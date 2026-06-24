// ✅ SANTRA MALL - MASTER CONFIG - 25 JUNE 2026
// Sabhi 24 files me yahi ek file use hogi

// STEP 1: Firebase Config
if (typeof masterConfig === 'undefined') {
  var masterConfig = {
    apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
    authDomain: "santramarketshoppingmall.firebaseapp.com",
    projectId: "santramarketshoppingmall",
    storageBucket: "santramarketshoppingmall.appspot.com",
    messagingSenderId: "398490252924",
    appId: "1:398490252924:web:d1b6348b549183b93b7bf9",
    measurementId: "G-ZW1ZR8HETY",
    databaseURL: "https://santramarketshoppingmall-default-rtdb.firebaseio.com"
  };
  window.masterConfig = masterConfig;
  window.firebaseConfig = masterConfig;
}

// STEP 2: Global Keys - YE SABSE ZARURI HAI
if (typeof CART_KEY === 'undefined') {
  var CART_KEY = "santraMallCart_v2"; // ✅ SAB JAGAH SAME HOGA
  window.CART_KEY = CART_KEY;
}

if (typeof MYCHOICE_KEY === 'undefined') {
  var MYCHOICE_KEY = "santraMallMyChoice_v2";
  window.MYCHOICE_KEY = MYCHOICE_KEY;
}

if (typeof WISHLIST_KEY === 'undefined') {
  var WISHLIST_KEY = "SANTRA_WISHLIST";
  window.WISHLIST_KEY = WISHLIST_KEY;
}

if (typeof ADMIN_WHATSAPP === 'undefined') {
  var ADMIN_WHATSAPP = "918769171078";
  window.ADMIN_WHATSAPP = ADMIN_WHATSAPP;
}

if (typeof ADMIN_EMAIL === 'undefined') {
  var ADMIN_EMAIL = "santramarketshoppingmall@gmail.com";
  window.ADMIN_EMAIL = ADMIN_EMAIL;
}

// STEP 3: Firebase Init - SIRF FIRESTORE
if (typeof firebase !== 'undefined' && !firebase.apps.length && typeof masterConfig !== 'undefined') {
    firebase.initializeApp(masterConfig);
    console.log("✅ Firebase Connected:", masterConfig.projectId);
} else if (firebase.apps.length) {
    console.log("✅ Firebase Already Connected");
} else {
    console.error("❌ Firebase SDK load nahi hua");
}

// STEP 4: db, auth Global
if (typeof db === 'undefined' && typeof firebase !== 'undefined' && firebase.apps.length) {
  var db = firebase.firestore();
  window.db = db;
}

if (typeof auth === 'undefined' && typeof firebase !== 'undefined' && firebase.apps.length) {
  var auth = firebase.auth();
  window.auth = auth;
}

// ❌ REALTIME DATABASE HATA DIYA - ZARURAT NAHI HAI
// var rtdb = firebase.database();

// STEP 5: BUSINESS_CONFIG
if (typeof BUSINESS_CONFIG === 'undefined') {
  var BUSINESS_CONFIG = {
    WHATSAPP_NUMBER: "918769171078",
    EMAIL: "mansasingh7109@gmail.com",
    EMAIL_2: "santramarketshoppingmall@gmail.com"
  };
  window.BUSINESS_CONFIG = BUSINESS_CONFIG;
}

// STEP 6: EMAILJS CONFIG - YAHAN DAAL DE APNI KEYS
if (typeof EMAILJS_CONFIG === 'undefined') {
  var EMAILJS_CONFIG = {
    PUBLIC_KEY: "abcd1234EfGh5678", // 👈 Yahan EmailJS ka Public Key
    SERVICE_ID: "service_xxxxxxx",  // 👈 Yahan Service ID
    TEMPLATE_ID: "template_xxxxxxx" // 👈 Yahan Template ID
  };
  window.EMAILJS_CONFIG = EMAILJS_CONFIG;
}

console.log("✅ secrets.js done. CART_KEY:", CART_KEY, "EMAILJS:", EMAILJS_CONFIG.SERVICE_ID);
