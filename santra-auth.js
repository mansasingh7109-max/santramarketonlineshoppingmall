// SANTRA MALL - Common Auth & Order OTP System
const SANTRA_CONFIG = {
  apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
    authDomain: "santramarketshoppingmall.firebaseapp.com",
    projectId: "santramarketshoppingmall",
    storageBucket: "santramarketshoppingmall.appspot.com",
    messagingSenderId: "398490252924",
    appId: "1:398490252924:web:d1b6348b549183b93b7bf9",
    measurementId: "G-ZW1ZR8HETY",// ← Comma zaroori hai
    databaseURL: "https://santramarketshoppingmall-default-rtdb.firebaseio.com/" // ← Last me / nahi lagana
};

if (!firebase.apps.length) firebase.initializeApp(SANTRA_CONFIG);
const santraDB = firebase.firestore();
const ADMIN_WA = "918769171078";

// 1. LOGIN CHECK
function santraGetCustomer() {
  return localStorage.getItem('santra_whatsapp_mobile');
}

function santraRequireLogin() {
  const mobile = santraGetCustomer();
  if (!mobile) {
    alert('❌ Pehle login karo!');
    window.location.href = 'profile.html';
    return null;
  }
  return mobile;
}

// 2. ORDER OTP REQUEST (har order pe)
function santraRequestOrderOTP(cartData, totalAmount) {
  const mobile = santraRequireLogin();
  if (!mobile) return;

  const orderId = 'ORD_' + mobile + '_' + Date.now();
  
  // Loading
  const btn = event.target;
  if (btn) { btn.disabled = true; btn.innerText = '⏳ OTP Request...'; }

  santraDB.collection('order_requests').doc(orderId).set({
    mobile: mobile,
    cart: cartData,
    amount: totalAmount,
    status: 'pending',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    // Admin ko bhejo
    const msg = `🛒 *ORDER OTP REQUEST*\n\nCustomer: ${mobile}\nOrder ID: ${orderId}\nAmount: ₹${totalAmount}\nItems: ${cartData.length}\n\nOTP bhejo customer ko.`;
    window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`, '_blank');
    
    // OTP modal kholo
    santraShowOrderOTPModal(orderId, mobile);
    
    if (btn) { btn.disabled = false; btn.innerText = 'Place Order'; }
  });
}

// 3. ORDER OTP VERIFY
function santraVerifyOrderOTP(orderId, mobile, otp) {
  santraDB.collection('order_otps').doc(orderId).get().then(doc => {
    if (!doc.exists) return alert('❌ OTP nahi mila');
    
    const data = doc.data();
    if (data.otp === otp) {
      // Order confirm
      santraDB.collection('orders').doc(orderId).set({
        ...data.orderData,
        status: 'confirmed',
        confirmedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('✅ Order Confirm Ho Gaya!');
      localStorage.removeItem('santra_cart');
      window.location.href = 'orders.html';
    } else {
      alert('❌ Galat OTP');
    }
  });
}

// 4. PROFILE AUTO LOAD
function santraLoadProfile() {
  const mobile = santraGetCustomer();
  if (!mobile) return;
  
  santraDB.collection('customers').doc(mobile).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      // Profile page pe auto fill
      if (document.getElementById('profileName')) {
        document.getElementById('profileName').innerText = data.name;
        document.getElementById('profileMobile').innerText = data.mobile;
      }
    }
  });
}

// Auto run on every page
document.addEventListener('DOMContentLoaded', santraLoadProfile);