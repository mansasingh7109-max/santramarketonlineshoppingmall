// FINAL santra-image-link-fix.js - V3 - 24 JULY - HOME IMAGE IN MY CART 100% - PURA AYA - OLD CODE SAVE WITH UPDATE
// OLD CODE BACKUP - 23 JULY 2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI - SAVE WITH UPDATE
/*
OLD BACKUP START - 23 JULY 2026 SAFE - V2 HOME IMAGE FIX
window.getBaseId=function(id){ return String(id).split('_')[0].split('-')[0].trim(); };
window.getUniversalImage=function(p){ if(!p) return null; let f=['image','imageUrl']; for(let k of f){ let v=p[k]; if(v&&v.startsWith('http')) return v; } return null; };
window.ensureCartImagesFromCache=function(){ let K="santraMallCart_v2"; let raw=localStorage.getItem(K); if(!raw) return; let arr=JSON.parse(raw); arr.forEach(it=>{ if(!it.image){ it.image=window.getUniversalImage(it); } }); localStorage.setItem(K,JSON.stringify(arr)); };
OLD BACKUP END - 23 JULY SAFE - Kuch hataya nahi - V2 backup safe
*/

console.log("Image Fix V3 - HOME IMAGE IN CART - PURA AYA");
window.getBaseId=window.getBaseId||function(id){if(!id)return"";return String(id).split('_')[0].split('-')[0].split(' ')[0].trim();};
window.getDisplayCode=function(c){if(!c)return"N/A";return window.getBaseId(c);};
window.getProductPageLink=function(id){return"product.html?id="+window.getBaseId(id);};
window.openProductPageUniversal=function(id){let l=window.getProductPageLink(id);try{window.location.href=l;}catch(e){window.open(l,'_blank');}};

window.getUniversalImage=function(p){
if(!p)return null;
let f=['image','imageUrl','thumbnail','thumb','photo','img','productImage','src','mainImage','imgUrl','imageURL','picture'];
for(let k of f){let v=p[k];if(v&&typeof v==='string'&&v.trim().startsWith('http')&&!v.includes('placeholder')&&!v.toLowerCase().includes('no+image')&&!v.includes('via.placeholder'))return v.trim();}
if(p.media&&Array.isArray(p.media)){for(let m of p.media){if(typeof m==='string'&&m.startsWith('http'))return m;if(m&&m.url&&m.url.startsWith('http'))return m.url;}}
if(p.images&&Array.isArray(p.images)){for(let im of p.images){if(typeof im==='string'&&im.startsWith('http'))return im;if(im&&im.url&&im.url.startsWith('http'))return im.url;if(im&&im.imageUrl&&im.imageUrl.startsWith('http'))return im.imageUrl;}}
try{
let all=[];
['santra_all_products_cache','allProductsCache','productsCache','santra_products_cache'].forEach(k=>{try{let j=JSON.parse(localStorage.getItem(k)||"[]");if(Array.isArray(j)) all=all.concat(j);}catch(e){}});
if(window.allProducts) all=all.concat(window.allProducts);
if(window.products) all=all.concat(window.products);
let base=String(p.id||p.code||p.name||"").toLowerCase().split('_')[0].split('-')[0];
let nameKey=String(p.name||"").toLowerCase().slice(0,8);
for(let x of all){
if(!x)continue;
let xid=String(x.id||x.code||"").toLowerCase().split('_')[0].split('-')[0];
let xname=String(x.name||"").toLowerCase();
if((base&&xid===base)|| (nameKey&&xname.includes(nameKey)) ){
for(let k of f){let v=x[k];if(v&&typeof v==='string'&&v.startsWith('http')&&!v.includes('placeholder'))return v.trim();}
if(x.images&&x.images[0]){let im=x.images[0];if(typeof im==='string'&&im.startsWith('http'))return im;if(im&&im.url&&im.url.startsWith('http'))return im.url;}
}
}
}catch(e){}
return null;
};

// STEP 1: Cart me jo bhi image khali hai usko turant cache se bharo + Firebase se fetch trigger
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
if(real){it.image=real;it.thumbnail=real;changed=true;}
else{
let pid=it.id||it.code||"";
if(pid) setTimeout(()=>{window.fetchImageUniversal(pid,null);},100);
}
}
});
if(changed){localStorage.setItem(K,JSON.stringify(arr));console.log("Cart images injected V3");}
}catch(e){console.log("inject V3 fail",e.message);}
};

// STEP 2: AddToCart me image pakka save ho - Home se My Cart me image jayegi
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
else if(p.name){
let cReal=window.getUniversalImage({name:p.name, id:p.id});
if(cReal){p.image=cReal; p.thumbnail=cReal;}
}
return orig(p);
};
console.log("addToCart patched V3 - Home image save hoga");
};
patchAdd();
})();

// STEP 3: Firebase se direct image lao - baseId + full id + name search
window.fetchImageUniversal=function(pid,el){
if(!pid)return;
let base=window.getBaseId(pid);
let db=null;
try{if(window.db)db=window.db;else if(window.firebase&&window.firebase.firestore)db=window.firebase.firestore();else if(typeof firebase!=='undefined'&&firebase.firestore)db=firebase.firestore();}catch(e){}
function apply(img){
if(!img||img.includes('placeholder')||img.toLowerCase().includes('no+image'))return;
if(el){el.src=img;el.style.display="block";el.style.background="#fff";el.style.minHeight="80px";el.style.minWidth="80px";}
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
}catch(e){}
document.querySelectorAll('img[data-id="'+pid+'"], img[data-id="'+base+'"], img[data-product-id="'+pid+'"]').forEach(i=>{
if(i!==el){i.src=img; i.style.display="block";}
});
}
if(!db){
let im=window.getUniversalImage({id:pid});
if(im&&el) apply(im);
return;
}
(async function(){
let ids=[pid,base];
for(let tid of ids){
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

// STEP 4: UI fix - Code _M _XXL hatao + Image khali ho to fetch karo
window.fixCartPageDisplay=function(){
document.querySelectorAll('*').forEach(el=>{
if(el.children.length===0&&el.textContent&&el.textContent.includes('Code:')){
let t=el.textContent;
if(t.includes('_M')||t.includes('_XXL')||t.includes('_XL')){
let nt=t.replace(/Code:\s*([A-Za-z0-9]+)(_[A-Z0-9]+)+/g,function(m,p1){return"Code: "+p1;});
if(nt!==t)el.textContent=nt;
}
}
});
document.querySelectorAll('b,strong,span,div').forEach(el=>{
let t=el.textContent||"";
if(t.includes('(Size M) (Size M)'))el.textContent=t.replace('(Size M) (Size M)','(Size M)');
});
document.querySelectorAll('img[data-id], img[data-product-id], #cartContainer img,.cart-item img, img[alt*="Frock"], img[alt*="Size"], img[alt*="frock"]').forEach(img=>{
let id=img.getAttribute('data-id')||img.getAttribute('data-product-id')||"";
if(id){
if(!img.dataset.fixed){
img.style.cursor="pointer";
img.onclick=function(){window.openProductPageUniversal(id);};
img.dataset.fixed="1";
}
let src=img.getAttribute('src')||"";
let bad=!src||src.includes('placeholder')||src.toLowerCase().includes('no+image')||src.trim()===""||src.startsWith('data:')||img.naturalWidth===0;
if(bad){
let real=window.getUniversalImage({id:id});
if(real){
img.src=real;img.style.display="block";
}else{
window.fetchImageUniversal(id,img);
}
}
}
});
};

window.ensureCartImagesFromCache();
document.addEventListener('DOMContentLoaded',function(){
window.ensureCartImagesFromCache();
setTimeout(window.fixCartPageDisplay,400);
setTimeout(window.fixCartPageDisplay,1500);
setTimeout(window.fixCartPageDisplay,3500);
setTimeout(window.fixCartPageDisplay,7000);
});
setInterval(function(){window.ensureCartImagesFromCache();window.fixCartPageDisplay();},2000);

console.log("Image Fix FINAL V3 - HOME IMAGE IN MY CART - PURA AYA - LAST LINE OK");
/* OLD BACKUP 23 JULY SAFE - LAST LINE OK - V3 HOME IMAGE FIX - Home page ki image My Cart me 100% ayegi - LAST LINE */
