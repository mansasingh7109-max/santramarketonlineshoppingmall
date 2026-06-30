// ==================== CART.JS - UNIVERSAL CART HANDLER ====================
// 30-JUNE-2026 06:45 PM - UPDATED FOR SANTRA MALL - OLD LAYOUT SAFE
// index.html, cart.html, product.html sab me chalega

/*
⚠️ ===== OLD CODE BACKUP - 29 JUNE WALA =====
window.CART_KEY = window.CART_KEY || "santra_cart";
===== OLD CODE BACKUP END =====
*/

// ✅ FIX 1: KEY MATCH - sab files se same
window.CART_KEY = window.CART_KEY || "santraMallCart_v2";

// ✅ BADGE UPDATE - Header + Bottom Nav
window.updateCartBadge = function() {
    const cartBadge = document.getElementById('cartBadge');
    const bottomCartBadge = document.getElementById('bottomCartBadge');
    if (!cartBadge &&!bottomCartBadge) return;
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
    } else {
        let cart = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
        let totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartBadgeCount(cartBadge, totalQty);
        setCartBadgeCount(bottomCartBadge, totalQty);
    }
}

function setCartBadgeCount(badge, count) {
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0? 'flex' : 'none';
    }
}

// ✅ ADD TO CART - Universal - IMAGE FIX
window.addToCart = function(productData) {
    if (!productData ||!productData.id) {
        if(typeof showToast!== 'undefined') showToast("Product not found");
        return;
    }
    const user = typeof auth!== 'undefined'? auth.currentUser : null;

    // ✅ FIX 2: IMAGE PROPERLY PICK KARO - home page ke liye
    let img = productData.image || '';
    if(!img && productData.images && productData.images.length > 0) img = productData.images[0];
    if(!img && productData.media && productData.media.length > 0) img = productData.media[0].url || productData.media[0];
    if(!img) img = 'https://via.placeholder.com/90x90?text=No+Image';

    let cartItem = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: img, // ✅ image save hoga
        code: productData.code || productData.id,
        variant: productData.variant || "Default",
        qty: 1,
        dbType: productData.dbType || 'rtdb'
    };

    // LocalStorage
    let cartArray = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
    let existingIndex = cartArray.findIndex(item => item.id === productData.id);
    if (existingIndex > -1) {
        cartArray[existingIndex].qty += 1;
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
                return cartRef.update({ qty: currentQty + 1, image: img });
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

// ✅ REMOVE FROM CART
window.removeFromCart = function(productId) {
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    let cartArray = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
    cartArray = cartArray.filter(item => item.id!== productId);
    localStorage.setItem(window.CART_KEY, JSON.stringify(cartArray));
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart/' + productId).remove();
    }
    if(typeof showToast!== 'undefined') showToast("Removed from cart");
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

// ✅ UPDATE QTY
window.updateCartQty = function(productId, newQty) {
    if (newQty < 1) return removeFromCart(productId);
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    let cartArray = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
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

// ✅ GET CART ITEMS
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
        let items = JSON.parse(localStorage.getItem(window.CART_KEY) || "[]");
        callback(items);
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