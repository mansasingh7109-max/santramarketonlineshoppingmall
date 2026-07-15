/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA
⚠️ Agar kuch gadbad ho to isko uncomment karke use kar lena

const CART_KEY = "santraMallCart_v2"; // ❌ DUPLICATE ERROR - constants.js me hai
const BASE_URL = "https://santramarketshoppingmall.web.app"; // ❌ DUPLICATE ERROR

function shareCart() {
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (cart.length === 0) {
        alert("❌ Cart is empty!");
        return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - SHARE.JS - UPDATED 16 JULY 2026 =====
// ✅ OLD BACKUP SAFE + CART CLEAR AFTER SHARE

if(!window.BASE_URL) window.BASE_URL = "https://santramarketshoppingmall.web.app";
if(!window.ADMIN_WHATSAPP) window.ADMIN_WHATSAPP = "918769171078";

var BASE_URL = window.BASE_URL;
var ADMIN_WHATSAPP = window.ADMIN_WHATSAPP;

var getCartKey = function() { 
    return window.CART_KEY || "santraMallCart_v2"; 
};

var showToastMsg = function(msg) {
    if(typeof santraToast!== 'undefined') santraToast(msg);
    else if(typeof window.showToast === 'function') window.showToast(msg);
    else console.log(msg);
};

// ✅ 1. SEND ORDER - WITH CART CLEAR AFTER SHARE
window.shareCart = function() {
    let cartKey = getCartKey();
    let raw = localStorage.getItem(cartKey) || localStorage.getItem('cart') || localStorage.getItem('santra_cart') || "[]";
    let cart = [];
    try { 
        let parsed = JSON.parse(raw);
        cart = Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch(e) { cart = []; }

    if (cart.length === 0) {
        showToastMsg("❌ Cart is empty!");
        return;
    }

    let orderId = "SM" + Date.now();
    let dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    let text = `🛒 *NEW ORDER - SANTRA MALL* 🛒\n`;
    text += `Order ID: ${orderId}\n`;
    text += `Date: ${dateStr}\n`;
    text += `━━━━━━━━━━━━━━━━━━\n\n`;
    
    let subtotal = 0;
    cart.forEach(function(item, index) {
        let size = item.size || item.variant || 'M';
        let qty = parseInt(item.qty) || 1;
        let price = parseFloat(item.price) || 0;
        let itemTotal = price * qty;
        subtotal += itemTotal;
        let code = item.code || item.productCode || item.id || 'N/A';
        let name = item.name || item.productName || 'Product';
        let id = item.id || code;
        
        text += `${index + 1}. *${name}*\n`;
        text += `Size: ${size}\n`;
        text += `Qty: ${qty} x ₹${price} = ₹${itemTotal}\n`;
        text += `Code: ${code}\n`;
        text += `Link: ${BASE_URL}/product.html?id=${id}\n\n`;
    });

    let delivery = subtotal >= 500 ? 0 : 49;
    let grandTotal = subtotal + delivery;

    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `*Subtotal: ₹${subtotal}*\n`;
    text += `*Delivery: ${delivery === 0 ? "FREE" : "₹" + delivery}*\n`;
    text += `*🧾 GRAND TOTAL: ₹${grandTotal}*\n`;
    text += `━━━━━━━━━━━━━━━━━━\n\n`;
    text += `*📝 Customer Details:*\nName: ________\nMobile: ________\nAddress: ________\n\nPlease confirm this order ✅\n\n*>> IMPORTANT: PLEASE SEND OTP TO CONFIRM THIS ORDER <<*\n*OTP ke bina order confirm nahi hoga*`;

    let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    
    try {
        window.open(whatsappURL, '_blank');
        showToastMsg('✅ Opening Admin WhatsApp: 8769171078');

        // ✅ FINAL - Cart Clear for New Products - Only 1 time
        setTimeout(function(){
            localStorage.removeItem("santraMallCart_v2");
            localStorage.removeItem("cart");
            localStorage.removeItem("santra_cart");
            localStorage.removeItem(window.CART_KEY || "santraMallCart_v2");
            if(window.cart) window.cart = {};
            if(typeof renderCart === 'function') renderCart();
            if(typeof updateCartBadge === 'function') updateCartBadge();
            if(typeof renderOrderSummary === 'function') renderOrderSummary();
            console.log("✅ Cart cleared for new products");
        }, 1200);

    } catch(err) {
        showToastMsg('❌ Share failed!');
    }
};

// ✅ 2. SINGLE PRODUCT SHARE - NO CART CLEAR
window.shareSingleProduct = function(productId) {
    let cartKey = getCartKey();
    let raw = localStorage.getItem(cartKey) || localStorage.getItem('cart') || localStorage.getItem('santra_cart') || "[]";
    let cart = [];
    try { 
        let parsed = JSON.parse(raw);
        cart = Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch(e) { cart = []; }
    let item = cart.find(function(p) { return p.id === productId || p.code === productId; });
    if (!item) { showToastMsg("❌ Product not found!"); return; }
    let size = item.size || item.variant || 'M';
    let qty = parseInt(item.qty) || 1;
    let price = parseFloat(item.price) || 0;
    let code = item.code || item.id;
    let name = item.name || 'Product';
    let text = `🛍️ *PRODUCT INQUIRY - SANTRA MALL* 🛍️\n\n*${name}*\n━━━━━━━━━━━━━━━━━━\nSize: ${size}\nQty: ${qty}\nPrice: ₹${price}\nTotal: ₹${price * qty}\nCode: ${code}\n\n🔗 View: ${BASE_URL}/product.html?id=${item.id}\n\nCustomer is interested. Please confirm ✅`;
    let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
    showToastMsg('✅ Opening Admin WhatsApp: 8769171078');
};

// ✅ 3. PRODUCT PAGE SE DIRECT SHARE
window.shareProductDirect = function(product) {
    if (!product || !product.id) { showToastMsg("❌ Product data missing!"); return; }
    let price = product.price || 0;
    let mrp = product.mrp || 0;
    let name = product.name || 'Product';
    let code = product.code || product.id;
    let text = `🛍️ *PRODUCT INQUIRY - SANTRA MALL* 🛍️\n\n*${name}*\n━━━━━━━━━━━━━━━━━━\nPrice: ₹${price}\n` + (mrp > price ? `MRP: ₹${mrp} (${Math.round((1 - price/mrp) * 100)}% OFF)\n` : ``) + `Code: ${code}\n\n🔗 Buy Now: ${BASE_URL}/product.html?id=${product.id}\n\nCustomer wants to know more. Please share details ✅`;
    let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
    showToastMsg('✅ Opening Admin WhatsApp: 8769171078');
};

window.sendOrderToAll = window.shareCart;
console.log('✅ share.js FINAL loaded - OLD BACKUP SAFE + CART CLEAR ENABLED');