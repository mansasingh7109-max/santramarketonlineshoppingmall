/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI - V11 PRESERVED
const CART_KEY = "santraMallCart_v2";
const BASE_URL = "https://santramarketshoppingmall.web.app";
function shareCart() {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (cart.length === 0) { alert("❌ Cart is empty!"); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
OLD CODE BACKUP END - 09/07/2026 SAFE

V8 FINAL BACKUP - share22julyjan.js - 4 SCREENSHOT MIX - OLD LONG MESSAGE SAVE
V11 FINAL BACKUP - Old code save with update - Screenshot wala page - SAFE - PRESERVED
OLD BACKUP END - SAFE - AB V29 FINAL - Old Save + Update DNA - ONE FILE URL + Order Page Fix + Admin OTP Ready + Delivery 150 + Help
*/

// share.js - V29 FINAL - ONE FILE URL - My Cart - SANTRA MALL - Old Save + Update DNA - Fast Running Useful
console.log("✅ share.js V29 FINAL - ONE FILE URL - Order Page + Cart Empty + Delivery 150 + Admin OTP Ready + Long Detail Message");

window.shareCart = function(){
 try{
  // ONE FILE cart ke 5 key check — My Cart - ONE FILE URL + Mustard Desi oil wala Cart (1) ke liye
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || localStorage.getItem("santraMallCart_v2") || localStorage.getItem("santraMallCart") || localStorage.getItem("cart") || localStorage.getItem("santraMallCart_v3") || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai - My Cart - ONE FILE URL me add karo"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  let customer = {}; try{ customer = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
  let name = customer.name || customer.customerName || "Customer";
  // Mobile fix — __________ hata diya — isliye Order Page me kabhi dikta kabhi nahi wala bug tha — Share js + Checkout html dono ke liye same key
  let loginMobile = customer.loginMobile || customer.mobile || customer.customerMobile || localStorage.getItem('santra_mobile') || localStorage.getItem('mobile') || "8003200377";
  loginMobile = String(loginMobile).replace(/\D/g,'').slice(-10) || "8003200377";
  let deliveryMobile = customer.deliveryMobile || customer.extraDeliveryMobile || loginMobile;
  let email = customer.email || "";
  let fullAddr = customer.address || customer.fullAddress || customer.shippingAddress || "Address";
  let payment = customer.paymentMethod || "Online Payment";
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let subtotal = 0; cart.forEach(it=>{ subtotal+=(parseInt(it.qty||1)||1)*(parseFloat(it.price||0)||0); });
  let delivery = 150; let grandTotal = subtotal+delivery;

  // Local — orders.html isi par filter karta hai — Checkout html + Share js dono ke liye jaruri — isliye Order Detail order page me dike Detail
  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('santra_mobile', loginMobile);
  localStorage.setItem('santra_deliveryMobile', deliveryMobile);
  let arr = cart.map(it=>{ let img=it.image||it.imageUrl||it.thumbnail||''; return {...it,image:img,imageUrl:img, size:it.size||'M'}; });
  try{
    localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr));
    localStorage.setItem('lastOrderFullBackup', JSON.stringify({orderId, loginMobile, deliveryMobile, grandTotal, items:arr, dateStr}));
    localStorage.setItem('lastOrderGrandTotal', String(grandTotal));
  }catch(e){}

  try{
   if(window.db){
    let orderData = {
      orderId:orderId, id:orderId,
      mobile:loginMobile, loginMobile:loginMobile, deliveryMobile:deliveryMobile, customerMobile:loginMobile,
      name:name, customerName:name, email:email, address:fullAddr, fullAddress:fullAddr,
      cart:arr, items:arr, products:arr, // 3 naam se save — Checkout html items naam se save karta hai — Share js cart naam se — dono se Order Page me dikhega + admin panel
      subtotal:subtotal, delivery:150, grandTotal:grandTotal, total:grandTotal, totalAmount:grandTotal,
      status:'Pending - OTP Wait', date:new Date().toISOString(), dateStr:dateStr,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      presentTag:true, presentUpdate:true, otp:'', adminOtp:'', customerOTP:'', file:'share-otp-verify.html', finalFile:'orders.html', website:'santramarketshoppingmall.web.app'
    };
    window.db.collection('orders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('adminOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrderOtp').doc(orderId).set({orderId:orderId, mobile:loginMobile, loginMobile:loginMobile, otp:'', status:'Pending - OTP Wait', date:new Date().toISOString(), presentTag:true},{merge:true});
    window.db.collection('order_otps').doc(orderId).set({orderId:orderId, otp:'', loginMobile:loginMobile, presentTag:true, timestamp:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    window.db.collection('adminCustomerView').doc(orderId).set({orderId:orderId, mobile:loginMobile, loginMobile:loginMobile, name:name, total:grandTotal, grandTotal:grandTotal, products:arr, status:'Pending', dateStr:dateStr, presentTag:true},{merge:true});
   }
  }catch(e){ console.log("DB save error", e); }

  // Screenshot jaisa long detail message - V34 FINAL wala - Product - SANTRA MALL - Old Save + ID Hide - Mustard Desi oil wala - Grand Total ₹750 wala
  let text = `Product - SANTRA MALL - V34 FINAL - Old Save + ID Hide\n${BASE_URL}\n\nNew Order - SANTRA MALL - ONE FILE URL - V29\nOrder ID: ${orderId}\nDate: ${dateStr}\n\n`;
  arr.forEach((it,i)=>{
   let size=it.size||it.variant||'M'; let qty=parseInt(it.qty)||1; let price=parseFloat(it.price)||0; let code=it.code||it.id||'N/A';
   let nameP=it.name||'Product'; let cleanId=(it.id||code||'').toString().split('_')[0];
   text+=`${i+1}. ${nameP} (Size ${size}) - Size:${size} Qty:${qty} x ₹${price}=₹${qty*price}\nCode:${code}\nView: ${BASE_URL}/product.html?id=${cleanId}\n\n`;
  });
  text+=`_________________________________\nSubtotal: ₹${subtotal}\nDelivery: ₹150\nGRAND TOTAL: ₹${grandTotal}\n_________________________________\n\nCustomer Details:\nName: ${name}\nMobile: ${loginMobile}\nExtra: ${deliveryMobile}\nEmail: ${email||'-'}\nAddress: ${fullAddr}\nPayment: ${payment}\n\nVerify: ${BASE_URL}/share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}\nOrders: ${BASE_URL}/orders.html?mobile=${loginMobile}\n`;
  window.open(`https://wa.me/918769171078?text=${encodeURIComponent(text)}`, '_blank');

  // Cart khali fix — ONE FILE URL ke saare keys khali — Share js order jane ke baad Cart khali hona chahiye
  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   localStorage.setItem('santraMallCart_v3', JSON.stringify([]));
   localStorage.removeItem('cartItems');
   localStorage.removeItem('CART_KEY');
   if(typeof window.clearCart === 'function'){ window.clearCart(); }
   if(window.updateCartCount){ window.updateCartCount(0); }
   document.querySelectorAll('#cartCount,.cart-count,[data-cart-count],.cart-badge').forEach(el=>{ el.textContent='0'; el.style.display='none'; });
  }catch(e){ console.log(e); }

  setTimeout(function(){ location.href=`share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}`; }, 900);
 }catch(e){ console.error("shareCart error", e); alert("Error: "+e.message); }
};
console.log("✅ share.js V29 FINAL - LAST LINE OK - ONE FILE URL - Order Page + Cart Empty + Delivery 150 + Admin OTP Ready - Old Save + Update DNA");