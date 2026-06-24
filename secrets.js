// ✅ SANTRA MALL - MASTER CONFIG - 24 JUNE 2026
// 100 files me same code rakho, error nahi aayega

// STEP 1: Firebase Config - Agar nahi hai to banao
if (typeof masterConfig === 'undefined') {
  var masterConfig = {
    apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
    authDomain: "santramarketshoppingmall.firebaseapp.com",
    projectId: "santramarketshoppingmall",
    storageBucket: "santramarketshoppingmall.firebasestorage.app",
    messagingSenderId: "398490252924",
    appId: "1:398490252924:web:d1b6348b549183b93b7bf9",
    measurementId: "G-ZW1ZR8HETY", // ← Comma zaroori hai
    databaseURL: "https://santramarketshoppingmall-default-rtdb.firebaseio.com/" // ← Last me / nahi lagana
}

// STEP 2: Global Keys - Sabse important
// ✅ Agar kisi aur file me pehle se hai to skip kar dega
if (typeof CART_KEY === 'undefined') {
  var CART_KEY = "santra_mall_cart"; // ✅ Yahi final key hai
  window.CART_KEY = CART_KEY;
}

if (typeof MYCHOICE_KEY === 'undefined') {
  var MYCHOICE_KEY = "santra_mall_mychoice";
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

// STEP 3: Firebase Init - Ek hi baar hoga
if (typeof firebase !== 'undefined' && !firebase.apps.length && typeof masterConfig !== 'undefined') {
  firebase.initializeApp(masterConfig);
  console.log("✅ Firebase Connected:", masterConfig.projectId);
}

// STEP 4: db, auth Global - Agar nahi hai to banao
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

console.log("✅ secrets.js done. CART_KEY:", CART_KEY);

// STEP 5: BUSINESS_CONFIG
if (typeof BUSINESS_CONFIG === 'undefined') {
  var BUSINESS_CONFIG = {
    WHATSAPP_NUMBER: "918769171078",
    EMAIL: "mansasingh7109@gmail.com",
    EMAIL_2: "santramarketshoppingmall@gmail.com"
  };
  window.BUSINESS_CONFIG = BUSINESS_CONFIG;
}

