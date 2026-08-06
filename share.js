/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
const CART_KEY = "santraMallCart_v2";
const BASE_URL = "https://santramarketshoppingmall.web.app";
function shareCart() {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (cart.length === 0) { alert("❌ Cart is empty!"); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
OLD CODE BACKUP END - 09/07/2026 SAFE

V8 FINAL BACKUP - share22julyjan.js - 4 SCREENSHOT MIX - OLD LONG MESSAGE SAVE
V9 FINAL BACKUP - NO VERSION NEEDED - OLD LONG MESSAGE + CART CLEAR AFTER ORDER FOR FUTURE PRODUCTS - UPDATED V9.5 WITH ORDER-SAVE.JS - SAFE
*/

// share.js - V15.5 FINAL - V9 Old Code Save With Update - No Ref + Sold By Santra Mall + Total Hamesha + Cancel Reason Support + order-save.js
console.log("✅ share.js V15.5 FINAL - V9 Old Save - No Ref - Sold By Santra Mall - Total Fix - order-save.js - Cart clear");

// ✅ 1️⃣ PASTE HERE - TOP PE - Config - Yahi config hai jo tu dhoondh rahi thi
if(!window.BASE_URL) window.BASE_URL = "https://santramarketshoppingmall.web.app";
if(!window.ADMIN_WHATSAPP) window.ADMIN_WHATSAPP = "918769171078";
var BASE_URL = window.BASE_URL;
var ADMIN_WHATSAPP = window.ADMIN_WHATSAPP;

// Safe DB + IST Time
try{ if(!window.db || typeof window.db.collection!=='function'){ if(typeof firebase!=='undefined' && firebase.firestore) window.db = firebase.firestore(); } }catch(e){}
var db = window.db;
window.getISTNow = window.getISTNow || function(){ try{ return new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}); }catch(e){ return new Date().toLocaleString(); } };

window.shareCart = window.shareCart || function(){};

window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || "[]";
  let cart = [];
  try{ cart = JSON.parse(raw); if(!Array.isArray(cart)) cart = Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  let istTime = getISTNow();
  let customer = JSON.parse(localStorage.getItem('santra_customer') || '{}');
  let name = (customer.name || localStorage.getItem('santra_customer_name') || "Customer").trim();
  let mobile = (customer.mobile || localStorage.getItem('santra_mobile') || "").toString().replace(/\D/g,'').slice(-10);
  if(!mobile || mobile.length!=10) mobile = (localStorage.getItem('customer_mobile')||"").replace(/\D/g,'').slice(-10) || "__________";
  let email = customer.email || localStorage.getItem('santra_customer_email') || "";
  let address = customer.address || localStorage.getItem('santra_customer_addr') || "__________";

  // ✅ 2️⃣ Firebase Save - Nayi file order-save.js se connect + Total Hamesha
  let subtotal = 0;
  cart.forEach(function(item){ subtotal += (parseFloat(item.price||item.sellingPrice||0)||0)*(parseInt(item.qty||item.quantity||1)||1); });
  let delivery = subtotal >= 500? 0 : 49;
  let grandTotal = subtotal + delivery;

  let orderDataForSave = {
    customerName: name, name: name,
    customerMobile: mobile, mobile: mobile,
    customerEmail: email, email: email,
    customerAddress: address, address: address,
    items: cart.map(it=>({id:it.id, name: it.name, size: it.size||it.variant||'M', qty: parseInt(it.qty||1)||1, price: parseFloat(it.price||0)||0, total: (parseInt(it.qty||1)||1)*(parseFloat(it.price||0)||0), image: it.image||''})),
    cart: cart,
    total: grandTotal, totalAmount: grandTotal, grandTotal: grandTotal, subtotal: subtotal, delivery: delivery,
    soldBy: "Santra Mall",
    status: 'Pending - OTP Wait',
    dateStr: dateStr, istTime: istTime
  };

  // Old wala code safe rakha - agar nayi file nahi hai toh ye chalega
  try{
   if(window.db && typeof saveOrderBoth!== 'function' && typeof saveOrderSafely!== 'function'){
    window.db.collection('orders').doc(orderId).set({
     orderId: orderId, mobile: mobile, customerMobile: mobile, name: name, customerName: name, email: email, address: address, cart: cart, items: cart,
     total: grandTotal, grandTotal: grandTotal, subtotal: subtotal, delivery: delivery, soldBy: "Santra Mall",
     status: 'Pending - OTP Wait', date: new Date().toISOString(), dateStr: dateStr, istTime: istTime,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     file: 'share-otp-verify.html', finalFile: 'orders.html', website: 'santramarketshoppingmall.web.app'
    }, {merge:true});

    if(mobile.length==10){
      window.db.collection('customers').doc(mobile).set({
        name: name, mobile: mobile, lastOrderId: orderId, soldBy: "Santra Mall",
        allNames: firebase.firestore.FieldValue.arrayUnion(name),
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
    }
   }
  }catch(e){}

  // ✅ Long Message - No Ref + Sold By Santra Mall + Total Hamesha Dikhega
  let text = `🛒 *NEW ORDER - SANTRA MALL* 🛒\n`;
  text += `Order ID: ${orderId}\nDate: ${dateStr} | Sold By: Santra Mall\n_________________________________\n\n`;
  subtotal = 0;
  cart.forEach(function(item, index){
   let size = item.size || item.variant || 'M'; let qty = parseInt(item.qty) || 1; let price = parseFloat(item.price) || 0;
   let itemTotal = price * qty; subtotal += itemTotal;
   let code = item.code || item.productCode || item.id || 'N/A';
   let nameP = item.name || item.productName || 'Product';
   let cleanId = (item.id || code || '').toString().split('_')[0].split('-')[0];
   text += `${index + 1}. *${nameP}* - ${BASE_URL}/product.html?id=${cleanId}\nSize: ${size}\nQty: ${qty} x ₹${price} = ₹${itemTotal}\nCode: ${code}\n\n`;
  });
  delivery = subtotal >= 500? 0 : 49; grandTotal = subtotal + delivery;
  text += `_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ${delivery === 0? "FREE" : "₹" + delivery}*\n*🧾 GRAND TOTAL: ₹${grandTotal}*\n*Sold By: Santra Mall*\n_________________________________\n\n`;
  text += `*♦️ Customer Details:*\nName: ${name}\nMobile: ${mobile}\nEmail: ${email||'-'}\nAddress: ${address}\n\n`;
  text += `*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}*\n`;
  text += `*📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL*\n\n`;
  text += `*>> OTP ke bina order confirm nahi hoga <<*`;

  let fullText = text;

  // ✅ 3️⃣ Nayi file ko call karo - Firebase me save rahega - Total hamesha
  try{
    if(typeof saveOrderBoth === 'function'){
      saveOrderBoth({name: name, mobile: mobile, email: email, address: address}, cart, grandTotal, 'share_js_V9_V15');
      console.log("✅ saveOrderBoth se Firebase me save kiya - Total ₹"+grandTotal);
    } else if(typeof saveOrderSafely === 'function'){
      saveOrderSafely(orderId, orderDataForSave, fullText);
      console.log("✅ saveOrderSafely (old) se save kiya");
    }
  }catch(e){ console.log("Order save file not loaded yet, fallback used", e); }

  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('lastOrderGrandTotal', grandTotal);
  try{ localStorage.setItem('lastOrderCartBackup', JSON.stringify(cart)); }catch(e){}

  let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(whatsappURL, '_blank');

  // CART CLEAR AFTER MESSAGE SENT - Future products ke liye
  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   localStorage.removeItem('cartItems');
   localStorage.removeItem('CART_KEY');
   if(typeof window.clearCart === 'function'){ window.clearCart(); }
   document.querySelectorAll('#cartCount,.cart-count, [data-cart-count]').forEach(el=>{el.textContent='0';});
   console.log("✅ Cart cleared - Future products ke liye ready");
  }catch(e){}

  setTimeout(function(){
   if(typeof goToVerifyPage === 'function'){ goToVerifyPage(orderId, mobile, 'share_link', 'Santra Mall', 'share_js_V9_V15'); }
   else { location.href = `${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}`; }
  }, 800);

 }catch(e){ console.error("shareCart error", e); alert("Error: "+e.message); }
};

console.log("share.js V15.5 FINAL - V9 Old Save + No Ref + Sold By Santra Mall + Total Hamesha + order-save.js + Cart clear - LAST LINE OK");