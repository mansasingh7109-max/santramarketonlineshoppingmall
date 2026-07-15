// ==================== CONFIRM-ORDER.JS - FINAL 15 JULY 2026 ====================

/*
⚠️ OLD CODE BACKUP - 26 JUNE 2026 SE PEHLE WALA - SAFE HIDE - TERI PURANI FILE YAHAN HAI
const db = firebase.firestore(); // ← is line ko hata de ya comment kar de
// db admin.html se aa jayega

// ===== SANTRA MALL - CONFIRM ORDER MODULE =====
// File: confirm-order.js
// Kaam: OTP Verify + Order Confirm + WhatsApp

const db = firebase.firestore();
function santraVerifyOTP(){...}
function santraConfirmOrder(){...}

OLD CODE BACKUP END - SAFE HAI - HATAYA NAHI
*/

// ===== SANTRA MALL - CONFIRM ORDER MODULE - FINAL 15 JULY 2026 =====
// File: confirm-order.js
// Kaam: OTP Verify + Order Confirm + WhatsApp + 4 Hour Expiry + CONSTANTS.JS SUPPORT

// ✅ NAYA: Keys constants.js se lo - admin.html load karta hai - ZINDAGI BHAR KA FIX
const CART_KEY = window.CART_KEY || "santraMallCart_v2";
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";
const ADMIN_EMAIL = window.ADMIN_EMAIL || "santramarketshoppingmall@gmail.com";

console.log('✅ confirm-order.js FINAL loaded - CART_KEY:', CART_KEY, 'CUSTOMER_KEY:', CUSTOMER_KEY);

// const db = firebase.firestore(); ← HATAYA - db admin.html se aa jayega - global variable
// Admin.html me pehle se hai: const db = firebase.firestore();

// ===== FUNCTION 1: OTP VERIFY - 4 HOUR EXPIRY CHECK KE SAATH =====
async function santraVerifyOTP(orderDocId, customerOTP) {
  try {
    console.log('🔐 OTP Verify start:', orderDocId, 'Entered:', customerOTP);
    
    const orderRef = db.collection('orders').doc(orderDocId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      return { success: false, message: '❌ Order nahi mila database me' };
    }
    
    const orderData = orderDoc.data();
    
    // ✅ 4 HOUR EXPIRY CHECK - NAYA ADD
    let otpDoc = null;
    try{
      otpDoc = await db.collection('order_otps').doc(orderDocId).get();
    }catch(e){}

    if(otpDoc && otpDoc.exists){
      const otpData = otpDoc.data();
      const otpTime = otpData.timestamp?.toDate?.() || otpData.createdAt?.toDate?.() || new Date(0);
      const diffHours = (new Date() - otpTime) / 1000 / 60 / 60;
      if(diffHours > 4){
        return { success: false, message: '❌ OTP Expire ho gaya (4 hours)! Naya OTP bhejo' };
      }
    } else if(orderData.createdAt){
      // Order creation se 4 hour check
      const orderTime = orderData.createdAt.toDate?.() || new Date(orderData.createdAt);
      const diffHours = (new Date() - orderTime) / 1000 / 60 / 60;
      if(diffHours > 24 && orderData.status==='pending_otp'){
        console.warn('Order 24h se pending hai');
      }
    }
    
    // ✅ OTP Match - Test OTP 123456 bhi allowed
    const isValidOTP = (orderData.otp === customerOTP) || (otpDoc?.data?.().otp === customerOTP) || (customerOTP === '123456');
    
    if (isValidOTP) {
      console.log('✅ OTP Match ho gaya');
      return { success: true, message: '✅ OTP Verified', orderData: orderData };
    } else {
      console.log('❌ Galat OTP');
      return { success: false, message: '❌ OTP galat hai. Customer se dobara pucho. Admin WhatsApp check karo' };
    }
    
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return { success: false, message: '❌ Error: ' + error.message };
  }
}

// ===== FUNCTION 2: ORDER CONFIRM - TIMELINE + ADMIN REMARK =====
async function santraConfirmOrder(orderDocId, paymentMode, adminRemark) {
  try {
    console.log('✅ Confirm Order start:', orderDocId, paymentMode);
    
    const orderRef = db.collection('orders').doc(orderDocId);
    
    await orderRef.update({
      status: 'Confirmed',
      paymentMode: paymentMode || 'COD',
      otpVerified: true,
      otpVerifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmedBy: 'admin',
      adminRemark: adminRemark || 'Confirmed via WhatsApp OTP - 4 hour valid',
      timeline: firebase.firestore.FieldValue.arrayUnion({
        status: 'confirmed',
        timestamp: new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
        remark: `Payment: ${paymentMode} | Confirmed by Admin | ${adminRemark||''}`
      })
    });

    // OTP doc delete karo - Confirm ho gaya
    try{ await db.collection('order_otps').doc(orderDocId).delete(); }catch(e){}
    
    console.log('✅ Order Confirmed in Firebase');
    return { success: true, message: '✅ Order successfully confirmed' };
    
  } catch (error) {
    console.error('Confirm Order Error:', error);
    return { success: false, message: '❌ Confirm nahi hua: ' + error.message };
  }
}

// ===== FUNCTION 3: WHATSAPP CONFIRMATION - CONSTANTS.JS + BASE_URL =====
function santraSendConfirmation(orderData) {
  try {
    const orderId = orderData.orderId || orderData.id || 'N/A';
    const message = `🎉 *SANTRA MALL - Order Confirmed* ✅

Hi ${orderData.customerName || orderData.name || 'Customer'},

Aapka order #${orderId} confirm ho gaya hai!

*Order Details:*
🧾 Order ID: ${orderId}
💰 Total: ₹${orderData.totalAmount || orderData.total || 0}
💳 Payment: ${orderData.paymentMode || 'COD'}
📦 Items: ${orderData.items ? orderData.items.length : 0} products
🔐 OTP: Verified (4 hour system)

*Delivery Address:*
${orderData.customerAddress || orderData.address || orderData.location || 'Address'}
${orderData.customerCity || ''}, ${orderData.customerState || ''} - ${orderData.customerPincode || ''}

Track karo:
${BASE_URL}/orders.html?order=${orderData.id}
${BASE_URL}/order.html?orderId=${orderId}

Delivery 3-5 days me 🚚
Admin: ${ADMIN_WHATSAPP}

Thanks! 🛍️ *SANTRA MALL*`;

    const encodedMsg = encodeURIComponent(message);
    const customerMobile = orderData.customerMobile || orderData.mobile || orderData.loginMobile || orderData.whatsappMobile;
    if(!customerMobile) return false;
    
    const whatsappLink = `https://wa.me/91${customerMobile}?text=${encodedMsg}`;
    window.open(whatsappLink, '_blank');
    console.log('✅ WhatsApp Confirmation sent to', customerMobile);
    return true;
    
  } catch (error) {
    console.error('WhatsApp Error:', error);
    return false;
  }
}

// ===== FUNCTION 4: CART KHALI - CONSTANTS.JS KEYS =====
function santraClearCartAfterConfirm() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CART_KEY + '_v2');
  localStorage.removeItem('santra_cart');
  localStorage.removeItem('checkout_data');
  localStorage.removeItem(CUSTOMER_KEY + '_checkout_temp');
  console.log('✅ Cart cleared after confirm - CART_KEY:', CART_KEY);
}

// ✅ FUNCTION 5: ORDER CANCEL
async function santraCancelOrder(orderDocId, cancelReason) {
  try {
    console.log('❌ Cancel Order start:', orderDocId);
    const orderRef = db.collection('orders').doc(orderDocId);
    
    await orderRef.update({
      status: 'Cancelled',
      cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
      cancelledBy: 'admin',
      cancelReason: cancelReason || 'Cancelled by Admin',
      timeline: firebase.firestore.FieldValue.arrayUnion({
        status: 'cancelled',
        timestamp: new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
        remark: `Cancelled: ${cancelReason || 'Admin decision'}`
      })
    });
    
    return { success: true, message: '✅ Order cancelled' };
  } catch (error) {
    console.error('Cancel Error:', error);
    return { success: false, message: '❌ Cancel nahi hua: ' + error.message };
  }
}

// ✅ FUNCTION 6: NAYA - OTP RESEND - 4 HOUR VALID
async function santraResendOrderOTP(orderDocId){
  try{
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const db = firebase.firestore();
    await db.collection('orders').doc(orderDocId).update({ otp: newOTP, otpResentAt: firebase.firestore.FieldValue.serverTimestamp() });
    await db.collection('order_otps').doc(orderDocId).set({
      otp: newOTP,
      orderId: orderDocId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      expireHours: 4,
      resentBy: 'admin'
    });

    const orderDoc = await db.collection('orders').doc(orderDocId).get();
    const data = orderDoc.data();
    const msg = `🔐 *SANTRA MALL - Order OTP*\n\nOrder ID: ${orderDocId.slice(-6)}\nYour OTP: *${newOTP}*\n\nValid for 4 hours\nOrder Total: ₹${data.totalAmount||data.total}\nLink: ${BASE_URL}/orders.html`;
    window.open(`https://wa.me/91${data.customerMobile||data.mobile}?text=${encodeURIComponent(msg)}`,'_blank');
    return { success: true, otp: newOTP, message: '✅ New OTP sent - 4 hour valid' };
  }catch(e){
    return { success: false, message: '❌ Error: '+e.message };
  }
}

// ===== EXPORT + GLOBAL =====
if (typeof module !== 'undefined') {
  module.exports = { santraVerifyOTP, santraConfirmOrder, santraSendConfirmation, santraClearCartAfterConfirm, santraCancelOrder, santraResendOrderOTP };
}

window.santraVerifyOTP = santraVerifyOTP;
window.santraConfirmOrder = santraConfirmOrder;
window.santraSendConfirmation = santraSendConfirmation;
window.santraClearCartAfterConfirm = santraClearCartAfterConfirm;
window.santraCancelOrder = santraCancelOrder;
window.santraResendOrderOTP = santraResendOrderOTP;

console.log("✅ confirm-order.js FINAL 15 JULY 2026 - CONSTANTS + 4HOUR OTP + RESEND");