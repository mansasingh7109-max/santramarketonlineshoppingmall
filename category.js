/*
⚠️ OLD CODE BACKUP - 29-JUNE-2026 SE PEHLE WALA
⚠️ Tera purana code yahan save hai

// ==================== CATEGORY.JS - UNIVERSAL CATEGORY HANDLER ====================
// 29-JUNE-2026 02:40 PM - OLD LAYOUT COMPATIBLE
// index.html, category.html dono me chalega - Layout nahi todega

let allCategories = [];
let allProductsForCategory = [];

// ✅ LOAD CATEGORIES - index.html ke dropdown + category.html page dono ke liye
window.loadCategories = async function() {
    try {
        allProductsForCategory = [];
        const productIds = new Set();

        // RTDB se
        if (typeof rtdb!== 'undefined') {
            const rtdbSnap = await rtdb.ref("products").once("value");
            if (rtdbSnap.exists()) {
                rtdbSnap.forEach(child => {
                    if (!productIds.has(child.key)) {
                        allProductsForCategory.push({ id: child.key,...child.val(), dbType: 'rtdb' });
                        productIds.add(child.key);
                    }
                });
            }
        }

        // Firestore se
        if (typeof db!== 'undefined') {
            const firestoreSnap = await db.collection("products").get();
            firestoreSnap.forEach(doc => {
                if (!productIds.has(doc.id)) {
                    allProductsForCategory.push({ id: doc.id,...doc.data(), dbType: 'firestore' });
                    productIds.add(doc.id);
                }
            });
        }

        // Unique categories nikalo
        allCategories = [...new Set(allProductsForCategory.map(p => p.category).filter(Boolean))];

        // ✅ Agar index.html hai to dropdown fill karo - LAYOUT SAFE
        const select = document.getElementById("categoryFilter");
        if(select) {
            select.innerHTML = '<option value="">All Categories</option>' +
                allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        // ✅ Agar category.html hai to grid render karo - SIRF category.html me
        const container = document.getElementById("categoryContainer");
        if(container) {
            renderCategoryGrid();
        }

    } catch (error) {
        console.error("Category load error:", error);
        const container = document.getElementById("categoryContainer");
        if(container) container.innerHTML = `<div class="empty">❌ Error: ${error.message}</div>`;
    }
}

OLD CODE BACKUP END
*/

// ==================== CATEGORY.JS - UNIVERSAL CATEGORY HANDLER - UPDATED 15 JULY 2026 ====================
// ✅ CONSTANTS.JS + COMMON.JS SUPPORT + FIREBASE READY EVENT
// index.html, category.html dono me chalega - Layout nahi todega

// ✅ NAYA: Constants se keys lo
const CART_KEY = window.CART_KEY || "santraMallCart_v2";
const MYCHOICE_KEY = window.MYCHOICE_KEY || "santraMallMyChoice_v2";
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

console.log('✅ category.js loaded - CART_KEY:', CART_KEY);

let allCategories = [];
let allProductsForCategory = [];
let firebaseReady = false;

// ✅ Firebase ready hone ka wait karo - common.js se aayega
window.addEventListener('firebaseReady', function() {
  firebaseReady = true;
  console.log('✅ Firebase ready in category.js');
  setTimeout(loadCategories, 100);
});

// ✅ Agar Firebase pehle se ready hai
if (window.db && window.auth) {
  firebaseReady = true;
  setTimeout(loadCategories, 300);
}

// ✅ LOAD CATEGORIES - index.html ke dropdown + category.html page dono ke liye
window.loadCategories = async function() {
    try {
        // Firebase ready check
        if (!firebaseReady) {
            console.log('⏳ Waiting for Firebase...');
            return;
        }

        allProductsForCategory = [];
        const productIds = new Set();

        // RTDB se - common.js se rtdb aayega
        if (typeof firebase!== 'undefined' && firebase.database) {
            const rtdb = firebase.database();
            const rtdbSnap = await rtdb.ref("products").once("value");
            if (rtdbSnap.exists()) {
                rtdbSnap.forEach(child => {
                    if (!productIds.has(child.key)) {
                        const p = child.val();
                        allProductsForCategory.push({
                            id: child.key,
                           ...p,
                            dbType: 'rtdb',
                            price: parseFloat(p.price) || 0,
                            stock: parseInt(p.stock) || 0
                        });
                        productIds.add(child.key);
                    }
                });
            }
        }

        // Firestore se - common.js se db aayega
        if (window.db) {
            const firestoreSnap = await window.db.collection("products").get();
            firestoreSnap.forEach(doc => {
                if (!productIds.has(doc.id)) {
                    const p = doc.data();
                    allProductsForCategory.push({
                        id: doc.id,
                       ...p,
                        dbType: 'firestore',
                        price: parseFloat(p.price) || 0,
                        stock: parseInt(p.stock) || 0
                    });
                    productIds.add(doc.id);
                }
            });
        }

        // Unique categories nikalo - stock wale products se
        allCategories = [...new Set(
            allProductsForCategory
               .filter(p => p.category && p.stock > 0)
               .map(p => p.category)
        )].sort();

        console.log('✅ Categories loaded:', allCategories.length, 'Products:', allProductsForCategory.length);

        // ✅ Agar index.html hai to dropdown fill karo - LAYOUT SAFE
        const select = document.getElementById("categoryFilter");
        if(select) {
            select.innerHTML = '<option value="">All Categories</option>' +
                allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

            // URL se category select karo
            const urlParams = new URLSearchParams(window.location.search);
            const catParam = urlParams.get('category');
            if(catParam) {
                select.value = decodeURIComponent(catParam);
                if(typeof applyFilters === 'function') applyFilters();
            }
        }

        // ✅ Agar category.html hai to grid render karo - SIRF category.html me
        const container = document.getElementById("categoryContainer");
        if(container) {
            renderCategoryGrid();
        }

    } catch (error) {
        console.error("Category load error:", error);
        const container = document.getElementById("categoryContainer");
        if(container) container.innerHTML = `<div class="empty">❌ Error: ${error.message}</div>`;
    }
}

// ✅ RENDER CATEGORY GRID - SIRF category.html ke liye - index.html ko touch nahi karega
function renderCategoryGrid() {
    const container = document.getElementById("categoryContainer");
    if (!container) return; // ✅ index.html me nahi chalega

    if (allCategories.length === 0) {
        container.innerHTML = `<div class="empty">😔 No categories found</div>`;
        return;
    }

    container.innerHTML = allCategories.map(cat => {
        const count = allProductsForCategory.filter(p => p.category === cat && p.stock > 0).length;
        const catProduct = allProductsForCategory.find(p => p.category === cat && p.stock > 0);
        const catImage = catProduct?.image || catProduct?.imageUrl || catProduct?.images?.[0] || 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(cat);
        return `
        <div class="category-card" onclick="openCategoryProducts('${cat}')">
            <img src="${catImage}" class="cat-img" onerror="this.src='https://via.placeholder.com/200x200?text=${encodeURIComponent(cat)}'" alt="${cat}">
            <div class="cat-name">${cat}</div>
            <div class="cat-count">${count} Products</div>
        </div>`;
    }).join('');
}

// ✅ OPEN CATEGORY - index.html pe filter lagake bhejo
window.openCategoryProducts = function(category) {
    window.location.href = `${BASE_URL}/index.html?category=${encodeURIComponent(category)}`;
}

// ✅ APPLY FILTER - index.html ke liye - OLD LAYOUT SAFE
window.applyFilters = function() {
    const category = document.getElementById("categoryFilter");
    if (!category) return; // ✅ index.html me nahi hai to return

    const categoryValue = category.value;
    if (typeof filteredProducts!== 'undefined' && typeof allProducts!== 'undefined') {
        if (!categoryValue) {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(p => p.category === categoryValue);
        }
        if(typeof renderProducts === 'function') renderProducts();

        // ✅ Update URL without reload
        const url = new URL(window.location);
        if(categoryValue) {
            url.searchParams.set('category', categoryValue);
        } else {
            url.searchParams.delete('category');
        }
        window.history.replaceState({}, '', url);
    }
}

// ✅ CLEAR FILTER - index.html ke liye - OLD LAYOUT SAFE
window.clearFilters = function() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    if(searchInput) searchInput.value = "";
    if(categoryFilter) categoryFilter.value = "";

    if (typeof filteredProducts!== 'undefined' && typeof allProducts!== 'undefined') {
        filteredProducts = [...allProducts];
        if(typeof renderProducts === 'function') renderProducts();
    }
    // URL se category hatao
    window.history.replaceState({}, document.title, window.location.pathname);
    santraToast('✅ Filters cleared');
}

// ✅ Auto load - common.js ke baad chalega
document.addEventListener('DOMContentLoaded', function() {
    // Agar Firebase already ready hai to load karo
    if (firebaseReady) {
        loadCategories();
    }
});

console.log("✅ category.js loaded - 15 JULY 2026 - CONSTANTS.JS + COMMON.JS SUPPORT");