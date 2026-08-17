/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
V8 FINAL BACKUP - 4 SCREENSHOT MIX - SAFE
V11 FINAL BACKUP - ORDER SUMMARY PAGE - SAFE
V12-V18 BACKUP - FULL ID Fix + Customer Profile + Delivery Form Auto - SAFE
OLD BACKUP END - SAFE
*/

// V20 FINAL - OLD SAVE WITH UPDATE DNA - Delivery 150 Fix + Orders.html Fix + Admin Customer OTP Fix
console.log("✅ share.js V20 FINAL - Delivery 150 Fix");

window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  let customer = {}; try{ customer = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
  let name = customer.name || customer.customerName || "__________";
  let loginMobile = customer.loginMobile || customer.mobile || localStorage.getItem('santra_mobile') || "__________";
  let deliveryMobile = customer.deliveryMobile || customer.extraDeliveryMobile || localStorage.getItem('santra_deliveryMobile') || loginMobile;
  let email = customer.email || "";
  let fullAddr = customer.address || customer.fullAddress || "__________";
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let ADMIN_WHATSAPP = "918769171078";

  // V20 FIX - Hamesha 150 - FREE khatam
  let subtotal = 0;
  cart.forEach(it=>{ let q=parseInt(it.qty||1)||1, p=parseFloat(it.price||0)||0; subtotal+=q*p; });
  let delivery = 150;
  let grandTotal = subtotal+delivery;

  // 5 JAGAH SAVE - taaki orders.html + adminCustomerOrderOtp dono me dikhe - OLD DATA SAFE - merge:true
  try{
   if(window.db){
    let orderData = {
     orderId: orderId, id: orderId,
     mobile: loginMobile, customerMobile: loginMobile, loginMobile: loginMobile,
     deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile,
     name: name, customerName: name,
     email: email, address: fullAddr, fullAddress: fullAddr,
     cart: cart, items: cart, products: cart,
     subtotal: subtotal, delivery: 150, grandTotal: grandTotal, total: grandTotal,
     status: 'Pending - OTP Wait', date: new Date().toISOString(), dateStr: dateStr,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     presentTag:true, soldBy:'Santra Mall'
    };
    window.db.collection('orders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('adminOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrderOtp').doc(orderId).set({orderId:orderId, mobile:loginMobile, deliveryMobile:deliveryMobile, cart:cart, total:grandTotal, status:'Pending - OTP Wait', delivery:150, date:new Date().toISOString()},{merge:true});
    window.db.collection('adminCustomerView').doc(orderId).set({orderId:orderId, mobile:loginMobile, name:name, address:fullAddr, total:grandTotal, products:cart, delivery:150, status:'Pending', dateStr:dateStr},{merge:true});
    window.db.collection('customers').doc(loginMobile).set({name:name, mobile:loginMobile, loginMobile:loginMobile, deliveryMobile:deliveryMobile, address:fullAddr, lastOrderId:orderId},{merge:true});
   }
  }catch(e){}

  let text = `🛒 *NEW ORDER - SANTRA MALL - V20 FINAL*\nOrder ID: ${orderId}\nDate: ${dateStr}\n_________________________________\n\n`;
  cart.forEach((it,i)=>{ let size=it.size||it.variant||'M'; let qty=parseInt(it.qty)||1; let price=parseFloat(it.price)||0; let code=it.code||it.id||'N/A'; let nameP=it.name||'Product'; let cleanId=(it.id||code||'').toString().trim(); text+=`${i+1}. *${nameP}*\nSize:${size} Qty:${qty} x ₹${price}=₹${qty*price}\nCode:${code}\nView:${BASE_URL}/product.html?id=${encodeURIComponent(cleanId)}\n\n`; });
  text+=`_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ₹150*\n*GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n*Customer:* ${name} | ${loginMobile} | ${deliveryMobile}\n*Verify:* ${BASE_URL}/share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}\n*Orders:* ${BASE_URL}/orders.html?mobile=${loginMobile}\n`;

  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('santra_mobile', loginMobile);
  localStorage.setItem('santra_deliveryMobile', deliveryMobile);
  localStorage.setItem('lastOrderGrandTotal', grandTotal);
  try{
    let arr=cart.map(it=>{ let img=it.image||it.imageUrl||''; return {...it, image:img, imageUrl:img}; });
    localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr));
    let screenshotBox=`<div class="screenshot-box">🛒 <b>SANTRAJET MALL - V20 Present</b>\nOrder ID: ${orderId}\nDate: ${dateStr}\n\nSubtotal: ₹${subtotal}\nDelivery: ₹150\n<b>Grand Total: ₹${grandTotal}</b>\nCustomer: ${name} | Login: ${loginMobile}</div>`;
    localStorage.setItem('lastScreenshotBox', screenshotBox);
  }catch(e){}

  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');

  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   if(typeof window.clearCart==='function') window.clearCart();
  }catch(e){}

  setTimeout(()=>{ location.href=`share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}`; }, 800);
 }catch(e){ alert("Error: "+e.message); }
};