/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
V8 FINAL BACKUP - 4 SCREENSHOT MIX - SAFE
V11 FINAL BACKUP - ORDER SUMMARY PAGE - SAFE
V12-V15 BACKUP - FULL ID Fix - trim() - SAFE
V16 FINAL BACKUP - Clean Buttons - No cloudinary/imgbb/firebase/base64 - AAPKA BHEJA HUA - SAFE
V17 FINAL - Product Link Image + Full Detail Fix - AAPKA BHEJA HUA - SAFE
OLD BACKUP END - SAFE
*/

// V19 FINAL - OLD SAVE WITH UPDATE DNA - Delivery 150 Fix + Orders.html + Admin OTP Fix + Customer Profile Auto
console.log("✅ share.js V19 FINAL - Old Save With Update DNA - Delivery 150 + Orders Fix");

window.shareCart = window.shareCart || function(){};
window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  
  // CUSTOMER - FULL - OLD + NEW
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

  // TOTAL - V19 FIX - Hamesha ₹150 - FREE hata
  let subtotal = 0;
  cart.forEach(it=>{ let q=parseInt(it.qty||1)||1, p=parseFloat(it.price||0)||0; subtotal+=q*p; });
  let delivery = 150;
  let grandTotal = subtotal+delivery;

  // FIREBASE SAVE - 5 JAGAH - OLD SAVE WITH UPDATE - taaki orders.html + admin OTP dono me dikhe
  try{
   if(window.db){
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
    let orderData = {
     orderId: orderId, id: orderId,
     mobile: loginMobile, customerMobile: loginMobile, loginMobile: loginMobile,
     deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile,
     name: name, customerName: name, fullName: name,
     email: email, address: finalAddr, fullAddress: finalAddr, customerAddress: finalAddr,
     cart: cart, items: cart, orderItems: cart, products: cart,
     subtotal: subtotal, delivery: 150, grandTotal: grandTotal, total: grandTotal, totalAmount: grandTotal,
     status: 'Pending - OTP Wait', paymentMethod: 'Cash on Delivery',
     date: new Date().toISOString(), dateStr: dateStr,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     presentTag:true, soldBy:'Santra Mall'
    };
    window.db.collection('orders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('adminOrders').doc(orderId).set({...orderData, adminNote:'New Order '+orderId},{merge:true});
    window.db.collection('customerOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrderOtp').doc(orderId).set({orderId:orderId, mobile:loginMobile, deliveryMobile:deliveryMobile, cart:cart, total:grandTotal, status:'Pending - OTP Wait', date:new Date().toISOString()},{merge:true});
    window.db.collection('adminCustomerView').doc(orderId).set({orderId:orderId, mobile:loginMobile, name:name, address:finalAddr, total:grandTotal, products:cart, status:'Pending', dateStr:dateStr},{merge:true});
   }
  }catch(e){ console.log(e); }

  // CLEAN MESSAGE - FREE hata - ₹150 fix
  let text = `🛒 *NEW ORDER - SANTRA MALL - V19* 🛒\nOrder ID: ${orderId}\nDate: ${dateStr}\n_________________________________\n\n`;
  cart.forEach(function(item, index){
   let size = item.size || item.variant || 'M'; let qty = parseInt(item.qty)||1; let price = parseFloat(item.price)||0;
   let code = item.code || item.productCode || item.id || 'N/A';
   let nameP = item.name || item.productName || 'Product';
   let cleanId = (item.id || code || '').toString().trim();
   text += `${index + 1}. *${nameP}*\nSize: ${size} | Qty: ${qty} x ₹${price} = ₹${qty*price}\nCode: ${code}\n🔗 View: ${BASE_URL}/product.html?id=${encodeURIComponent(cleanId)}\n\n`;
  });
  text += `_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ₹150*\n*🧾 GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n`;
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
    localStorage.setItem('lastOrderFullBackup', JSON.stringify({orderId, customerName: name, loginMobile, deliveryMobile, address: finalAddr, items: arr, grandTotal, dateStr, status:'Pending', delivery:150}));
    // ScreenshotBox - FREE hata
    let itemsText = arr.map((it,i)=>`${i+1}. ${it.name} Qty:${it.qty} x ₹${it.price}`).join('\n');
    let screenshotBox=`<div class="screenshot-box">🛒 <b>SANTRAJET MALL - V19 Present + Live</b>\nOrder ID: ${orderId}\nDate: ${dateStr}\n\n${itemsText}\n\nSubtotal: ₹${subtotal}\nDelivery: ₹150\n<b>Grand Total: ₹${grandTotal}</b>\nPayment: Cash on Delivery\nCustomer: ${name} | Login: ${loginMobile}</div>`;
    localStorage.setItem('lastScreenshotBox', screenshotBox);
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

 }catch(e){ console.error("shareCart V19 error", e); alert("Error: "+e.message); }
};
console.log("share.js V19 FINAL - Old Save With Update DNA - LAST LINE OK");