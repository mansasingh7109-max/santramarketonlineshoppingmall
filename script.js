/*
⚠️ OLD CODE BACKUP - 13 JUNE 2026 WALA - SAVE HIDE
⚠️ Tera purana code yahan safe hai

const WISHLIST_KEY = "SANTRA_WISHLIST";
const CART_KEY = "SANTRA_CART";
const YOU_CHOOSE_KEY = "SANTRA_YOUCHOOSE";
let allProducts = [];
let SANTRA_DB = JSON.parse(localStorage.getItem("SANTRA_DB")) || {...};

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - FINAL script.js - 15 JULY 2026 =====
// ✅ CONSTANTS.JS SUPPORT + NO DOUBLE + CART FIX

// 1. ✅ KEYS - constants.js se lo - Double nahi hoga
if (typeof WISHLIST_KEY === 'undefined') {
  var WISHLIST_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
}
if (typeof CART_KEY === 'undefined') {
  var CART_KEY = window.CART_KEY || "santraMallCart_v2";
}
if (typeof YOU_CHOOSE_KEY === 'undefined') {
  var YOU_CHOOSE_KEY = "SANTRA_YOUCHOOSE";
}
if (typeof MYCHOICE_KEY === 'undefined') {
  var MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
}

let allProducts = [];
let SANTRA_DB = JSON.parse(localStorage.getItem("SANTRA_DB")) || JSON.stringify({
    settings: {
        helpdeskPhone: "8769171078",
        helpdeskWhatsapp: "8769171078",
        helpdeskEmail: "santramarketshoppingmall@gmail.com",
        helpdeskEmail2: "mansasingh7109@gmail.com"
    },
    orders: [],
    products: [],
    backups: []
});
try { SANTRA_DB = JSON.parse(localStorage.getItem("SANTRA_DB")) || SANTRA_DB; } catch(e){}

// 2. Firebase wait
function waitForFirebase() {
    if (typeof firebase !== "undefined" && firebase.apps.length > 0) {
        // ✅ Double init roko
        if (!window.db) window.db = firebase.firestore();
        if (!window.auth) window.auth = firebase.auth();
        console.log("✅ Firebase Connected:", window.masterConfig?.projectId || "santramarketshoppingmall");
        startApp();
    } else {
        console.log("⏳ Waiting for Firebase...");
        setTimeout(waitForFirebase, 100);
    }
}

// 3. App start
function startApp() {
    createAutoBackup();
    setupFirebaseListeners();
    updateCartCount();
    updateWishlistCount();
    const customer = localStorage.getItem("santra_customer");
    if (customer) {
        try {
          const custData = JSON.parse(customer);
          let el = document.getElementById("userInfo");
          if(el){ el.innerText = `Hi, ${custData.name}`; el.classList.remove("hide"); }
          let loginBtn = document.getElementById("loginBtn");
          if(loginBtn) loginBtn.classList.add("hide");
          let logoutBtn = document.getElementById("logoutBtn");
          if(logoutBtn) logoutBtn.classList.remove("hide");
        } catch(e){}
    }
    console.log("✅ SANTRA MALL Loaded - CART_KEY:", CART_KEY);
}

// ... Baaki ke saare functions same rahenge - sirf CART_KEY use hoga
// 4. Firebase Listeners
function setupFirebaseListeners() {
    if(!window.db) return;
    window.db.collection("settings").doc("theme").onSnapshot(docSnap => {
        if (docSnap.exists) {
            const t = docSnap.data();
            if (t.accentColor) document.documentElement.style.setProperty("--accent", t.accentColor);
            if (t.bgColor) document.documentElement.style.setProperty("--bg", t.bgColor);
            if (t.cardColor) document.documentElement.style.setProperty("--card", t.cardColor);
            if (t.textColor) document.documentElement.style.setProperty("--text", t.textColor);
            let logo = document.getElementById("logoText");
            if (t.logoText && logo) logo.innerText = t.logoText;
        }
    });

    window.db.collection("products").onSnapshot(snapshot => {
            window.allProductsCache = [];
            snapshot.forEach(doc => {
                let product = { id: doc.id, ...doc.data() };
                window.allProductsCache.push(product);
            });
            loadProducts();
        }, error => {
            console.error("Firebase Error:", error);
            window.allProductsCache = SANTRA_DB.products || [];
            loadProducts();
        });

    window.db.collection("categories").onSnapshot(snapshot => {
            window.allCategoriesCache = [];
            snapshot.forEach(doc => { window.allCategoriesCache.push({ id: doc.id, ...doc.data() }); });
            loadCategories();
        }, error => { loadCategories(); });
}

function createAutoBackup() {
    try {
        const backup = { timestamp: new Date().toLocaleString("en-IN"), data: { settings: SANTRA_DB.settings, orders: SANTRA_DB.orders } };
        if (!SANTRA_DB.backups) SANTRA_DB.backups = [];
        SANTRA_DB.backups.unshift(backup);
        if (SANTRA_DB.backups.length > 3) SANTRA_DB.backups.pop();
        localStorage.setItem("SANTRA_DB", JSON.stringify(SANTRA_DB));
    } catch (err) {}
}

function saveSANTRA_DB() {
    try {
        const dbToSave = { settings: SANTRA_DB.settings, orders: SANTRA_DB.orders, backups: SANTRA_DB.backups };
        localStorage.setItem("SANTRA_DB", JSON.stringify(dbToSave));
    } catch (err) {}
}

// ... [Tera baaki ka pura code - addToCart, etc - same rahega] ...
// ✅ IMPORTANT: addToCart me CART_KEY already naya wala use hoga

function addToCart(productId) {
    try {
        let product = allProducts.find(p => String(p.id) === String(productId));
        if (!product) { alert("❌ Product not found!"); return; }
        let stockNum = Number(product.stock) || 0;
        if (stockNum <= 0) {
            alert("❌ Out of Stock!");
            return;
        }
        // ✅ NAYA KEY USE HOGA
        let CART = JSON.parse(localStorage.getItem(CART_KEY) || localStorage.getItem(window.CART_KEY) || "{}");
        // Object ya Array dono handle
        if(Array.isArray(CART)){
          let arr = CART;
          CART = {};
          arr.forEach(it=>{ let id = it.id || productId; CART[id]=it; });
        }
        let item = CART[productId];
        if (item) { item.qty = (item.qty || 1) + 1; } 
        else {
            CART[productId] = {
                id: product.id, name: product.name, price: product.price, mrp: product.mrp, qty: 1,
                image: product.img || product.image, product_code: product.product_code, category: product.category,
                addedAt: Date.now()
            };
        }
        localStorage.setItem(CART_KEY, JSON.stringify(CART));
        localStorage.setItem("cart", JSON.stringify(Object.values(CART)));
        updateCartCount();
        alert(`✅ ${product.name} cart me add ho gaya!`);
    } catch (err) { console.error("Add to cart error:", err); }
}

function updateCartCount() {
    try {
      let CART = JSON.parse(localStorage.getItem(CART_KEY) || localStorage.getItem(window.CART_KEY) || "{}");
      let count = 0;
      if(Array.isArray(CART)) count = CART.reduce((s,i)=>s+(i.qty||1),0);
      else count = Object.values(CART).reduce((sum, item) => sum + (item.qty || 1),0);
      let cartCountEl = document.getElementById("cartCount");
      let navCartCountEl = document.getElementById("navCartCount");
      if (cartCountEl) cartCountEl.innerText = count;
      if (navCartCountEl) { navCartCountEl.innerText = count; navCartCountEl.style.display = count > 0 ? "block" : "none"; }
    } catch(e){}
}

// Baaki functions - loadProducts, renderProducts, wishlist etc same...
function loadProducts(category = null) {
    let products = window.allProductsCache && window.allProductsCache.length > 0 ? window.allProductsCache : SANTRA_DB.products;
    if (category) { products = products.filter(p => (p.category||"").toLowerCase() === category.toLowerCase()); }
    let container = document.getElementById("productGrid") || document.getElementById("productList");
    if (!container) return;
    if (!products || products.length === 0) { container.innerHTML = '<div class="loading">No products found</div>'; return; }
    renderProducts(products);
}
function renderProducts(products){ allProducts = products; /* tera purana render code yahan */ }
// START
document.addEventListener("DOMContentLoaded", waitForFirebase);
document.addEventListener("DOMContentLoaded", function () { updateCartCount(); });