/*

⚠️ OLD CODE BACKUP - 30 JUNE 2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

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

OLD CODE BACKUP END

*/

// ✅ MYCHOICE.JS - SANTRA MALL - UPDATED 14 JULY 2026
// ✅ Home page + Product page dono ke liye fix + SyntaxError fix

// ✅ PURANA CODE COMMENT OUT - constants.js se aa raha hai
// if (typeof MYCHOICE_KEY === 'undefined') {
// var MYCHOICE_KEY = 'santraMallMyChoice_v2';
// window.MYCHOICE_KEY = MYCHOICE_KEY;
// }
// if (typeof CART_KEY === 'undefined') {
// var CART_KEY = 'santraMallCart_v2';
// window.CART_KEY = CART_KEY;
// }

// ✅ NAYA CODE: window se direct use karo - SAFE HAI
const MYCHOICE_KEY = window.MYCHOICE_KEY;
const CART_KEY = window.CART_KEY;
const rtdb = window.rtdb;
const db = window.db;
const auth = window.auth;

// ✅ FIXED - product page ke liye currentProduct support
if (typeof window.addToMyChoice === 'undefined' || true) { // force override
  window.addToMyChoice = function(product, selectedVariant = null, selectedQty = 1) {

    // 🔥 PRODUCT PAGE FIX: agar product nahi mila to currentProduct use karo
    if(!product ||!product.id) {
      if(typeof currentProduct!== 'undefined' && currentProduct && currentProduct.id) {
        product = {
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          image: (typeof getProductThumbnail === 'function')? getProductThumbnail(currentProduct) : (currentProduct.image || ''),
          code: currentProduct.code || currentProduct.id,
          category: currentProduct.category || 'General',
          variant: 'Default'
        };
      } else {
        showToast("❌ Product load nahi hua");
        return false;
      }
    }

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || '[]');
    } catch(e) { list = []; }

    // purana kachra saaf
    list = list.filter(i => typeof i === 'object' && i!== null && i.id);

    // sirf id check (home page jaisa)
    let existing = list.find(i => i.id === product.id);

    if(!existing) {
      let newItem = {
        id: product.id,
        name: product.name || 'Product',
        price: product.price || 0,
        image: product.image || '',
        code: product.code || product.id,
        category: product.category || 'General',
        variant: product.variant || 'Default',
        addedAt: new Date().toISOString()
      };
      list.push(newItem);

      // ✅ 3 JAGAH SAVE - taaki sab pages padh sake
      localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
      localStorage.setItem('sm_wishlist_v1', JSON.stringify(list));
      localStorage.setItem('santraMallWishlist', JSON.stringify(list));

      showToast('😍 Added to My Choice!');

      // heart update (product page)
      const wishBtn = document.getElementById('wishBtn');
      if(wishBtn) wishBtn.innerText = '❤️';

      updateChoiceCount();

      // Firebase sync
      if(typeof auth!== 'undefined' && auth.currentUser && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + auth.currentUser.uid + '/myChoice/' + product.id).set(newItem);
      }
      return true;
    } else {
      // remove karo (toggle)
      list = list.filter(i => i.id!== product.id);
      localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
      localStorage.setItem('sm_wishlist_v1', JSON.stringify(list));
      localStorage.setItem('santraMallWishlist', JSON.stringify(list));

      const wishBtn = document.getElementById('wishBtn');
      if(wishBtn) wishBtn.innerText = '🤍';

      showToast('❌ Removed');
      updateChoiceCount();
      return false;
    }
  };
}

// ✅ Toast
if (typeof window.showToast === 'undefined') {
  window.showToast = function(msg) {
    const t = document.createElement('div');
    t.innerText = msg;
    t.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#e40046;color:white;padding:14px 24px;border-radius:8px;z-index:9999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3)';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  };
}

// ✅ Badge
window.updateChoiceCount = function() {
  try {
    let data = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || '[]');
    let count = Array.isArray(data)? data.length : 0;
    document.querySelectorAll('.mychoice-count, #mychoiceCount,.wish-count, #wishCount,.nav-badge').forEach(el => {
      if(el) {
        el.innerText = count;
        el.style.display = count > 0? 'flex' : 'none';
      }
    });
  } catch(e) {}
};

// ✅ Home hearts
function bindHomePageHearts() {
  document.querySelectorAll('[class*="product"],.product-card,.card').forEach(card => {
    const heart = card.querySelector('.fa-heart, button, [class*="heart"], [class*="wish"]');
    if(heart &&!heart.dataset.mychoiceBound) {
      heart.dataset.mychoiceBound = '1';
      heart.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const img = card.querySelector('img')?.src || '';
        const name = card.querySelector('h3, h4,.title')?.innerText?.trim() || 'Product';
        const price = parseInt((card.querySelector('.price')?.innerText || '0').replace(/\D/g, '')) || 0;
        const link = card.querySelector('a[href*="id="]')?.href || '';
        const id = link? link.split('id=')[1].split('&')[0] : 'home_' + Date.now();
        addToMyChoice({id, name, image: img, price});
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateChoiceCount();
  setTimeout(bindHomePageHearts, 2000);
  setInterval(bindHomePageHearts, 3000);
});

window.removeFromMyChoice = function(id) {
  let list = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || '[]');
  list = list.filter(i => i.id!== id);
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(list));
  localStorage.setItem('sm_wishlist_v1', JSON.stringify(list));
  localStorage.setItem('santraMallWishlist', JSON.stringify(list));
  updateChoiceCount();
  showToast('❌ Removed');
  if(typeof loadMyChoice === 'function') loadMyChoice();
};