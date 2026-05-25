// ===== SANTRA MALL - FINAL script.js =====
// Date: 24-May-2026 - OTP REMOVED + FIREBASE SAFE + CLEAN

// 1. Global Variables
const WISHLIST_KEY = 'SANTRA_WISHLIST';
const CART_KEY = 'SANTRA_CART';

let allProducts = [];
let SANTRA_DB = JSON.parse(localStorage.getItem('SANTRA_DB')) || {
  settings: {
    helpdeskPhone: '9829508335',
    helpdeskWhatsapp: '8769171078',
    helpdeskEmail: 'santramarketshoppingmall@gmail.com',
    helpdeskEmail2: 'mansasingh7109@gmail.com'
  },
  orders: [],
  products: [],
  backups: []
};

// 2. Firebase ke ready hone ka wait karo
function waitForFirebase() {
  if (typeof firebase!== 'undefined' && firebase.apps.length > 0) {
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    console.log('✅ Firebase Connected');
    startApp();
  } else {
    console.log('⏳ Waiting for Firebase...');
    setTimeout(waitForFirebase, 100);
  }
}

// 3. App start karo jab Firebase ready ho
function startApp() {
  createAutoBackup();
  setupFirebaseListeners();
  updateCartCount();
  updateWishlistCount();

  const customer = localStorage.getItem('santra_customer');
  if (customer) {
    const custData = JSON.parse(customer);
    document.getElementById('userInfo').innerText = `Hi, ${custData.name}`;
    document.getElementById('userInfo').classList.remove('hide');
    document.getElementById('loginBtn').classList.add('hide');
    document.getElementById('logoutBtn').classList.remove('hide');
  }
  console.log('✅ SANTRA MALL Loaded');
}

// 4. Firebase Listeners
function setupFirebaseListeners() {
  window.db.collection("settings").doc("theme").onSnapshot((docSnap) => {
    if(docSnap.exists){
      const t = docSnap.data();
      if(t.accentColor) document.documentElement.style.setProperty('--accent', t.accentColor);
      if(t.bgColor) document.documentElement.style.setProperty('--bg', t.bgColor);
      if(t.cardColor) document.documentElement.style.setProperty('--card', t.cardColor);
      if(t.textColor) document.documentElement.style.setProperty('--text', t.textColor);
      if(t.logoText) document.getElementById('logoText').innerText = t.logoText;
    }
  });

  window.db.collection("products").onSnapshot((snapshot) => {
    window.allProductsCache = [];
    snapshot.forEach(doc => {
      let product = { id: doc.id,...doc.data() };
      window.allProductsCache.push(product);
    });
    loadProducts();
  }, (error) => {
    console.error("Firebase Error:", error);
    document.getElementById('productGrid').innerHTML = '<div class="loading">⚠️ Products load nahi hue. Firebase rules check karo.</div>';
    window.allProductsCache = SANTRA_DB.products || [];
    loadProducts();
  });

  window.db.collection("categories").onSnapshot((snapshot) => {
    window.allCategoriesCache = [];
    snapshot.forEach(doc => {
      window.allCategoriesCache.push({ id: doc.id,...doc.data() });
    });
    loadCategories();
  }, (error) => {
    console.error("Categories Error:", error);
    loadCategories();
  });
}

function createAutoBackup() {
  try {
    const backup = {
      timestamp: new Date().toLocaleString('en-IN'),
      data: { settings: SANTRA_DB.settings, orders: SANTRA_DB.orders }
    };
    if (!SANTRA_DB.backups) SANTRA_DB.backups = [];
    SANTRA_DB.backups.unshift(backup);
    if (SANTRA_DB.backups.length > 3) SANTRA_DB.backups.pop();
    localStorage.setItem('SANTRA_DB', JSON.stringify(SANTRA_DB));
    console.log('✅ Auto Backup Created:', backup.timestamp);
  } catch (err) {
    console.error('Backup Error:', err);
  }
}

function saveSANTRA_DB() {
  try {
    const dbToSave = {
      settings: SANTRA_DB.settings,
      orders: SANTRA_DB.orders,
      backups: SANTRA_DB.backups
    };
    localStorage.setItem('SANTRA_DB', JSON.stringify(dbToSave));
  } catch (err) {
    console.error('Save Error:', err);
  }
}

// 5. Category wise serial number
function addSerialNumbers(products) {
  const categoryCount = {};
  return products.map(product => {
    if (!categoryCount[product.category]) {
      categoryCount[product.category] = 1;
    } else {
      categoryCount[product.category]++;
    }
    product.serial = `${product.category}-${categoryCount[product.category]}`;
    product.product_code = product.serial;
    product.product_link = `${window.location.origin}/product.html?id=${product.id}`;
    product.imageUrl = product.img || product.image;
    product.source = product.source || 'firebase';
    return product;
  });
}

window.loadCategories = function(){
  const catContainer = document.getElementById('categoryList');
  if (!catContainer) return;
  catContainer.innerHTML = '';
  if(!window.allCategoriesCache || window.allCategoriesCache.length === 0){
    catContainer.innerHTML = '<p style="padding:20px;color:#999">No categories</p>';
    return;
  }
  window.allCategoriesCache.forEach((cat) => {
    const catName = cat.name || 'Category';
    const catImg = cat.image || cat.img || 'https://via.placeholder.com/50';
    catContainer.innerHTML += `
      <div class="cat-item" onclick="filterByCategory('${catName}')">
        <img src="${catImg}" onerror="this.src='https://via.placeholder.com/50'" alt="${catName}">
        <p>${catName}</p>
      </div>
    `;
  });
}

// 6. Cart Functions
function addToCart(productId) {
  try {
    let product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) {
      alert("❌ Product not found! Page refresh karo.");
      return;
    }

    let stockNum = Number(product.stock) || 0;
    if (stockNum <= 0) {
      alert("❌ Out of Stock! WhatsApp pe order karo.");
      orderOnWhatsApp(productId, product.name, product.price, product.img, product.source, product.product_code, product.product_link);
      return;
    }

    let CART = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    let item = CART.find(i => String(i.id) === String(productId));

    if (item) {
      item.qty = (item.qty || 1) + 1;
    } else {
      CART.push({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        qty: 1,
        image: product.img || product.image,
        imageUrl: product.img || product.image,
        seriesNumber: product.product_code,
        productPageLink: product.product_link,
        product_code: product.product_code,
        product_link: product.product_link,
        category: product.category,
        source: product.source
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(CART));
    updateCartCount();
    alert(`✅ ${product.name} cart me add ho gaya!`);

  } catch (err) {
    console.error('Add to cart error:', err);
    alert('❌ Error: ' + err.message);
  }
}

function updateCartCount() {
  let CART = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  let count = CART.reduce((sum, item) => sum + (item.qty || 1), 0);
  let cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.innerText = count;
}

function buyNow(productId) {
  addToCart(productId);
  window.location.href = 'checkout-v2.html';
}

// 7. WhatsApp Order
function orderOnWhatsApp(productId, productName, productPrice, productImage, source, productCode, productLink) {
  let number = SANTRA_DB.settings?.helpdeskWhatsapp || '8769171078';
  let serial = productCode || 'N/A';
  let link = productLink || `${window.location.origin}/product.html?id=${productId}`;

  const message = `New Order - SANTRA MALL

CUSTOMER PROFILE:
Name: [Apna naam likhe]
Mobile: [Mobile number]
Address: [Address]
Payment: Cash on Delivery

Items:
- ${serial} | ${productName} x 1 = Rs.${productPrice}
  Product Link: ${link}

Subtotal: Rs.${productPrice}
Delivery: FREE
Total Amount: Rs.${productPrice}`;

  const whatsappURL = `https://wa.me/91${number}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}

// 8. Help Desk
function openHelpDesk(){
  window.location.href = 'help.html';
}

// 9. Products Load
function loadProducts(category = null) {
  let products = (window.allProductsCache && window.allProductsCache.length > 0)? window.allProductsCache : SANTRA_DB.products;

  if(category) {
    products = products.filter(p => {
      let cat = p.category || p.cat || '';
      if(typeof cat === 'object') cat = cat.name || cat.id || '';
      return cat.toLowerCase() === category.toLowerCase();
    });
  }

  let container = document.getElementById('productGrid') || document.getElementById('productList');
  if(!container) return;

  if(!products || products.length === 0) {
    container.innerHTML = '<div class="loading">No products found</div>';
    return;
  }
  renderProducts(addSerialNumbers(products));
}

// 10. renderProducts - WISHLIST UPDATED
function renderProducts(products) {
  let container = document.getElementById('productGrid') || document.getElementById('productList');
  if (!container) return;

  allProducts = products;
  container.innerHTML = '';

  products.forEach(p => {
    try {
      let stockNum = Number(p.stock) || 0;
      let images = [];
      if (p.images && Array.isArray(p.images) && p.images.length > 0) {
        images = p.images.filter(img => img);
      } else if (p.img) {
        images = [p.img];
      } else if (p.image) {
        images = [p.image];
      }
      if (images.length === 0) {
        images = ['https://via.placeholder.com/300x300?text=No+Image'];
      }
      const hasMultipleImages = images.length > 1;

      let buttonHTML = '';
      if (stockNum > 0) {
        buttonHTML = `
          <div class="product-btns">
            <button class="btn-cart" onclick="event.stopPropagation(); addToCart('${p.id}')">🛒 Add to Cart</button>
            <button class="btn-buy" onclick="event.stopPropagation(); buyNow('${p.id}')">⚡ Buy Now</button>
          </div>
        `;
      } else {
        buttonHTML = `
          <button class="whatsapp-btn" style="width:100%;background:#25D366;color:white;border:none;padding:8px;border-radius:4px;font-size:11px;cursor:pointer;font-weight:bold;margin-top:8px;" onclick="event.stopPropagation(); orderOnWhatsApp('${p.id}', '${p.name}', ${p.price}, '${images[0]}', '${p.source}', '${p.product_code}', '${p.product_link}')">💬 Order on WhatsApp</button>
        `;
      }

      container.innerHTML += `
        <div class="product-card" onclick="openProductModal('${p.id}')">
          ${p.isNew? '<span class="new-badge">NEW</span>' : ''}
          ${hasMultipleImages? `<span class="img-count">${images.length} 📷</span>` : ''}
          <button class="wish-icon ${isInWishlist(p.id)? 'active' : ''}" onclick='event.stopPropagation(); toggleWishlist({id: "${p.id}",name: "${p.name}",price: ${p.price},image: "${images[0]}",product_code: "${p.product_code}",category: "${p.category}"})' id="wish-${p.id}">${isInWishlist(p.id)? '❤️' : '🩷'}</button>
          <div class="image-slider">
            ${images.map((img, i) => `<img src="${img}" class="slide-img ${i === 0? 'active' : ''}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">`).join('')}
            ${hasMultipleImages? `<button class="prev-btn" onclick="event.stopPropagation(); changeSlide('${p.id}', -1)"><</button><button class="next-btn" onclick="event.stopPropagation(); changeSlide('${p.id}', 1)">></button><div class="dots">${images.map((_, i) => `<span class="dot ${i === 0? 'active' : ''}" onclick="event.stopPropagation(); goToSlide('${p.id}', ${i})"></span>`).join('')}</div>` : ''}
          </div>
          <div class="product-info">
            <h3>${p.name}</h3>
            <div><span class="price">₹${p.price}</span>${p.mrp? `<span class="mrp">₹${p.mrp}</span>` : ''}</div>
            <div class="stock">Category: ${p.category} | Stock: ${p.stock}</div>
            ${buttonHTML}
          </div>
        </div>
      `;
    } catch (err) {
      console.error('Product render error:', err, p);
    }
  });
}

// 11. SLIDER FUNCTIONS
let currentSlides = {};
function changeSlide(productId, direction) {
  const cards = document.querySelectorAll('.product-card');
  let slider = null;
  cards.forEach(card => {
    if (card.innerHTML.includes(`changeSlide('${productId}'`)) {
      slider = card;
    }
  });
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide-img');
  const dots = slider.querySelectorAll('.dot');
  if (!currentSlides[productId]) currentSlides[productId] = 0;
  slides[currentSlides[productId]].classList.remove('active');
  if (dots.length > 0) dots[currentSlides[productId]].classList.remove('active');
  currentSlides[productId] += direction;
  if (currentSlides[productId] >= slides.length) currentSlides[productId] = 0;
  if (currentSlides[productId] < 0) currentSlides[productId] = slides.length - 1;
  slides[currentSlides[productId]].classList.add('active');
  if (dots.length > 0) dots[currentSlides[productId]].classList.add('active');
}

function goToSlide(productId, index) {
  const cards = document.querySelectorAll('.product-card');
  let slider = null;
  cards.forEach(card => {
    if (card.innerHTML.includes(`goToSlide('${productId}'`)) {
      slider = card;
    }
  });
  if (!slider) return;
  const slides = slider.querySelectorAll('.slide-img');
  const dots = slider.querySelectorAll('.dot');
  if (!currentSlides[productId]) currentSlides[productId] = 0;
  slides[currentSlides[productId]].classList.remove('active');
  if (dots.length > 0) dots[currentSlides[productId]].classList.remove('active');
  currentSlides[productId] = index;
  slides[currentSlides[productId]].classList.add('active');
  if (dots.length > 0) dots[currentSlides[productId]].classList.add('active');
}

// 12. WISHLIST FUNCTIONS
function isInWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  return wishlist.some(item => String(item.id) === String(productId));
}

function toggleWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  const btn = document.getElementById(`wish-${product.id}`);
  let index = wishlist.findIndex(item => String(item.id) === String(product.id));
  if (index > -1) {
    wishlist.splice(index, 1);
    if(btn) { btn.innerHTML = '🩷'; btn.classList.remove('active'); }
    alert('💔 Removed from Wishlist');
  } else {
    wishlist.push({id: String(product.id), name: product.name, price: Number(product.price) || 0, image: product.image || '', product_code: product.product_code || '', category: product.category || '', qty: 1});
    if(btn) { btn.innerHTML = '❤️'; btn.classList.add('active'); }
    alert('❤️ Added to Wishlist!');
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  let countElement = document.getElementById('wishlist-count');
  if (countElement) countElement.innerText = wishlist.length;
}

// 13. PRODUCT MODAL
function openProductModal(productId) {
  const product = allProducts.find(p => String(p.id) === String(productId));
  if (!product) return;
  let images = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    images = product.images.filter(img => img);
  } else if (product.img) {
    images = [product.img];
  } else if (product.image) {
    images = [product.image];
  } else {
    images = ['https://via.placeholder.com/300x300?text=No+Image'];
  }
  document.getElementById('modalTitle').innerText = product.name;
  document.getElementById('modalPrice').innerText = `₹${product.price}`;
  document.getElementById('modalMrp').innerText = product.mrp? `₹${product.mrp}` : '';
  document.getElementById('modalCat').innerText = product.category;
  document.getElementById('modalStock').innerText = product.stock;
  document.getElementById('modalDesc').innerText = product.description || '';
  let sliderHTML = `<div class="image-slider" style="height:300px;">${images.map((img, i) => `<img src="${img}" class="slide-img ${i === 0? 'active' : ''}" style="height:300px;" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'">`).join('')}${images.length > 1? `<button class="prev-btn" onclick="changeModalSlide(-1)"><</button><button class="next-btn" onclick="changeModalSlide(1)">></button><div class="dots">${images.map((_, i) => `<span class="dot ${i === 0? 'active' : ''}" onclick="goToModalSlide(${i})"></span>`).join('')}</div>` : ''}</div>`;
  document.getElementById('modalImgSlider').innerHTML = sliderHTML;
  
  document.getElementById('orderFormSection').style.display = 'none';
  document.getElementById('modalActionBtns').style.display = 'block';
  
  const modalWishBtn = document.querySelector('#productModal.btn[onclick="addToWishlistFromModal()"]');
  if (modalWishBtn) {
    if (isInWishlist(product.id)) {
      modalWishBtn.innerHTML = '❤️ Added to Wishlist';
      modalWishBtn.style.background = '#10b981';
    } else {
      modalWishBtn.innerHTML = '😍 Add to Wishlist';
      modalWishBtn.style.background = 'var(--wish)';
    }
  }
  document.getElementById('productModal').classList.remove('hide');
  window.currentModalProduct = product;
  window.currentModalSlide = 0;
}

function changeModalSlide(direction) {
  const slides = document.querySelectorAll('#modalImgSlider.slide-img');
  const dots = document.querySelectorAll('#modalImgSlider.dot');
  if (slides.length <= 1) return;
  slides[window.currentModalSlide].classList.remove('active');
  if (dots.length > 0) dots[window.currentModalSlide].classList.remove('active');
  window.currentModalSlide += direction;
  if (window.currentModalSlide >= slides.length) window.currentModalSlide = 0;
  if (window.currentModalSlide < 0) window.currentModalSlide = slides.length - 1;
  slides[window.currentModalSlide].classList.add('active');
  if (dots.length > 0) dots[window.currentModalSlide].classList.add('active');
}

function goToModalSlide(index) {
  const slides = document.querySelectorAll('#modalImgSlider.slide-img');
  const dots = document.querySelectorAll('#modalImgSlider.dot');
  slides[window.currentModalSlide].classList.remove('active');
  if (dots.length > 0) dots[window.currentModalSlide].classList.remove('active');
  window.currentModalSlide = index;
  slides[window.currentModalSlide].classList.add('active');
  if (dots.length > 0) dots[window.currentModalSlide].classList.add('active');
}

function closeProductModal() { document.getElementById('productModal').classList.add('hide'); }
function addToCartFromModal() { if (window.currentModalProduct) addToCart(window.currentModalProduct.id); }
function buyNowFromModal() { if (window.currentModalProduct) showOrderFormInModal(); }
function addToWishlistFromModal() {
  if (window.currentModalProduct) {
    toggleWishlist(window.currentModalProduct);
    const btn = event.target;
    if (isInWishlist(window.currentModalProduct.id)) {
      btn.innerHTML = '❤️ Added to Wishlist';
      btn.style.background = '#10b981';
    } else {
      btn.innerHTML = '😍 Add to Wishlist';
      btn.style.background = 'var(--wish)';
    }
  }
}

// 14. CUSTOMER LOGIN - NO OTP
function openCustomerLogin() { document.getElementById('customerLoginModal').classList.remove('hide'); }
function closeCustomerLogin() { document.getElementById('customerLoginModal').classList.add('hide'); }

function loginCustomerWithoutOTP() {
  const name = document.getElementById('custName').value.trim();
  const mobile = document.getElementById('custMobile').value.trim();
  if (!name || mobile.length!== 10) {
    alert('❌ Name aur 10 digit mobile daalo');
    return;
  }
  localStorage.setItem('santra_customer', JSON.stringify({name: name, mobile: mobile}));
  alert('✅ Login Successful!');
  closeCustomerLogin();
  location.reload();
}

function customerLogout() {
  localStorage.removeItem('santra_customer');
  alert('Logged out');
  location.reload();
}

// 15. OTHER FUNCTIONS
function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  if (!query) { loadProducts(); return; }
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
  renderProducts(filtered);
}
function openFilterPopup() { document.getElementById('filterPopup').classList.add('show'); }
function closeFilterPopup() {
  document.getElementById('filterPopup').classList.remove('hide');
  document.getElementById('filterPopup').classList.remove('show');
}
function applyHomeFilters() { closeFilterPopup(); loadProducts(); }
function clearHomeFilters() {
  document.getElementById('filterSize').value = '';
  document.getElementById('filterColor').value = '';
  document.getElementById('filterFabric').value = '';
  document.getElementById('filterMaterial').value = '';
}
function openCategories() { alert('Categories page coming soon'); }
function openCart() { window.location.href = 'cart.html'; }
function openOrders() { window.location.href = 'orders.html'; }
function goHome() { loadProducts(); window.scrollTo(0, 0); }
function viewAllProducts() { loadProducts(); window.scrollTo(0, 400); }
function changeModalQty(change) {
  const qtyEl = document.getElementById('modalQty');
  let qty = parseInt(qtyEl.innerText);
  qty += change;
  if (qty < 1) qty = 1;
  qtyEl.innerText = qty;
}
window.filterByCategory = function(catName) {
  loadProducts(catName);
  window.scrollTo(0, 400);
}

// 16. ORDER FORM IN PRODUCT MODAL
function showOrderFormInModal() {
  const customer = localStorage.getItem('santra_customer');
  if (customer) {
    const custData = JSON.parse(customer);
    document.getElementById('orderCustName').value = custData.name || '';
    document.getElementById('orderCustMobile').value = custData.mobile || '';
  }
  document.getElementById('orderFormSection').style.display = 'block';
  document.getElementById('modalActionBtns').style.display = 'none';
}

async function submitOrderFromPopup() {
  try {
    const name = document.getElementById('orderCustName').value.trim();
    const mobile = document.getElementById('orderCustMobile').value.trim();
    const email = document.getElementById('orderCustEmail').value.trim();
    const address = document.getElementById('orderCustAddress').value.trim();
    const paymentMode = document.getElementById('orderPaymentMode').value;
    
    if (!name ||!mobile ||!address ||!paymentMode) {
      alert('❌ Please fill all required fields');
      return;
    }
    if (mobile.length!== 10) {
      alert('❌ Enter 10 digit mobile number');
      return;
    }
    
    const product = window.currentModalProduct;
    if (!product) {
      alert('❌ Product error. Please close and try again');
      return;
    }
    
    const qty = parseInt(document.getElementById('modalQty').innerText) || 1;
    const orderId = 'SM' + Date.now();
    
    const orderData = {
      orderId: orderId,
      customerName: name,
      customerMobile: mobile,
      customerEmail: email,
      customerAddress: address,
      productId: product.id,
      productName: product.name,
      productImage: product.images? product.images[0] : product.img,
      productPrice: product.price,
      productQty: qty,
      totalAmount: product.price * qty,
      productSeries: product.product_code || product.serial,
      productCategory: product.category,
      productLink: product.product_link || `${window.location.origin}/product.html?id=${product.id}`,
      paymentMode: paymentMode,
      status: "pending_otp",
      orderDate: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await window.db.collection("orders").add(orderData);
    
    document.getElementById('productModal').innerHTML = `
      <div style="text-align:center; padding:40px 20px;">
        <div style="font-size:60px; color:#4CAF50;">✅</div>
        <h2 style="color:#4CAF50; margin:15px 0;">Request Sent for OTP</h2>
        <p style="font-size:16px; color:#666;">Order ID: <b>${orderId}</b></p>
        <p style="margin:15px 0; color:#333;">Please wait for confirmation on WhatsApp.</p>
        <p style="font-size:14px; color:#999;">Admin will send you OTP shortly</p>
        <button onclick="closeProductModal()" style="background:#e91e63; color:white; padding:12px 30px; border:none; border-radius:5px; font-size:16px; margin-top:20px; cursor:pointer;">
          Close
        </button>
      </div>
    `;
    
    const adminWhatsapp = SANTRA_DB.settings?.helpdeskWhatsapp || '8769171078';
    const whatsappMsg = `🔔 NEW ORDER REQUEST #${orderId}%0A%0APayment Mode: ${paymentMode}%0A%0A👤 Customer Details:%0AName: ${name}%0AMobile: ${mobile}%0AEmail: ${email || 'N/A'}%0AAddress: ${address}%0A%0A🛒 Order Items:%0A1. ${product.name} | ${product.product_code || 'N/A'} | Qty: ${qty} = ₹${product.price * qty}%0A Link: ${product.product_link || window.location.href}%0A%0A💰 Total: ₹${product.price * qty}%0A📅 Date: ${new Date().toLocaleString('en-IN')}%0A%0A⚠️ ACTION REQUIRED:%0A1. Send OTP to customer on WhatsApp%0A2. Save OTP in Firebase%0A3. Verify in Admin Panel`;
    
    window.open(`https://wa.me/91${adminWhatsapp}?text=${whatsappMsg}`, '_blank');
    
  } catch (err) {
    console.error('Order Error:', err);
    alert('❌ Error placing order: ' + err.message);
  }
}

// 17. START EVERYTHING
document.addEventListener('DOMContentLoaded', waitForFirebase);