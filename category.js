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
        if (typeof rtdb !== 'undefined') {
            const rtdbSnap = await rtdb.ref("products").once("value");
            if (rtdbSnap.exists()) {
                rtdbSnap.forEach(child => {
                    if (!productIds.has(child.key)) {
                        allProductsForCategory.push({ id: child.key, ...child.val(), dbType: 'rtdb' });
                        productIds.add(child.key);
                    }
                });
            }
        }

        // Firestore se
        if (typeof db !== 'undefined') {
            const firestoreSnap = await db.collection("products").get();
            firestoreSnap.forEach(doc => {
                if (!productIds.has(doc.id)) {
                    allProductsForCategory.push({ id: doc.id, ...doc.data(), dbType: 'firestore' });
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

// ✅ RENDER CATEGORY GRID - SIRF category.html ke liye - index.html ko touch nahi karega
function renderCategoryGrid() {
    const container = document.getElementById("categoryContainer");
    if (!container) return; // ✅ index.html me nahi chalega

    if (allCategories.length === 0) {
        container.innerHTML = `<div class="empty">😔 No categories found</div>`;
        return;
    }

    container.innerHTML = allCategories.map(cat => {
        const count = allProductsForCategory.filter(p => p.category === cat).length;
        const catProduct = allProductsForCategory.find(p => p.category === cat);
        const catImage = catProduct?.image || catProduct?.images?.[0] || 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(cat);
        return `
        <div class="category-card" onclick="openCategoryProducts('${cat}')">
            <img src="${catImage}" class="cat-img" onerror="this.src='https://via.placeholder.com/200x200?text=${encodeURIComponent(cat)}'">
            <div class="cat-name">${cat}</div>
            <div class="cat-count">${count} Products</div>
        </div>`;
    }).join('');
}

// ✅ OPEN CATEGORY - index.html pe filter lagake bhejo
window.openCategoryProducts = function(category) {
    window.location.href = `index.html?category=${encodeURIComponent(category)}`;
}

// ✅ APPLY FILTER - index.html ke liye - OLD LAYOUT SAFE
window.applyFilters = function() {
    const category = document.getElementById("categoryFilter");
    if (!category) return; // ✅ index.html me nahi hai to return
    
    const categoryValue = category.value;
    if (typeof filteredProducts !== 'undefined' && typeof allProducts !== 'undefined') {
        if (!categoryValue) {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(p => p.category === categoryValue);
        }
        if(typeof renderProducts === 'function') renderProducts();
    }
}

// ✅ CLEAR FILTER - index.html ke liye - OLD LAYOUT SAFE
window.clearFilters = function() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    if(searchInput) searchInput.value = "";
    if(categoryFilter) categoryFilter.value = "";

    if (typeof filteredProducts !== 'undefined' && typeof allProducts !== 'undefined') {
        filteredProducts = [...allProducts];
        if(typeof renderProducts === 'function') renderProducts();
    }
    // URL se category hatao
    window.history.replaceState({}, document.title, window.location.pathname);
}

// ✅ Auto load - Sirf dropdown/grid fill karega, layout nahi chhedega
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadCategories, 300);
});