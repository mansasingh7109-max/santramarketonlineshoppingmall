// constants.js - SIRF EK BAAR DECLARE HOGA - FINAL 25 JUNE 2026

// ✅ PURANA CODE - SAVE HIDE KAR DIYA - KUCH HATAYA NAHI
// const CART_KEY = "santraMallCart_v2";
// const MYCHOICE_KEY = "santraMallMyChoice_v2";
// window.CART_KEY = CART_KEY;
// window.MYCHOICE_KEY = MYCHOICE_KEY;
// console.log("✅ Constants loaded - CART_KEY:", CART_KEY);

// ✅ NAYA UPDATE CODE - NO DOUBLE - 3 FILE FOLLOW
if (typeof CART_KEY === 'undefined') {
  var CART_KEY = "santraMallCart_v2";
  window.CART_KEY = CART_KEY;
}
if (typeof MYCHOICE_KEY === 'undefined') {
  var MYCHOICE_KEY = "santraMallMyChoice_v2";
  window.MYCHOICE_KEY = MYCHOICE_KEY;
}
if (typeof BASE_URL === 'undefined') {
  var BASE_URL = "https://santramarketshoppingmall.web.app";
  var baseURL = BASE_URL;
  window.BASE_URL = BASE_URL;
  window.baseURL = baseURL;
}

console.log("✅ Constants loaded - CART_KEY:", CART_KEY, "BASE_URL:", BASE_URL);