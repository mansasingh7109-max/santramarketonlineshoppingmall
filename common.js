/*
⚠️ OLD CODE BACKUP - 26 JUNE 2026 SE PEHLE WALA
⚠️ secrets.js load karta tha, ab constants.js use karenge

(function() {
  const s1 = document.createElement('script');
  s1.src = '/secrets.js';
  document.head.appendChild(s1);

  s1.onload = function() {
    const fb1 = document.createElement('script');
    fb1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
    document.head.appendChild(fb1);

    fb1.onload = function() {
      const fb2 = document.createElement('script');
      fb2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
      document.head.appendChild(fb2);

      const fb3 = document.createElement('script');
      fb3.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
      document.head.appendChild(fb3);
    }
  }
})();

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - COMMON.JS - UPDATED 15 JULY 2026 =====
// ✅ CONSTANTS.JS SUPPORT + FIREBASE LOADER
// Kaam: Sab pages me Firebase + Constants load karna

(function() {
  console.log('🚀 common.js loading - CONSTANTS.JS VERSION');

  // ✅ STEP 1: constants.js load karo - secrets.js ki jagah
  const constantsScript = document.createElement('script');
  constantsScript.src = '/constants.js?v=1';
  document.head.appendChild(constantsScript);

  constantsScript.onload = function() {
    console.log('✅ constants.js loaded - CART_KEY:', window.CART_KEY);

    // ✅ STEP 2: Firebase App load karo
    const fbApp = document.createElement('script');
    fbApp.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
    document.head.appendChild(fbApp);

    fbApp.onload = function() {
      console.log('✅ Firebase App loaded');

      // ✅ STEP 3: Firebase Auth load karo
      const fbAuth = document.createElement('script');
      fbAuth.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
      document.head.appendChild(fbAuth);

      // ✅ STEP 4: Firebase Firestore load karo
      const fbFirestore = document.createElement('script');
      fbFirestore.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
      document.head.appendChild(fbFirestore);

      // ✅ STEP 5: Firebase Storage load karo - photo upload ke liye
      const fbStorage = document.createElement('script');
      fbStorage.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js';
      document.head.appendChild(fbStorage);

      fbFirestore.onload = function() {
        console.log('✅ Firebase Firestore loaded');

        // ✅ STEP 6: Firebase Initialize karo - constants.js se config lo
        setTimeout(() => {
          if (window.firebaseConfig &&!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
            window.db = firebase.firestore();
            window.storage = firebase.storage();
            window.auth = firebase.auth();
            console.log('✅ Firebase initialized from constants.js');

            // Custom event fire karo - baaki scripts ko batao ready hai
            window.dispatchEvent(new Event('firebaseReady'));
          } else if (firebase.apps.length) {
            window.db = firebase.firestore();
            window.storage = firebase.storage();
            window.auth = firebase.auth();
            console.log('✅ Firebase already initialized');
            window.dispatchEvent(new Event('firebaseReady'));
          }
        }, 100);
      };
    };
  };

  constantsScript.onerror = function() {
    console.error('❌ constants.js load failed! Check file path');
    alert('Error: constants.js nahi mila. Admin se contact karo.');
  };
})();

// ✅ GLOBAL HELPER FUNCTIONS - CONSTANTS.JS USE KARTE HAIN

// Cart me add karne ka function
window.santraAddToCart = function(product) {
  if (!product ||!product.id) {
    console.error('Product invalid');
    return false;
  }

  let cart = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
  cart = cart.filter(item => item!== null && item!== undefined);

  const existingIndex = cart.findIndex(item => item && item.id === product.id && item.size === (product.size || 'M'));

  if (existingIndex === -1) {
    cart.push({
      id: product.id,
      name: product.name || "Product",
      price: parseFloat(product.price) || 0,
      image: product.image || '',
      size: product.size || 'M',
      qty: 1,
      addedAt: Date.now()
    });
  } else {
    cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
  }

  localStorage.setItem(window.CART_KEY, JSON.stringify(cart));
  console.log('✅ Added to cart - Key:', window.CART_KEY);
  return true;
};

// My Choice me add karne ka function
window.santraAddToMyChoice = function(product) {
  if (!product ||!product.id) {
    console.error('Product invalid');
    return false;
  }

  let myChoice = JSON.parse(localStorage.getItem(window.MYCHOICE_KEY) || "[]");
  myChoice = myChoice.filter(item => item!== null && item!== undefined);

  const exists = myChoice.some(item => item && item.id === product.id);

  if (!exists) {
    myChoice.push({
      id: product.id,
      name: product.name || "Product",
      price: parseFloat(product.price) || 0,
      image: product.image || '',
      code: product.code || product.id,
      addedAt: Date.now()
    });
    localStorage.setItem(window.MYCHOICE_KEY, JSON.stringify(myChoice));
    console.log('✅ Added to My Choice - Key:', window.MYCHOICE_KEY);
    return true;
  }
  return false;
};

// Customer login check
window.santraGetCustomer = function() {
  return localStorage.getItem(window.CUSTOMER_KEY + '_whatsapp_mobile');
};

// Toast message
window.santraToast = function(message, isError = false) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${isError? '#ef4444' : '#10b981'};color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-size:14px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3)`;
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 2000);
};

console.log("✅ common.js loaded - 15 JULY 2026 - CONSTANTS.JS SUPPORT");