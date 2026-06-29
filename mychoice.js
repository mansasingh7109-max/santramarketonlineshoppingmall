// ✅ MYCHOICE.JS - SANTRA MALL - 26 JUNE 2026 - GUEST + RTDB + FIRESTORE VERSION
// Is file ko index.html aur product.html me add kar dena

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

// ✅ STEP 1: MYCHOICE_KEY check - Agar secrets.js me nahi hai to banao
if (typeof MYCHOICE_KEY === "undefined") {
  var MYCHOICE_KEY = "santra_mall_mychoice";
  window.MYCHOICE_KEY = MYCHOICE_KEY;
}

// ✅ STEP 2: Add to My Choice Function - GUEST + RTDB + FIRESTORE + LOCALSTORAGE
window.addToMyChoice = function (product, selectedVariant = null, selectedQty = 1) {
  // ✅ FIX 1: Null/ID check
  if (!product) {
    console.error("❌ addToMyChoice: Product is null", product);
    showToast("❌ Product load nahi hua. Page refresh karo");
    return false;
  }
  if (!product.id &&!product.code) {
    console.error("❌ addToMyChoice: Product ID missing", product);
    showToast("❌ Product ID nahi mila");
    return false;
  }

  // My Choice data nikalo localStorage se backup ke liye
  let myChoiceData = localStorage.getItem(MYCHOICE_KEY);
  let myChoice = [];
  try {
    myChoice = JSON.parse(myChoiceData || "[]");
    if (!Array.isArray(myChoice)) myChoice = [];
  } catch (e) {
    console.log("MyChoice parse error, resetting:", e);
    myChoice = [];
  }

  // Price nikalo
  let finalPrice = product.price || product.sellingPrice || 0;
  if (selectedVariant && selectedVariant.price) {
    finalPrice = selectedVariant.price;
  }

  // ✅ FIX 2: Image 5 jagah se check karo
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

  // Variant name nikalo
  let variantName = "Default";
  if (selectedVariant) {
    variantName = selectedVariant.name || selectedVariant.size || selectedVariant.volume || selectedVariant.weight || "Default";
  }

  // My Choice Item banao
  let myChoiceItem = {
    id: product.id || product.code,
    name: product.name || product.productName || "Product",
    price: finalPrice,
    image: productImage,
    code: product.code || product.productCode || product.id,
    category: product.category || "General",
    variant: variantName,
    from: product.from || 'unknown',
    productLink: window.location.origin + "/product.html?id=" + encodeURIComponent(product.id || product.code) + "&from=" + (product.from || 'unknown'),
    qty: selectedQty || 1,
    addedAt: new Date().toISOString()
  };

  // Check karo already hai ya nahi
  let existingIndex = myChoice.findIndex(
    item => item.id === myChoiceItem.id && item.variant === myChoiceItem.variant
  );

  if (existingIndex === -1) {
    // 1. localStorage me save - offline backup + Guest ke liye
    myChoice.push(myChoiceItem);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));

    // 2. RTDB me save karo - Primary - SIRF LOGIN HONE PE
    if (typeof auth!== "undefined" && auth.currentUser && typeof rtdb!== "undefined") {
      rtdb.ref('users/' + auth.currentUser.uid + '//' + myItem.id)
      .set(myChoiceItem)
      .then(() => console.log("✅ Saved to RTDB"))
      .catch(err => console.log("RTDB save failed:", err));
    }

    // 3. Firestore me bhi save karo - Backup - SIRF LOGIN HONE PE
    if (typeof auth!== "undefined" && auth.currentUser && typeof db!== "undefined") {
      db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("mychoice")
      .doc(myChoiceItem.id)
      .set(myChoiceItem, { merge: true })
      .then(() => console.log("✅ Saved to Firestore"))
      .catch(err => console.log("Firestore save failed:", err));
    }

    showToast("😍 Added to My Choice!");
    console.log("✅ Saved to My Choice:", myChoiceItem);
    updateChoiceCount();
    return true;
  } else {
    showToast("Already in My Choice!");
    return false;
  }
};

// ✅ STEP 3: Toast Function - Agar nahi hai to banao
if (typeof showToast === "undefined") {
  window.showToast = function (message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#e40046;color:white;padding:14px 24px;border-radius:8px;z-index:9999;font-size:15px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3)";
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 3000);
  };
}

// ✅ STEP 4: Update Choice Count - GUEST + LOGIN DONO KE LIYE
window.updateChoiceCount = function () {
  try {
    // ✅ CORRECTION 1: Pehle check karo login hai ya nahi
    if (typeof auth!== "undefined" && auth.currentUser && typeof rtdb!== "undefined") {
      // Logged in - RTDB se real count lao
      rtdb.ref('users/' + auth.currentUser.uid + '/myChoice').once('value').then((snapshot) => {
        let count = snapshot.exists()? snapshot.numChildren() : 0;
        updateCountUI(count);
      }).catch(() => {
        // RTDB fail ho to localStorage se
        let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
        updateCountUI(Array.isArray(myChoice)? myChoice.length : 0);
      });
    } else {
      // Guest - localStorage se count
      let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
      let count = Array.isArray(myChoice)? myChoice.length : 0;
      updateCountUI(count);
    }

    function updateCountUI(count) {
      // ✅ CORRECTION 2: Saare possible selectors add kiye
      let countElements = document.querySelectorAll(".mychoice-count, #mychoiceCount,.wish-count, #wishCount,.wishlist-count");
      countElements.forEach(el => {
        if (el) {
          el.innerText = count;
          el.style.display = count > 0? 'flex' : 'none'; // ✅ CORRECTION 3: 0 pe hide
        }
      });
      console.log("✅ My Choice count updated:", count);
    }
  } catch (e) {
    console.log("Choice count update failed:", e);
  }
};

// ✅ STEP 5: Remove from My Choice - GUEST + LOGIN
window.removeFromMyChoice = function(productId) {
  // LocalStorage se hatao
  let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
  myChoice = myChoice.filter(item => item.id!== productId);
  localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));

  // Login hai to Firebase se bhi hatao
  if (typeof auth!== "undefined" && auth.currentUser && typeof rtdb!== "undefined") {
    rtdb.ref('users/' + auth.currentUser.uid + '/myChoice/' + productId).remove();
  }
  if (typeof auth!== "undefined" && auth.currentUser && typeof db!== "undefined") {
    db.collection("users").doc(auth.currentUser.uid).collection("mychoice").doc(productId).delete();
  }

  updateChoiceCount();
  showToast("❌ Removed from My Choice");
};

// Page load pe count update karo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateChoiceCount);
} else {
  updateChoiceCount();
}

console.log("✅ mychoice.js loaded - UPDATED 26 JUNE 2026 - GUEST + RTDB + FIRESTORE");