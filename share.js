// FINAL share.js - V4 - 24 JULY - Short Link Only - Long Message Khatam - WhatsApp Box Fix - PURA AYA - OLD CODE SAVE
// OLD BACKUP - 23 JULY V3 - KUCH HATAYA NAHI
/*
OLD V3: function shareCart(){ let text=`🛒 *New Order* Date...`; window.open(`https://wa.me/?text=${text}`); } - LONG MESSAGE BUG
OLD V3: function shareSingleProduct(productId){ let item=cart.find(p=>p.id===productId); } - EXACT MATCH BUG - _M nahi milta tha
*/
window.getBaseId=window.getBaseId||function(id){return String(id||'').split('_')[0].split('-')[0].trim();};
if(!window.BASE_URL) window.BASE_URL="https://santramarketshoppingmall.web.app";
if(!window.ADMIN_WHATSAPP) window.ADMIN_WHATSAPP="918769171078";
var ADMIN_WHATSAPP=window.ADMIN_WHATSAPP;
var getCartKey=function(){return window.CART_KEY||"santraMallCart_v2";};
var showDeliveryFormPopup=function(cart,cb){
let o=document.getElementById('santra_delivery_popup');if(o)o.remove();
let n=localStorage.getItem('santra_customer_name')||'',mo=localStorage.getItem('santra_mobile')||localStorage.getItem('customer_mobile')||'',em=localStorage.getItem('santra_customer_email')||'',ad=localStorage.getItem('santra_customer_addr')||'';
let h='<div id="santra_delivery_popup" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999999;display:flex;align-items:center;justify-content:center;padding:15px"><div style="background:white;width:100%;max-width:400px;border-radius:16px;padding:18px"><h3 style="margin:0 0 12px;color:#e40046;text-align:center">Delivery Details</h3><input id="popup_name" value="'+n+'" placeholder="Full Name *" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #ddd;border-radius:10px"><input id="popup_mobile" value="'+mo+'" type="tel" maxlength="10" placeholder="Mobile 10 digit *" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #e40046;border-radius:10px"><input id="popup_email" value="'+em+'" type="email" placeholder="Email (optional)" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #ddd;border-radius:10px"><textarea id="popup_address" placeholder="Full Address *" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #ddd;border-radius:10px;min-height:70px">'+ad+'</textarea><div style="display:flex;gap:8px;margin-top:12px"><button id="popup_cancel" style="flex:1;padding:12px;background:#e5e7eb;border:none;border-radius:10px;font-weight:bold">Cancel</button><button id="popup_submit" style="flex:2;padding:12px;background:#e40046;color:white;border:none;border-radius:10px;font-weight:bold">Save & Continue</button></div></div></div>';
document.body.insertAdjacentHTML('beforeend',h);
document.getElementById('popup_cancel').onclick=function(){let e=document.getElementById('santra_delivery_popup');if(e)e.remove();};
document.getElementById('popup_submit').onclick=function(){
let name=document.getElementById('popup_name').value.trim();
let mobile=document.getElementById('popup_mobile').value.trim().replace(/\D/g,'').slice(-10);
let email=document.getElementById('popup_email').value.trim();
let address=document.getElementById('popup_address').value.trim();
if(!name)return alert('Name likho');if(!mobile||mobile.length!=10)return alert('10 digit mobile likho');if(!address)return alert('Address likho');
localStorage.setItem('santra_customer_name',name);localStorage.setItem('santra_mobile',mobile);localStorage.setItem('customer_mobile',mobile);localStorage.setItem('santra_customer_email',email);localStorage.setItem('santra_customer_addr',address);
let ee=document.getElementById('santra_delivery_popup');if(ee)ee.remove();cb({name,mobile,email,address});};};
var goToVerifyPage=function(oid,mo){
let ks=[getCartKey(),"santraMallCart_v2","cart","santra_cart"];ks.forEach(k=>{try{if(k)localStorage.removeItem(k);}catch(e){}});
localStorage.setItem(getCartKey(),"[]");localStorage.setItem("santraMallCart_v2","[]");
if(window.cart)window.cart={};try{if(typeof updateCartCount==='function')updateCartCount();if(typeof updateCartBadge==='function')updateCartBadge();if(typeof renderCart==='function')renderCart();}catch(e){}
let m=(mo||'').toString().replace(/\D/g,'').slice(-10)||localStorage.getItem('santra_mobile')||'';
location.href="share-otp-verify.html?orderId="+oid+"&mobile="+m;};
// SHORT LINK ONLY - LONG MESSAGE KHATAM - WHATSAPP BOX FIX
window.shareCart=function(){
let key=getCartKey();let raw=localStorage.getItem(key)||"[]";let cart=[];try{let p=JSON.parse(raw);cart=Array.isArray(p)?p:Object.values(p);}catch(e){}
if(!cart.length){alert("Cart empty");return;}
showDeliveryFormPopup(cart,function(c){
let oid="SM"+Date.now();
let sub=cart.reduce((s,it)=>s+(parseFloat(it.price)||0)*(parseInt(it.qty)||1),0);let del=sub>=500?0:49;let gt=sub+del;
localStorage.setItem('lastOrderId',oid);localStorage.setItem('lastOrderIdForOTP',oid);localStorage.setItem('lastOrderGrandTotal',gt);
let live="https://mansasingh7109-max.github.io/santramarketonlineshoppingmall/share-otp-verify.html?orderId="+oid;
// SHORT MESSAGE ONLY - NO LONG MESSAGE
let txt="Hi SANTRA MALL Order Placed\nOrder ID: "+oid+"\nAmount: Rs."+gt+"\nLink: "+live+"\nOTP Open WhatsApp dabao.";
window.open("https://wa.me/"+ADMIN_WHATSAPP+"?text="+encodeURIComponent(txt),'_blank');
setTimeout(function(){goToVerifyPage(oid,c.mobile);},700);
});
};
window.shareSingleProduct=function(pid){
console.log("SHARE CLICKED V4",pid);
let key=getCartKey();let raw=localStorage.getItem(key)||"[]";let cart=[];try{let p=JSON.parse(raw);cart=Array.isArray(p)?p:Object.values(p);}catch(e){}
let base=window.getBaseId(pid);
let it=null;
for(let p of cart){let id=String(p.id||p.code||"").trim();if(id===String(pid).trim()||window.getBaseId(id)===base){it=p;break;}}
if(!it){
try{
let all=[];['santra_all_products_cache','allProductsCache'].forEach(k=>{try{let j=JSON.parse(localStorage.getItem(k)||"[]");if(Array.isArray(j)) all=all.concat(j);}catch(e){}});
if(window.allProducts) all=all.concat(window.allProducts);
for(let x of all){if(!x)continue;let xid=String(x.id||x.code||"").trim();if(xid===String(pid).trim()||window.getBaseId(xid)===base){it=x;break;}}
}catch(e){}
}
if(!it){it={id:pid,code:pid,name:pid,price:150,qty:1};}
showDeliveryFormPopup([it],function(c){
let oid="SM"+Date.now();
let live="https://mansasingh7109-max.github.io/santramarketonlineshoppingmall/share-otp-verify.html?orderId="+oid;
// SHORT MESSAGE ONLY
let txt="Hi SANTRA MALL - Product Inquiry\nProduct: "+(it.name||"Frock")+"\nCode: "+window.getBaseId(it.code||it.id||pid)+"\nOrder ID: "+oid+"\nLink: "+live+"\nOTP ke liye Open WhatsApp dabao.";
window.open("https://wa.me/"+ADMIN_WHATSAPP+"?text="+encodeURIComponent(txt),'_blank');
setTimeout(function(){goToVerifyPage(oid,c.mobile);},600);
});
};
window.shareProduct=function(pid){ return window.shareSingleProduct(pid); };
window.shareProductDirect=function(p){
if(!p){alert("Product data missing");return;}
let id=p.id||p.code||"Frock";
showDeliveryFormPopup([p],function(c){
let oid="SM"+Date.now();
let live="https://mansasingh7109-max.github.io/santramarketonlineshoppingmall/share-otp-verify.html?orderId="+oid;
let txt="Hi SANTRA MALL - Product Inquiry\nProduct: "+(p.name||id)+"\nCode: "+window.getBaseId(p.code||p.id||id)+"\nOrder ID: "+oid+"\nLink: "+live+"\nOTP ke liye Open WhatsApp dabao.";
window.open("https://wa.me/"+ADMIN_WHATSAPP+"?text="+encodeURIComponent(txt),'_blank');
setTimeout(function(){goToVerifyPage(oid,c.mobile);},600);
});
};
// LONG MESSAGE FUNCTIONS KO OVERRIDE - KUCH BHI LONG MESSAGE NA BHEJE
window.generateOrderData=function(){ return null; };
window.sendOrderToAll=window.shareCart;
window.sendOrderWhatsApp=window.shareCart;
console.log('share.js FINAL V4 - Short Link Only - Long Message Khatam - WhatsApp Box Fix - PURA AYA - LAST LINE OK');
/* V4 24 JULY - SHORT LINK ONLY - Long message khatam - Extra line hide - LAST LINE OK - OLD CODE SAVE WITH UPDATE */