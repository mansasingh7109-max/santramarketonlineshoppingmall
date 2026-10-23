/*
⚠️ OLD CODE BACKUP - 26 JUNE 2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

let myChoiceArray = JSON.parse(localStorage.getItem("santrajet_mychoice") || "[]");
let cart = JSON.parse(localStorage.getItem("santrajet_cart") || "[]");
localStorage.setItem("santrajet_mychoice", JSON.stringify(myChoiceArray));
localStorage.setItem("santrajet_cart", JSON.stringify(cart));

OLD CODE BACKUP END
*/

// ==================== SANTRA MALL - PRODUCTS.JS - UPDATED 15 JULY 2026 ====================
// ✅ CONSTANTS.JS SUPPORT + NULL FIX + GUEST SUPPORT

// ✅ NAYA: Keys constants.js se lo
const CART_KEY = window.CART_KEY || "santraMallCart_v2";
const MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";

console.log('✅ products.js loaded - CART_KEY:', CART_KEY);

// ✅ NEW UPDATED CODE - RTDB + Firestore + GUEST SUPPORT + NULL CHECK
function getProductThumbnail(product) {
    if (!product) return "https://via.placeholder.com/300?text=No+Image";
    if (product.media && Array.isArray(product.media) && product.media.length > 0 && product.media[0].url) {
        return product.media[0].url;
    }
    else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
    }
    else if (product.imageUrl) {
        return product.imageUrl;
    }
    else if (product.image) {
        return product.image;
    }
    else {
        return "https://via.placeholder.com/300?text=No+Image";
    }
}

function getProductImages(product) {
    if (!product) return ["https://via.placeholder.com/300?text=No+Image"];
    if (product.media && Array.isArray(product.media) && product.media.length > 0) {
        return product.media.map(m => m.url).filter(url => url);
    }
    else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        return product.images;
    }
    else if (product.imageUrl) {
        return [product.imageUrl];
    } else if (product.image) {
        return [product.image];
    } else {
        return ["https://via.placeholder.com/300?text=No+Image"];
    }
}

// ✅ MAIN FIX: My Choice me Add karne ke liye - LOGIN OPTIONAL + CONSTANTS.JS
function addToMyChoiceFromHome(product) {
    // ✅ FIX 1: Agar product hi null hai to return kar do
    if (!product ||!product.id) {
        showToast("❌ Product load nahi hua. Page refresh karo");
        console.error("❌ Product is null or missing ID:", product);
        return;
    }

    const user = firebase.auth().currentUser;
    const guestInfo = JSON.parse(localStorage.getItem(CUSTOMER_KEY + "_guest_info") || "null");
    const productImage = getProductThumbnail(product);

    let myChoiceItem = {
        id: product.id,
        name: product.name || "Product",
        price: parseFloat(product.price) || 0,
        image: productImage,
        code: product.code || product.id,
        variant: product.size || product.variant || 'Default',
        from: product.dbType || 'rtdb',
        addedAt: Date.now()
    };

    // ✅ GUEST USER - LOGIN NAHI MANGA - CONSTANTS.JS USE KARO
    if (!user) {
        let myChoiceArray = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");

        // ✅ FIX 2: Pehle se null values hatao
        myChoiceArray = myChoiceArray.filter(item => item!== null && item!== undefined);

        let existingIndex = myChoiceArray.findIndex(item => item && item.id === product.id);

        if (existingIndex === -1) {
            myChoiceArray.push(myChoiceItem);
            localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoiceArray));
            showToast("😍 Added to My Choice!");
            updateHomeBadges();
            const btn = document.querySelector(`.choice-heart-btn[data-id="${product.id}"]`);
            if(btn) btn.classList.add('active');
        } else {
            showToast("Already in My Choice!");
        }
        return;
    }

    // ✅ LOGIN USER - FIREBASE ME SAVE
    firebase.database().ref('users/' + user.uid + '/myChoice/' + product.id).set(myChoiceItem).then(() => {
        showToast("😍 Added to My Choice!");
        updateHomeBadges();
        const btn = document.querySelector(`.choice-heart-btn[data-id="${product.id}"]`);
        if(btn) btn.classList.add('active');
    }).catch((error) => {
        showToast("❌ Error: " + error.message);
    });
}

// ✅ CART ME ADD KARNE KE LIYE BHI FUNCTION - CONSTANTS.JS
function addToCartFromHome(product) {
    if (!product ||!product.id) {
        showToast("❌ Product load nahi hua. Page refresh karo");
        return;
    }

    const user = firebase.auth().currentUser;
    const productImage = getProductThumbnail(product);

    let cartItem = {
        id: product.id,
      
        name: (product.name && String(product.name).trim()) ? String(product.name).trim() : "",

if(!myChoiceItem.name){ showToast("❌ Naam nahi hai"); return; }
      
      
        price: parseFloat(product.price) || 0,
        image: productImage,
        code: product.code || product.id,
        size: product.size || product.variant || 'M',
        qty: 1,
        addedAt: Date.now()
    };

    // ✅ GUEST USER - CONSTANTS.JS USE KARO
    if (!user) {
        let cartArray = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        cartArray = cartArray.filter(item => item!== null && item!== undefined);

        let existingIndex = cartArray.findIndex(item => item && item.id === product.id && item.size === cartItem.size);

        if (existingIndex === -1) {
            cartArray.push(cartItem);
        } else {
            cartArray[existingIndex].qty = (cartArray[existingIndex].qty || 1) + 1;
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
        showToast("✅ Added to Cart!");
        updateHomeBadges();
        return;
    }

    // ✅ LOGIN USER - FIREBASE ME SAVE
    firebase.database().ref('users/' + user.uid + '/cart/' + product.id).set(cartItem).then(() => {
        showToast("✅ Added to Cart!");
        updateHomeBadges();
    }).catch((error) => {
        showToast("❌ Error: " + error.message);
    });
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-size:14px";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
}

function updateHomeBadges() {
    const user = firebase.auth().currentUser;

    // ✅ GUEST USER - CONSTANTS.JS USE KARO
    if (!user) {
        let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        cart = cart.filter(item => item!== null && item!== undefined);
        let totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

        const cartBadge = document.getElementById('cartBadge');
        const bottomCartBadge = document.getElementById('bottomCartBadge');
        if (cartBadge) {
            cartBadge.innerText = totalQty;
            cartBadge.style.display = totalQty > 0? 'flex' : 'none';
        }
        if (bottomCartBadge) {
            bottomCartBadge.innerText = totalQty;
            bottomCartBadge.style.display = totalQty > 0? 'flex' : 'none';
        }

        // My Choice badge bhi update karo
        let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
        myChoice = myChoice.filter(item => item!== null && item!== undefined);
        const choiceBadge = document.getElementById('choiceBadge');
        if (choiceBadge) {
            choiceBadge.innerText = myChoice.length;
            choiceBadge.style.display = myChoice.length > 0? 'flex' : 'none';
        }
        return;
    }

    // ✅ LOGIN USER - Firebase se count lo
    firebase.database().ref('users/' + user.uid + '/cart').once('value').then(snap => {
        let totalQty = 0;
        if (snap.exists()) {
            snap.forEach(child => {
                totalQty += (child.val().qty || 1);
            });
        }
        const cartBadge = document.getElementById('cartBadge');
        const bottomCartBadge = document.getElementById('bottomCartBadge');
        if (cartBadge) {
            cartBadge.innerText = totalQty;
            cartBadge.style.display = totalQty > 0? 'flex' : 'none';
        }
        if (bottomCartBadge) {
            bottomCartBadge.innerText = totalQty;
            bottomCartBadge.style.display = totalQty > 0? 'flex' : 'none';
        }
    });
}

// ✅ Global functions
window.addToMyChoiceFromHome = addToMyChoiceFromHome;
window.addToCartFromHome = addToCartFromHome;
window.updateHomeBadges = updateHomeBadges;

console.log("✅ products.js loaded - 15 JULY 2026 - CONSTANTS.JS + GUEST SUPPORT");