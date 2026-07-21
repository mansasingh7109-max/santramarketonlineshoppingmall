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

// ==================== CART.JS - FINAL FIXED - 21 JULY 2026 - IMAGE FIX + HOME TAB FIX ====================
// index.html, cart.html, product.html sab me chalega - Old code upar safe hai

// ✅ Image ka final solution - har type ka image pakdega
function getProductThumbnail(p){
  if(!p) return "https://via.placeholder.com/90x90?text=No+Image";
  if(p.image && typeof p.image==="string" && p.image.trim()!=="" &&!p.image.includes("placeholder")) return p.image;
  if(p.imageUrl && typeof p.imageUrl==="string" && p.imageUrl.trim()!=="") return p.imageUrl;
  if(p.thumbnail && typeof p.thumbnail==="string" && p.thumbnail.trim()!=="") return p.thumbnail;
  if(p.img && typeof p.img==="string" && p.img.trim()!=="") return p.img;
  if(p.productImage && typeof p.productImage==="string") return p.productImage;
  if(p.media && Array.isArray(p.media) && p.media.length>0){
    let m=p.media[0];
    if(typeof m==="string" && m.trim()!=="") return m;
    if(m && (m.url||m.imageUrl)) return m.url||m.imageUrl;
  }
  if(p.images && Array.isArray(p.images) && p.images.length>0){
    let m=p.images[0];
    if(typeof m==="string" && m.trim()!=="") return m;
    if(m && (m.url||m.imageUrl)) return m.url||m.imageUrl;
  }
  // Home page cache se dhoondo - sabse important
  try{
    let cache=JSON.parse(localStorage.getItem('santra_all_products_cache')||"[]");
    let sid=String(p.id||p.productId||p.code||"").toLowerCase();
    let f=cache.find(x=>String(x.id||"").toLowerCase()===sid || String(x.code||"").toLowerCase()===sid);
    if(f){
      if(f.image) return f.image;
      if(f.imageUrl) return f.imageUrl;
      if(f.thumbnail) return f.thumbnail;
    }
  }catch{}
  return "https://via.placeholder.com/90x90?text=No+Image";
}

// ✅ SAFE GET CART - Array + Object dono handle
window.getSafeCart = function() {
    let cart = [];
    try{
        const raw = localStorage.getItem(window.CART_KEY || "santraMallCart_v2");
        cart = raw? JSON.parse(raw) : [];
        if(!Array.isArray(cart)) cart = Object.values(cart);
        if(!Array.isArray(cart)) cart = [];
    }catch(e){
        cart = [];
    }
    return cart;
}

window.getSafeWishlist = function() {
    let wish = [];
    try{
        const raw = localStorage.getItem(window.MYCHOICE_KEY || "santraMallMyChoice_v2");
        wish = raw? JSON.parse(raw) : [];
        if(!Array.isArray(wish)) wish = Object.values(wish);
        if(!Array.isArray(wish)) wish = [];
    }catch(e){
        wish = [];
    }
    return wish;
}

window.updateCartBadge = function() {
    const cartBadge = document.getElementById('cartBadge');
    const bottomCartBadge = document.getElementById('bottomCartBadge');
    const homeCartBadge = document.getElementById('homeCartBadge');
    const choiceBadge = document.getElementById('choiceBadge');

    let cart = getSafeCart();
    let wish = getSafeWishlist();
    let totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    [cartBadge, bottomCartBadge, homeCartBadge].forEach(b=>{
        if(b){ b.innerText=totalQty; b.style.display=totalQty>0?'flex':'none'; }
    });
    if(choiceBadge){ choiceBadge.innerText=wish.length; choiceBadge.style.display=wish.length>0?'flex':'none'; }
}

function setCartBadgeCount(badge, count) {
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0? 'flex' : 'none';
    }
}

// ✅ ADD TO CART - IMAGE FIX FINAL
window.addToCart = function(productData) {
    if (!productData ||!productData.id || productData.id === 'undefined') {
        if(typeof currentProduct!== 'undefined' && currentProduct && currentProduct.id){
            productData = currentProduct;
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
    let img = getProductThumbnail(productData); // ✅ Yahi fix hai

    let cartItem = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: img,
        imageUrl: img,
        thumbnail: img,
        code: productData.code || productData.id,
        variant: productData.variant || "M",
        size: productData.variant || "M",
        qty: productData.qty || 1,
        dbType: productData.dbType || 'rtdb'
    };

    let cartArray = getSafeCart();
    let existingIndex = cartArray.findIndex(item => String(item.id).toLowerCase() === String(productData.id).toLowerCase());
    if (existingIndex > -1) {
        cartArray[existingIndex].qty += (productData.qty || 1);
        // Image update bhi karo agar purana blank tha
        if(!cartArray[existingIndex].image || cartArray[existingIndex].image.includes('placeholder')){
            cartArray[existingIndex].image = img;
            cartArray[existingIndex].imageUrl = img;
        }
    } else {
        cartArray.push(cartItem);
    }
    localStorage.setItem(window.CART_KEY || "santraMallCart_v2", JSON.stringify(cartArray));
    localStorage.setItem("santraMallCart_v2", JSON.stringify(cartArray));

    if (user && typeof rtdb!== 'undefined') {
        const cartRef = rtdb.ref('users/' + user.uid + '/cart/' + productData.id);
        cartRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                const currentQty = snapshot.val().qty || 1;
                return cartRef.update({ qty: currentQty + (productData.qty || 1), image: img, imageUrl: img });
            } else {
                return cartRef.set(cartItem);
            }
        }).catch(err => console.log('Firebase cart error:', err));
    }

    if(typeof showToast!== 'undefined') showToast("✅ Added to Cart! 🛒");
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

window.buyNow = function(productId) {
    if (typeof allProducts!== 'undefined') {
        const product = allProducts.find(p => p.id === productId);
        if (product) addToCart(product);
    } else if (typeof currentProduct!== 'undefined') {
        addToCart(currentProduct);
    }
    setTimeout(() => { window.location.href = "cart.html"; }, 500);
}

window.removeFromCart = function(productId) {
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    let cartArray = getSafeCart();
    cartArray = cartArray.filter(item => String(item.id).toLowerCase()!==String(productId).toLowerCase());
    localStorage.setItem(window.CART_KEY || "santraMallCart_v2", JSON.stringify(cartArray));
    localStorage.setItem("santraMallCart_v2", JSON.stringify(cartArray));
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart/' + productId).remove();
    }
    if(typeof showToast!== 'undefined') showToast("Removed from cart");
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

window.updateCartQty = function(productId, newQty) {
    if (newQty < 1) return removeFromCart(productId);
    const user = typeof auth!== 'undefined'? auth.currentUser : null;
    let cartArray = getSafeCart();
    let index = cartArray.findIndex(item => String(item.id).toLowerCase()===String(productId).toLowerCase());
    if (index > -1) {
        cartArray[index].qty = newQty;
        localStorage.setItem(window.CART_KEY || "santraMallCart_v2", JSON.stringify(cartArray));
        localStorage.setItem("santraMallCart_v2", JSON.stringify(cartArray));
    }
    if (user && typeof rtdb!== 'undefined') {
        rtdb.ref('users/' + user.uid + '/cart/' + productId + '/qty').set(newQty);
    }
    updateCartBadge();
    if (typeof renderCartPage === 'function') { renderCartPage(); }
}

window.getCartItems = function(callback) {
    let items = getSafeCart();
    callback(items);
}

window.addToWishlist = function(productData) {
    if(!productData ||!productData.id) return;
    let wish = getSafeWishlist();
    if(!wish.find(p => String(p.id).toLowerCase() === String(productData.id).toLowerCase())) {
        wish.push({
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: getProductThumbnail(productData)
        });
        localStorage.setItem(window.MYCHOICE_KEY || "santraMallMyChoice_v2", JSON.stringify(wish));
        localStorage.setItem("santrajet_mychoice", JSON.stringify(wish));
        if(typeof showToast!== 'undefined') showToast("❤️ My Choice me add ho gaya");
        updateCartBadge();
    } else {
        if(typeof showToast!== 'undefined') showToast("Already in My Choice");
    }
}

window.placeOrder = function() {
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
        let orders = JSON.parse(localStorage.getItem('santra_orders') || "[]");
        orders.push({...orderData, id: 'order_' + Date.now()});
        localStorage.setItem('santra_orders', JSON.stringify(orders));
        localStorage.setItem(window.CART_KEY || "santraMallCart_v2", "[]");
        localStorage.setItem("santraMallCart_v2", "[]");
        if(typeof showToast!== 'undefined') showToast("✅ Order Placed Successfully!");
        updateCartBadge();
        setTimeout(() => { window.location.href = "orders.html"; }, 1500);
    });
}

document.addEventListener('DOMContentLoaded', function() { setTimeout(updateCartBadge, 500); });
console.log('Cart.js FINAL 21 JULY loaded, image fix done:', typeof window.addToCart);