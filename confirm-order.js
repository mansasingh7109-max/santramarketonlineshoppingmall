   // const db = firebase.firestore(); ← is line ko hata de ya comment kar de
   // db admin.html se aa jayega
// ===== SANTRA MALL - CONFIRM ORDER MODULE =====
// File: confirm-order.js
// Kaam: OTP Verify + Order Confirm + WhatsApp

// IMPORTANT: Firebase pehle initialize hona chahiye
// const db = firebase.firestore();

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

// ===== FUNCTION 3: WHATSAPP MESSAGE BHEJO =====
function santraSendConfirmation(orderData) {
  try {
    const message = `🎉 *SANTRA MALL - Order Confirmed*

Hi ${orderData.customerName},

Aapka order confirm ho gaya hai ✅

*Order Details:*
Order ID: #${orderData.orderId}
Total Amount: ₹${orderData.totalAmount}
Payment Mode: ${orderData.paymentMode}
Items: ${orderData.items.length} products

*Delivery Address:*
${orderData.customerAddress}
${orderData.customerCity}, ${orderData.customerState} - ${orderData.customerPincode}

Track your order:
santra.com/order.html?orderId=${orderData.orderId}

Delivery in 3-5 days 🚚

Thanks for shopping! 🛍️`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/91${orderData.customerMobile}?text=${encodedMsg}`;
    
    // Nayi tab me WhatsApp khol do
    window.open(whatsappLink, '_blank');
    return true;
    
  } catch (error) {
    console.error('WhatsApp Error:', error);
    return false;
  }
}

// ===== FUNCTION 4: CART KHALI KARO =====
function santraClearCartAfterConfirm() {
  localStorage.removeItem('cart');
  localStorage.removeItem('checkout_data');
  console.log('Cart cleared after confirm');
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined') {
  module.exports = { santraVerifyOTP, santraConfirmOrder, santraSendConfirmation };
}