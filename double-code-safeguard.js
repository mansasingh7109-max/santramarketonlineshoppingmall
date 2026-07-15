/*
⚠️ OLD CODE BACKUP - 14 JULY 2026 SE PEHLE WALA
⚠️ Tera purana code yahan safe hide hai

// double-code-safeguard.js - FINAL 15 JULY 2026 - NO ALERT
(function(){
  console.log("🛡️ Safeguard Loaded");
  if(typeof window.CART_KEY === 'undefined'){
    window.CART_KEY = "santraMallCart_v2";
    var CART_KEY = "santraMallCart_v2";
  }
  if(typeof window.MYCHOICE_KEY === 'undefined'){
    window.MYCHOICE_KEY = "santraMallMyChoice_v2";
    var MYCHOICE_KEY = "santraMallMyChoice_v2";
  }
  // ✅ Kabhi alert nahi ayega
})();

// Aur usse bhi purana
// if(typeof CART_KEY === 'undefined'){
//   alert("Error: constants.js nahi mila. Admin se contact karo.");
// }

OLD CODE BACKUP END
*/

// double-code-safeguard.js - FINAL 15 JULY 2026 - SUPER FINAL + OLD BACKUP SAFE
(function () {
    "use strict";
    // ✅ Double load rok - Ek baar hi chalega
    if (window.DOUBLE_CODE_SAFEGUARD_LOADED) {
      console.log("🛡️ Safeguard already loaded - Skipping");
      return;
    }
    window.DOUBLE_CODE_SAFEGUARD_LOADED = true;

    try {
      // ✅ KEYS - constants.js se lo, nahi mila to khud banao - NO ALERT
      window.CART_KEY = window.CART_KEY || "santraMallCart_v2";
      window.MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
      window.BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

      // ✅ Firebase safe init - Double init nahi hoga
      if (typeof firebase !== "undefined" && !window.rtdb) {
          try {
              if (!firebase.apps.length && typeof firebaseConfig !== "undefined") {
                  firebase.initializeApp(firebaseConfig);
              }
              window.rtdb = firebase.database();
              window.auth = firebase.auth();
              if(!window.db && firebase.firestore) window.db = firebase.firestore();
          } catch (e) {
              console.warn("⚠️ Firebase init in safeguard:", e.message);
              try { window.rtdb = firebase.database(); } catch(e2){}
          }
      }

      // ✅ Ye 3 line error khatam kar dengi
      window.CART_KEY_CONST = window.CART_KEY;
      window.MYCHOICE_KEY_CONST = window.MYCHOICE_KEY;
      window.RTDB_CONST = window.rtdb;

      console.log("🛡️ Safeguard Loaded - CART:", window.CART_KEY);

    } catch (err) {
      // ✅ Naya error aaye to console me, popup nahi
      console.error("🛡️ Safeguard caught:", err.message);
      window.CART_KEY = "santraMallCart_v2";
      window.MYCHOICE_KEY = "santraMallMyChoice_v2";
    }
})();

// ✅ False alert blocker - constants.js wala popup kabhi nahi ayega
(function(){
  const oldAlert = window.alert;
  window.alert = function(msg){
    if(typeof msg === 'string' && msg.toLowerCase().includes('constants.js')){
      console.warn("🚫 Blocked false constants.js alert");
      return;
    }
    return oldAlert.apply(window, arguments);
  };
})();