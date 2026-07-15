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
    measurementId: "G-ZW1ZR8HETY",// ← Comma zaroori hai
    databaseURL: "https://santramarketshoppingmall-default-rtdb.firebaseio.com/" // ← Last me / nahi lagana
  };
  window.masterConfig = masterConfig;
  window.firebaseConfig = masterConfig;
}

// STEP 2: Global Keys - CART_KEY & MYCHOICE_KEY HATA DIYE ❌
// if (typeof CART_KEY === 'undefined') {
//   var CART_KEY = "santraMallCart_v2"; // ← constants.js me chala gaya
//   window.CART_KEY = CART_KEY;
// }

// if (typeof MYCHOICE_KEY === 'undefined') {
//   var MYCHOICE_KEY = "santraMallMyChoice_v2"; // ← constants.js me chala gaya
//   window.MYCHOICE_KEY = MYCHOICE_KEY;
// }

// ADMIN_WHATSAPP rakh sakti hai agar constants.js me nahi daala
if (typeof ADMIN_WHATSAPP === 'undefined') {
  var ADMIN_WHATSAPP = "918769171078";
  window.ADMIN_WHATSAPP = ADMIN_WHATSAPP;
}

if (typeof ADMIN_EMAIL === 'undefined') {
  var ADMIN_EMAIL = "santramarketshoppingmall@gmail.com";
  window.ADMIN_EMAIL = ADMIN_EMAIL;
}

// STEP 3: Firebase Init - FIRESTORE + RTDB DONO
if (typeof firebase !== 'undefined' && !firebase.apps.length && typeof masterConfig !== 'undefined') {
    firebase.initializeApp(masterConfig);
    console.log("✅ Firebase Connected:", masterConfig.projectId);
} else if (firebase.apps.length) {
    console.log("✅ Firebase Already Connected");
} else {
    console.error("❌ Firebase SDK load nahi hua");
}

// STEP 4: db, auth, rtdb Global
if (typeof db === 'undefined' && typeof firebase !== 'undefined' && firebase.apps.length) {
  var db = firebase.firestore();
  window.db = db;
}

if (typeof auth === 'undefined' && typeof firebase !== 'undefined' && firebase.apps.length) {
  var auth = firebase.auth();
  window.auth = auth;
}

if (typeof rtdb === 'undefined' && typeof firebase !== 'undefined' && firebase.apps.length) {
  var rtdb = firebase.database();
  window.rtdb = rtdb;
}

// STEP 5: BUSINESS_CONFIG
if (typeof BUSINESS_CONFIG === 'undefined') {
  var BUSINESS_CONFIG = {
    WHATSAPP_NUMBER: "918769171078",
    EMAIL: "mansasingh7109@gmail.com",
    EMAIL_2: "santramarketshoppingmall@gmail.com"
  };
  window.BUSINESS_CONFIG = BUSINESS_CONFIG;
}

// STEP 6: EMAILJS CONFIG
if (typeof EMAILJS_CONFIG === 'undefined') {
  var EMAILJS_CONFIG = {
    PUBLIC_KEY: "", 
    SERVICE_ID: "",
    TEMPLATE_ID: ""
  };
  window.EMAILJS_CONFIG = EMAILJS_CONFIG;
}

// ✅ console.log me se bhi CART_KEY hata de
console.log("✅ secrets.js done");
