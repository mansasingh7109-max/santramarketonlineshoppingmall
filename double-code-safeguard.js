// double-code-safeguard.js
// Is file ko sabse pehle load karo HTML me
// Ye 100 baar bhi load ho jaye, error nahi degi

(function () {
    "use strict";

    // Check pehle se load to nahi hai
    if (window.DOUBLE_CODE_SAFEGUARD_LOADED) {
        console.log("⚠️ Double Code Safeguard already loaded, skipping");
        return;
    }
    window.DOUBLE_CODE_SAFEGUARD_LOADED = true;

    // 1. CART_KEY Safe Banao
    if (typeof window.CART_KEY === "undefined") {
        window.CART_KEY = "santraMallCart_v2";
        console.log("✅ CART_KEY created");
    } else {
        console.log("⚠️ CART_KEY already exists, skipping:", window.CART_KEY);
    }

    // 2. MYCHOICE_KEY Safe Banao
    if (typeof window.MYCHOICE_KEY === "undefined") {
        window.MYCHOICE_KEY = "santraMallMyChoice_v2";
        console.log("✅ MYCHOICE_KEY created");
    }

    // 3. Firebase rtdb Safe Banao
    if (typeof window.rtdb === "undefined" && typeof firebase !== "undefined") {
        try {
            // firebaseConfig secrets.js se aayega
            if (
                !firebase.apps.length &&
                typeof firebaseConfig !== "undefined"
            ) {
                firebase.initializeApp(firebaseConfig);
            }
            window.rtdb = firebase.database();
            window.auth = firebase.auth();
            console.log("✅ Firebase rtdb created");
        } catch (e) {
            console.log("⚠️ Firebase already initialized, using existing rtdb");
            window.rtdb = firebase.database();
        }
    }

    console.log("🛡️ Double Code Safeguard Loaded");
})();
