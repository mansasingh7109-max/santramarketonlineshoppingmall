/*
⚠️ OLD CODE BACKUP - 09/07/2026 SE PEHLE WALA - SAFE
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

OLD CODE BACKUP END - 09/07/2026 SAFE - KUCH HATAYA NAHI
*/

// ===== SANTRA MALL - SHARE.JS - UPDATED 16 JULY 2026 - FINAL =====
// ✅ OLD BACKUP SAFE + CART CLEAR AFTER SHARE + share-otp-verify.html + orders.html FINAL
// Github: mansasingh7109-max.github.io/santramarketonlineshoppingmall/
// Firebase Customer: santramarketshoppingmall.web.app - FINAL orders.html
// Admin: 8769171078, 9829508335, 9001654667
// File: share-otp-verify.html - Share ki formality puri - Lowercase

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

// ✅ NEW UPDATE 16 JULY 2026 - share-otp-verify.html se connect - Old save ke saath
var goToVerifyPage = function(orderId, mobile, via, refAdmin, source) {
    // Ye function share-otp-verify.html pe bhejega - orders.html final me dikhega
    // File name: share-otp-verify.html - lowercase - FINAL
    const mob = (mobile||'').toString().replace(/\D/g,'').slice(-10) || localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
    const ref = refAdmin || '8769171078';
    const v = via || 'share_link';
    const src = source || 'share_js';
    // FINAL orders.html pe jayega verify ke baad
    const verifyUrl = `share-otp-verify.html?mobile=${mob}&orderId=${orderId}&via=${v}&ref=${ref}&source=${src}&file=share-otp-verify.html&final=orders.html`;
    window.location.href = verifyUrl;
};

// ✅ 1. SEND ORDER - WITH CART CLEAR + share-otp-verify.html Formality - FINAL orders.html
window.shareCart = function() {
    let cartKey = getCartKey();
    let raw = localStorage.getItem(cartKey) || localStorage.getItem('cart') || localStorage.getItem('santra_cart') || "[]";
    let cart = [];
    try {
        let parsed = JSON.parse(raw);
        cart = Array.isArray(parsed)? parsed : Object.values(parsed);
    } catch(e) { cart = []; }

    if (cart.length === 0) {
        showToastMsg("❌ Cart is empty!");
        return;
    }

    let orderId = "SM" + Date.now();
    let dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    let mobile = localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';

    // ✅ NEW - Firestore me temp order save - share-otp-verify.html se connect - Past Present Future
    try {
        if(typeof firebase!== 'undefined' && firebase.firestore) {
            firebase.firestore().collection('orders').doc(orderId).set({
                orderId: orderId,
                customerMobile: mobile,
                mobile: mobile,
                items: cart,
                total: cart.reduce((s,it)=>s+(parseFloat(it.price||0)*(it.qty||1)),0),
                via: 'share_link',
                source: 'share_js_shareCart',
                refAdmin: '8769171078',
                status: 'Pending - Redirect to share-otp-verify.html',
                date: new Date().toISOString(),
                dateStr: dateStr,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                file: 'share-otp-verify.html',
                finalFile: 'orders.html',
                website: 'santramarketshoppingmall.web.app',
                github: 'mansasingh7109-max.github.io/santramarketonlineshoppingmall/'
            }, {merge:true});
        }
    } catch(e){ console.log('Firestore save skip', e.message); }

    let text = `🛒 *NEW ORDER - SANTRA MALL - FINAL orders.html* 🛒\n`;
    text += `Order ID: ${orderId}\n`;
    text += `Date: ${dateStr}\n`;
    text += `Via: Share Cart -> share-otp-verify.html -> orders.html FINAL\n`;
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
        let cleanId = (item.id || code || '').toString().split('_')[0].split('-')[0];
        text += `${index + 1}. *${name}* - ${BASE_URL}/product.html?id=${cleanId}\n`;
        text += `Size: ${size}\n`;
        text += `Qty: ${qty} x ₹${price} = ₹${itemTotal}\n`;
        text += `Code: ${code}\n\n`;
    });

    let delivery = subtotal >= 500? 0 : 49;
    let grandTotal = subtotal + delivery;

    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `*Subtotal: ₹${subtotal}*\n`;
    text += `*Delivery: ${delivery === 0? "FREE" : "₹" + delivery}*\n`;
    text += `*🧾 GRAND TOTAL: ₹${grandTotal}*\n`;
    text += `━━━━━━━━━━━━━━━━━━\n\n`;
    text += `*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}*\n`;
    text += `*📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL*\n\n`;
    text += `*>> OTP ke bina order confirm nahi hoga - share-otp-verify.html <<*`;

    // ✅ NEW - Pehle verify page pe bhejo - Formality puri - Old WhatsApp bhi saath me
    showToastMsg('✅ Share Cart - Redirect to share-otp-verify.html - FINAL orders.html');

    // WhatsApp bhi open + Verify page bhi - Dono - Ecommerce jaisa
    let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');

    setTimeout(function(){
        goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_shareCart');
    }, 800);

    // ✅ FINAL - Cart Clear for New Products - Only 1 time - Old code save
    setTimeout(function(){
        localStorage.removeItem("santraMallCart_v2");
        localStorage.removeItem("cart");
        localStorage.removeItem("santra_cart");
        localStorage.removeItem(window.CART_KEY || "santraMallCart_v2");
        if(window.cart) window.cart = {};
        if(typeof renderCart === 'function') renderCart();
        if(typeof updateCartBadge === 'function') updateCartBadge();
        if(typeof renderOrderSummary === 'function') renderOrderSummary();
        console.log("✅ Cart cleared - FINAL orders.html - share-otp-verify.html connect");
    }, 1200);
};

// ✅ 2. SINGLE PRODUCT SHARE - NO CART CLEAR - share-otp-verify.html connect
window.shareSingleProduct = function(productId) {
    let cartKey = getCartKey();
    let raw = localStorage.getItem(cartKey) || localStorage.getItem('cart') || localStorage.getItem('santra_cart') || "[]";
    let cart = [];
    try {
        let parsed = JSON.parse(raw);
        cart = Array.isArray(parsed)? parsed : Object.values(parsed);
    } catch(e) { cart = []; }
    let item = cart.find(function(p) { return p.id === productId || p.code === productId; });
    if (!item) { showToastMsg("❌ Product not found!"); return; }
    let size = item.size || item.variant || 'M';
    let qty = parseInt(item.qty) || 1;
    let price = parseFloat(item.price) || 0;
    let code = item.code || item.id;
    let name = item.name || 'Product';
    let mobile = localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
    let orderId = "SM" + Date.now();

    let text = `🛍️ *PRODUCT INQUIRY - SANTRA MALL - FINAL orders.html* 🛍️\n\n*${name}*\n━━━━━━━━━━━━━━━━━━\nSize: ${size}\nQty: ${qty}\nPrice: ₹${price}\nTotal: ₹${price * qty}\nCode: ${code}\n\n🔗 View: ${BASE_URL}/product.html?id=${item.id}\n\n🔐 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}&via=share_link\n📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL\n\nPlease confirm ✅`;
    let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
    showToastMsg('✅ Single Product - share-otp-verify.html connect - FINAL orders.html');
    setTimeout(()=>{ goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_single'); }, 600);
};

// ✅ 3. PRODUCT PAGE SE DIRECT SHARE - share-otp-verify.html connect
window.shareProductDirect = function(product) {
    if (!product ||!product.id) { showToastMsg("❌ Product data missing!"); return; }
    let price = product.price || 0;
    let mrp = product.mrp || 0;
    let name = product.name || 'Product';
    let code = product.code || product.id;
    let mobile = localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
    let orderId = "SM" + Date.now();

    let text = `🛍️ *PRODUCT INQUIRY - SANTRA MALL - FINAL* 🛍️\n\n*${name}*\n━━━━━━━━━━━━━━━━━━\nPrice: ₹${price}\n` + (mrp > price? `MRP: ₹${mrp} (${Math.round((1 - price/mrp) * 100)}% OFF)\n` : ``) + `Code: ${code}\n\n🔗 Buy Now: ${BASE_URL}/product.html?id=${product.id}\n🔐 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}&via=share_link\n📦 Orders FINAL: ${BASE_URL}/orders.html?mobile=${mobile}\n\nPlease share details ✅`;
    let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
    showToastMsg('✅ Direct Share - share-otp-verify.html - FINAL orders.html');
    setTimeout(()=>{ goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_direct'); }, 600);
};

// ✅ NEW - share-otp-verify.html ke liye goToOrders - FINAL orders.html pe bheje - Tera pucha hua function
window.goToOrdersFromShareVerify = function() {
  const params = new URLSearchParams(window.location.search);
  const mobile = params.get('mobile') || document.getElementById('mobileInput')?.value.trim().replace(/\D/g,'').slice(-10) || localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
  const via = params.get('via') || 'share_link';
  const refAdmin = params.get('ref') || '8769171078';
  const source = params.get('source') || 'share_js';
  const orderId = params.get('orderId') || '';
  // FINAL orders.html - Past Present Future + 4h OTP
  window.location.href = `orders.html?mobile=${mobile}&verified=true&via=${via}&ref=${refAdmin}&source=${source}&orderId=${orderId}&file=share-otp-verify.html`;
};

window.sendOrderToAll = window.shareCart;
console.log('✅ share.js FINAL loaded - OLD BACKUP SAFE + share-otp-verify.html + orders.html FINAL - 16 July 2026');