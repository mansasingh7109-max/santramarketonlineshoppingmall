/*
⚠️ OLD CODE BACKUP - V11 FINAL - SAFE - KUCH HATAYA NAHI - PRESERVED - 09/07/2026
OLD BACKUP END - SAFE - AB V30 FINAL - ONE FILE URL - Order Page Fix - GitHub Play Fix - Old Save + Update DNA
*/
console.log("✅ share.js V30 FINAL - GitHub Play Fix - Order Page + Delivery 150 + Admin OTP Ready");

window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || localStorage.getItem("santraMallCart_v2") || localStorage.getItem("santraMallCart") || localStorage.getItem("cart") || localStorage.getItem("santraMallCart_v3") || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  let customer = {}; try{ customer = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
  let name = customer.name || customer.customerName || "Customer";
  // FIX - __________ hata diya - isliye GitHub Play par Order Page par nahi dikh raha tha
  let loginMobile = customer.loginMobile || customer.mobile || customer.customerMobile || localStorage.getItem('santra_mobile') || localStorage.getItem('mobile') || "8003200377";
  loginMobile = String(loginMobile).replace(/\D/g,'').slice(-10) || "8003200377";
  let deliveryMobile = customer.deliveryMobile || customer.extraDeliveryMobile || loginMobile;
  let email = customer.email || "";
  let fullAddr = customer.address || customer.fullAddress || "Address";
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let subtotal = 0; cart.forEach(it=>{ subtotal+=(parseInt(it.qty||1)||1)*(parseFloat(it.price||0)||0); });
  let delivery = 150; let grandTotal = subtotal+delivery;

  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('santra_mobile', loginMobile); // GitHub Play ke liye jaruri
  let arr = cart.map(it=>{ let img=it.image||it.imageUrl||it.thumbnail||''; return {...it,image:img,imageUrl:img, size:it.size||'M'}; });
  try{ localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr)); localStorage.setItem('lastOrderGrandTotal', String(grandTotal)); }catch(e){}

  try{
   if(window.db){
    let orderData = {
      orderId:orderId, id:orderId,
      mobile:loginMobile, loginMobile:loginMobile, customerMobile:loginMobile, deliveryMobile:deliveryMobile,
      name:name, customerName:name, email:email, address:fullAddr,
      cart:arr, items:arr, products:arr, // 3 naam se - Checkout html + Share js dono se Order Page me dikhega
      subtotal:subtotal, delivery:150, grandTotal:grandTotal, total:grandTotal, totalAmount:grandTotal,
      status:'Pending - OTP Wait', date:new Date().toISOString(), dateStr:dateStr,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(), presentTag:true, otp:'', adminOtp:''
    };
    window.db.collection('orders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrderOtp').doc(orderId).set({orderId:orderId, mobile:loginMobile, otp:'', status:'Pending'},{merge:true});
    window.db.collection('order_otps').doc(orderId).set({orderId:orderId, otp:'', loginMobile:loginMobile, presentTag:true},{merge:true});
    window.db.collection('adminCustomerView').doc(orderId).set({orderId:orderId, mobile:loginMobile, name:name, total:grandTotal, products:arr, presentTag:true},{merge:true});
   }
  }catch(e){}

  let text = `NEW ORDER - SANTRA MALL - ONE FILE URL - V30\nOrder ID: ${orderId}\nDate: ${dateStr}\n\n`;
  arr.forEach((it,i)=>{ let size=it.size||'M'; let qty=parseInt(it.qty)||1; let price=parseFloat(it.price)||0; let code=it.code||it.id||'N/A'; text+=`${i+1}. ${it.name||'Product'} (Size ${size}) Qty:${qty} x ₹${price}=₹${qty*price} Code:${code}\n`; });
  text+=`Subtotal: ₹${subtotal} Delivery: ₹150 GRAND TOTAL: ₹${grandTotal}\nCustomer: ${name} Mobile: ${loginMobile}\nVerify: ${BASE_URL}/share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}\nOrders: ${BASE_URL}/orders.html?mobile=${loginMobile}\n`;
  window.open(`https://wa.me/918769171078?text=${encodeURIComponent(text)}`, '_blank');

  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   localStorage.setItem('santraMallCart_v3', JSON.stringify([]));
   if(typeof window.clearCart==='function') window.clearCart();
   document.querySelectorAll('#cartCount,.cart-count').forEach(el=>{el.textContent='0'; el.style.display='none';});
  }catch(e){}

  setTimeout(()=>{ location.href=`share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}`; }, 800);
 }catch(e){ alert("Error: "+e.message); }
};