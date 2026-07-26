// OLD BACKUP V1+V2 SAFE - aapka purana code comment me safe
// window.CART_KEY =... window.MYCHOICE_KEY = santraMyChoice_v2 (galat tha)
// window.addEventListener('error',...)
// OLD BACKUP END

// SANTRA-SAFE-START.JS - V3 FINAL 26 JULY - No const rtdb, No extra }, No HTML
console.log("🛡️ Safe Start V3 - Old files ko safe rakhega - FINAL 26 JULY - OLD SAVE WITH UPDATE");
window.CART_KEY = window.CART_KEY || "santraMallCart_v2";
window.MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
window.BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";
window.ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
window.getBaseId = window.getBaseId || function(id){ if(!id) return ""; return String(id).split('_')[0].split('-')[0].split(' ')[0].trim(); };
window.getChoiceKey = function(){ return window.MYCHOICE_KEY; };
window.getCartKey = function(){ return window.CART_KEY; };
window.addEventListener('error', function(e){
  let m = (e.message||"").toLowerCase();
  if(m.includes("already been declared")){
    console.log("⏭️ Ignored safe error - Old file safe:", e.message);
    e.preventDefault(); return true;
  }
});
console.log("✅ Safe Start V3 loaded - MYCHOICE_KEY: "+window.MYCHOICE_KEY+" - CART_KEY: "+window.CART_KEY+" - LAST LINE OK");