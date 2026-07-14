/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

const CART_KEY = "santraMallCart_v2";
const BASE_URL = "https://santramarketshoppingmall.web.app";

function shareCart() {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (cart.length === 0) {
        alert("❌ Cart is empty!");
        return;
    }
    // ... baaki purana code
}

function shareSingleProduct(productId) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    let item = cart.find(p => p.id === productId);
    if (!item) return;
    // ... baaki purana code
}

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - SHARE.JS - UPDATED 15 JULY 2026 =====
// ✅ CONSTANTS.JS + COMMON.JS SUPPORT + ERROR PROOF

// ✅ NAYA: Constants se keys lo - common.js load karega
const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

// ✅ FIX: window.CART_KEY use karo, const mat banao
const getCartKey = () => window.CART_KEY || "santraMallCart_v2";

// ✅ Toast helper - common.js se aayega, nahi to fallback
const showToast = (msg, isError = false) => {
    if(typeof santraToast!== 'undefined') {
        santraToast(msg, isError);
    } else {
        alert(msg);
    }
};

// ✅ 1. CART PAGE - Send Order / Share Cart Button
function shareCart() {
    let cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    
    if (cart.length === 0) {
        showToast("❌ Cart is empty!", true);
        return;
    }

    let text = "🛒 *My Cart - SANTRA MALL* 🛒\n\n";
    let total = 0;
    
    cart.forEach((item, index) => {
        let size = item.size || item.variant || 'M';
        let qty = parseInt(item.qty) || 1;
        let price = parseFloat(item.price) || 0;
        let itemTotal = price * qty;
        total += itemTotal;
        
        text += `${index + 1}. *${item.name || 'Product'}*\n`;
        text += `Size: ${size}\n`;  // ✅ SIZE
        text += `Qty: ${qty} x ₹${price} = ₹${itemTotal}\n`;  // ✅ QTY
        text += `Link: ${BASE_URL}/product.html?id=${item.id}\n\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `*Grand Total: ₹${total}*\n`;
    text += `Shop: ${BASE_URL}`;

    // WhatsApp pe bhejo - Error proof
    if (navigator.share) {
        navigator.share({ 
            title: "My Cart - SANTRA MALL", 
            text: text 
        }).catch(err => {
            console.log('Share cancelled, using WhatsApp:', err);
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    
    showToast('✅ Opening WhatsApp...');
}

// ✅ 2. SINGLE PRODUCT SHARE - Cart me har item ke neeche wala blue Share button
function shareSingleProduct(productId) {
    let cartKey = getCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    let item = cart.find(p => p.id === productId);
    
    if (!item) {
        showToast("❌ Product not found in cart!", true);
        return;
    }
    
    let size = item.size || item.variant || 'M';
    let qty = parseInt(item.qty) || 1;
    let price = parseFloat(item.price) || 0;
    
    let text = `🛍️ *SANTRA MALL* 🛍️\n\n`;
    text += `*${item.name || 'Product'}*\n`;
    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `Size: ${size}\n`;  // ✅ SIZE FIX
    text += `Qty: ${qty}\n`;    // ✅ QTY FIX
    text += `Price: ₹${price}\n`;
    text += `Total: ₹${price * qty}\n\n`;
    text += `🔗 Order Now: ${BASE_URL}/product.html?id=${item.id}\n\n`;
    text += `Visit: ${BASE_URL}`;
    
    // WhatsApp pe bhejo - Error proof
    if (navigator.share) {
        navigator.share({ 
            title: item.name, 
            text: text 
        }).catch(err => {
            console.log('Share cancelled, using WhatsApp:', err);
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    
    showToast('✅ Opening WhatsApp...');
}

// ✅ 3. PRODUCT PAGE SE DIRECT SHARE - For product.html
function shareProductDirect(product) {
    if (!product ||!product.id) {
        showToast("❌ Product data missing!", true);
        return;
    }
    
    let text = `🛍️ *SANTRA MALL* 🛍️\n\n`;
    text += `*${product.name || 'Product'}*\n`;
    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `Price: ₹${product.price || 0}\n`;
    if(product.mrp > product.price) {
        let off = Math.round((1 - product.price/product.mrp) * 100);
        text += `MRP: ₹${product.mrp} (${off}% OFF)\n`;
    }
    text += `\n🔗 Buy Now: ${BASE_URL}/product.html?id=${product.id}\n\n`;
    text += `Visit: ${BASE_URL}`;
    
    if (navigator.share) {
        navigator.share({ 
            title: product.name, 
            text: text 
        }).catch(err => {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
}

// ✅ 4. Share buttons auto add - for home page
function addShareButtons() {
    console.log("✅ Share buttons ready, CART_KEY:", getCartKey());
}

// Export for module use
export const shareMyCart = shareCart;
export const shareSingleProductExport = shareSingleProduct;
export const shareProductDirectExport = shareProductDirect;

// Make globally available
window.shareCart = shareCart;
window.shareSingleProduct = shareSingleProduct;
window.shareProductDirect = shareProductDirect;

// ✅ Auto load - common.js ke baad chalega
document.addEventListener('DOMContentLoaded', () => {
    addShareButtons();
    console.log('✅ share.js loaded, CART_KEY:', getCartKey());
});
