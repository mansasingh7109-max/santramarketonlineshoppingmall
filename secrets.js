
// ✅ SANTRA MALL - MASTER CONFIG - 22 JUNE 2026
// Purane const firebaseConfig ke saath bhi chalega

// STEP 1: Config pakdo - chahe const ho ya var ya FIREBASE_CONFIG
var masterConfig = null;

if (typeof firebaseConfig !== 'undefined') {
  masterConfig = firebaseConfig; // const ya var firebaseConfig
} else if (typeof FIREBASE_CONFIG !== 'undefined') {
  masterConfig = FIREBASE_CONFIG; // Purana FIREBASE_CONFIG
} else {
  // Agar kahin nahi mila to yahi use karo
  masterConfig = {
    apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
    authDomain: "santramarketshoppingmall.firebaseapp.com",
    projectId: "santramarketshoppingmall",
    storageBucket: "santramarketshoppingmall.firebasestorage.app",
    messagingSenderId: "398490252924",
    appId: "1:398490252924:web:d1b6348b549183b93b7bf9",
    measurementId: "G-ZW1ZR8HETY", // ← Comma zaroori hai
    databaseURL: "https://santramarketshoppingmall-default-rtdb.firebaseio.com/" // ← Last me / nahi lagana
  };
  // Global bana do taki admin.html me bhi mil jaye
  window.firebaseConfig = masterConfig;
}

// STEP 2: BUSINESS_CONFIG
if (typeof BUSINESS_CONFIG === 'undefined') {
  var BUSINESS_CONFIG = {
    WHATSAPP_NUMBER: "918769171078",
    EMAIL: "mansasingh7109@gmail.com",
    EMAIL_2: "santramarketshoppingmall@gmail.com"
  };
}

// STEP 3: Global Variables
if (typeof CART_KEY === 'undefined') var CART_KEY = "SANTRA_CART";
if (typeof WISHLIST_KEY === 'undefined') var WISHLIST_KEY = "SANTRA_WISHLIST"; 
// ✅ SAHI - 91 add kar de India ke liye
if (typeof ADMIN_WHATSAPP === 'undefined') var ADMIN_WHATSAPP = "918769171078";
if (typeof ADMIN_EMAIL === 'undefined') var ADMIN_EMAIL = "santramarketshoppingmall@gmail.com";
if (typeof EMAILJS_PUBLIC_KEY === 'undefined') var EMAILJS_PUBLIC_KEY = EMAILJS_CONFIG.PUBLIC_KEY;

// STEP 4: Firebase Init - Sabse important
if (typeof firebase !== 'undefined' && !firebase.apps.length && masterConfig) {
  firebase.initializeApp(masterConfig);
  console.log("✅ Firebase Connected from secrets.js using:", masterConfig.projectId);
}
// STEP 5: Global Variables - CASE SENSITIVE HAI
if (typeof CART_KEY === 'undefined') var CART_KEY = "santra_cart";
if (typeof MYCHOICE_KEY === 'undefined') var MYCHOICE_KEY = "santra_mychoice";
if (typeof ADMIN_WHATSAPP === 'undefined') var ADMIN_WHATSAPP = "918769171078";
if (typeof ADMIN_EMAIL === 'undefined') var ADMIN_EMAIL = "santramarketshoppingmall@gmail.com";
