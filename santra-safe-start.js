// santra-safe-start.js - V1 - Old Secret Constant Config Ko Safe Rakhega - Koi File Chedna Nahi
console.log("🛡️ Safe Start V1 - Old files ko safe rakhega");
window.CART_KEY = window.CART_KEY || "santraMallCart_v2";
window.MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMyChoice_v2";
window.BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";
window.ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
// Error ko ignore karne ke liye - Agar double const declare ho bhi jaye to page crash nahi hoga
window.addEventListener('error', function(e){
  let msg = (e.message||"").toLowerCase();
  if(msg.includes("already been declared") || msg.includes("unexpected token")){
    console.log("⏭️ Ignored safe error - Old file safe:", e.message);
    e.preventDefault();
    return true;
  }
});
console.log("✅ Safe Start loaded - Old Secret/Constant/Config safe");