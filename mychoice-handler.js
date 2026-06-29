// ==================== MYCHOICE HANDLER - UNIVERSAL VERSION ====================
// Ye file product.html, index.html, cart.html sab me chalegi
// Agar page me pehle se code hai to use override kar degi
// Created: 28-JUNE-2026 7:05 PM

const MYCHOICE_KEY = "santrajet_mychoice";

// FORCE OVERRIDE: Pehle se function ho to bhi ye wala chale
// Isliye if condition hata di. Ab hamesha ye file follow hogi

// 1. Header Badge Update - Universal
window.updateMyChoiceBadge = function() {
    if (typeof auth === 'undefined') return;
    auth.onAuthStateChanged(user => {
        if (user && typeof rtdb !== 'undefined') {
            // Login user - Firebase se count
            rtdb.ref('users/' + user.uid + '/myChoice').on('value', (snapshot) => {
                const count = snapshot.numChildren();
                const choiceBadge = document.getElementById('choiceBadge');
                if (choiceBadge) {
                    choiceBadge.innerText = count;
                    choiceBadge.style.display = count > 0 ? 'flex' : 'none';
                }
            });
        } else {
            // Guest user - LocalStorage se count
            let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
            const choiceBadge = document.getElementById('choiceBadge');
            if (choiceBadge) {
                choiceBadge.innerText = myChoice.length;
                choiceBadge.style.display = myChoice.length > 0 ? 'flex' : 'none';
            }
        }
    });
}

// 2. Product Ko MyChoice Me Add Karna - Universal
window.addToMyChoice = function(productData) {
    // product.html se call hoga to currentProduct use hoga
    // index.html se call hoga to productData pass karna padega
    let product = productData || (typeof currentProduct !== 'undefined' ? currentProduct : null);
    
    if (!product) {
        if(typeof showToast !== 'undefined') showToast("Product load nahi hua");
        return;
    }

    const user = typeof auth !== 'undefined' ? auth.currentUser : null;
    let finalPrice = product.price;
    let productImage = product.image || product.thumbnail;
    
    // Variant check - sirf product.html me hoga
    if (typeof selectedVariantData !== 'undefined' && selectedVariantData?.price) {
        finalPrice = selectedVariantData.price;
    }
    if (typeof getProductThumbnail !== 'undefined') {
        productImage = getProductThumbnail(product);
    }

    let choiceItem = {
        id: product.id,
        name: product.name,
        price: finalPrice,
        image: productImage,
        code: product.code || product.id,
        variant: typeof selectedVariant !== 'undefined' ? selectedVariant || "Default" : "Default",
        from: product.dbType || 'rtdb',
        addedAt: new Date().toISOString()
    };

    // LocalStorage me save
    let myChoiceArray = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
    let existingIndex = myChoiceArray.findIndex(item => item && item.id === product.id && item.variant === choiceItem.variant);
    
    if (existingIndex === -1) {
        myChoiceArray.push(choiceItem);
        localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoiceArray));
    } else {
        if(typeof showToast !== 'undefined') showToast("⚠️ Already in My Choice!");
        return;
    }

    // Firebase me save - Login hai to
    if (user && typeof rtdb !== 'undefined') {
        rtdb.ref('users/' + user.uid + '/myChoice/' + product.id).set(choiceItem)
       .then(() => {
            if(typeof showToast !== 'undefined') showToast("😍 Added to My Choice!");
            window.updateMyChoiceBadge();
            if(typeof window.updateWishlistIcon !== 'undefined') window.updateWishlistIcon(true);
        })
       .catch((error) => {
            if(typeof showToast !== 'undefined') showToast("❌ Error: " + error.message);
        });
    } else {
        if(typeof showToast !== 'undefined') showToast("😍 Added to My Choice!");
        window.updateMyChoiceBadge();
        if(typeof window.updateWishlistIcon !== 'undefined') window.updateWishlistIcon(true);
    }
}

// 3. Wishlist Icon Update
window.updateWishlistIcon = function(isAdded) {
    const wishBtn = document.getElementById('wishBtn');
    if (wishBtn) {
        wishBtn.innerHTML = isAdded ? '😍' : '🤍';
    }
}

// 4. Check Status - Product Page Ke Liye
window.checkWishlistStatus = function() {
    if (typeof auth === 'undefined') return;
    const user = auth.currentUser;
    const productId = new URLSearchParams(window.location.search).get("id");
    if (!productId) return;

    if (user && typeof rtdb !== 'undefined') {
        rtdb.ref('users/' + user.uid + '/myChoice/' + productId).once('value', (snapshot) => {
            window.updateWishlistIcon(snapshot.exists());
        });
    } else {
        let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
        let exists = myChoice.some(item => item && item.id === productId);
        window.updateWishlistIcon(exists);
    }
}

// 5. Remove From MyChoice
window.removeFromMyChoice = function(productId) {
    const user = typeof auth !== 'undefined' ? auth.currentUser : null;
    
    let myChoice = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || "[]");
    myChoice = myChoice.filter(item => item && item.id !== productId);
    localStorage.setItem(MYCHOICE_KEY, JSON.stringify(myChoice));
    
    if (user && typeof rtdb !== 'undefined') {
        rtdb.ref('users/' + user.uid + '/myChoice/' + productId).remove();
    }
    
    window.updateMyChoiceBadge();
    if(typeof window.updateWishlistIcon !== 'undefined') window.updateWishlistIcon(false);
    if(typeof showToast !== 'undefined') showToast("Removed from My Choice");
}

// 6. Auto Init - Page Load Pe Badge Update Karo
document.addEventListener('DOMContentLoaded', function() {
    // Firebase load hone ka wait karo
    setTimeout(() => {
        if(typeof window.updateMyChoiceBadge !== 'undefined') {
            window.updateMyChoiceBadge();
        }
    }, 1000);
});

console.log("✅ MyChoice Handler Loaded - Universal Mode | All Pages | 28-JUNE-2026");