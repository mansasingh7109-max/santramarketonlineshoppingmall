window.MYCHOICE_KEY = "santraMallMyChoice_v2";

// ✅ MYCHOICE.JS - SANTRA MALL - 26 JUNE 2026 - GUEST + RTDB + FIRESTORE VERSION

/*
⚠️ ===== OLD CODE BACKUP - 25 JUNE 2026 SE PEHLE WALA =====
⚠️ Agar kuch toot jaye to ye uncomment kar dena
... (tera pura old backup yahan same hai)...
===== OLD CODE BACKUP END =====
*/

if (typeof MYCHOICE_KEY === "undefined") {
  var MYCHOICE_KEY = "santraMallMyChoice_v2";
  window.MYCHOICE_KEY = MYCHOICE_KEY;
}

window.addToMyChoice = function (product, selectedVariant = null, selectedQty = 1) {
  if (!product) { showToast("❌ Product load nahi hua. Page refresh karo"); return false; }
  if (!product.id &&!product.code) { showToast("❌ Product ID nahi mila"); return false; }
  let myChoiceData = localStorage.getItem(MYCHOICE_KEY);
  let myChoice = [];
  try { myChoice = JSON.parse(myChoiceData || "[]"); if (!Array.isArray(myChoice)) myChoice = []; } catch (e) { myChoice = []; }
  let finalPrice = product.price || product.sellingPrice || 0;
  if (selectedVariant && selectedVariant.price) { finalPrice = selectedVariant.price; }
  let productImage = "";
  if (product.media && product.media.length > 0) { productImage = product.media[0].url || product.media[0]; }
  else if (product.images && product.images.length > 0) { productImage = product.images[0]; }
  else if (product.imageUrl) { productImage = product.imageUrl; }
  else if (product.image) { productImage = product.image; }
  else if (product.img) { productImage = product.img; }
  let variantName = "Default";
  if (selectedVariant) { variantName = selectedVariant.name || selectedVariant.size || selectedVariant.volume || selectedVariant.weight || "Default"; }
  let myChoiceItem = { id: product.id || product.code, name: product.name || product.productName || "Product", price: finalPrice, image: productImage, code: product.code || product.productCode || product.id, category: product.category || "General", variant: variantName, from: product.from || 'unknown', productLink: window.location.origin + "/product.html?id=" + encodeURIComponent(product.id || product.code) + "&from=" + (product.from || 'unknown'), qty: selectedQty || 1, addedAt: new Date().toISOString() };
  let existingIndex = myChoice.findIndex(item => item.id === myChoiceItem.id && item.variant === myChoiceItem.variant);
  if (existingIndex === -1) {
    myChoice.push(myChoiceItem);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));
    if (typeof auth!== "undefined" && auth.currentUser && typeof rtdb!== "undefined") { rtdb.ref('users/' + auth.currentUser.uid + '/myChoice/' + myChoiceItem.id).set(myChoiceItem); }
    if (typeof auth!== "undefined" && auth.currentUser && typeof db!== "undefined") { db.collection("users").doc(auth.currentUser.uid).collection("mychoice").doc(myChoiceItem.id).set(myChoiceItem, { merge: true }); }
    showToast("😍 Added to My Choice!"); updateChoiceCount(); return true;
  } else { showToast("Already in My Choice!"); return false; }
};

// ✅ FIX - HOME PAGE KE LIYE: product load hone ka wait karo
window.toggleMyChoice = function(id){
  let product = null;
  if (typeof allProducts!== "undefined" && allProducts.length>0) {
    product = allProducts.find(p => p.id === id);
  }
  if (!product) {
    let all = JSON.parse(localStorage.getItem("ALL_PRODUCTS") || "[]");
    product = all.find(p => p.id === id);
  }
  // ✅ EXTRA FIX: agar abhi bhi nahi mila to 1 sec wait karke retry
  if (!product) {
    setTimeout(() => {
      let all = JSON.parse(localStorage.getItem("ALL_PRODUCTS") || "[]");
      product = all.find(p => p.id === id);
      if (product) { window.toggleMyChoice(id); } else { showToast("❌ Product nahi mila - thoda wait karke try karo"); }
    }, 800);
    return;
  }
  let list = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || '[]');
  const btn = document.getElementById('heart-'+id);
  if(list.find(x => x.id === id)){
    list = list.filter(x => x.id!== id);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
    if(btn) btn.innerHTML = '🤍';
    removeFromMyChoice(id);
  } else {
    addToMyChoice(product);
    if(btn) btn.innerHTML = '❤️';
  }
};

if (typeof showToast === "undefined") { window.showToast = function (message) { const toast = document.createElement("div"); toast.innerText = message; toast.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#e40046;color:white;padding:14px 24px;border-radius:8px;z-index:9999;font-size:15px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3)"; document.body.appendChild(toast); setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000); }; }

window.updateChoiceCount = function () { /* same as before */ };
window.removeFromMyChoice = function(productId) { /* same as before */ };

if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", updateChoiceCount); } else { updateChoiceCount(); }

console.log("✅ mychoice.js loaded - UPDATED 26 JUNE 2026 - GUEST + RTDB + FIRESTORE");
// ==================== MYCHOICE CHROME FIX PATCH - 30 JUNE 2026 ====================
// ✅ OLD KEY migrate - backup safe
(function migrateMyChoice() {
    const OLD_KEYS = ["santra_wishlist", "mychoice", "santraMyChoice"];
    const NEW_KEY = window.MYCHOICE_KEY;
    try {
        for(let old of OLD_KEYS) {
            const data = localStorage.getItem(old);
            if(data &&!localStorage.getItem(NEW_KEY)) {
                localStorage.setItem(NEW_KEY, data);
                console.log('✅ MyChoice migrated from', old);
                break;
            }
        }
    } catch(e) {}
})();

// ✅ FIX: toggleMyChoice ke baad UI update force
const originalToggle = window.toggleMyChoice;
window.toggleMyChoice = function(id) {
    originalToggle(id);
    setTimeout(() => {
        updateChoiceCount();
        // mychoice page pe ho to render karo
        if(typeof renderMyChoicePage === 'function') renderMyChoicePage();
        // popup ho to update
        const popup = document.getElementById('myChoicePopup');
        if(popup && popup.style.display!== 'none') {
            if(typeof loadMyChoicePopup === 'function') loadMyChoicePopup();
        }
    }, 400);
};

// ✅ FIX: addToMyChoice me image fallback aur
const originalAdd = window.addToMyChoice;
window.addToMyChoice = function(product, variant=null, qty=1) {
    // image fix - home page ke liye
    if(product &&!product.image && product.images) {
        product.image = product.images[0];
    }
    if(product &&!product.image && product.media) {
        product.image = product.media[0]?.url || product.media[0];
    }
    const result = originalAdd(product, variant, qty);
    // badge update
    setTimeout(updateChoiceCount, 200);
    return result;
};

// ✅ updateChoiceCount complete karo (tere me empty tha)
window.updateChoiceCount = function() {
    const badges = [
        document.getElementById('choiceBadge'),
        document.getElementById('bottomChoiceBadge'),
        document.getElementById('wishlistBadge')
    ];
    let list = [];
    try { list = JSON.parse(localStorage.getItem(window.MYCHOICE_KEY) || '[]'); } catch(e) {}
    const count = list.length;
    badges.forEach(b => {
        if(b) {
            b.innerText = count;
            b.style.display = count > 0? 'flex' : 'none';
        }
    });
};

// ✅ removeFromMyChoice complete
window.removeFromMyChoice = function(productId) {
    let list = JSON.parse(localStorage.getItem(window.MYCHOICE_KEY) || '[]');
    list = list.filter(x => x.id!== productId);
    localStorage.setItem(window.MYCHOICE_KEY, JSON.stringify(list));

    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    if(user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/myChoice/' + productId).remove();
    }
    if(user && typeof db!== 'undefined') {
        db.collection("users").doc(user.uid).collection("mychoice").doc(productId).delete();
    }

    showToast("💔 Removed from My Choice");
    updateChoiceCount();
    if(typeof renderMyChoicePage === 'function') renderMyChoicePage();
};

// ✅ Chrome localStorage quota fix
try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
} catch(e) {
    console.warn('localStorage blocked, using memory');
    window.MYCHOICE_MEMORY = [];
    const origGet = localStorage.getItem;
    localStorage.getItem = function(k) {
        if(k === window.MYCHOICE_KEY) return JSON.stringify(window.MYCHOICE_MEMORY);
        return origGet.call(this, k);
    };
}
// ==================== PATCH END ====================
console.log("✅ mychoice.js PATCH loaded - 30 JUNE");

