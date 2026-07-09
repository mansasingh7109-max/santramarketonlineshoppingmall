// share.js - UPDATED 09/07/2026 - Size + Qty fix
const CART_KEY = "santraMallCart_v2";
const BASE_URL = "https://santramarketshoppingmall.web.app";

// ✅ 1. CART PAGE - Send Order / Share Cart Button
function shareCart() {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    
    if (cart.length === 0) {
        alert("❌ Cart is empty!");
        return;
    }

    let text = "🛒 *My Cart - SANTRA MALL* 🛒\n\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        let size = item.size || item.variant || 'M';
        let qty = item.qty || 1;
        let price = item.price || 0;
        let itemTotal = price * qty;
        total += itemTotal;
        
        text += `${index + 1}. *${item.name}*\n`;
        text += `Size: ${size}\n`;  // ✅ SIZE
        text += `Qty: ${qty} x ₹${price} = ₹${itemTotal}\n`;  // ✅ QTY
        text += `Link: ${BASE_URL}/product.html?id=${item.id}\n\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `*Grand Total: ₹${total}*\n`;
    text += `Shop: ${BASE_URL}`;

    // WhatsApp pe bhejo
    if (navigator.share) {
        navigator.share({ title: "My Cart", text: text });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
}

// ✅ 2. SINGLE PRODUCT SHARE (Cart me har item ke neeche wala blue Share button)
function shareSingleProduct(productId) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    let item = cart.find(p => p.id === productId);
    if (!item) return;
    
    let size = item.size || 'M';
    let qty = item.qty || 1;
    
    let text = `*${item.name}*\n`;
    text += `Size: ${size}\n`;  // ✅
    text += `Qty: ${qty}\n`;    // ✅
    text += `Price: ₹${item.price}\n`;
    text += `Link: ${BASE_URL}/product.html?id=${item.id}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ✅ 3. Share buttons auto add
function addShareButtons() {
    // purana code same
}

// Export for module use
export const shareMyCart = shareCart;
export const shareSingleProductExport = shareSingleProduct;

// Make globally available
window.shareCart = shareCart;
window.shareSingleProduct = shareSingleProduct;