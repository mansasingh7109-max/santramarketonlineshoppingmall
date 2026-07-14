// double-code-safeguard.js - FINAL
(function () {
    "use strict";
    if (window.DOUBLE_CODE_SAFEGUARD_LOADED) return;
    window.DOUBLE_CODE_SAFEGUARD_LOADED = true;

    window.CART_KEY = window.CART_KEY || "santraMallCart_v2";
    window.MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";

    if (typeof firebase !== "undefined" && !window.rtdb) {
        try {
            if (
                !firebase.apps.length &&
                typeof firebaseConfig !== "undefined"
            ) {
                firebase.initializeApp(firebaseConfig);
            }
            window.rtdb = firebase.database();
            window.auth = firebase.auth();
        } catch (e) {
            window.rtdb = firebase.database();
        }
    }

    // Ye 3 line error khatam kar dengi
    window.CART_KEY_CONST = window.CART_KEY;
    window.MYCHOICE_KEY_CONST = window.MYCHOICE_KEY;
    window.RTDB_CONST = window.rtdb;

    console.log("🛡️ Safeguard Loaded");
})();
