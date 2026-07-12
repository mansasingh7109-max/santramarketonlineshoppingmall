// order-saver.js - v2.0 - Santra Safe (old code preserved)
(function(){
  console.log('📦 Order Saver v2 Loaded');

  // === TUMHARA PURANA FUNCTION - bilkul same ===
  async function saveOrderSafely(orderId, orderData, fullText) {
    try {
      // 1. Firebase Firestore
      if (window.db) {
        await db.collection('orders').doc(orderId).set({
          ...orderData,
          fullMessage: fullText,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      // 2. Realtime Database backup
      if (window.rtdb) {
        await rtdb.ref('orders/' + orderId).set({
          ...orderData,
          fullMessage: fullText,
          timestamp: Date.now()
        });
      }

      // 3. EmailJS
      if (typeof emailjs !== 'undefined' && typeof EMAILJS_CONFIG !== 'undefined') {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            order_id: orderId,
            customer_name: orderData.customerName,
            customer_mobile: orderData.customerMobile,
            customer_email: orderData.customerEmail,
            customer_address: orderData.customerAddress,
            order_total: orderData.total,
            order_items: orderData.items.map(i => `${i.name} (${i.size}) x ${i.qty} = ₹${i.total}`).join('\n'),
            full_message: fullText,
            to_email: 'santramarketshoppingmall@gmail.com'
          }
        );
      }

      console.log('✅ Order saved: Firebase + Email');
      return true;

    } catch (err) {
      console.log('Firebase busy, order local me save', err);
      localStorage.setItem("pending_order_" + orderId, JSON.stringify({
        ...orderData,
        fullMessage: fullText
      }));
      return false;
    }
  }

  // === NAYA WRAPPER - santra-home ke liye ===
  window.saveOrder = async function(orderData){
    const orderId = 'ORD' + Date.now();
    const fullText = `New Order ${orderId}\nName: ${orderData.customerName}\nTotal: ₹${orderData.total}\nItems: ${orderData.items.length}`;
    
    // purane function ko call karo
    const ok = await saveOrderSafely(orderId, orderData, fullText);
    
    // local backup (hamesha)
    const orders = JSON.parse(localStorage.getItem('santraOrders')||'[]');
    orders.unshift({...orderData, id:orderId, time:new Date().toISOString()});
    localStorage.setItem('santraOrders', JSON.stringify(orders.slice(0,100)));
    
    // healing lock ko alert bhejo
    if(window.SantraLock) SantraLock.sendAlert('ORDER', `${orderId} - ₹${orderData.total}`);
    
    return orderId;
  };

  // === NAYA: pending orders auto-retry ===
  window.retryPendingOrders = async function(){
    Object.keys(localStorage).forEach(async key=>{
      if(key.startsWith('pending_order_')){
        const data = JSON.parse(localStorage.getItem(key));
        const id = key.replace('pending_order_','');
        const ok = await saveOrderSafely(id, data, data.fullMessage);
        if(ok) localStorage.removeItem(key);
      }
    });
  };

  // har 30 sec me retry
  setInterval(window.retryPendingOrders, 30000);
  
  // expose purana function bhi
  window.saveOrderSafely = saveOrderSafely;
})();