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
// ✅ OLD BACKUP SAFE + DELIVERY FORM POPUP - Name, Mobile, Email, Address + share-otp-verify.html + orders.html FINAL
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

// ✅ NEW - CUSTOMER DELIVERY FORM POPUP - Sirf 4 field - Name, Mobile, Email, Address - FINAL
var showDeliveryFormPopup = function(cart, callback){
    // Agar pehle se popup hai to hata do
    let oldPopup = document.getElementById('santra_delivery_popup');
    if(oldPopup) oldPopup.remove();

    let savedName = localStorage.getItem('santra_customer_name') || '';
    let savedMobile = localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
    let savedEmail = localStorage.getItem('santra_customer_email') || '';
    let savedAddr = localStorage.getItem('santra_customer_addr') || '';

    let popupHTML = `
    <div id="santra_delivery_popup" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999999;display:flex;align-items:center;justify-content:center;padding:15px">
      <div style="background:white;width:100%;max-width:400px;border-radius:16px;padding:18px;box-shadow:0 10px 30px rgba(0,0,0,0.3)">
        <h3 style="margin:0 0 12px;color:#e40046;text-align:center">📝 Delivery Details - FINAL orders.html</h3>
        <div style="font-size:11px;color:#666;text-align:center;margin-bottom:10px">Old Code Safe - share-otp-verify.html + orders.html</div>
        <input id="popup_name" placeholder="👤 Full Name *" value="${savedName}" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #ddd;border-radius:10px;font-size:14px">
        <input id="popup_mobile" placeholder="📱 Mobile 10 digit *" value="${savedMobile}" type="tel" maxlength="10" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #e40046;border-radius:10px;font-size:14px">
        <input id="popup_email" placeholder="📧 Email (optional)" value="${savedEmail}" type="email" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #ddd;border-radius:10px;font-size:14px">
        <textarea id="popup_address" placeholder="📍 Full Address - House No, Street, City *" style="width:100%;padding:12px;margin:6px 0;border:1.5px solid #ddd;border-radius:10px;font-size:14px;min-height:70px">${savedAddr}</textarea>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button id="popup_cancel" style="flex:1;padding:12px;background:#e5e7eb;border:none;border-radius:10px;font-weight:bold">❌ Cancel</button>
          <button id="popup_submit" style="flex:2;padding:12px;background:#e40046;color:white;border:none;border-radius:10px;font-weight:bold">✅ Save & Share - Verify</button>
        </div>
        <div style="font-size:10px;color:#999;text-align:center;margin-top:8px">Mobile se hi orders.html?mobile= pe OTP Box dikhega - Bina Login bhi - 4h Active</div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    document.getElementById('popup_cancel').onclick = function(){
        document.getElementById('santra_delivery_popup').remove();
    };
    document.getElementById('popup_submit').onclick = function(){
        let name = document.getElementById('popup_name').value.trim();
        let mobile = document.getElementById('popup_mobile').value.trim().replace(/\D/g,'').slice(-10);
        let email = document.getElementById('popup_email').value.trim();
        let address = document.getElementById('popup_address').value.trim();

        if(!name) return alert('Name likho');
        if(!mobile || mobile.length!=10) return alert('10 digit mobile likho - Isi pe OTP ayega - orders.html pe');
        if(!address) return alert('Address likho');

        // Save for next time
        localStorage.setItem('santra_customer_name', name);
        localStorage.setItem('santra_mobile', mobile);
        localStorage.setItem('customer_mobile', mobile);
        localStorage.setItem('santra_customer_email', email);
        localStorage.setItem('santra_customer_addr', address);

        document.getElementById('santra_delivery_popup').remove();
        callback({name:name, mobile:mobile, email:email, address:address});
    };
};

// ✅ NEW UPDATE 16 JULY 2026 - share-otp-verify.html se connect - Old save ke saath
var goToVerifyPage = function(orderId, mobile, via, refAdmin, source) {
    const mob = (mobile||'').toString().replace(/\D/g,'').slice(-10) || localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
    const ref = refAdmin || '8769171078';
    const v = via || 'share_link';
    const src = source || 'share_js';
    const verifyUrl = `share-otp-verify.html?mobile=${mob}&orderId=${orderId}&via=${v}&ref=${ref}&source=${src}&file=share-otp-verify.html&final=orders.html`;
    window.location.href = verifyUrl;
};

// ✅ 1. SEND ORDER - WITH DELIVERY FORM POPUP + CART CLEAR + share-otp-verify.html Formality - FINAL orders.html
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

    // ✅ Pehle Delivery Form dikhao - Name, Mobile, Email, Address - Final
    showDeliveryFormPopup(cart, async function(customer){
        let orderId = "SM" + Date.now();
        let dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        let mobile = customer.mobile;
        let name = customer.name;
        let email = customer.email;
        let address = customer.address;

        // ✅ Firestore + RTDB me save - Mobile ke saath - admin-orders-all.html me dikhega SeriesNo ke saath
        try {
            if(typeof firebase!== 'undefined'){
                // RTDB - Main orders
                if(firebase.database){
                    await firebase.database().ref('orders/'+orderId).set({
                        id: orderId,
                        ono: orderId,
                        customer: {m: mobile, n: name, addr: address, email: email},
                        customerMobile: mobile,
                        mobile: mobile,
                        customerName: name,
                        total: cart.reduce((s,it)=>s+(parseFloat(it.price||0)*(it.qty||1)),0),
                        totalAmount: cart.reduce((s,it)=>s+(parseFloat(it.price||0)*(it.qty||1)),0),
                        items: cart,
                        date: new Date().toISOString(),
                        createdAt: Date.now(),
                        status: 'Pending',
                        paymentMode: 'COD',
                        message: `Name: ${name}, Mobile: ${mobile}, Email: ${email}, Address: ${address}`,
                        orderMessage: `Name: ${name}, Mobile: ${mobile}, Email: ${email}, Address: ${address}`,
                        adminMessage: '',
                        via: 'share_link',
                        refAdmin: '8769171078',
                        source: 'share_js_shareCart',
                        otpVerified: false,
                        file: 'share-otp-verify.html',
                        finalFile: 'orders.html'
                    });
                }
                // Firestore
                if(firebase.firestore) {
                    await firebase.firestore().collection('orders').doc(orderId).set({
                        orderId: orderId,
                        customerMobile: mobile,
                        mobile: mobile,
                        customerName: name,
                        customerEmail: email,
                        customerAddress: address,
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
                        orderMessage: `Name: ${name}, Mobile: ${mobile}, Address: ${address}`
                    }, {merge:true});
                }
            }
        } catch(e){ console.log('Save skip', e.message); }

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
            let nameP = item.name || item.productName || 'Product';
            let cleanId = (item.id || code || '').toString().split('_')[0].split('-')[0];
            text += `${index + 1}. *${nameP}* - ${BASE_URL}/product.html?id=${cleanId}\n`;
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
        text += `*♦️ Customer Details:*\nName: ${name}\nMobile: ${mobile}\nEmail: ${email||'-'}\nAddress: ${address}\n\n`;
        text += `*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}*\n`;
        text += `*📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL*\n\n`;
        text += `*>> OTP ke bina order confirm nahi hoga - share-otp-verify.html <<*`;

        showToastMsg('✅ Share Cart - Redirect to share-otp-verify.html - FINAL orders.html');

        let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
        window.open(whatsappURL, '_blank');

        setTimeout(function(){
            goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_shareCart');
        }, 800);

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
    });
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

    // Single ke liye bhi form
    showDeliveryFormPopup([item], function(customer){
        let size = item.size || item.variant || 'M';
        let qty = parseInt(item.qty) || 1;
        let price = parseFloat(item.price) || 0;
        let code = item.code || item.id;
        let name = item.name || 'Product';
        let mobile = customer.mobile;
        let orderId = "SM" + Date.now();

        let text = `🛍️ *PRODUCT INQUIRY - SANTRA MALL - FINAL orders.html* 🛍️\n\n*${name}*\n━━━━━━━━━━━━━━━━━━\nSize: ${size}\nQty: ${qty}\nPrice: ₹${price}\nTotal: ₹${price * qty}\nCode: ${code}\n\nCustomer: ${customer.name}, ${mobile}, ${customer.address}\n\n🔗 View: ${BASE_URL}/product.html?id=${item.id}\n\n🔐 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}&via=share_link\n📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL\n\nPlease confirm ✅`;
        let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
        window.open(whatsappURL, '_blank');
        showToastMsg('✅ Single Product - share-otp-verify.html connect - FINAL orders.html');
        setTimeout(()=>{ goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_single'); }, 600);
    });
};

// ✅ 3. PRODUCT PAGE SE DIRECT SHARE - share-otp-verify.html connect
window.shareProductDirect = function(product) {
    if (!product ||!product.id) { showToastMsg("❌ Product data missing!"); return; }
    showDeliveryFormPopup([product], function(customer){
        let price = product.price || 0;
        let mrp = product.mrp || 0;
        let name = product.name || 'Product';
        let code = product.code || product.id;
        let mobile = customer.mobile;
        let orderId = "SM" + Date.now();

        let text = `🛍️ *PRODUCT INQUIRY - SANTRA MALL - FINAL* 🛍️\n\n*${name}*\n━━━━━━━━━━━━━━━━━━\nPrice: ₹${price}\n` + (mrp > price? `MRP: ₹${mrp} (${Math.round((1 - price/mrp) * 100)}% OFF)\n` : ``) + `Code: ${code}\n\nCustomer: ${customer.name}, ${mobile}, ${customer.address}\n\n🔗 Buy Now: ${BASE_URL}/product.html?id=${product.id}\n🔐 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}&via=share_link\n📦 Orders FINAL: ${BASE_URL}/orders.html?mobile=${mobile}\n\nPlease share details ✅`;
        let whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
        window.open(whatsappURL, '_blank');
        showToastMsg('✅ Direct Share - share-otp-verify.html - FINAL orders.html');
        setTimeout(()=>{ goToVerifyPage(orderId, mobile, 'share_link', '8769171078', 'share_js_direct'); }, 600);
    });
};

window.goToOrdersFromShareVerify = function() {
  const params = new URLSearchParams(window.location.search);
  const mobile = params.get('mobile') || document.getElementById('mobileInput')?.value.trim().replace(/\D/g,'').slice(-10) || localStorage.getItem('santra_mobile') || localStorage.getItem('customer_mobile') || '';
  const via = params.get('via') || 'share_link';
  const refAdmin = params.get('ref') || '8769171078';
  const source = params.get('source') || 'share_js';
  const orderId = params.get('orderId') || '';
  window.location.href = `orders.html?mobile=${mobile}&verified=true&via=${via}&ref=${refAdmin}&source=${source}&orderId=${orderId}&file=share-otp-verify.html`;
};

window.sendOrderToAll = window.shareCart;
console.log('✅ share.js FINAL loaded - OLD BACKUP SAFE + Delivery Form Popup Name Mobile Email Address + share-otp-verify.html + orders.html FINAL - 16 July 2026');