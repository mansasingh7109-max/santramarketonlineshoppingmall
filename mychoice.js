// ✅ MYCHOICE.JS - SANTRA MALL - 30 JUNE 2026 - UNIVERSAL VERSION
// Is file ko index.html, product.html, cart.html, mychoice.html me add kar dena

/*
⚠️ ===== OLD CODE BACKUP - 25 JUNE 2026 SE PEHLE WALA =====
⚠️ Agar kuch toot jaye to ye uncomment kar dena

window.addToMyChoice = function (product, selectedVariant = null, selectedQty = 1) {
  if (!product) {
    showToast("❌ Product load nahi hua");
    return false;
  }
  let myChoiceData = localStorage.getItem(MYCHOICE_KEY);
  let myChoice = [];
  try {
    myChoice = JSON.parse(myChoiceData || "[]");
    if (!Array.isArray(myChoice)) myChoice = [];
  } catch (e) {
    myChoice = [];
  }
  let finalPrice = product.price || product.sellingPrice || 0;
  if (selectedVariant && selectedVariant.price) {
    finalPrice = selectedVariant.price;
  }
  let productImage = "";
  if (product.media && product.media.length > 0) {
    productImage = product.media[0].url || product.media[0];
  } else if (product.images && product.images.length > 0) {
    productImage = product.images[0];
  } else if (product.imageUrl) {
    productImage = product.imageUrl;
  } else if (product.image) {
    productImage = product.image;
  } else if (product.img) {
    productImage = product.img;
  }
  let variantName = "Default";
  if (selectedVariant) {
    variantName = selectedVariant.name || selectedVariant.size || selectedVariant.volume || selectedVariant.weight || "Default";
  }
  let myChoiceItem = {
    id: product.id || product.code,
    name: product.name || product.productName,
    price: finalPrice,
    image: productImage,
    code: product.code || product.productCode || product.id,
    category: product.category || "General",
    variant: variantName,
    productLink: window.location.origin + "/product.html?id=" + encodeURIComponent(product.id || product.code),
    qty: selectedQty || 1,
    addedAt: new Date().toISOString()
  };
  let existingIndex = myChoice.findIndex(item => item.id === myChoiceItem.id && item.variant === myChoiceItem.variant);
  if (existingIndex === -1) {
    myChoice.push(myChoiceItem);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));
    showToast("😍 Added to My Choice!");
    if (typeof auth!== "undefined" && auth.currentUser && typeof db!== "undefined") {
      db.collection("users").doc(auth.currentUser.uid).collection("mychoice").doc(myChoiceItem.id).set(myChoiceItem, { merge: true });
    }
    updateChoiceCount();
    return true;
  } else {
    showToast("Already in My Choice!");
    return false;
  }
};
===== OLD CODE BACKUP END =====
*/

// ✅ STEP 1: KEY UNIFY - sab jagah same
if (typeof MYCHOICE_KEY === "undefined") {
  var MYCHOICE_KEY = "santraMallMyChoice_v2"; // ✅ cart.html se match
  window.MYCHOICE_KEY = MYCHOICE_KEY;
}

// ✅ STEP 2: Add to My Choice - UNIVERSAL
window.addToMyChoice = function (product, selectedVariant = null, selectedQty = 1) {
  if (!product) {
    console.error("❌ addToMyChoice: Product null");
    showToast("❌ Product load nahi hua");
    return false;
  }
  if (!product.id &&!product.code) {
    product.id = product.id || 'temp_' + Date.now();
  }

  let myChoice = [];
  try {
    myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
    if (!Array.isArray(myChoice)) myChoice = [];
  } catch (e) { myChoice = []; }

  let finalPrice = product.price || product.sellingPrice || 0;
  if (selectedVariant?.price) finalPrice = selectedVariant.price;

  let productImage = product.image || product.imageUrl || product.img || "";
  if (product.images?.[0]) productImage = product.images[0];
  if (product.media?.[0]) productImage = product.media[0].url || product.media[0];

  let variantName = selectedVariant?.name || selectedVariant?.size || "Default";

  let myChoiceItem = {
    id: product.id || product.code,
    name: product.name || product.productName || "Product",
    price: finalPrice,
    image: productImage,
    code: product.code || product.id,
    category: product.category || "General",
    variant: variantName,
    productLink: location.origin + "/product.html?id=" + encodeURIComponent(product.id || product.code),
    addedAt: new Date().toISOString()
  };

  let existingIndex = myChoice.findIndex(item => item.id === myChoiceItem.id);
  if (existingIndex === -1) {
    myChoice.push(myChoiceItem);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));

    // ✅ FIX: RTDB path sahi kiya (// nahi, /)
    if (typeof auth!== "undefined" && auth.currentUser && typeof rtdb!== "undefined") {
      rtdb.ref('users/' + auth.currentUser.uid + '/myChoice/' + myChoiceItem.id).set(myChoiceItem);
    }
    if (typeof auth!== "undefined" && auth.currentUser && typeof db!== "undefined") {
      db.collection("users").doc(auth.currentUser.uid).collection("mychoice").doc(myChoiceItem.id).set(myChoiceItem, { merge: true });
    }

    showToast("😍 Added to My Choice!");
    updateChoiceCount();
    return true;
  } else {
    showToast("Already in My Choice!");
    return false;
  }
};

// ✅ STEP 3: Toast
if (typeof showToast === "undefined") {
  window.showToast = function (message) {
    const t = document.createElement("div");
    t.innerText = message;
    t.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#e40046;color:white;padding:14px 24px;border-radius:8px;z-index:9999;font-weight:bold";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };
}

// ✅ STEP 4: Update Count - AUTO
window.updateChoiceCount = function () {
  try {
    let count = 0;
    if (typeof auth!== "undefined" && auth.currentUser && typeof rtdb!== "undefined") {
      rtdb.ref('users/' + auth.currentUser.uid + '/myChoice').once('value').then(s => {
        count = s.exists()? s.numChildren() : 0;
        updateUI(count);
      });
    } else {
      let data = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
      count = Array.isArray(data)? data.length : 0;
      updateUI(count);
    }
    function updateUI(c) {
      document.querySelectorAll(".mychoice-count, #mychoiceCount,.wish-count, #wishCount,.wishlist-count, #choiceCount").forEach(el => {
        el.innerText = c;
        el.style.display = c > 0? 'flex' : 'none';
      });
    }
  } catch(e) {}
};

// ✅ STEP 5: Remove
window.removeFromMyChoice = function(productId) {
  let data = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
  data = data.filter(i => i.id!== productId);
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(data));
  if (auth?.currentUser) {
    rtdb.ref('users/' + auth.currentUser.uid + '/myChoice/' + productId).remove();
  }
  updateChoiceCount();
  showToast("❌ Removed");
};

// ✅ STEP 6: MOVE FUNCTIONS for cart.html
window.moveToCart = function(id) {
  let data = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
  let item = data.find(i => i.id === id);
  if(item && typeof addToCart === 'function') {
    addToCart(item);
    removeFromMyChoice(id);
    showToast("✅ Moved to Cart");
  }
};

window.moveToMyChoice = function(id) {
  // cart se mychoice me - cart.html use karega
  if(typeof cart!== 'undefined' && cart[id]) {
    addToMyChoice(cart[id]);
    if(typeof removeFromCart === 'function') removeFromCart(id);
  }
};

// ✅ STEP 7: AUTO-BIND BUTTONS - index.html aur product.html ke liye
document.addEventListener('DOMContentLoaded', () => {
  updateChoiceCount();

  // Auto-bind heart buttons
  setTimeout(() => {
    document.querySelectorAll('button,.heart,.wishlist-btn, [onclick*="MyChoice"]').forEach(btn => {
      const txt = (btn.innerText + btn.className).toLowerCase();
      if(txt.includes('heart') || txt.includes('wish') || txt.includes('mychoice') || btn.innerHTML.includes('🤍') || btn.innerHTML.includes('😍')) {
        if(!btn.dataset.mychoiceBound) {
          btn.dataset.mychoiceBound = '1';
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if(window.currentProduct) {
              addToMyChoice(window.currentProduct);
            } else {
              // Try to get product from card
              const card = btn.closest('[data-product],.product-card,.product');
              if(card?.dataset?.product) {
                try { addToMyChoice(JSON.parse(card.dataset.product)); } catch {}
              }
            }
          });
        }
      }
    });
  }, 800);
});

console.log("✅ mychoice.js loaded - UNIVERSAL 30 JUNE");
