/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE - KUCH HATAYA NAHI
V8 FINAL BACKUP - 4 SCREENSHOT MIX - SAFE
V11 FINAL BACKUP - ORDER SUMMARY PAGE - SAFE - TUMHARA ORIGINAL
V12-V18 BACKUP - FULL ID Fix + Customer Profile + Delivery Form Auto - SAFE
OLD BACKUP END - SAFE - AB V20 FINAL - OLD SAVE WITH UPDATE DNA
*/

console.log("✅ share.js V20 FINAL - Old Save + Delivery 150 + Orders.html Fix");

window.shareCart = function(){
 try{
  let cartKey = window.CART_KEY || "santraMallCart_v2";
  let raw = localStorage.getItem(cartKey) || localStorage.getItem("santraMallCart_v2") || "[]";
  let cart = []; try{ cart=JSON.parse(raw); if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){cart=[];}
  if(cart.length===0){ alert("Cart khali hai"); return; }

  let orderId = 'SM' + Date.now();
  let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
  
  // CUSTOMER - FULL - OLD + NEW - mobile fix taaki orders.html filter chale
  let customer = {};
  try{ customer = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
  let name = customer.name || customer.customerName || "Customer";
  let loginMobile = customer.loginMobile || customer.mobile || customer.customerMobile || localStorage.getItem('santra_mobile') || localStorage.getItem('mobile') || "9829508335";
  loginMobile = String(loginMobile).replace(/\D/g,'').slice(-10) || "9829508335";
  let deliveryMobile = customer.deliveryMobile || customer.extraDeliveryMobile || localStorage.getItem('santra_deliveryMobile') || loginMobile;
  let email = customer.email || "";
  let fullAddr = customer.address || customer.fullAddress || "Address";
  let BASE_URL = "https://santramarketshoppingmall.web.app";
  let ADMIN_WHATSAPP = "918769171078";

  // V20 FIX - Delivery hamesha 150 - FREE hata
  let subtotal = 0;
  cart.forEach(it=>{ let q=parseInt(it.qty||1)||1, p=parseFloat(it.price||0)||0; subtotal+=q*p; });
  let delivery = 150;
  let grandTotal = subtotal+delivery;

  // LOCAL STORAGE - orders.html ispe hi present dikhata hai - sabse jaruri
  localStorage.setItem('lastOrderId', orderId);
  localStorage.setItem('lastOrderIdForOTP', orderId);
  localStorage.setItem('santra_mobile', loginMobile);
  localStorage.setItem('santra_deliveryMobile', deliveryMobile);
  localStorage.setItem('lastOrderGrandTotal', grandTotal);
  let arr = [];
  try{
    arr = cart.map(it=>{
      let img = it.image||it.imageUrl||it.productImage||it.thumbnail||'';
      try{
        if(!img && window.SANTRA_IMAGES && window.SANTRA_IMAGES[it.id]) img=window.SANTRA_IMAGES[it.id];
        if(!img && window.SANTRA_ALL_URLS && window.SANTRA_ALL_URLS[it.id]) img=window.SANTRA_ALL_URLS[it.id];
      }catch(e){}
      return {...it, image:img, imageUrl:img, productImage:img};
    });
    localStorage.setItem('lastOrderCartBackup', JSON.stringify(arr));
    localStorage.setItem('lastOrderFullBackup', JSON.stringify({orderId, customerName:name, loginMobile, deliveryMobile, address:fullAddr, items:arr, subtotal, delivery:150, grandTotal, dateStr, status:'Pending - OTP Wait'}));
  }catch(e){}

  // FIREBASE - 5 JAGAH - OLD SAVE - merge:true - old data safe - admin OTP list bhi tik
  try{
   if(window.db){
    let orderData = {
     orderId: orderId, id: orderId,
     mobile: loginMobile, customerMobile: loginMobile, loginMobile: loginMobile,
     deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile,
     name: name, customerName: name,
     email: email, address: fullAddr, fullAddress: fullAddr,
     cart: arr.length?arr:cart, items: arr.length?arr:cart, products: arr.length?arr:cart,
     subtotal: subtotal, delivery: 150, grandTotal: grandTotal, total: grandTotal,
     status: 'Pending - OTP Wait', date: new Date().toISOString(), dateStr: dateStr,
     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
     presentTag:true, soldBy:'Santra Mall', website:'santramarketshoppingmall.web.app'
    };
    window.db.collection('orders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('adminOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrders').doc(orderId).set(orderData,{merge:true});
    window.db.collection('customerOrderOtp').doc(orderId).set({orderId:orderId, mobile:loginMobile, deliveryMobile:deliveryMobile, cart:arr.length?arr:cart, total:grandTotal, delivery:150, status:'Pending - OTP Wait', date:new Date().toISOString(), dateStr:dateStr},{merge:true});
    window.db.collection('adminCustomerView').doc(orderId).set({orderId:orderId, mobile:loginMobile, name:name, address:fullAddr, total:grandTotal, delivery:150, products:arr.length?arr:cart, status:'Pending', dateStr:dateStr},{merge:true});
    window.db.collection('customers').doc(loginMobile).set({name:name, mobile:loginMobile, loginMobile:loginMobile, deliveryMobile:deliveryMobile, address:fullAddr, lastOrderId:orderId, lastOrderDate:dateStr},{merge:true});
   }
  }catch(e){ console.log(e); }

  // WHATSAPP - FREE hata - 150 fix
  let text = `🛒 *NEW ORDER - SANTRA MALL - V20 FINAL*\nOrder ID: ${orderId}\nDate: ${dateStr}\n_________________________________\n\n`;
  cart.forEach((it,i)=>{ let size=it.size||it.variant||'M'; let qty=parseInt(it.qty)||1; let price=parseFloat(it.price)||0; let code=it.code||it.id||'N/A'; let nameP=it.name||'Product'; let cleanId=(it.id||code||'').toString().trim(); text+=`${i+1}. *${nameP}* - Size:${size} Qty:${qty} x ₹${price}=₹${qty*price}\nCode:${code}\nView:${BASE_URL}/product.html?id=${encodeURIComponent(cleanId)}\n\n`; });
  text+=`_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ₹150*\n*GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n*Customer:* ${name} | Login:${loginMobile} | Delivery:${deliveryMobile}\n*Verify:* ${BASE_URL}/share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}\n*Orders:* ${BASE_URL}/orders.html?mobile=${loginMobile}\n`;

  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');

  try{
   localStorage.setItem(cartKey, JSON.stringify([]));
   localStorage.setItem('santraMallCart_v2', JSON.stringify([]));
   localStorage.setItem('santraMallCart', JSON.stringify([]));
   localStorage.setItem('cart', JSON.stringify([]));
   if(typeof window.clearCart==='function') window.clearCart();
   document.querySelectorAll('#cartCount,.cart-count,[data-cart-count]').forEach(el=>{el.textContent='0';});
  }catch(e){}

  setTimeout(()=>{ location.href=`share-otp-verify.html?mobile=${loginMobile}&orderId=${orderId}`; }, 900);
 }catch(e){ console.error(e); alert("Error: "+e.message); }
};