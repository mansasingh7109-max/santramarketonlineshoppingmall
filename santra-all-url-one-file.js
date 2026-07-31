console.log("✅ V46 ULTIMATE - Category + All Image Fix - Past Present Future - OLD CODE SAVE");

window.SANTRA_ALL_URL_MAP = window.SANTRA_ALL_URL_MAP || {};
window.SANTRA_ALL_PRODUCTS_LIST = window.SANTRA_ALL_PRODUCTS_LIST || [];

window.normalizeKey = function(s){ return String(s||"").toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim(); };

// Image 1,2,3,4,5 + images[0],[1],[2],[3] sab check - Past Present Future ke liye
window.getOneFileImage = function(p){
  if(!p) return "";
  let fields=['image','imageUrl','img','thumbnail','photo','image2','image3','image4','image5','image_2','image_3','img2','img3','photo2','photo3','mainImage','productImage'];
  for(let k of fields){
    let v=p[k];
    if(v && typeof v==='string' && v.startsWith('http') &&!v.includes('placeholder') &&!v.includes('No+Image') &&!v.includes('via.placeholder')){
      return v.trim();
    }
  }
  if(p.images && Array.isArray(p.images)){
    for(let im of p.images){
      if(!im) continue;
      let url = typeof im==='string'? im : (im.url||im.src||im.image||im.imageUrl||"");
      if(url && url.startsWith('http') &&!url.includes('placeholder') &&!url.includes('No+Image')) return url.trim();
    }
  }
  let arrFields=['productImages','gallery','photos','imageList','allImages','product_images'];
  for(let k of arrFields){
    if(p[k] && Array.isArray(p[k])){
      for(let im of p[k]){
        let url = typeof im==='string'? im : (im.url||"");
        if(url && url.startsWith('http') &&!url.includes('placeholder')) return url.trim();
      }
    }
  }
  return "";
};

window.getOneFileBaseId = function(id){
  if(!id) return "";
  let s=String(id).toLowerCase().trim().split('_')[0];
  if(s.startsWith('-')) return s;
  return s.split('-')[0];
};

// PAST + PRESENT + FUTURE ka map build
window.buildOneFileV46 = window.buildOneFileV45 = function(){
  return new Promise(async (res)=>{
    let all=[];
    // PAST - localStorage me purane products
    try{ if(window.santra_master_all_products_with_images_v24) all=all.concat(window.santra_master_all_products_with_images_v24); }catch(e){}
    try{ let m=localStorage.getItem('santra_master_all_products_with_images_v24'); if(m) all=all.concat(JSON.parse(m)); }catch(e){}
    try{ let m2=localStorage.getItem('allProducts'); if(m2) all=all.concat(JSON.parse(m2)); }catch(e){}
    try{ let m3=localStorage.getItem('santra_products'); if(m3) all=all.concat(JSON.parse(m3)); }catch(e){}
    // PRESENT - Firebase RTDB + Firestore
    try{ if(firebase && firebase.database){ let snap=await firebase.database().ref('products').once('value'); if(snap.exists()) all=all.concat(Object.values(snap.val())); } }catch(e){}
    try{ let db=window.db||firebase.firestore(); if(db){ let snap=await db.collection('products').get(); snap.forEach(d=>all.push(d.data())); } }catch(e){}
    // FUTURE - future me jo add hoga wo agli baar auto ayega kyunki build har page load pe hoga

    let map={}; let list=[]; let first=""; let cnt23=0;
    let seen=new Set();
    all.forEach(p=>{
      if(!p) return;
      let idKey=(p.id||p.code||p.name||"").toString().toLowerCase();
      if(seen.has(idKey)) return; // duplicate hatana
      seen.add(idKey);
      let img=window.getOneFileImage(p);
      if(!img) return;
      if(!first) first=img;
      if(p.image2||p.image3||(p.images&&p.images.length>1)) cnt23++;
      list.push(p);

      [p.id,p.code,p.productId,p.productCode,p.name].filter(Boolean).forEach(k=>{
        let low=String(k).toLowerCase();
        let norm=window.normalizeKey(k);
        if(low) map[low]=img;
        if(norm) map[norm]=img;
        map[window.getOneFileBaseId(k)]=img;
      });
      if(p.category){
        let catNorm=window.normalizeKey(p.category);
        if(catNorm) map['cat_'+catNorm]=img; // category ke liye bhi
      }
      if(p.name){
        let nk=window.normalizeKey(p.name.split('(')[0]);
        map[nk]=img;
        map[nk.split(' ').slice(0,2).join(' ')]=img;
        map[nk.split(' ').slice(0,3).join(' ')]=img;
      }
    });

    window.SANTRA_FIRST_IMAGE=first;
    window.SANTRA_ALL_URL_MAP=map;
    window.SANTRA_ALL_PRODUCTS_LIST=list;
    localStorage.setItem('santra_one_file_map_v46', JSON.stringify(map));
    localStorage.setItem('santra_master_all_products_with_images_v24', JSON.stringify(list)); // future ke liye save
    console.log(`✅ ONE FILE = ${Object.keys(map).length} URLs - V46 ULTIMATE - Category+Home+Cart - Image2,3=${cnt23} - Past=${all.length} - Present=Live - Future=Auto`);
    res(map);
  });
};

// Cart ka fix
window.fixCartHalfImageV46 = window.fixCartHalfImageV45 = function(){
  let map=window.SANTRA_ALL_URL_MAP;
  try{ if(!map||Object.keys(map).length<10) map=JSON.parse(localStorage.getItem('santra_one_file_map_v46')||"{}"); }catch(e){}
  let key=window.CART_KEY||'santraMallCart_v2';
  let arr=JSON.parse(localStorage.getItem(key)||"[]");
  if(!Array.isArray(arr)) arr=Object.values(arr);
  let fixed=0;
  arr.forEach(it=>{
    let codeN=window.normalizeKey(it.code||it.id||"");
    let nameN=window.normalizeKey((it.name||"").split('(')[0]);
    let two=nameN.split(' ').slice(0,2).join(' ');
    let cands=[String(it.code||"").toLowerCase(), String(it.id||"").toLowerCase(), codeN, nameN, two].filter(Boolean);
    let url=null;
    for(let c of cands){ if(map[c]){ url=map[c]; break; } }
    if(!url){
      for(let mk in map){
        let mkN=window.normalizeKey(mk);
        if(mkN.length<3) continue;
        if(codeN.includes(mkN) || mkN.includes(codeN) || nameN.includes(mkN)){ url=map[mk]; break; }
      }
    }
    if(url){ it.image=url; it.thumbnail=url; it.img=url; fixed++; }
  });
  localStorage.setItem(key, JSON.stringify(arr));
  console.log(`✅ Cart Fixed: ${fixed}/${arr.length} - V46`);
  return fixed;
};

// Category + Home + All pages ka universal fix - Past Present Future
window.fixAllImagesPastPresentFuture = window.fixCategoryImagesV46 = function(){
  let map=window.SANTRA_ALL_URL_MAP;
  try{ if(!map||Object.keys(map).length<10) map=JSON.parse(localStorage.getItem('santra_one_file_map_v46')||"{}"); }catch(e){}
  let fixed=0;
  document.querySelectorAll('img').forEach(img=>{
    let src=img.getAttribute('src')||"";
    let isBroken =!src || src.includes('placeholder') || src.includes('No+Image') || img.naturalWidth===0;
    if(!isBroken && src.startsWith('http')) return; // sahi hai toh skip

    // alt, title, data-code, data-id, parent text se dhoondo
    let keys=[
      img.alt,
      img.getAttribute('data-code'),
      img.getAttribute('data-id'),
      img.getAttribute('data-name'),
      img.parentElement?.innerText?.slice(0,50)
    ].filter(Boolean).map(k=>window.normalizeKey(k));

    let url=null;
    for(let k of keys){ if(map[k]){ url=map[k]; break; } }
    if(!url){
      for(let k of keys){
        for(let mk in map){
          let mkN=window.normalizeKey(mk);
          if(k.includes(mkN) || mkN.includes(k)){ url=map[mk]; break; }
        }
        if(url) break;
      }
    }
    if(url){
      img.src=url;
      img.setAttribute('data-fixed','v46');
      fixed++;
    }
  });
  if(fixed>0) console.log(`✅ All Images Fixed (Category+Home+Cart): ${fixed} - V46 ULTIMATE - Past Present Future`);
  return fixed;
};

// Auto run - No Reload Loop - Sirf ek baar
let v46Run=false;
window.runV46Ultimate = function(){
  if(v46Run) return; v46Run=true;
  window.buildOneFileV46().then(()=>{
    window.fixCartHalfImageV46();
    window.fixAllImagesPastPresentFuture();
    // 2 sec baad dobara check taaki lazy load image bhi fix ho
    setTimeout(()=>window.fixAllImagesPastPresentFuture(), 2000);
  });
};

// Har page pe auto chalega - Home, Category, Cart, Product, Orders
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(()=>window.runV46Ultimate(), 500); });
window.addEventListener('load', ()=>{ setTimeout(()=>window.fixAllImagesPastPresentFuture(), 1500); });
// Firebase load hone ke baad bhi
setTimeout(()=>{ if(typeof firebase!=='undefined' &&!v46Run) window.runV46Ultimate(); }, 1200);

console.log("V46 ULTIMATE - LAST LINE OK - Category+All+PastPresentFuture - Single File Fix Done");