/*
⚠️ OLD CODE BACKUP - V11 FINAL - SAFE - KUCH HATAYA NAHI - PRESERVED
OLD BACKUP END - SAFE - AB V35 FINAL - Order Sent Hamesha Dikhega + WhatsApp Link + Delivery 150
*/
console.log("✅ share.js V35 FINAL - Fix Kabhi Dikhta Kabhi Nahi + WhatsApp Hamesha");

window.shareCart = async function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || localStorage.getItem("santraMallCart_v2") || localStorage.getItem("santraMallCart") || localStorage.getItem("cart") || localStorage.getItem("santraMallCart_v3") || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  let customer = {}; try{ customer = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
  let name = customer.name || customer.customerName || "Customer";
  let loginMobile = customer.loginMobile || customer.mobile || customer.customerMobile || localStorage.getItem('santra_mobile') || "9829508335";
  loginMobile = String(loginMobile).replace(/\D/g,'').slice(-10) || "9829508335";
  let deliveryMobile = customer.deliveryMobile || customer.extraDeliveryMobile || loginMobile;
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let subtotal = 0; cart.forEach(it=>{ subtotal+=(parseInt(it.qty||1)||1)*(parseFloat(it.price||0)||0); });
  let delivery = 150; let grandTotal = subtotal+delivery;

  // Local pehle set - Order Page isi se dikhega chahe Firebase slow ho
  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('santra_mobile', loginMobile);
  let arr = cart.map(it=>{
    let img = it.image || it.imageUrl || '';
    let rawId = (it.id || '').toString();
    let cleanId = rawId.split('_')[0].split('-')[0];
    return {...it, image:img, imageUrl:img, cleanId:cleanId, size:it.size||'M'};
  });
  try{ localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr)); localStorage.setItem('lastOrderGrandTotal', String(grandTotal)); }catch(e){}

  // Firebase - AWAIT karke save - WhatsApp se pehle - isliye kabhi nahi wala khatam
  try{
   if(window.db){
    let orderData = {
      orderId:orderId, id:orderId,
      mobile:loginMobile, loginMobile:loginMobile, customerMobile:loginMobile, deliveryMobile:deliveryMobile,
      name:name, customerName:name,
      cart:arr, items:arr, products:arr,
      subtotal:subtotal, delivery:150, grandTotal:grandTotal, total:grandTotal,
      status:'Pending - OTP Wait', date:new Date().toISOString(), dateStr:dateStr,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(), presentTag:true, otp:''
    };
    await window.db.collection('orders').doc(orderId).set(orderData,{merge:true});
    await window.db.collection('customerOrderOtp').doc(orderId).set({orderId:orderId, mobile:loginMobile, loginMobile:loginMobile, otp:'', status:'Pending'},{merge:true});
    await window.db.collection('order_otps').doc(orderId).set({orderId:orderId, otp:'', loginMobile:loginMobile, presentTag:true},{merge:true});
    console.log("✅ Firebase saved - Order Page me dikhega:", orderId);
   }
  }catch(e){ console.error("Firebase save fail - Rule deploy karo", e); }

  let text = `Product - SANTRA MALL - V34 FINAL - Old Save + ID Hide\n${BASE_URL}\n\nNew Order - SANTRA MALL - ONE FILE URL - V35\nOrder ID: ${orderId}\nDate: ${dateStr}\n\n`;
  arr.forEach((it,i)=>{ let size=it.size||'M'; let qty=parseInt(it.qty)||1; let price=parseFloat(it.price)||0; text+=`${i+1}. ${it.name||'Product'} (Size ${size}) - Size:${size} Qty:${qty} x ₹${price}=₹${qty*price}\nCode:${it.id||'N/A'}\nView: ${BASE_URL}/product.html?id=${it.cleanId}\n\n`; });
  text+=`Subtotal: ₹${subtotal}\nDelivery: ₹150\nGRAND TOTAL: ₹${grandTotal}\n\nCustomer Details:\nName: ${name}\nMobile: ${loginMobile}\nExtra: ${deliveryMobile}\n\nVerify: ${BASE_URL}/share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}\nOrders: ${BASE_URL}/orders.html?mobile=${loginMobile}\n`;

  window.open(`https://wa.me/918769171078?text=${encodeURIComponent(text)}`, '_blank');

  try{
    localStorage.setItem(cartKey, JSON.stringify([]));
    localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
    localStorage.setItem('santraMallCart', JSON.stringify([]));
    localStorage.setItem('cart', JSON.stringify([]));
    localStorage.setItem('santraMallCart_v3', JSON.stringify([]));
    if(window.clearCart) window.clearCart();
  }catch(e){}

  setTimeout(()=>{ location.href=`share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}`; }, 1200);
 }catch(e){ alert(e.message); }
};