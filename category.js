/*
⚠️ OLD CODE BACKUP - 29-JUNE-2026 SE PEHLE WALA - SAFE - TERA PURANA CODE YAHAN SAVE HAI

// ==================== CATEGORY.JS - UNIVERSAL CATEGORY HANDLER ====================
// 29-JUNE-2026 02:40 PM - OLD LAYOUT COMPATIBLE
// index.html, category.html dono me chalega - Layout nahi todega

let allCategories = [];
let allProductsForCategory = [];

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

        allCategories = [...new Set(allProductsForCategory.map(p => p.category).filter(Boolean))];

        const select = document.getElementById("categoryFilter");
        if(select) {
            select.innerHTML = '<option value="">All Categories</option>' +
                allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        const container = document.getElementById("categoryContainer");
        if(container) {
            renderCategoryGrid();
        }

    } catch (error) {
        console.error("Category load error:", error);
    }
}

OLD CODE BACKUP END - KUCH HATAYA NAHI
*/

// ==================== CATEGORY.JS - UNIVERSAL - UPDATED 15 JULY 2026 - FINAL ====================
// ✅ TERA FINAL constants.js + config.js FOLLOW - OLD JAISA + NO common.js

// ✅ FIX: Tere constants.js se lo - Fallback ke saath
if(typeof window.CART_KEY === 'undefined'){ window.CART_KEY = "santraMallCart_v2"; }
if(typeof window.MYCHOICE_KEY === 'undefined'){ window.MYCHOICE_KEY = "santraMallMyChoice_v2"; }
if(typeof window.CUSTOMER_KEY === 'undefined'){ window.CUSTOMER_KEY = "santra_customer"; }
if(typeof window.BASE_URL === 'undefined'){ window.BASE_URL = "https://santramarketshoppingmall.web.app"; }
if(typeof window.firebaseConfig === 'undefined'){
  window.firebaseConfig = {
    apiKey: "AIzaSyApXIGoX071cYEvGbfhBF69DB9Kv5YlSMA",
    authDomain: "santramarketshoppingmall.firebaseapp.com",
    projectId: "santramarketshoppingmall",
    databaseURL: "https://santramarketshoppingmall-default-rtdb.firebaseio.com",
    storageBucket: "santramarketshoppingmall.appspot.com",
    messagingSenderId: "398490252924",
    appId: "1:398490252924:web:d1b6348b549183b93b7bf9"
  };
}

// Firebase init - Tere config.js jaisa
try{
  if(typeof window.initFirebaseOnce === 'function'){
    window.initFirebaseOnce(window.firebaseConfig);
  } else if(typeof firebase!== 'undefined' &&!firebase.apps.length){
    firebase.initializeApp(window.firebaseConfig);
  }
}catch(e){ console.log("Firebase init in category.js:", e.message); }

const CART_KEY = window.CART_KEY;
const MYCHOICE_KEY = window.MYCHOICE_KEY;
const CUSTOMER_KEY = window.CUSTOMER_KEY;
const BASE_URL = window.BASE_URL;

console.log('✅ category.js FINAL - CART_KEY:', CART_KEY, 'BASE_URL:', BASE_URL, '- Following YOUR constants.js');

let allCategories = [];
let allProductsForCategory = [];

// ✅ LOAD CATEGORIES - index.html dropdown + category.html grid dono ke liye - OLD JAISA
window.loadCategories = async function() {
    try {
        const db = window.db || (typeof firebase!== 'undefined'? firebase.firestore() : null);
        const rtdb = (typeof firebase!== 'undefined' && firebase.database)? firebase.database() : null;

        if(!db &&!rtdb){
          console.warn("Firebase not ready, retrying...");
          setTimeout(loadCategories, 800);
          return;
        }

        allProductsForCategory = [];
        const productIds = new Set();

        // 1. RTDB se - Pehle jaisa
        if (rtdb) {
            try{
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
            }catch(e){ console.log("RTDB error:", e.message); }
        }

        // 2. Firestore se
        if (db) {
            try{
              const firestoreSnap = await db.collection("products").get();
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
            }catch(e){ console.log("Firestore error:", e.message); }
        }

        // Unique categories - stock wale se - Pehle jaisa
        allCategories = [...new Set(
            allProductsForCategory
              .filter(p => p.category && p.stock > 0)
              .map(p => p.category)
        )].sort();

        console.log('✅ Categories loaded:', allCategories.length, 'Products:', allProductsForCategory.length);

        // ✅ index.html hai toh dropdown fill karo - LAYOUT SAFE - OLD JAISA
        const select = document.getElementById("categoryFilter");
        if(select) {
            select.innerHTML = '<option value="">All Categories</option>' +
                allCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

            const urlParams = new URLSearchParams(window.location.search);
            const catParam = urlParams.get('category');
            if(catParam) {
                select.value = decodeURIComponent(catParam);
                if(typeof applyFilters === 'function') applyFilters();
            }
        }

        // ✅ category.html hai toh grid render karo
        const container = document.getElementById("categoryContainer");
        if(container) {
            renderCategoryGrid();
        }

        // ✅ category.html page ka catList bhi
        const catList = document.getElementById("catList");
        if(catList && allCategories.length>0){
            renderCategoryListForCategoryPage();
        }

    } catch (error) {
        console.error("Category load error:", error);
        const container = document.getElementById("categoryContainer") || document.getElementById("catList");
        if(container) container.innerHTML = `<div class="empty">❌ Error: ${error.message}</div>`;
    }
}

// ✅ category.html ke liye alag render - Pehle jaisa
function renderCategoryListForCategoryPage(){
  const catList = document.getElementById("catList");
  if(!catList) return;
  if (allCategories.length === 0) {
      catList.innerHTML = `<div class="loader">No categories - Admin se add karo</div>`;
      return;
  }
  catList.innerHTML = allCategories.map(cat => {
      const count = allProductsForCategory.filter(p => p.category === cat && p.stock > 0).length;
      const catProduct = allProductsForCategory.find(p => p.category === cat && p.stock > 0);
      const catImage = catProduct?.image || catProduct?.imageUrl || 'https://via.placeholder.com/80?text=' + encodeURIComponent(cat);
      return `
      <div class="cat-card" onclick="showCategoryProducts('${cat}')">
          <img src="${catImage}" onerror="this.src='https://via.placeholder.com/80?text=No+Image'" alt="${cat}">
          <h4>${cat}</h4>
          <p style="font-size:12px;color:#999;">${count} Products</p>
      </div>`;
  }).join('');
}

// ✅ RENDER CATEGORY GRID - index.html ke liye
function renderCategoryGrid() {
    const container = document.getElementById("categoryContainer");
    if (!container) return;

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

window.openCategoryProducts = function(category) {
    window.location.href = `${BASE_URL}/index.html?category=${encodeURIComponent(category)}`;
}

window.applyFilters = function() {
    const category = document.getElementById("categoryFilter");
    if (!category) return;

    const categoryValue = category.value;
    if (typeof filteredProducts!== 'undefined' && typeof allProducts!== 'undefined') {
        if (!categoryValue) {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(p => p.category === categoryValue);
        }
        if(typeof renderProducts === 'function') renderProducts();

        const url = new URL(window.location);
        if(categoryValue) url.searchParams.set('category', categoryValue);
        else url.searchParams.delete('category');
        window.history.replaceState({}, '', url);
    }
}

window.clearFilters = function() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    if(searchInput) searchInput.value = "";
    if(categoryFilter) categoryFilter.value = "";

    if (typeof filteredProducts!== 'undefined' && typeof allProducts!== 'undefined') {
        filteredProducts = [...allProducts];
        if(typeof renderProducts === 'function') renderProducts();
    }
    window.history.replaceState({}, document.title, window.location.pathname);
    if(typeof santraToast === 'function') santraToast('✅ Filters cleared');
    else alert('✅ Filters cleared');
}

// ✅ Auto load - DOMContentLoaded - common.js ka wait nahi
document.addEventListener('DOMContentLoaded', function() {
    // 500ms baad load - Firebase ready hone ka wait
    setTimeout(()=> {
        if(window.loadCategories) window.loadCategories();
    }, 600);
});

// ✅ Agar category.html page pe showCategoryProducts function chahiye
window.showCategoryProducts = window.showCategoryProducts || function(catName){
  window.location.href = `${BASE_URL}/category.html?name=${encodeURIComponent(catName)}`;
};

console.log("✅ category.js FINAL - 15 JULY - Old save + constants.js + Load fix - Pehle jaisa");