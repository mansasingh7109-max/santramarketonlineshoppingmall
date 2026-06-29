// ===== SANTRA MALL - LOGIN.JS - UPDATED - 29-JUNE-2026 =====
// ✅ Ab ye file sirf Guest Cart + Helpers ke liye hai
// ✅ Login ab customer-account.html se hoga - popup hata diya

// ✅ Global Keys - Old code safe
const CART_KEY = 'santraMallCart_v2';
const MYCHOICE_KEY = 'santraMallMyChoice_v2';

// ✅ Page Load pe init
document.addEventListener('DOMContentLoaded', function() {
  updateHeader();
  updateCartCount();
  checkCustomerStatus();
});

// ✅ Check Customer Status - Header Update ke liye
function checkCustomerStatus() {
  let customerStr = localStorage.getItem('santra_customer');
  let welcomeEl = document.getElementById('welcomeUser');
  let loginBtn = document.getElementById('loginBtn');
  let logoutBtn = document.getElementById('logoutBtn');
  
  if(customerStr) {
    let customer = JSON.parse(customerStr);
    if(customer.isLoggedIn) {
      if(welcomeEl) welcomeEl.innerText = `Welcome ${customer.name}`;
      if(loginBtn) loginBtn.style.display = 'none';
      if(logoutBtn) logoutBtn.style.display = 'block';
    }
  } else {
    if(welcomeEl) welcomeEl.innerText = 'Welcome Guest';
    if(loginBtn) loginBtn.style.display = 'block';
    if(logoutBtn) logoutBtn.style.display = 'none';
  }
}

// ✅ Header Update Function
function updateHeader() {
  checkCustomerStatus();
}

// ✅ Logout Function - Old code safe
function logout() {
  if(confirm('Logout karna hai?')) {
    localStorage.removeItem('santra_customer');
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem('santrajet_mychoice');
    alert('Logged out successfully');
    location.reload();
  }
}

// ✅ Guest Cart - Login jaruri nahi - Old code safe
function addToCart(productId, name, price, image) {
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  let existing = cart.find(item => item.id === productId);
  
  if(existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: productId, 
      name: name, 
      price: price, 
      image: image, 
      qty: 1
    });
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  showToast('✅ Added to Cart!');
}

// ✅ Cart Count Update - Old code safe
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  
  let cartBadge = document.getElementById('cartCount');
  let cartBadgeBottom = document.getElementById('cartCountBottom');
  
  if(cartBadge) {
    cartBadge.innerText = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
  
  if(cartBadgeBottom) {
    cartBadgeBottom.innerText = count;
  }

  // My Choice Count bhi update karo
  let choiceArray = JSON.parse(localStorage.getItem(MYCHOICE_KEY) || '[]');
  let choiceBadge = document.getElementById('choiceBadge');
  if (choiceBadge) {
    choiceBadge.innerText = choiceArray.length;
    choiceBadge.style.display = choiceArray.length > 0 ? 'flex' : 'none';
  }
}

// ✅ Toast Helper - Old code safe
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 20px;border-radius:8px;z-index:9999;font-size:14px";
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}

// ✅ Open Login - Ab customer-account.html khulega
function openLoginPopup() {
  window.location.href = 'customer-account.html';
}

// ✅ Storage change pe update - Multi tab support
window.addEventListener("storage", function() {
  updateHeader();
  updateCartCount();
});