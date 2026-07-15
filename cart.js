// ==================== CART.JS - UNIVERSAL CART HANDLER ====================
// 14-JULY-2026 - UPDATED FOR SANTRA MALL - ARRAY SAFE + CONSTANTS.JS
// index.html, cart.html, product.html sab me chalega

// ✅ NAYA CODE: constants.js se keys aayenge - const mat banao
// window.CART_KEY aur window.MYCHOICE_KEY constants.js me define ho chuke hain

// ✅ SAFE GET CART - Array guarantee
window.getSafeCart = function() {
    let cart = [];
    try{
        const raw = localStorage.getItem(window.CART_KEY);
        cart = raw? JSON.parse(raw) : [];
        if(!Array.isArray(cart)) cart = [];
    }catch(e){
        console.warn('Cart parse error, resetting:', e);
        cart = [];
    }
    return cart;
}

// ✅ SAFE GET WISHLIST - Array guarantee
window.getSafeWishlist = function() {
    let wish = [];
    try{
        const raw = localStorage.getItem(window.MYCHOICE_KEY);
        wish = raw? JSON.parse(raw) : [];
        if(!Array.isArray(wish)) wish = [];
    }catch(e){
        console.warn('Wishlist parse error, resetting:', e);
        wish = [];
    }
    return wish;
}

// ... Baaki tera poora code same rahega ...
/*

⚠️ OLD CODE BACKUP - 29 JUNE 2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

// ✅ FORCE SAME KEY EVERYWHERE - Sabse pehle
delete window.CART_KEY; // Purana hatao
delete window.WISH_KEY;
window.CART_KEY = "santraMallCart_v2";
window.WISH_KEY = "santraMyChoice_v2";
localStorage.setItem('CART_KEY_FORCED', 'santraMallCart_v2');

window.CART_KEY = window.CART_KEY || "santra_cart";

OLD CODE BACKUP END

*/

// ==================== CART.JS - UNIVERSAL CART HANDLER ====================
// 14-JULY-2026 - UPDATED FOR SANTRA MALL - ARRAY SAFE + CONSTANTS.JS
// index.html, cart.html, product.html sab me chalega

// ✅ NAYA CODE: constants.js se keys aayenge - const mat banao
// window.CART_KEY aur window.MYCHOICE_KEY constants.js me define ho chuke hain

// ✅ SAFE GET CART - Array guarantee
window.getSafeCart = function() {
    let cart = [];
    try{
        const raw = localStorage.getItem(window.CART_KEY);
        cart = raw? JSON.parse(raw) : [];
        if(!Array.isArray(cart)) cart = [];
    }catch(e){
        console.warn('Cart parse error, resetting:', e);
        cart = [];
    }
    return cart;
}

// ✅ SAFE GET WISHLIST - Array guarantee
window.getSafeWishlist = function() {
    let wish = [];
    try{
        const raw = localStorage.getItem(window.MYCHOICE_KEY);
        wish = raw? JSON.parse(raw) : [];
        if(!Array.isArray(wish)) wish = [];
    }catch(e){
        console.warn('Wishlist parse error, resetting:', e);
        wish = [];
    }
    return wish;
}

// ✅ BADGE UPDATE - Header + Bottom Nav
window.updateCartBadge = function() {
    const cartBadge = document.getElementById('cartBadge');
    const bottomCartBadge = document.getElementById('bottomCartBadge');
    const choiceBadge = document.getElementById('choiceBadge');
    if (!cartBadge &&!bottomCartBadge &&!choiceBadge) return;

    const user = typeof auth!== 'undefined'? auth.currentUser : null;

    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart').on('value', (snapshot) => {
            let totalQty = 0;
            if (snapshot.exists()) {
                snapshot.forEach((child) => { totalQty += (child.val().qty || 1); });
            }
            setCartBadgeCount(cartBadge, totalQty);
            setCartBadgeCount(bottomCartBadge, totalQty);
        });

        rtdb.ref('users/' + user.uid + '/wishlist').on('value', (snapshot) => {
            let count = snapshot.exists()? snapshot.numChildren() : 0;
            setCartBadgeCount(choiceBadge, count);
        });
    } else {
        let cart = getSafeCart();
        let wish = getSafeWishlist();
        let totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartBadgeCount(cartBadge, totalQty);
        setCartBadgeCount(bottomCartBadge, totalQty);
        setCartBadgeCount(choiceBadge, wish.length);
    }
}

function setCartBadgeCount(badge, count) {
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0? 'flex' : 'none';
    }
}

// ✅ ADD TO CART - Universal - IMAGE FIX + ARRAY SAFE + PRODUCT PAGE SUPPORT
window.addToCart = function(productData) {
    // ✅ FIX 1: Agar productData nahi aaya to currentProduct check karo - Product page ke liye
    if (!productData ||!productData.id || productData.id === 'undefined') {
        if(typeof currentProduct!== 'undefined' && currentProduct && currentProduct.id){
            productData = currentProduct;
            // Variant bhi add karo agar select hai
            if(typeof selectedVariant!== 'undefined' && selectedVariant){
                productData.variant = selectedVariant;
                productData.id = currentProduct.id + '-' + selectedVariant;
            }
            if(typeof selectedVariantData!== 'undefined' && selectedVariantData && selectedVariantData.price){
                productData.price = selectedVariantData.price;
            }
        } else {
            if(typeof showToast!== 'undefined') showToast("Product not found");
            return;
        }
    }

    const user = typeof auth!== 'undefined'? auth.currentUser : null;

    // ✅ FIX 2: IMAGE PROPERLY PICK KARO - undefined check add kiya
    let img = productData.image || '';
    if(!img && productData.images && Array.isArray(productData.images) && productData.images.length > 0) img = productData.images[0];
    if(!img && productData.media && Array.isArray(productData.media) && productData.media.length > 0) img = productData.media[0].url || productData.media[0];
    if(!img) img = 'https://via.placeholder.com/90x90?text=No+Image';

    let cartItem = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: img,
        code: productData.code || productData.id,
        variant: productData.variant || "Default",
        qty: productData.qty || 1,
        dbType: productData.dbType || 'rtdb'
    };

    // LocalStorage - ARRAY SAFE
    let cartArray = getSafeCart();
    let existingIndex = cartArray.findIndex(item => item.id === productData.id);
    if (existingIndex > -1) {
        cartArray[existingIndex].qty += (productData.qty || 1);
    } else {
        cartArray.push(cartItem);
    }
    localStorage.setItem(window.CART_KEY, JSON.stringify(cartArray));

    // Firebase
    if (user && typeof rtdb!== 'undefined') {
        const cartRef = rtdb.ref('users/' + user.uid + '/cart/' + productData.id);
        cartRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                const currentQty = snapshot.val().qty || 1;
                return cartRef.update({ qty: currentQty + (productData.qty || 1), image: img });
            } else {
                return cartRef.set(cartItem);
            }
        }).catch(err => console.log('Firebase cart error:', err));
    }

    if(typeof showToast!== 'undefined') showToast("✅ Added to Cart! 🛒");
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

// ✅ BUY NOW - Universal
window.buyNow = function(productId) {
    if (typeof allProducts!== 'undefined') {
        const product = allProducts.find(p => p.id === productId);
        if (product) addToCart(product);
    } else if (typeof currentProduct!== 'undefined') {
        addToCart(currentProduct);
    }
    setTimeout(() => { window.location.href = "cart.html"; }, 500);
}

// ✅ REMOVE FROM CART - ARRAY SAFE
window.removeFromCart = function(productId) {
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    let cartArray = getSafeCart();
    cartArray = cartArray.filter(item => item.id!== productId);
    localStorage.setItem(window.CART_KEY, JSON.stringify(cartArray));
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart/' + productId).remove();
    }
    if(typeof showToast!== 'undefined') showToast("Removed from cart");
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

// ✅ UPDATE QTY - ARRAY SAFE
window.updateCartQty = function(productId, newQty) {
    if (newQty < 1) return removeFromCart(productId);
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    let cartArray = getSafeCart();
    let index = cartArray.findIndex(item => item.id === productId);
    if (index > -1) {
        cartArray[index].qty = newQty;
        localStorage.setItem(window.CART_KEY, JSON.stringify(cartArray));
    }
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart/' + productId + '/qty').set(newQty);
    }
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

// ✅ GET CART ITEMS - ARRAY SAFE
window.getCartItems = function(callback) {
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart').once('value', (snapshot) => {
            let items = [];
            if (snapshot.exists()) {
                snapshot.forEach((child) => { items.push({...child.val(), id: child.key }); });
            }
            callback(items);
        });
    } else {
        let items = getSafeCart();
        callback(items);
    }
}

// ✅ ADD TO WISHLIST - ARRAY SAFE
window.addToWishlist = function(productData) {
    if(!productData ||!productData.id) return;
    let wish = getSafeWishlist();
    if(!wish.find(p => p.id === productData.id)) {
        wish.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image || (productData.images && productData.images[0]) || ''
        });
        localStorage.setItem(window.MYCHOICE_KEY, JSON.stringify(wish));
        if(typeof showToast!== 'undefined') showToast("❤️ My Choice me add ho gaya");
        updateCartBadge();
    } else {
        if(typeof showToast!== 'undefined') showToast("Already in My Choice");
    }
}

// ✅ PLACE ORDER
window.placeOrder = function() {
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    const customer = localStorage.getItem('santra_customer');
    if (!customer ||!JSON.parse(customer).isLoggedIn) {
        if(confirm('Order karne ke liye Login kare?\n\nOK = Login Page')) {
            localStorage.setItem('redirect_after_login', 'cart.html');
            window.location.href = 'customer-account.html';
        }
        return;
    }
    getCartItems((items) => {
        if (items.length === 0) { if(typeof showToast!== 'undefined') showToast("Cart khali hai"); return; }
        const customerData = JSON.parse(customer);
        const orderData = {
            items: items,
            total: items.reduce((sum, item) => sum + (item.price * item.qty), 0),
            orderDate: Date.now(),
            status: 'Pending',
            customerName: customerData.name,
            customerPhone: customerData.phone || customerData.mobile || ''
        };
        if (user && typeof rtdb!== 'undefined') {
            const orderRef = rtdb.ref('users/' + user.uid + '/orders').push();
            orderRef.set(orderData).then(() => {
                rtdb.ref('users/' + user.uid + '/cart').remove();
                localStorage.setItem(window.CART_KEY, "[]");
                if(typeof showToast!== 'undefined') showToast("✅ Order Placed Successfully!");
                updateCartBadge();
                setTimeout(() => { window.location.href = "orders.html"; }, 1500);
            });
        } else {
            let orders = JSON.parse(localStorage.getItem('santra_orders') || "[]");
            orders.push({...orderData, id: 'order_' + Date.now()});
            localStorage.setItem('santra_orders', JSON.stringify(orders));
            localStorage.setItem(window.CART_KEY, "[]");
            if(typeof showToast!== 'undefined') showToast("✅ Order Placed Successfully!");
            updateCartBadge();
            setTimeout(() => { window.location.href = "orders.html"; }, 1500);
        }
    });
}

// ✅ SHARE CART LINK
window.shareCartLink = function() {
    getCartItems((items) => {
        if (items.length === 0) { if(typeof showToast!== 'undefined') showToast("Cart khali hai"); return; }
        const cartIds = items.map(item => item.id).join(',');
        const shareUrl = `${window.location.origin}/cart.html?share=${cartIds}`;
        if (navigator.share) {
            navigator.share({ title: 'My Santra Mall Cart', text: 'Check out my cart', url: shareUrl });
        } else {
            navigator.clipboard.writeText(shareUrl);
            if(typeof showToast!== 'undefined') showToast("Cart link copied!");
        }
    });
}

// ✅ Page load pe badge update
document.addEventListener('DOMContentLoaded', function() { setTimeout(updateCartBadge, 500); });

// ==================== CHROME FIX PATCH - 30 JUNE 2026 ====================
// ✅ OLD KEY se NEW KEY me migrate karo (backup safe)
(function migrateCartKey() {
    const OLD_KEY = "santra_cart";
    const NEW_KEY = window.CART_KEY;
    try {
        const oldData = localStorage.getItem(OLD_KEY);
        const newData = localStorage.getItem(NEW_KEY);
        if (oldData &&!newData) {
            localStorage.setItem(NEW_KEY, oldData);
            console.log('✅ Cart migrated from old key');
        }
    } catch(e) { console.log('migrate error', e); }
})();

// ✅ FIX: addToCart ke baad popup force open karo
const originalAddToCart = window.addToCart;
window.addToCart = function(productData) {
    originalAddToCart(productData);
    // popup kholo
    setTimeout(() => {
        const popup = document.getElementById('cartPopup') || document.getElementById('myCartPopup');
        if(popup) {
            popup.style.display = 'block';
            popup.classList.add('show');
            // items render karo
            if(typeof renderCartPopup === 'function') renderCartPopup();
        }
    }, 300);
};

// ✅ Chrome me localStorage block fix - try catch
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    try {
        originalSetItem.apply(this, arguments);
    } catch(e) {
        console.warn('localStorage full or blocked, using sessionStorage');
        sessionStorage.setItem(key, value);
    }
};
// ==================== PATCH END ====================

// ✅ Debug - Sabse end me daalo taki function define ho jaye
console.log('Cart.js loaded, addToCart exists:', typeof window.addToCart);
