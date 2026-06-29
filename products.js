// ==================== SANTRA MALL - PRODUCTS.JS - 26 JUNE 2026 ====================

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

// ✅ MAIN FIX: My Choice me Add karne ke liye - LOGIN OPTIONAL
function addToMyChoiceFromHome(product) {
    // ✅ FIX 1: Agar product hi null hai to return kar do
    if (!product ||!product.id) {
        showToast("❌ Product load nahi hua. Page refresh karo");
        console.error("❌ Product is null or missing ID:", product);
        return;
    }

    const user = firebase.auth().currentUser;
    const guestInfo = JSON.parse(localStorage.getItem("santrajet_guest_info") || "null");
    const productImage = getProductThumbnail(product);

    let myChoiceItem = {
        id: product.id,
        name: product.name || "Product",
        price: parseFloat(product.price) || 0,
        image: productImage,
        code: product.code || product.id,
        variant: 'Default',
        from: product.dbType || 'rtdb',
        addedAt: Date.now()
    };

    // ✅ GUEST USER - LOGIN NAHI MANGA
    if (!user) {
        let myChoiceArray = JSON.parse(localStorage.getItem("santrajet_mychoice") || "[]");

        // ✅ FIX 2: Pehle se null values hatao
        myChoiceArray = myChoiceArray.filter(item => item!== null && item!== undefined);

        let existingIndex = myChoiceArray.findIndex(item => item && item.id === product.id);

        if (existingIndex === -1) {
            myChoiceArray.push(myChoiceItem);
            localStorage.setItem("santrajet_mychoice", JSON.stringify(myChoiceArray));
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

function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-size:14px";
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
}

function updateHomeBadges() {
    const user = firebase.auth().currentUser;
    if (!user) {
        let cart = JSON.parse(localStorage.getItem("santrajet_cart") || "[]");
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
        return;
    }
}

console.log("✅ products.js loaded - 26 JUNE 2026 - GUEST SUPPORT + NULL FIX");