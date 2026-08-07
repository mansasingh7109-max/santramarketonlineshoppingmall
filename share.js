/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
const CART_KEY = "santraMallCart_v2";
const BASE_URL = "https://santramarketshoppingmall.web.app";
function shareCart() { let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); if (cart.length === 0) { alert("❌ Cart is empty!"); return; } window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }
OLD CODE BACKUP END - 09/07/2026 SAFE
V8 FINAL BACKUP - 4 SCREENSHOT MIX - OLD LONG MESSAGE SAVE - SAFE
V11 FINAL BACKUP - ORDER SUMMARY PAGE - SCREENSHOT WALA PAGE - SAFE
V12-V15 BACKUP - FULL ID Fix - trim() - SAFE
V16 FINAL BACKUP - Clean Buttons - No cloudinary/imgbb/firebase/base64 - AAPKA BHEJA HUA - SAFE
*/

// V17 FINAL - OLD SAVE WITH UPDATE DNA - My link par image + full detail fix
console.log("✅ share.js V17 FINAL - Product Link Image Fix");

window.shareCart = window.shareCart || function(){};
window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  let customer = JSON.parse(localStorage.getItem('santra_customer') || '{}');
  let name = customer.name || "__________";
  let mobile = customer.mobile || customer.loginMobile || "__________";
  let email = customer.email || "";
  let address = customer.address || customer.fullAddress || "__________";
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

  // CLEAN MESSAGE - koi cloudinary/imgbb/firebase/base64 naam nahi
  let text = `🛒 *NEW ORDER - SANTRA MALL* 🛒\n`;
  text += `Order ID: ${orderId}\nDate: ${dateStr}\n_________________________________\n\n`;
  let subtotal = 0;
  cart.forEach(function(item, index){
   let size = item.size || item.variant || 'M'; let qty = parseInt(item.qty) || 1; let price = parseFloat(item.price) || 0;
   let itemTotal = price * qty; subtotal += itemTotal;
   let code = item.code || item.productCode || item.id || 'N/A';
   let nameP = item.name || item.productName || 'Product';
   let cleanId = (item.id || code || '').toString().trim(); // FULL ID - fCawrEJjpEoRkB0M5Ztu_M pura - NO SPLIT
   text += `${index + 1}. *${nameP}*\nSize: ${size} | Qty: ${qty} x ₹${price} = ₹${itemTotal}\nCode: ${code}\n🔗 View: ${BASE_URL}/product.html?id=${encodeURIComponent(cleanId)}\n\n`;
  });
  let delivery = subtotal >= 500? 0 : 49; let grandTotal = subtotal + delivery;
  text += `_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ${delivery === 0? "FREE" : "₹" + delivery}*\n*🧾 GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n`;
  text += `*♦️ Customer Details:*\nName: ${name}\nMobile: ${mobile}\nEmail: ${email||'-'}\nAddress: ${address}\n\n`;
  text += `*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}*\n`;
  text += `*📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile}*\n`;

  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('lastOrderGrandTotal', grandTotal);
  try{
    // Backup me image ke saath - product.html past present future ke liye
    let arr = cart.map(it=>{
      let img = it.image||it.imageUrl||it.productImage||it.thumbnail||'';
      try{
        if(!img && window.SANTRA_IMAGES && window.SANTRA_IMAGES[it.id]) img=window.SANTRA_IMAGES[it.id];
        if(!img && window.SANTRA_ALL_URLS && window.SANTRA_ALL_URLS[it.id]) img=window.SANTRA_ALL_URLS[it.id];
        if(!img && window.getProductImageUrl){ let u=window.getProductImageUrl(it.id); if(u) img=u; }
      }catch(e){}
      return {...it, image:img, imageUrl:img, productImage:img};
    });
    localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr));
  }catch(e){}

  let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(whatsappURL, '_blank');

  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   localStorage.removeItem('cartItems');
   if(typeof window.clearCart === 'function'){ window.clearCart(); }
   document.querySelectorAll('#cartCount,.cart-count, [data-cart-count]').forEach(el=>{el.textContent='0';});
  }catch(e){}

  setTimeout(function(){
   location.href = `share-otp-verify.html?mobile=${mobile}&orderId=${orderId}`;
  }, 800);

 }catch(e){ console.error("shareCart error", e); alert("Error: "+e.message); }
};
console.log("share.js V17 FINAL - Product Link Image + Full Detail Fix - LAST LINE OK");