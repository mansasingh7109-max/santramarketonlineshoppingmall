// otp-connect.js - 1 Line se sab connect - Firebase + Local + Notification
async function saveOrderBoth(customer,cart,total,source){
  let orderId="SM"+Date.now();
  let orderData={id:orderId,orderId:orderId,customerName:customer.name||'',mobile:customer.mobile||'',customerMobile:customer.mobile||'',address:customer.address||'',total:total,totalAmount:total,items:cart,status:'Pending - OTP Wait',createdAt:Date.now(),otpVerified:false,source:source||'web'};
  try{ await firebase.database().ref('orders/'+orderId).set(orderData); }catch(e){}
  try{ let l=JSON.parse(localStorage.getItem('adminOrders')||'[]'); l.unshift(orderData); localStorage.setItem('adminOrders',JSON.stringify(l)); localStorage.setItem('allOrders',JSON.stringify(l)); }catch(e){}
  localStorage.setItem('lastOrderId',orderId); localStorage.setItem('lastOrderMobile',orderData.mobile); localStorage.setItem('orderPlacedTime',Date.now().toString());
  return orderId;
}

// Upar wala purana code - saveOrderBoth function
async function saveOrderBoth(customer,cart,total,source){
  let orderId="SM"+Date.now();
  let orderData={...};
  // Firebase + Local + lastOrderId save
  return orderId;
}

// ✅ Sabse niche - Ye wala Notification code - Jo tumne bola
// otp-connect.js - Sab ke liye Notification - Hamesha dikhega - No Auto Hide
(function(){
  function showNotify(){
    let id = localStorage.getItem('lastOrderId');
    let t = localStorage.getItem('orderPlacedTime');
    let line = document.getElementById('otpNotifyLine');
    let txt = document.getElementById('otpNotifyText');
    if(!id || !line) return;
    let diff = Date.now() - parseInt(t||0);
    let fourHour = 4*60*60*1000;
    line.style.display = 'block';
    if(diff >= fourHour){
      txt.innerText = `⚠️ Order ${id} - OTP Expired - Click Here to Generate Again & View Order Page`;
    } else {
      txt.innerText = `🔔 Order ${id} - Add OTP for Verification - Click Here - View Order Page - 4 Hour Valid`;
    }
  }
  setInterval(showNotify, 3000);
  window.addEventListener('load', showNotify);
})();