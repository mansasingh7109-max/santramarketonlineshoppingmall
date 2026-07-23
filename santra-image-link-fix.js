// FINAL santra-image-link-fix.js - V5 - 24 JULY - Single Domain Auto - 2 Domain Error Fix - PURA AYA - OLD CODE SAVE
// OLD BACKUP - V3 - 2 DOMAIN HARDCODED - SAFE - KUCH HATAYA NAHI
/*
OLD V3 BACKUP - 23 JULY - 2 DOMAIN HARDCODED
window.BASE_URL="https://santramarketshoppingmall.web.app" - FIREBASE DOMAIN HARDCODED
window.getProductPageLink=function(id){return"product.html?id="+id;} - NO BASE PATH - GITHUB PE ERROR
window.getBaseId=function(id){return String(id).split('_')[0].split('-')[0].trim();};
OLD V3: Github domain pe khula to Firebase cache nahi milta tha - Image error My Cart me
OLD V3 BACKUP END - SAFE
*/
console.log("Image Fix V5 - Single Domain Auto - 2 Domain Error Fix - PURA AYA");
window.getBaseId=window.getBaseId||function(id){if(!id)return"";return String(id).split('_')[0].split('-')[0].split(' ')[0].trim();};
// SINGLE DOMAIN AUTO - Jiss domain pe site khuli hai ussi ka base path auto
window.getBasePath=function(){
  let p=window.location.pathname;
  if(p.includes('/santramarketonlineshoppingmall/')) return '/santramarketonlineshoppingmall/';
  return '/';
};
window.getDisplayCode=function(c){if(!c)return"N/A";return window.getBaseId(c);};
window.getProductPageLink=function(id){
  let bp=window.getBasePath();
  return bp+"product.html?id="+window.getBaseId(id);
};
window.openProductPageUniversal=function(id){let l=window.getProductPageLink(id);try{window.location.href=l;}catch(e){window.open(l,'_blank');}};
window.getUniversalImage=function(p){
if(!p)return null;
let f=['image','imageUrl','thumbnail','thumb','photo','img','productImage','src','mainImage','imgUrl','imageURL','picture'];
for(let k of f){let v=p[k];if(v&&typeof v==='string'&&v.trim().startsWith('http')&&!v.includes('placeholder')&&!v.toLowerCase().includes('no+image')&&!v.includes('via.placeholder'))return v.trim();}
if(p.media&&Array.isArray(p.media)){for(let m of p.media){if(typeof m==='string'&&m.startsWith('http'))return m;if(m&&m.url&&m.url.startsWith('http'))return m.url;}}
if(p.images&&Array.isArray(p.images)){for(let im of p.images){if(typeof im==='string'&&im.startsWith('http'))return im;if(im&&im.url&&im.url.startsWith('http'))return im.url;if(im&&im.imageUrl&&im.imageUrl.startsWith('http'))return im.imageUrl;}}
try{
let all=[];
['santra_all_products_cache','allProductsCache','productsCache','santra_products_cache','santra_all_products_cache_v2'].forEach(k=>{try{let j=JSON.parse(localStorage.getItem(k)||"[]");if(Array.isArray(j)) all=all.concat(j);}catch(e){}});
if(window.allProducts) all=all.concat(window.allProducts);
if(window.products) all=all.concat(window.products);
let base=String(p.id||p.code||p.name||"").toLowerCase().split('_')[0].split('-')[0];
let nameKey=String(p.name||"").toLowerCase().slice(0,8);
for(let x of all){
if(!x)continue;
let xid=String(x.id||x.code||"").toLowerCase().split('_')[0].split('-')[0];
let xname=String(x.name||"").toLowerCase();
if((base&&xid===base)||(nameKey&&xname.includes(nameKey))){
for(let k of f){let v=x[k];if(v&&typeof v==='string'&&v.startsWith('http')&&!v.includes('placeholder'))return v.trim();}
if(x.images&&x.images[0]){let im=x.images[0];if(typeof im==='string'&&im.startsWith('http'))return im;if(im&&im.url&&im.url.startsWith('http'))return im.url;}
}
}
}catch(e){}
return null;
};
window.ensureCartImagesFromCache=function(){
try{
let K=window.CART_KEY||"santraMallCart_v2";
let raw=localStorage.getItem(K);if(!raw)return;
let arr=JSON.parse(raw);if(!Array.isArray(arr)) arr=Object.values(arr);
let changed=false;
arr.forEach(it=>{
let src=it.image||it.imageUrl||it.thumbnail||"";
let bad=!src||src.includes('placeholder')||src.toLowerCase().includes('no+image')||src.includes('via.placeholder')||src.trim()==="";
if(bad){
let real=window.getUniversalImage(it);
if(real){it.image=real;it.thumbnail=real;it.imageUrl=real;changed=true;}
else{
let pid=it.id||it.code||"";
if(pid) setTimeout(()=>{window.fetchImageUniversal(pid,null);},100);
}
}
});
if(changed){localStorage.setItem(K,JSON.stringify(arr));}
}catch(e){}
};
(function(){
let tries=0;
let patchAdd=function(){
let orig=window.addToCart;
if(!orig && tries<20){tries++; setTimeout(patchAdd,500); return;}
if(!orig) return;
window.addToCart=function(p){
if(!p)return;
let real=window.getUniversalImage(p);
if(real){p.image=real; p.thumbnail=real; p.imageUrl=real;}
return orig(p);
};
};
patchAdd();
})();
window.fetchImageUniversal=function(pid,el){
if(!pid)return;
let base=window.getBaseId(pid);
let db=null;
try{if(window.db)db=window.db;else if(window.firebase&&window.firebase.firestore)db=window.firebase.firestore();}catch(e){}
function apply(img){
if(!img||img.includes('placeholder'))return;
if(el){el.src=img;el.style.display="block";el.style.background="#fff";el.removeAttribute('alt');el.style.minHeight="90px";el.style.minWidth="90px";}
try{
let K=window.CART_KEY||"santraMallCart_v2";
let raw=localStorage.getItem(K);
if(raw){
let arr=JSON.parse(raw);if(!Array.isArray(arr)) arr=Object.values(arr);
let ch=false;
arr.forEach(it=>{
let bid=window.getBaseId(it.id);
if(bid===base||String(it.id)===String(pid)||String(it.code)===String(pid)){
it.image=img;it.thumbnail=img;it.imageUrl=img;ch=true;
}
});
if(ch){localStorage.setItem(K,JSON.stringify(arr));}
}
}catch(e){}
document.querySelectorAll('img[data-id="'+pid+'"], img[data-id="'+base+'"], img[data-product-id="'+pid+'"], img[data-base="'+base+'"]').forEach(i=>{if(i!==el){i.src=img; i.style.display="block";}});
}
if(!db){
let im=window.getUniversalImage({id:pid});
if(im&&el) apply(im);
return;
}
(async function(){
for(let tid of [pid,base]){
try{
let doc=await db.collection('products').doc(tid).get();
if(doc.exists){
let im=window.getUniversalImage(doc.data());
if(im){apply(im);return;}
}
}catch(e){}
}
for(let q of [base,pid]){
try{
let snap=await db.collection('products').where('code','==',q).limit(1).get();
if(!snap.empty){let im=window.getUniversalImage(snap.docs[0].data());if(im){apply(im);return;}}
}catch(e){}
}
})();
};
window.fixCartPageDisplay=function(){
document.querySelectorAll('*').forEach(el=>{
if(el.children.length===0&&el.textContent.includes('Code:')){
let t=el.textContent;
if(t.includes('_M')||t.includes('_XXL')||t.includes('_XL')){
let nt=t.replace(/Code:\s*([A-Za-z0-9]+)(_[A-Z0-9]+)+/g,function(m,p1){return"Code: "+p1;});
if(nt!==t) el.textContent=nt;
}
}
});
document.querySelectorAll('h1, h2, h3, span, div, button, a').forEach(el=>{
if(el.children.length>0) return;
let txt=el.textContent||"";
if(txt.includes('Extra Item Fix')||txt.includes('Image Fix - Time Fix')||txt.includes('Time Fix Fallback')||txt.includes(' - Amount')||txt.includes('Loading - Extra')||txt.includes('Image Fix - Time')){
if(txt.includes('My Cart')) el.textContent="🛒 My Cart";
else if(txt.includes('Aaj:')){ let m=txt.match(/Aaj:\s*\d+\/\d+\/\d+/); if(m) el.textContent=m[0]; else el.textContent="Aaj: "+new Date().toLocaleDateString('en-IN'); }
else if(txt.includes('Date:')) el.textContent="Date: "+new Date().toLocaleDateString('en-IN');
else if(txt.includes('Price Details')) el.textContent="Price Details";
else if(txt.includes('Total Amount')) el.textContent="Total Amount";
else if(txt.includes('PROCEED TO CHECKOUT')) el.textContent="➡ PROCEED TO CHECKOUT";
}
});
document.querySelectorAll('img[data-id], img[data-product-id], #cartList img,.cart-card img, img[alt*="Frock"]').forEach(img=>{
let id=img.getAttribute('data-id')||img.getAttribute('data-product-id')||img.getAttribute('data-base')||"";
if(id){
let src=img.getAttribute('src')||"";
let bad=!src||src.includes('placeholder')||src.toLowerCase().includes('no+image')||src.trim()===""||src.startsWith('data:')||img.naturalWidth===0;
if(bad){
let real=window.getUniversalImage({id:id});
if(real){img.src=real;img.style.display="block";}
else{window.fetchImageUniversal(id,img);}
}
}
});
document.querySelectorAll('button').forEach(b=>{
let t=(b.innerText||"").toLowerCase();
if(t.includes('fix extra')||t.includes('clear duplicate')){ b.style.display='none'; b.style.visibility='hidden';}
});
};
document.addEventListener('DOMContentLoaded',function(){
window.ensureCartImagesFromCache();
setTimeout(window.fixCartPageDisplay,200);
setTimeout(window.fixCartPageDisplay,800);
});
setInterval(function(){window.ensureCartImagesFromCache();window.fixCartPageDisplay();},1200);
console.log("Image Fix FINAL V5 - Single Domain Auto - 2 Domain Error Fix - Image + Extra Hide - PURA AYA - LAST LINE OK");
/* V5 24 JULY - SINGLE DOMAIN AUTO - window.location.pathname.includes basePath - 2 domain link error khatam - Github app me alag domain link hatana hai - OLD CODE SAVE - LAST LINE OK */
