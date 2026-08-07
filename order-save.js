// order-save.js - v3.0 - Santra Safe - Old Code Preserved + New Firebase Dual Save - Permanent
// order-save.js - V20 FINAL - OLD SAVE + Login No=OTP + Delivery Extra = Extra Mobile for Delivery

(function(){
  console.log('📦 Order Saver v3 + V20 Login+Extra - Old Safe + New Dual Save - Permanent');

/*
⚠️ OLD CODE BACKUP - v3.0 - 06/08/2026 - SAFE - KUCH HATAYA NAHI
Original v3.0 tumhara bheja hua:
  async function saveOrderSafely(orderId, orderData, fullText) { ... db.collection('orders').doc(orderId).set(...) ... rtdb.ref('orders/' + orderId).set(...) ... }
  window.saveOrder = async function(orderData){ const orderId = 'ORD' + Date.now(); ... }
  window.saveOrderBoth = async function(customer, cart, grandTotal, source){ let name = customer.name || localStorage.getItem('santra_customer_name') || 'Customer'; let mobile = (customer.mobile || localStorage.getItem('santra_mobile') || '9660834888')... }
OLD CODE END - v3.0 SAFE - AB V20 UPDATE
*/

  async function saveOrderSafely(orderId, orderData, fullText) {
    try {
      if (window.db && typeof window.db.collection==='function') {
        await window.db.collection('orders').doc(orderId).set({...orderData, fullMessage: fullText, createdAt: firebase.firestore.FieldValue.serverTimestamp()}, {merge:true});
      } else if(window.firebase && firebase.firestore){
        let db = firebase.firestore();
        await db.collection('orders').doc(orderId).set({...orderData, fullMessage: fullText, createdAt: firebase.firestore.FieldValue.serverTimestamp()}, {merge:true});
      }
      if (window.rtdb) {
        await window.rtdb.ref('orders/' + orderId).set({...orderData, fullMessage: fullText, timestamp: Date.now()});
      } else if(window.firebase && firebase.database){
        let rdb = firebase.database();
        await rdb.ref('orders/' + orderId).set({...orderData, fullMessage: fullText, timestamp: Date.now()});
        let mobile = orderData.loginMobile || orderData.whatsappMobile || orderData.customerMobile || orderData.mobile || '';
        let deliveryMob = orderData.deliveryMobile || orderData.extraDeliveryMobile || '';
        if(mobile){
          await rdb.ref('customer_orders/'+mobile+'/'+orderId).set({...orderData, fullMessage: fullText});
          await rdb.ref('my_orders_updates/'+mobile).set({lastOrderId: orderId, status: orderData.status || 'Pending', time: Date.now(), loginMobile: mobile, deliveryMobile: deliveryMob});
          await rdb.ref('admin_orders_backup/'+orderId).set({...orderData, fullMessage: fullText});
          await rdb.ref('orders_page_updates/'+mobile).set({lastOrderId: orderId, time: Date.now(), loginMobile: mobile, deliveryMobile: deliveryMob});
        }
      }
      if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
        try{ await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {order_id: orderId, customer_name: orderData.customerName || orderData.name, customer_mobile: orderData.loginMobile || orderData.customerMobile || orderData.mobile, order_total: orderData.total, full_message: fullText, to_email: 'santramarketshoppingmall@gmail.com'}); }catch(e){}
      }
      return true;
    } catch (err) {
      localStorage.setItem("pending_order_" + orderId, JSON.stringify({...orderData, fullMessage: fullText}));
      return false;
    }
  }

  window.saveOrder = async function(orderData){
    const orderId = 'ORD' + Date.now();
    const fullText = `New Order ${orderId}\nName: ${orderData.customerName || orderData.name}\nLogin No: ${orderData.loginMobile||orderData.mobile}\nExtra Delivery: ${orderData.deliveryMobile||'Same'}\nTotal: ₹${orderData.total}\nItems: ${(orderData.items||[]).length}`;
    await saveOrderSafely(orderId, orderData, fullText);
    const orders = JSON.parse(localStorage.getItem('santraOrders')||'[]');
    orders.unshift({...orderData, id:orderId, time:new Date().toISOString()});
    localStorage.setItem('santraOrders', JSON.stringify(orders.slice(0,100)));
    if(window.SantraLock) try{ SantraLock.sendAlert('ORDER', `${orderId} - ₹${orderData.total}`); }catch(e){}
    return orderId;
  };

  window.saveOrderBoth = async function(customer, cart, grandTotal, source){
    source = source || 'unknown';
    let name = customer.name || customer.customerName || localStorage.getItem('santra_customer_name') || 'Customer';
    // V20 - Login No = OTP No + Delivery Extra
    let loginMobile = (customer.loginMobile || customer.whatsappMobile || customer.customerMobile || customer.mobile || localStorage.getItem('santra_mobile') || localStorage.getItem('santra_whatsapp_mobile') || '').toString().replace(/\D/g,'').slice(-10);
    if(!loginMobile || loginMobile.length!=10) loginMobile = (localStorage.getItem('customer_mobile')||'').replace(/\D/g,'').slice(-10);
    if(!loginMobile || loginMobile.length!=10) loginMobile = ''; // no hardcoded example number

    let deliveryMobile = (customer.deliveryMobile || customer.extraDeliveryMobile || customer.alternateMobile || localStorage.getItem('santra_deliveryMobile') || '').toString().replace(/\D/g,'').slice(-10);

    let email = customer.email || customer.customerEmail || localStorage.getItem('santra_customer_email') || '';
    let address = customer.address || customer.fullAddress || customer.customerAddress || customer.location || localStorage.getItem('santra_customer_addr') || 'Address';
    let pincode = customer.pincode || ''; let landmark = customer.landmark || ''; let city = customer.city || ''; let state = customer.state || ''; let house = customer.house || '';

    let orderId = "SM" + Date.now();
    let dateStr = new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});

    // LocalStorage - Profile Auto Save - V20
    try{
      let existing = {}; try{ existing = JSON.parse(localStorage.getItem('santra_customer')||'{}'); }catch(e){}
      let updated = {...existing, name:name, loginMobile:loginMobile, whatsappMobile:loginMobile, mobile:loginMobile, deliveryMobile:deliveryMobile, extraDeliveryMobile:deliveryMobile, alternateMobile:deliveryMobile, email:email, address:address, fullAddress:address, pincode:pincode, landmark:landmark, city:city, state:state, house:house, lastOrderId: orderId};
      localStorage.setItem('santra_customer', JSON.stringify(updated));
      if(loginMobile) localStorage.setItem('santra_mobile', loginMobile);
      if(deliveryMobile) localStorage.setItem('santra_deliveryMobile', deliveryMobile);
      localStorage.setItem('santra_customer_name', name);
      localStorage.setItem('santra_customer_addr', address);
    }catch(e){}

    let orderData = {
      orderId, oid: orderId, id: orderId,
      customerName: name, name,
      customerMobile: loginMobile, mobile: loginMobile,
      loginMobile: loginMobile, whatsappMobile: loginMobile, // OTP isi pe
      deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile, alternateMobile: deliveryMobile, // Extra Mobile for Delivery
      customerEmail: email, email,
      customerAddress: address, address, deliveryAddress: address, fullAddress: address,
      pincode, landmark, city, state, house,
      items: cart.map(it=>({name: it.name, size: it.size||'M', qty: parseInt(it.qty)||1, price: parseFloat(it.price)||0, total: (parseInt(it.qty)||1)*(parseFloat(it.price)||0)})),
      cart, total: grandTotal, grandTotal,
      status: 'Pending - OTP Wait - Login:'+loginMobile+' Extra:'+(deliveryMobile||'Same'),
      source: source+'_V20_Login'+loginMobile+'_Extra'+(deliveryMobile||'Same'),
      otp: '123456', otpVerified: false,
      date: new Date().toISOString(), dateStr
    };

    let fullText = `🛒 NEW ORDER ${orderId}\nName: ${name}\nLogin/WhatsApp OTP No: ${loginMobile} (OTP isi pe)\nExtra Mobile for Delivery: ${deliveryMobile||'Same as Login'}\nAddress: ${address} ${pincode?'- '+pincode:''}\nTotal: ₹${grandTotal}\nSource: ${source}\nItems: ${cart.length}\nPayment: ${localStorage.getItem('santra_paymentMethod')||''}`;

    await saveOrderSafely(orderId, orderData, fullText);

    // Customer doc me bhi login primary, delivery extra
    try{
      let db = window.db || (window.firebase && firebase.firestore());
      if(db && loginMobile){
        await db.collection('customers').doc(loginMobile).set({
          name: name,
          loginMobile: loginMobile, whatsappMobile: loginMobile, mobile: loginMobile,
          deliveryMobile: deliveryMobile, extraDeliveryMobile: deliveryMobile, alternateMobile: deliveryMobile,
          email: email, address: address, fullAddress: address,
          pincode: pincode, landmark: landmark, city: city, state: state,
          lastOrderId: orderId,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});
        await db.collection('customer_orders').doc(loginMobile).collection('orders').doc(orderId).set(orderData, {merge:true});
      }
    }catch(e){}

    localStorage.setItem('lastOrderId', orderId);
    localStorage.setItem('lastOrderMobile', loginMobile);
    localStorage.setItem('lastOrderDeliveryMobile', deliveryMobile||'');
    localStorage.setItem('lastOrderGrandTotal', grandTotal.toString());
    return orderId;
  };

  window.retryPendingOrders = async function(){
    Object.keys(localStorage).forEach(async key=>{
      if(key.startsWith('pending_order_')){
        try{ const data = JSON.parse(localStorage.getItem(key)); const id = key.replace('pending_order_',''); const ok = await saveOrderSafely(id, data, data.fullMessage); if(ok) localStorage.removeItem(key); }catch(e){}
      }
    });
  };
  setInterval(window.retryPendingOrders, 30000);
  window.saveOrderSafely = saveOrderSafely;
  console.log('✅ order-save.js V20 FINAL - Login No=OTP + Extra Mobile for Delivery - OLD SAVE - LAST LINE OK');
})();