/*

⚠️ OLD CODE BACKUP - 30 JUNE 2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

window.addToMyChoice = function (product, selectedVariant = null, selectedQty = 1) {
  if (!product) {
    showToast("❌ Product load nahi hua");
    return false;
  }
  let myChoiceData = localStorage.getItem(MYCHOICE_KEY);
  let myChoice = [];
  try {
    myChoice = JSON.parse(myChoiceData || "[]");
    if (!Array.isArray(myChoice)) myChoice = [];
  } catch (e) {
    myChoice = [];
  }
  let finalPrice = product.price || product.sellingPrice || 0;
  if (selectedVariant && selectedVariant.price) {
    finalPrice = selectedVariant.price;
  }
  let productImage = "";
  if (product.media && product.media.length > 0) {
    productImage = product.media[0].url || product.media[0];
  } else if (product.images && product.images.length > 0) {
    productImage = product.images[0];
  } else if (product.imageUrl) {
    productImage = product.imageUrl;
  } else if (product.image) {
    productImage = product.image;
  } else if (product.img) {
    productImage = product.img;
  }
  let variantName = "Default";
  if (selectedVariant) {
    variantName = selectedVariant.name || selectedVariant.size || selectedVariant.volume || selectedVariant.weight || "Default";
  }
  let myChoiceItem = {
    id: product.id || product.code,
    name: product.name || product.productName,
    price: finalPrice,
    image: productImage,
    code: product.code || product.productCode || product.id,
    category: product.category || "General",
    variant: variantName,
    productLink: window.location.origin + "/product.html?id=" + encodeURIComponent(product.id || product.code),
    qty: selectedQty || 1,
    addedAt: new Date().toISOString()
  };
  let existingIndex = myChoice.findIndex(item => item.id === myChoiceItem.id && item.variant === myChoiceItem.variant);
  if (existingIndex === -1) {
    myChoice.push(myChoiceItem);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));
    showToast("😍 Added to My Choice!");
    if (typeof auth!== "undefined" && auth.currentUser && typeof db!== "undefined") {
      db.collection("users").doc(auth.currentUser.uid).collection("mychoice").doc(myChoiceItem.id).set(myChoiceItem, { merge: true });
    }
    updateChoiceCount();
    return true;
  } else {
    showToast("Already in My Choice!");
    return false;
  }
};

OLD CODE BACKUP END

*/

// =======================================================
// ✅ MYCHOICE.JS - FINAL FIXED - 21 JULY 2026 - HOME TAB FIX
// Old code upar safe hai - Home Tab Add + Select + Image Fix
// =======================================================

const MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
const CART_KEY = window.CART_KEY || "santraMallCart_v2";
const rtdb = window.rtdb;
const db = window.db;
const auth = window.auth;
const ALL_KEYS = ["santraMallMyChoice_v2","santrajet_mychoice","santraMyChoice_v2","santraMallWishlist","myChoice","wishlist","sm_wishlist_v1"];

function getThumb(p){
  if(!p) return "";
  if(p.image &&!String(p.image).includes("placeholder")) return p.image;
  if(p.imageUrl) return p.imageUrl;
  if(p.thumbnail) return p.thumbnail;
  if(p.img) return p.img;
  if(p.media && p.media[0]) return p.media[0].url||p.media[0];
  if(p.images && p.images[0]) return typeof p.images[0]==="string"?p.images[0]:p.images[0].url;
  try{
    let cache=JSON.parse(localStorage.getItem('santra_all_products_cache')||"[]");
    let f=cache.find(x=>String(x.id).toLowerCase()===String(p.id).toLowerCase());
    if(f && f.image) return f.image;
  }catch{}
  return "";
}

function cleanMyChoiceList(list){
  if(!Array.isArray(list)){ try{ list=Object.values(list); }catch{ return []; } }
  let seen={}; let clean=[];
  list.forEach(o=>{
    if(!o||!o.id) return;
    let id=String(o.id).replace(/^home_/,'').toLowerCase().trim();
    if(!id) return;
    // length>35 wala filter hata diya - yahi bug tha
    let sz=String(o.size||o.variant||"M").toUpperCase();
    let key=id+"_"+sz;
    if(seen[key]) return;
    seen[key]=1; o.id=id; o.code=id;
    if(!o.image) o.image=getThumb(o);
    clean.push(o);
  });
  return clean;
}

function getAllChoicesMerged(){
  let merged=[]; let seen={};
  for(let k of ALL_KEYS){
    try{
      let raw=localStorage.getItem(k);
      if(!raw) continue;
      let arr=JSON.parse(raw);
      if(!Array.isArray(arr)) arr=Object.values(arr);
      arr.forEach(o=>{
        if(!o||!o.id) return;
        let id=String(o.id).toLowerCase();
        let sz=String(o.size||o.variant||"M").toUpperCase();
        let key=id+"_"+sz;
        if(seen[key]) return;
        seen[key]=1;
        merged.push(o);
      });
    }catch{}
  }
  return cleanMyChoiceList(merged);
}

function updateHeaderBadges(){
  try{
    let cart=[]; try{ cart=JSON.parse(localStorage.getItem(CART_KEY)||localStorage.getItem("santraMallCart_v2")||"[]"); if(!Array.isArray(cart)) cart=Object.values(cart);}catch{cart=[];}
    let qty=cart.reduce((s,i)=>s+(i.qty||1),0);
    ["cartBadge","homeCartBadge","cartCount","cartCountBottom"].forEach(id=>{ let el=document.getElementById(id); if(el){ el.innerText=qty; el.style.display=qty>0?"flex":"none"; }});
    let list=getAllChoicesMerged();
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
    ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(list));}catch{} });
    ["choiceBadge","homeChoiceBadge","myChoiceCount","choiceCount"].forEach(id=>{ let el=document.getElementById(id); if(el){ el.innerText=list.length; el.style.display=list.length>0?"flex":"inline-block"; }});
    list.forEach(it=>{ let btn=document.getElementById('heart-'+it.id); if(btn){ btn.innerHTML='❤️'; btn.style.color='#e40046'; }});
  }catch(e){}
}

window.toggleMyChoice=function(id,e){
  if(e){e.preventDefault(); e.stopPropagation();}
  if(!id) return;
  id=String(id).replace(/^home_/,'').toLowerCase().trim();
  let list=getAllChoicesMerged();
  let idx=list.findIndex(x=>String(x.id).toLowerCase()===id);
  let btn=document.getElementById('heart-'+id);
  if(idx>=0){
    list.splice(idx,1);
    if(btn){btn.innerHTML='🤍'; btn.style.color='#666';}
    showToast("❌ Removed");
  }else{
    let card=btn?.closest('.product-card') || document.querySelector(`[data-id="${id}"]`)?.closest('.product-card');
    let imgTag=card?.querySelector('img');
    let name=card?.querySelector('h3,.product-name')?.innerText?.trim()||id;
    let img=imgTag?.getAttribute('data-src') || imgTag?.src || '';
    let price=parseInt(card?.innerText.match(/₹\s*(\d+)/)?.[1]||'0')||0;
    if(!img ||!price){
      try{
        let all=JSON.parse(localStorage.getItem('santra_all_products_cache')||'[]');
        let f=all.find(p=>String(p.id).toLowerCase()===id);
        if(f){ if(!img) img=f.image||''; if(!price) price=f.price||100; if(f.name) name=f.name; }
      }catch{}
    }
    list.push({id:id,name:name,image:img,price:price,code:id,size:"M",variant:"M",addedAt:new Date().toISOString()});
    if(btn){btn.innerHTML='❤️'; btn.style.color='#e40046';}
    showToast("😍 Added to My Choice!");
  }
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
  ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(list));}catch{} });
  updateHeaderBadges(); updateChoiceCount();
  if(window.SM_LOCK?.backup) window.SM_LOCK.backup();
};

window.addToMyChoice=function(product, selectedVariant=null){
  if(!product||!product.id){
    if(typeof currentProduct!=='undefined'&&currentProduct.id) product=currentProduct;
    else{ showToast("❌ Product load nahi hua"); return false; }
  }
  let list=getAllChoicesMerged();
  let sz=selectedVariant?.name||"M";
  let ex=list.find(i=>String(i.id).toLowerCase()===String(product.id).toLowerCase() && (i.size||"M")===sz);
  if(!ex){
    list.push({id:String(product.id).toLowerCase(),name:product.name||'Product',price:product.price||0,image:getThumb(product),code:product.code||product.id,size:sz,variant:sz,addedAt:new Date().toISOString()});
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
    ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(list));}catch{} });
    showToast('😍 Added to My Choice!'); updateHeaderBadges(); return true;
  }else{
    list=list.filter(i=>!(String(i.id).toLowerCase()===String(product.id).toLowerCase() && (i.size||"M")===sz));
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
    ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(list));}catch{} });
    showToast('❌ Removed'); updateHeaderBadges(); return false;
  }
};

window.toggleSelectAllChoice=function(c){ document.querySelectorAll(".choice-check").forEach(x=>x.checked=c); }
window.moveSelectedToCart=function(){
  let checks=[...document.querySelectorAll(".choice-check:checked")];
  if(!checks.length) return showToast("Select item first");
  let list=getAllChoicesMerged();
  let cart=[]; try{cart=JSON.parse(localStorage.getItem(CART_KEY)||"[]"); if(!Array.isArray(cart)) cart=Object.values(cart);}catch{cart=[];}
  let idxs=checks.map(c=>parseInt(c.dataset.idx)).sort((a,b)=>b-a);
  idxs.forEach(i=>{ if(list[i]) cart.push({...list[i],qty:1,image:getThumb(list[i])}); });
  let newList=list.filter((_,i)=>!idxs.includes(i));
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(newList));
  ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(newList));}catch{} });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  localStorage.setItem("santraMallCart_v2", JSON.stringify(cart));
  updateHeaderBadges();
  if(typeof loadMyChoice==='function') loadMyChoice();
  showToast("✅ Moved to Cart");
}
window.removeSelectedChoice=function(){
  let checks=[...document.querySelectorAll(".choice-check:checked")];
  if(!checks.length) return showToast("Select item first");
  let list=getAllChoicesMerged();
  let idxs=checks.map(c=>parseInt(c.dataset.idx)).sort((a,b)=>b-a);
  idxs.forEach(i=>list.splice(i,1));
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
  ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(list));}catch{} });
  if(typeof loadMyChoice==='function') loadMyChoice();
  updateHeaderBadges();
}

if(typeof window.showToast==='undefined'){
  window.showToast=function(msg){
    let t=document.createElement('div'); t.innerText=msg;
    t.style.cssText='position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#e40046;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-weight:600;';
    document.body.appendChild(t); setTimeout(()=>t.remove(),2500);
  };
}
window.updateChoiceCount=function(){ updateHeaderBadges(); };
window.removeFromMyChoice=function(id){
  let list=getAllChoicesMerged();
  list=list.filter(i=>String(i.id).toLowerCase()!==String(id).toLowerCase());
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
  ALL_KEYS.forEach(k=>{ try{localStorage.setItem(k, JSON.stringify(list));}catch{} });
  updateHeaderBadges();
  if(typeof loadMyChoice==='function') loadMyChoice();
};
document.addEventListener('DOMContentLoaded', ()=>{ updateHeaderBadges(); updateChoiceCount(); });
window.addEventListener("load", updateHeaderBadges);