// share.js - V9 FINAL - NO VERSION NEEDED - OLD LONG MESSAGE + CART CLEAR AFTER ORDER FOR FUTURE PRODUCTS
console.log("✅ share.js V9 FINAL - Old long message + Cart clear");

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
  let customer = JSON.parse(localStorage.getItem('santra_customer') || '{}');
  let name = customer.name || "__________";
  let mobile = customer.mobile || "__________";
  let email = customer.email || "";
  let address = customer.address || "__________";
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";

  try{
   if(window.db){
    window.db.collection('orders').doc(orderId).set({
     orderId: orderId, mobile: mobile, name: name, email: email, address: address, cart: cart,
     status: 'Pending - OTP Wait', date: new Date().toISOString(), dateStr: dateStr,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     file: 'share-otp-verify.html', finalFile: 'orders.html', website: 'santramarketshoppingmall.web.app'
    }, {merge:true});
   }
  }catch(e){}

  let text = `🛒 *NEW ORDER - SANTRA MALL - FINAL orders.html* 🛒\n`;
  text += `Order ID: ${orderId}\nDate: ${dateStr}\nVia: Share Cart -> share-otp-verify.html -> orders.html FINAL\n_________________________________\n\n`;
  let subtotal = 0;
  cart.forEach(function(item, index){
   let size = item.size || item.variant || 'M'; let qty = parseInt(item.qty) || 1; let price = parseFloat(item.price) || 0;
   let itemTotal = price * qty; subtotal += itemTotal;
   let code = item.code || item.productCode || item.id || 'N/A';
   let nameP = item.name || item.productName || 'Product';
   let cleanId = (item.id || code || '').toString().split('_')[0].split('-')[0];
   text += `${index + 1}. *${nameP}* - ${BASE_URL}/product.html?id=${cleanId}\nSize: ${size}\nQty: ${qty} x ₹${price} = ₹${itemTotal}\nCode: ${code}\n\n`;
  });
  let delivery = subtotal >= 500? 0 : 49; let grandTotal = subtotal + delivery;
  text += `_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ${delivery === 0? "FREE" : "₹" + delivery}*\n*🧾 GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n`;
  text += `*♦️ Customer Details:*\nName: ${name}\nMobile: ${mobile}\nEmail: ${email||'-'}\nAddress: ${address}\n\n`;
  text += `*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}*\n`;
  text += `*📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL*\n\n`;
  text += `*>> OTP ke bina order confirm nahi hoga - share-otp-verify.html <<*`;

  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('lastOrderGrandTotal', grandTotal);

  let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(whatsappURL, '_blank');

  // ✅ CART CLEAR AFTER MESSAGE SENT - Future products ke liye My Cart khali
  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   localStorage.removeItem('cartItems');
   if(typeof window.clearCart === 'function'){ window.clearCart(); }
   document.querySelectorAll('#cartCount,.cart-count, [data-cart-count]').forEach(el=>{el.textContent='0';});
   console.log("✅ Cart cleared - My Cart khali for future products");
  }catch(e){}

  setTimeout(function(){
   if(typeof goToVerifyPage === 'function'){ goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_shareCart'); }
   else { location.href = `${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}`; }
  }, 800);

 }catch(e){ console.error("shareCart error", e); alert("Error: "+e.message); }
};

console.log("share.js V9 FINAL - Cart clear for future - LAST LINE OK");