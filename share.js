/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
V8 FINAL BACKUP - 4 SCREENSHOT MIX - SAFE
V11 FINAL BACKUP - ORDER SUMMARY PAGE - SAFE
V12-V15 BACKUP - FULL ID Fix - trim() - SAFE
V16 FINAL BACKUP - Clean Buttons - No cloudinary/imgbb/firebase/base64 - AAPKA BHEJA HUA - SAFE
V17 FINAL - Product Link Image + Full Detail Fix - AAPKA BHEJA HUA - SAFE
*/

// V18 FINAL - OLD SAVE WITH UPDATE DNA - Customer Profile + Delivery Form Auto + Ecommerce Flow - Customer + Admin Useful
console.log("✅ share.js V18 FINAL - Old Save With Update DNA");

window.shareCart = window.shareCart || function(){};
window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  
  // CUSTOMER - FULL - OLD + NEW - function saath me
  let customer = {};
  try{ customer = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
  let name = customer.name || customer.customerName || customer.fullName || "__________";
  let loginMobile = customer.loginMobile || customer.mobile || localStorage.getItem('santra_mobile') || "__________";
  let deliveryMobile = customer.deliveryMobile || customer.extraDeliveryMobile || localStorage.getItem('santra_deliveryMobile') || loginMobile;
  let email = customer.email || "";
  let fullAddr = customer.address || customer.fullAddress || customer.customerAddress || "__________";
  let pincode = customer.pincode || "";
  let city = customer.city || "";
  let finalAddr = fullAddr + (pincode? ", Pincode: "+pincode : "") + (city? ", "+city : "");
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";

  // TOTAL - function saath me
  let subtotal = 0;
  cart.forEach(it=>{ let q=parseInt(it.qty||1)||1, p=parseFloat(it.price||0)||0; subtotal+=q*p; });
  let delivery = subtotal>=500?0:49;
  let grandTotal = subtotal+delivery;

  // FIREBASE SAVE - CUSTOMER + ADMIN DONO KE LIYE - OLD SAVE WITH UPDATE
  try{
   if(window.db){
    // 1. Customer Profile Auto Update - taaki delivery form auto save ho
    if(loginMobile!=="__________"){
      window.db.collection('customers').doc(loginMobile).set({
        name: name, customerName: name, fullName: name,
        mobile: loginMobile, loginMobile: loginMobile, customerMobile: loginMobile,
        deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile,
        email: email, address: finalAddr, fullAddress: finalAddr, customerAddress: finalAddr,
        pincode: pincode, city: city,
        lastOrderId: orderId, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      },{merge:true});
    }
    // 2. Order Save - OLD fields + NEW fields - taaki orders.html me turant detail dikhe - demo nahi
    window.db.collection('orders').doc(orderId).set({
     orderId: orderId, id: orderId,
     mobile: loginMobile, customerMobile: loginMobile, loginMobile: loginMobile, // OLD + NEW - dono naam se
     deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile,
     name: name, customerName: name, fullName: name,
     email: email, address: finalAddr, fullAddress: finalAddr, customerAddress: finalAddr,
     cart: cart, items: cart, orderItems: cart, // OLD + NEW
     subtotal: subtotal, delivery: delivery, grandTotal: grandTotal, total: grandTotal, totalAmount: grandTotal,
     status: 'Pending - OTP Wait', paymentMethod: 'Cash on Delivery',
     date: new Date().toISOString(), dateStr: dateStr,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     file: 'share-otp-verify.html', finalFile: 'orders.html', website: 'santramarketshoppingmall.web.app'
    },{merge:true});
   }
  }catch(e){}

  // CLEAN MESSAGE - No cloudinary/imgbb/base64
  let text = `🛒 *NEW ORDER - SANTRA MALL - V18* 🛒\nOrder ID: ${orderId}\nDate: ${dateStr}\n_________________________________\n\n`;
  cart.forEach(function(item, index){
   let size = item.size || item.variant || 'M'; let qty = parseInt(item.qty)||1; let price = parseFloat(item.price)||0;
   let code = item.code || item.productCode || item.id || 'N/A';
   let nameP = item.name || item.productName || 'Product';
   let cleanId = (item.id || code || '').toString().trim(); // FULL ID - NO SPLIT - fCawrEJjpEoRkB0M5Ztu_M pura
   text += `${index + 1}. *${nameP}*\nSize: ${size} | Qty: ${qty} x ₹${price} = ₹${qty*price}\nCode: ${code}\n🔗 View: ${BASE_URL}/product.html?id=${encodeURIComponent(cleanId)}\n\n`;
  });
  text += `_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ${delivery===0?"FREE":"₹"+delivery}*\n*🧾 GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n`;
  text += `*♦️ Customer:*\nName: ${name}\nLogin/OTP No: ${loginMobile}\nExtra Delivery No: ${deliveryMobile}\nEmail: ${email||'-'}\nAddress: ${finalAddr}\n\n`;
  text += `*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}*\n*📦 Orders: ${BASE_URL}/orders.html?mobile=${loginMobile}*\n`;

  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderGrandTotal', grandTotal);
  localStorage.setItem('santra_mobile', loginMobile);
  localStorage.setItem('santra_deliveryMobile', deliveryMobile);
  try{
    let arr = cart.map(it=>{
      let img = it.image||it.imageUrl||it.productImage||it.thumbnail||'';
      try{
        if(!img && window.SANTRA_IMAGES && window.SANTRA_IMAGES[it.id]) img=window.SANTRA_IMAGES[it.id];
        if(!img && window.SANTRA_ALL_URLS && window.SANTRA_ALL_URLS[it.id]) img=window.SANTRA_ALL_URLS[it.id];
      }catch(e){}
      return {...it, image:img, imageUrl:img, productImage:img};
    });
    localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr));
    localStorage.setItem('lastOrderFullBackup', JSON.stringify({orderId, customerName: name, loginMobile, deliveryMobile, address: finalAddr, items: arr, grandTotal, dateStr, status:'Pending'}));
  }catch(e){}

  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');

  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   if(typeof window.clearCart === 'function'){ window.clearCart(); }
   document.querySelectorAll('#cartCount,.cart-count, [data-cart-count]').forEach(el=>{el.textContent='0';});
  }catch(e){}

  setTimeout(function(){
   location.href = `share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}`;
  }, 800);

 }catch(e){ console.error("shareCart V18 error", e); alert("Error: "+e.message); }
};
console.log("share.js V18 FINAL - Old Save With Update DNA - LAST LINE OK");