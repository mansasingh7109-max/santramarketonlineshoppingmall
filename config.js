// SANTRA MALL - Crash-Proof Config v2.0
(function() {
  
  // ✅ PURANA CODE - COMMENT OUT KAR DIYA - SAVE HAI
  // const CART_KEY = "santraMallCart_v2"; // constants.js me chala gaya
  // const MYCHOICE_KEY = "santraMallMyChoice_v2"; // constants.js me chala gaya
  // window.CART_KEY = CART_KEY; // constants.js kar dega
  // window.MYCHOICE_KEY = MYCHOICE_KEY; // constants.js kar dega
  // var rtdb = firebase.database(); // ← OLD CODE - config.js khud banayega initFirebaseOnce me
  // var db = firebase.firestore(); // ← OLD CODE - config.js khud banayega
  // var auth = firebase.auth(); // ← OLD CODE - config.js khud banayega

  // 1. Config ek baar hi bane
  if (!window.SANTRA) {
    window.SANTRA = {
      KEYS: {
        CART: "santraMallCart_v2",
        CHOICE: "santraMallMyChoice_v2",
        USER: "santraMallUser_v2"
      },
      ADMIN: {
        WHATSAPP: "918769171078",
        EMAIL: "santramarketshoppingmall@gmail.com"
      },
      SETTINGS: {
        FREE_DELIVERY_LIMIT: 500,
        MAX_QTY: 10,
        CURRENCY: "₹"
      }
    };
    console.log("✅ SANTRA Config loaded");
  }

  // 2. DUPLICATE PROTECTION - agar koi file dobara declare kare to rok do
  // CART_KEY protection
  if (typeof window.CART_KEY === 'undefined') {
    Object.defineProperty(window, 'CART_KEY', {
      get: function() { return window.SANTRA.KEYS.CART; },
      set: function() { console.warn("⚠️ CART_KEY duplicate ignored"); },
      configurable: false
    });
  }

  // MYCHOICE_KEY protection
  if (typeof window.MYCHOICE_KEY === 'undefined') {
    Object.defineProperty(window, 'MYCHOICE_KEY', {
      get: function() { return window.SANTRA.KEYS.CHOICE; },
      set: function() { console.warn("⚠️ MYCHOICE_KEY duplicate ignored"); },
      configurable: false
    });
  }

  // 3. Firebase duplicate protection - SAFER VERSION
  if (typeof window.initFirebaseOnce === 'undefined') {
    window.initFirebaseOnce = function(config) {
      if (!window.firebaseApp) {
        // ✅ Check karo firebase load hua ya nahi
        if (typeof firebase === 'undefined') {
          console.error("❌ Firebase not loaded yet");
          return null;
        }
        window.firebaseApp = firebase.initializeApp(config);
        window.rtdb = firebase.database();
        window.db = firebase.firestore();
        window.auth = firebase.auth();
        console.log("✅ Firebase init once");
      }
      return window.firebaseApp;
    };
  }

  // 4. toggleMyChoice missing protection
  if (typeof window.toggleMyChoice === 'undefined') {
    window.toggleMyChoice = function() {
      console.log("ℹ️ toggleMyChoice called from index - redirecting to mychoice");
      window.location.href = 'mychoice.html';
    };
  }

})();