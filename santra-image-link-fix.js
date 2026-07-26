// SANTRA IMAGE LINK FIX - V6 FINAL 27 JULY - WITHOUT VERSION - OLD CODE SAVE WITH UPDATE
/*
⚠️ OLD CODE BACKUP - 26 JULY V5 - SAFE - KUCH HATAYA NAHI
window.getBaseId=window.getBaseId||function(id){if(!id)return"";return String(id).split('_')[0].split('-')[0].split(' ')[0].trim();};
window.getUniversalImage=... [aapka purana code safe hai]
OLD BACKUP END - V5 SAFE
*/

// V6 FINAL - WITHOUT VERSION - HOME_ PREFIX FIX
window.getBaseId=window.getBaseId||function(id){
  if(!id) return "";
  return String(id).replace(/^home_/i,'').split('-')[0].split(' ')[0].trim().toLowerCase();
};
window.getUniversalImage=window.getUniversalImage||function(p){
  if(!p) return "https://via.placeholder.com/300?text=No+Image";
  let f=['image','imageUrl','thumbnail','thumb','photo','img','productImage','src'];
  for(let k of f){ if(p[k]&&typeof p[k]==='string'&&p[k].startsWith('http')&&!p[k].includes('placeholder')) return p[k].trim(); }
  if(p.media&&Array.isArray(p.media)){ for(let m of p.media){ if(typeof m==='string'&&m.startsWith('http')) return m; if(m&&m.url&&m.url.startsWith('http')) return m.url; } }
  if(p.images&&Array.isArray(p.images)){ for(let im of p.images){ if(typeof im==='string'&&im.startsWith('http')) return im; if(im&&im.url&&im.url.startsWith('http')) return im.url; } }
  return "https://via.placeholder.com/300?text="+encodeURIComponent(p.name||'Product');
};
window.getProductPageLink=function(id){ if(!id) return "#"; return `product.html?id=${window.getBaseId(id)}`; };
window.openProductPageUniversal=function(id){ if(!id) return; let l=window.getProductPageLink(id); try{ window.location.href=l; }catch(e){ window.open(l,'_blank'); } };
window.MYCHOICE_KEY=window.MYCHOICE_KEY||"santraMallMyChoice_v2";
(function(){ try{ ["myChoice","my_choice","wishlist","santraMyChoice","santraMallMyChoice","favorites"].forEach(function(k){ localStorage.removeItem(k); }); }catch(e){} })();

window.getMyChoiceMap=function(){
  try{
    let raw=localStorage.getItem(window.MYCHOICE_KEY)||"[]";
    let arr=JSON.parse(raw); if(!Array.isArray(arr)) arr=Object.values(arr||{});
    let map={}; arr.forEach(function(it){ let id=(it.id||it.code||"").toString().trim(); if(!id) return; let base=window.getBaseId(id); map[base]=it; map[id.toLowerCase()]=it; });
    return map;
  }catch(e){ return {}; }
};
window.getMyChoiceArray=function(){
  let raw=localStorage.getItem(window.MYCHOICE_KEY)||"[]"; let arr=[];
  try{ arr=JSON.parse(raw); if(!Array.isArray(arr)) arr=Object.values(arr||{}); }catch(e){ arr=[]; }
  let seen={},clean=[];
  arr.forEach(function(it){
    if(!it||!it.id) return;
    if(it.name==="Product"&&(!it.price||it.price===0)) return; // kachra filter
    let b=window.getBaseId(it.id||it.code||"").toLowerCase();
    if(!b||seen[b]) return; seen[b]=1; it.id=b; it.code=b; clean.push(it);
  });
  return clean;
};
window.saveMyChoiceMap=function(arr){
  if(!Array.isArray(arr)) arr=Object.values(arr||{});
  let seen={},clean=[];
  arr.forEach(function(it){ let b=window.getBaseId(it.id||it.code||"").toLowerCase(); if(!b||seen[b]) return; seen[b]=1; it.id=b; it.code=b; clean.push(it); });
  localStorage.setItem(window.MYCHOICE_KEY,JSON.stringify(clean));
  try{ window.dispatchEvent(new CustomEvent('mychoice:updated',{detail:clean})); }catch(e){}
  if(window.updateAllMyChoiceHearts) setTimeout(window.updateAllMyChoiceHearts,30);
};
window.toggleMyChoice=function(product){
  let rawId="", prodObj=null;
  if(typeof product==='string'){ rawId=product; prodObj=null; }
  else if(product){ rawId=(product.id||product.code||"").toString().trim(); prodObj=product; }
  if(!rawId){ try{ let u=new URLSearchParams(location.search).get('id'); if(u) rawId=u; }catch(e){} }
  if(!rawId) return false;
  let base=window.getBaseId(rawId);
  if(!base||base.length<2||base.length>40) return false;
  let arr=window.getMyChoiceArray();
  let idx=arr.findIndex(function(it){ return window.getBaseId(it.id||"").toLowerCase()===base; });
  if(idx!==-1){ arr.splice(idx,1); window.saveMyChoiceMap(arr); return false; }
  else{
    if(!prodObj){
      try{ if(window.allProducts){ let f=window.allProducts.find(z=>window.getBaseId(z.id||"")===base); if(f) prodObj=f; } }catch(e){}
    }
    if(!prodObj) return false; // dummy Product mat banao
    arr.push({id:base,code:base,name:prodObj.name||base,price:prodObj.price||0,image:window.getUniversalImage(prodObj),addedAt:Date.now()});
    window.saveMyChoiceMap(arr); return true;
  }
};
window.updateAllMyChoiceHearts=function(){
  try{
    let map=window.getMyChoiceMap();
    document.querySelectorAll('[id^="heart-"],[data-id],[data-product-id]').forEach(function(el){
      let id=el.getAttribute('data-id')||el.getAttribute('data-product-id')||el.id||"";
      if(id.indexOf('heart-')===0) id=id.replace('heart-','');
      if(!id) return;
      let base=window.getBaseId(id);
      let sel=!!(map[base]||map[id.toLowerCase()]);
      if(el.id&&el.id.indexOf('heart-')===0){ el.innerText=sel?"❤️":"🤍"; el.style.background=sel?"#ffe0e0":"white"; el.style.color=sel?"#e40046":""; }
    });
  }catch(e){}
};
document.addEventListener('DOMContentLoaded',function(){ setTimeout(window.updateAllMyChoiceHearts,400); setTimeout(window.updateAllMyChoiceHearts,1500); });
window.addEventListener('mychoice:updated',function(){ setTimeout(window.updateAllMyChoiceHearts,30); });
window.addToMyChoice=window.toggleMyChoice;
window.toggleWishlist=window.toggleMyChoice;
console.log("✅ santra-image-link-fix.js V6 FINAL WITHOUT VERSION - LAST LINE OK");