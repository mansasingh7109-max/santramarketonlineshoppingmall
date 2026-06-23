function addToCart(productData) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if already in cart
    let existing = cart.find(item => item.id === productData.id);
    if(existing) {
        existing.qty += 1;
    } else {
        productData.qty = 1;
        cart.push(productData);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to Cart ✅');
    updateCartCount(); // ye function cart icon pe number update karega
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelector('.cart-count').innerText = cart.length;
}

// Page load hote hi count update karo
document.addEventListener('DOMContentLoaded', updateCartCount);
