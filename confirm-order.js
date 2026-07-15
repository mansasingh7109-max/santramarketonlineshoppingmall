/*
⚠️ OLD CODE BACKUP - 26 JUNE 2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

const db = firebase.firestore(); // ← is line ko hata de ya comment kar de
// db admin.html se aa jayega

// ===== SANTRA MALL - CONFIRM ORDER MODULE =====
// File: confirm-order.js
// Kaam: OTP Verify + Order Confirm + WhatsApp

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - CONFIRM ORDER MODULE - UPDATED 15 JULY 2026 =====
// File: confirm-order.js
// Kaam: OTP Verify + Order Confirm + WhatsApp + CONSTANTS.JS SUPPORT
// IMPORTANT: Firebase pehle initialize hona chahiye - admin.html me hota hai

// ✅ NAYA: Keys constants.js se lo - admin.html load karta hai
const CART_KEY = window.CART_KEY || "santraMallCart_v2";
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

console.log('✅ confirm-order.js loaded - CART_KEY:', CART_KEY);

// const db = firebase.firestore(); ← is line ko hata de ya comment kar de
// db admin.html se aa jayega - global variable

// ===== FUNCTION 1: OTP VERIFY KARO =====
async function santraVerifyOTP(orderDocId, customerOTP) {
  try {
    console.log('OTP Verify start:', orderDocId);
    
    // 1. Firebase se order nikalo
    const orderRef = db.collection('orders').doc(orderDocId);
    const orderDoc = await orderRef.get();
    
    // 2. Order exist karta hai ya nahi
    if (!orderDoc.exists) {
      return { 
        success: false, 
        message: 'Order nahi mila database me' 
      };
    }
    
    const orderData = orderDoc.data();
    
    // 3. OTP match karo. 123456 test ke liye hai
    const isValidOTP = (orderData.otp === customerOTP) || (customerOTP === '123456');
    
    if (isValidOTP) {
      console.log('OTP Match ho gaya');
      return { 
        success: true, 
        message: 'OTP Verified',
        orderData: orderData 
      };
    } else {
      console.log('Galat OTP');
      return { 
        success: false, 
        message: 'OTP galat hai. Customer se dobara pucho' 
      };
    }
    
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return { 
      success: false, 
      message: 'Error: ' + error.message 
    };
  }
}

// ===== FUNCTION 2: ORDER CONFIRM KARO =====
async function santraConfirmOrder(orderDocId, paymentMode, adminRemark) {
  try {
    console.log('Confirm Order start:', orderDocId, paymentMode);
    
    const orderRef = db.collection('orders').doc(orderDocId);
    
    // Firebase me update karo
    await orderRef.update({
      status: 'confirmed',
      paymentMode: paymentMode,
      otpVerifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmedAt: firebase.firestore.FieldValue.serverTimestamp(),
      confirmedBy: 'admin',
      adminRemark: adminRemark || 'Confirmed via WhatsApp OTP',
      // Timeline me naya step add karo
      timeline: firebase.firestore.FieldValue.arrayUnion({
        status: 'confirmed',
        timestamp: new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
        remark: `Payment: ${paymentMode} | Confirmed by Admin`
      })
    });
    
    console.log('Order Confirmed in Firebase');
    return { 
      success: true, 
      message: 'Order successfully confirmed' 
    };
    
  } catch (error) {
    console.error('Confirm Order Error:', error);
    return { 
      success: false, 
      message: 'Confirm nahi hua: ' + error.message 
    };
  }
}

// ===== FUNCTION 3: WHATSAPP MESSAGE BHEJO - CONSTANTS.JS USE KARO =====
function santraSendConfirmation(orderData) {
  try {
    const message = `🎉 *SANTRA MALL - Order Confirmed*

Hi ${orderData.customerName || orderData.name || 'Customer'},

Aapka order confirm ho gaya hai ✅

*Order Details:*
Order ID: #${orderData.orderId || orderData.id}
Total Amount: ₹${orderData.totalAmount || orderData.total || 0}
Payment Mode: ${orderData.paymentMode || 'COD'}
Items: ${orderData.items ? orderData.items.length : 0} products

*Delivery Address:*
${orderData.customerAddress || orderData.address || orderData.location || 'Address'}
${orderData.customerCity || ''}, ${orderData.customerState || ''} - ${orderData.customerPincode || orderData.pincode || ''}

Track your order:
${BASE_URL}/order.html?orderId=${orderData.orderId || orderData.id}

Delivery in 3-5 days 🚚

Thanks for shopping! 🛍️`;

    const encodedMsg = encodeURIComponent(message);
    const customerMobile = orderData.customerMobile || orderData.mobile || orderData.loginMobile;
    const whatsappLink = `https://wa.me/91${customerMobile}?text=${encodedMsg}`;
    
    // Nayi tab me WhatsApp khol do
    window.open(whatsappLink, '_blank');
    return true;
    
  } catch (error) {
    console.error('WhatsApp Error:', error);
    return false;
  }
}

// ===== FUNCTION 4: CART KHALI KARO - CONSTANTS.JS USE KARO =====
function santraClearCartAfterConfirm() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem('checkout_data');
  localStorage.removeItem(CUSTOMER_KEY + '_checkout_temp');
  console.log('✅ Cart cleared after confirm - Key:', CART_KEY);
}

// ✅ NAYA FUNCTION 5: ORDER CANCEL KARO
async function santraCancelOrder(orderDocId, cancelReason) {
  try {
    console.log('Cancel Order start:', orderDocId);
    
    const orderRef = db.collection('orders').doc(orderDocId);
    
    await orderRef.update({
      status: 'cancelled',
      cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
      cancelledBy: 'admin',
      cancelReason: cancelReason || 'Cancelled by Admin',
      timeline: firebase.firestore.FieldValue.arrayUnion({
        status: 'cancelled',
        timestamp: new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
        remark: `Cancelled: ${cancelReason || 'Admin decision'}`
      })
    });
    
    console.log('Order Cancelled in Firebase');
    return { 
      success: true, 
      message: 'Order cancelled successfully' 
    };
    
  } catch (error) {
    console.error('Cancel Order Error:', error);
    return { 
      success: false, 
      message: 'Cancel nahi hua: ' + error.message 
    };
  }
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined') {
  module.exports = { santraVerifyOTP, santraConfirmOrder, santraSendConfirmation, santraClearCartAfterConfirm, santraCancelOrder };
}

// ✅ Global functions - admin.html use karega
window.santraVerifyOTP = santraVerifyOTP;
window.santraConfirmOrder = santraConfirmOrder;
window.santraSendConfirmation = santraSendConfirmation;
window.santraClearCartAfterConfirm = santraClearCartAfterConfirm;
window.santraCancelOrder = santraCancelOrder;

console.log("✅ confirm-order.js loaded - 15 JULY 2026 - CONSTANTS.JS SUPPORT");