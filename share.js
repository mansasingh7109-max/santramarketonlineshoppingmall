/*

⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

// const CART_KEY = "santraMallCart_v2";
// const BASE_URL = "https://santramarketshoppingmall.web.app";

OLD CODE BACKUP END

*/

// ✅ SHARE.JS - UPDATED 14 JULY 2026 - CONSTANTS.JS SUPPORT
// ✅ constants.js se CART_KEY aayega - const mat banao

const BASE_URL = "https://santramarketshoppingmall.web.app";

// ✅ FIX: window.CART_KEY use karo, hardcode mat karo
const getCartKey = () => window.CART_KEY || "santraMallCart_v2";

// ✅ 1. CART PAGE - Send Order / Share Cart Button
function shareCart() {
    let cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    
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
    let cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let item = cart.find(p => p.id === productId);
    if (!item) return;
    
    let size = item.size || item.variant || 'M';
    let qty = item.qty || 1;
    
    let text = `*${item.name}*\n`;
    text += `Size: ${size}\n`;  // ✅
    text += `Qty: ${qty}\n`;    // ✅
    text += `Price: ₹${item.price}\n`;
    text += `Link: ${BASE_URL}/product.html?id=${item.id}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ✅ 3. Share buttons auto add - for home page hearts
function addShareButtons() {
    // purana code same
    console.log("✅ Share buttons ready");
}

// Export for module use
export const shareMyCart = shareCart;
export const shareSingleProductExport = shareSingleProduct;

// Make globally available
window.shareCart = shareCart;
window.shareSingleProduct = shareSingleProduct;

// ✅ Auto load
document.addEventListener('DOMContentLoaded', () => {
    addShareButtons();
    console.log('✅ share.js loaded, CART_KEY:', getCartKey());
});