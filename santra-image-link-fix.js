// FINAL santra-image-link-fix.js - V6 - 24 JULY - Duplicate Fix Line Hide + Home Image 100% + Extra Text Hide - PURA AYA - OLD CODE SAVE
// OLD BACKUP - V3 - 23 JULY - SAFE - KUCH HATAYA NAHI - SAVE WITH UPDATE
/*
OLD V3 BACKUP START - 23 JULY SAFE - V3 HOME IMAGE IN MY CART 100% - PURA AYA
window.getBaseId=function(id){return String(id).split('_')[0].split('-')[0].trim();};
window.getDisplayCode=function(c){return"N/A";};
window.getUniversalImage=function(p){ let f=['image','imageUrl']; for(let k of f){if(p[k]&&p[k].startsWith('http'))return p[k];} return null; };
window.ensureCartImagesFromCache=function(){ let K="santraMallCart_v2"; let raw=localStorage.getItem(K); if(!raw)return; let arr=JSON.parse(raw); arr.forEach(it=>{ if(!it.image) it.image=window.getUniversalImage(it); }); localStorage.setItem(K,JSON.stringify(arr)); };
OLD V3: Isme Extra Item Fix line hide ka logic nahi tha - Isiliye My Cart me Fix Extra Item - Clear Duplicate + My Cart - Extra Item Fix - Image Fix dikh raha tha
OLD V3 BACKUP END - SAFE - Kuch hataya nahi
*/
console.log("Image Fix V6 - Duplicate Fix Line Hide + Home Image 100% + Extra Hide - PURA AYA");
window.getBaseId=window.getBaseId||function(id){if(!id)return"";return String(id).split('_')[0].split('-')[0].split(' ')[0].trim();};
window.getBasePath=function(){ let p=window.location.pathname; if(p.includes('/santramarketonlineshoppingmall/')) return '/santramarketonlineshoppingmall/'; return '/'; };
window.getDisplayCode=function(c){if(!c)return"N/A";return window.getBaseId(c);};
window.getProductPageLink=function(id){let bp=window.getBasePath();return bp+"product.html?id="+window.getBaseId(id);};
window.openProductPageUniversal=function(id){let l=window.getProductPageLink(id);try{window.location.href=l;}catch(e){window.open(l,'_blank');}};
window.getUniversalImage=function(p){
if(!p)return null;
let f=['image','imageUrl','thumbnail','thumb','photo','img','productImage','src','mainImage','imgUrl','imageURL','picture'];
for(let k of f){let v=p[k];if(v&&typeof v==='string'&&v.trim().startsWith('http')&&!v.includes('placeholder')&&!v.toLowerCase().includes('no+image')&&!v.includes('via.placeholder'))return v.trim();}
if(p.media&&Array.isArray(p.media)){for(let m of p.media){if(typeof m==='string'&&m.startsWith('http'))return m;if(m&&m.url&&m.url.startsWith('http'))return m.url;}}
if(p.images&&Array.isArray(p.images)){for(let im of p.images){if(typeof im==='string'&&im.startsWith('http'))return im;if(im&&im.url&&im.url.startsWith('http'))return im.url;if(im&&im.imageUrl.startsWith('http'))return im.imageUrl;}}
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
// V6 FINAL - DUPLICATE FIX LINE HIDE - LOGIC RAHEGA BUT UI PE NAHI DIKHEGA - EXTRA ITEM FIX LINE KA KYA KAAM HAI? - Kabhi extra item pda hua na dikhe iske liye duplicate hata ke qty badhata hai - Logic piche chalega but line show nahi hogi
window.fixCartPageDisplay=function(){
// 1. Code _M _XXL _XL hatao
document.querySelectorAll('*').forEach(el=>{
if(el.children.length===0&&el.textContent&&el.textContent.includes('Code:')){
let t=el.textContent;
if(t.includes('_M')||t.includes('_XXL')||t.includes('_XL')){
let nt=t.replace(/Code:\s*([A-Za-z0-9]+)(_[A-Z0-9]+)+/g,function(m,p1){return"Code: "+p1;});
if(nt!==t) el.textContent=nt;
}
}
});
// 2. EXTRA ITEM FIX + IMAGE FIX + TIME FIX TEXTS HIDE - LOGIC RAHEGA BUT UI CLEAN
document.querySelectorAll('h1, h2, h3, h4, span, div, b, strong, button, a, p').forEach(el=>{
if(el.children.length>0) return;
let txt=(el.textContent||"").trim();
if(!txt) return;
// My Cart - Extra Item Fix - Image Fix
if(txt.includes('My Cart') && txt.includes('Extra Item Fix')){ el.textContent="🛒 My Cart"; }
// Aaj: 23/7/2028 - Time Fix Fallback - Extra Item Fix
if(txt.startsWith('Aaj:') && txt.includes('Extra Item Fix')){ let m=txt.match(/Aaj:\s*\d+\/\d+\/\d+/); if(m) el.textContent=m[0]; else el.textContent="Aaj: "+new Date().toLocaleDateString('en-IN'); }
// Date: Loading - Extra Item Fix - Image Fix - Time Fix
if(txt.includes('Date:') && txt.includes('Extra Item Fix')){ el.textContent="Date: "+new Date().toLocaleDateString('en-IN'); }
// Price Details - Extra Item Fix
if(txt.includes('Price Details') && txt.includes('Extra Item Fix')){ el.textContent="Price Details"; }
// Total Amount - Amount
if(txt.includes('Total Amount') && (txt.includes('Extra Item Fix') || txt.includes(' - Amount'))){ el.textContent="Total Amount"; }
// PROCEED TO CHECKOUT - Extra Item Fix
if(txt.includes('PROCEED TO CHECKOUT') && txt.includes('Extra Item Fix')){ el.textContent="➡ PROCEED TO CHECKOUT"; }
// Fix Extra Item - Clear Duplicate button text
if(txt.includes('Fix Extra Item') || txt.includes('Clear Duplicate')){ el.style.display='none'; el.style.visibility='hidden'; el.style.opacity='0'; el.style.height='0'; el.style.pointerEvents='none'; }
});
// 3. Button hide - Fix Extra Item - Clear Duplicate
document.querySelectorAll('button, a, div').forEach(b=>{
let t=((b.innerText||"")+" "+(b.textContent||"")).toLowerCase();
if(t.includes('fix extra') || t.includes('clear duplicate') || t.includes('extra item fix') && b.tagName==='BUTTON'){
  b.style.display='none!important';
  b.style.visibility='hidden';
  b.style.opacity='0';
  b.style.height='0';
  b.style.margin='0';
  b.style.padding='0';
  b.style.pointerEvents='none';
}
});
// 4. Image fix - Home ki image My Cart me layega - Kuch ka aa raha kuch ka nahi - Sabka ayega
document.querySelectorAll('img[data-id], img[data-product-id], img[data-base], #cartList img,.cart-card img, img[alt*="Frock"], img[alt*="Size"]').forEach(img=>{
let id=img.getAttribute('data-id')||img.getAttribute('data-product-id')||img.getAttribute('data-base')||"";
if(id){
if(!img.dataset.fixed){
img.style.cursor="pointer";
img.onclick=function(){window.openProductPageUniversal(id);};
img.dataset.fixed="1";
}
let src=img.getAttribute('src')||"";
let bad=!src||src.includes('placeholder')||src.toLowerCase().includes('no+image')||src.trim()===""||src.startsWith('data:')||img.naturalWidth===0||img.getAttribute('alt')==="No image";
if(bad){
let real=window.getUniversalImage({id:id, code:id, name:img.alt||id});
if(real){img.src=real;img.style.display="block";img.style.background="#fff";}
else{window.fetchImageUniversal(id,img);}
}
}
});
};
// AUTO RUN - Har 1 sec pe check - Extra line kabhi nahi dikhegi
window.ensureCartImagesFromCache();
document.addEventListener('DOMContentLoaded',function(){
window.ensureCartImagesFromCache();
setTimeout(window.fixCartPageDisplay,100);
setTimeout(window.fixCartPageDisplay,400);
setTimeout(window.fixCartPageDisplay,1000);
setTimeout(window.fixCartPageDisplay,2000);
});
setInterval(function(){window.ensureCartImagesFromCache();window.fixCartPageDisplay();},800);
console.log("Image Fix FINAL V6 - Duplicate Fix Line Hide + Home Image 100% - Logic rahega but UI pe nahi dikhega - PURA AYA - LAST LINE OK");
/* OLD BACKUP 23 JULY SAFE - LAST LINE OK - V6 - Duplicate Fix Line Hide - Extra Item Fix line ka kaam: kabhi extra item pda hua na dikhe isliye duplicate hata ke qty badhata hai - Logic rahega but UI pe line show nahi hogi - Home image My Cart me 100% ayegi - LAST LINE OK */
