// ===== SANTRA MALL - UPDATED SCRIPT.JS =====
// Date: 13-May-2026 - Fixed all bugs

// 1. Global Variables
let SANTRA_DB = {
  settings: {
    helpdeskPhone: '9829508335',
    helpdeskWhatsapp: '9829508335', 
    helpdeskEmail: 'help@santramall.com'
  },
  orders: []
};

// Tumhare products - yaha add/edit karo
const products = [
  { id: 1, category: "Dress", name: "Red Kurti", price: 899, mrp: 1299, stock: 10, img: "https://via.placeholder.com/300x300.png?text=Red+Kurti" },
  { id: 2, category: "Dress", name: "Blue Saree", price: 1299, mrp: 1899, stock: 5, img: "https://via.placeholder.com/300x300.png?text=Blue+Saree" },
  { id: 3, category: "Food", name: "Samosa", price: 20, mrp: 30, stock: 50, img: "https://via.placeholder.com/300x300.png?text=Samosa" },
  { id: 4, category: "Pins", name: "Metal Pins", price: 1300, mrp: 1800, stock: 8, img: "https://via.placeholder.com/300x300.png?text=Metal+Pins" },
  { id: 5, category: "Pins", name: "Designer Pin", price: 1500, mrp: 2000, stock: 0, img: "https://via.placeholder.com/300x300.png?text=Designer+Pin" }
];

let allProducts = []; // Global use ke liye

// 2. Category wise serial number banane ka function
function addSerialNumbers(products) {
  const categoryCount = {};
  
  return products.map(product => {
    if (!categoryCount[product.category]) {
      categoryCount[product.category] = 1;
    } else {
      categoryCount[product.category]++;
    }
    
    product.serial = `${product.category}-${categoryCount[product.category]}`;
    product.product_code = product.serial; // For compatibility
    product.product_link = `https://santramall.com/product/${product.serial.toLowerCase()}`;
    product.imageUrl = product.img; // For compatibility
    product.source = 'local';
    return product;
  });
}

// 3. Cart Functions
function addToCart(productId, source, imgUrl, productCode, productLink) {
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

    let CART = JSON.parse(localStorage.getItem('santra_cart')) || [];
    let item = CART.find(i => String(i.id) === String(productId));
    
    if (item) {
      item.qty += 1;
    } else {
      CART.push({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        qty: 1,
        image: product.img,
        product_code: product.product_code,
        product_link: product.product_link,
        category: product.category,
        source: product.source
      });
    }
    
    localStorage.setItem('santra_cart', JSON.stringify(CART));
    updateCartCount();
    alert(`✅ ${product.name} cart me add ho gaya!`);
    
  } catch (err) {
    console.error('Add to cart error:', err);
    alert('❌ Error: ' + err.message);
  }
}

function updateCartCount() {
  let CART = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  let count = CART.reduce((sum, item) => sum + item.qty, 0);
  let cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.innerText = count;
}

async function buyNow(productId, source, imgUrl, productCode, productLink) {
  addToCart(productId, source, imgUrl, productCode, productLink);
  window.location.href = 'cart.html';
}

// 4. WhatsApp Order - Updated Version
function orderOnWhatsApp(productId, productName, productPrice, productImage, source, productCode, productLink) {
  let number = SANTRA_DB.settings?.helpdeskWhatsapp || '9829508335';
  let serial = productCode || 'N/A';
  let link = productLink || `https://santramall.com/product/${productId}`;
  
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

// 5. Help Desk Modal - FIXED: Functions bahar hain, sirf HTML andar
function openHelpDesk() {
  let modal = document.getElementById('helpDeskModal');
  if (!modal) {
    console.error('Help Desk Modal not found in HTML');
    return;
  }
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>💬 Help Desk</h2>
        <button onclick="closeHelpDesk()">×</button>
      </div>
      <div class="modal-body">
        <p><b>📞 Phone:</b> ${SANTRA_DB.settings.helpdeskPhone}</p>
        <p><b>📧 Email:</b> ${SANTRA_DB.settings.helpdeskEmail}</p>
        <p><b>💬 WhatsApp:</b> ${SANTRA_DB.settings.helpdeskWhatsapp}</p>
        <button class="whatsapp-btn" onclick="orderOnWhatsApp('', 'General Inquiry', '', '', '', '', '')">
          💬 Chat on WhatsApp
        </button>
      </div>
    </div>
  `; // Backtick yahi close ho gaya - BUG FIXED
  
  modal.classList.add('active');
}

function closeHelpDesk() {
  let modal = document.getElementById('helpDeskModal');
  if (modal) modal.classList.remove('active');
}

// 6. Products ko page par dikhana - Updated with Cart Buttons
function renderProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;
  
  allProducts = addSerialNumbers(products); // Global me save karo
  productList.innerHTML = ''; // Clear karo pehle
  
  allProducts.forEach(p => {
    let stockNum = Number(p.stock) || 0;
    let buttonHTML = '';
    
    if (stockNum > 0) {
      buttonHTML = `
        <button class="cart-btn" onclick="addToCart('${p.id}', '${p.source}', '${p.img}', '${p.product_code}', '${p.product_link}')">🛒 Add to Cart</button>
        <button class="buy-btn" onclick="buyNow('${p.id}', '${p.source}', '${p.img}', '${p.product_code}', '${p.product_link}')">⚡ Buy Now</button>
      `;
    } else {
      buttonHTML = `
        <button class="whatsapp-btn" onclick="orderOnWhatsApp('${p.id}', '${p.name}', ${p.price}, '${p.img}', '${p.source}', '${p.product_code}', '${p.product_link}')">
          💬 Order on WhatsApp
        </button>
      `;
    }
    
    productList.innerHTML += `
      <div class="product-card">
        <span class="serial-tag">${p.serial}</span>
        ${p.stock <= 0 ? '<span class="out-stock">Out of Stock</span>' : ''}
        <img src="${p.img}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="price"><s>Rs.${p.mrp}</s> <b>Rs.${p.price}</b></div>
        <div class="stock">Stock: ${p.stock}</div>
        ${buttonHTML}
      </div>
    `;
  });
}

// 7. Page Load hote hi sab chala do
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartCount();
});