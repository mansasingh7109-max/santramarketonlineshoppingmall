// load-products.js - Sirf RTDB URL + Firestore Code

// 1. REALTIME DATABASE Connect - Tera URL direct yaha add kar diya
// Ye secrets.js wale databaseURL ko use karega, par humne specifically URL bhi de diya

var rtdb = (typeof rtdb !== 'undefined' && rtdb) ? rtdb : firebase.database("https://santramarketshoppingmall-default-rtdb.firebaseio.com");

console.log("RTDB Connected with URL");

// 2. FIRESTORE Connect - secrets.js se config le lega

var db = (typeof db !== 'undefined' && db) ? db : firebase.firestore();

console.log("Firestore Connected");

// 3. RTDB SE PRODUCTS LOAD KARO
function loadProductsFromRTDB() {
  const productContainer = document.getElementById('allProducts'); 
  if (!productContainer) {
    console.log("Div #allProducts nahi mila");
    return;
  }
  
  productContainer.innerHTML = 'Loading from Realtime Database...';
  
  // RTDB me 'products' node se data lao
  rtdb.ref('products').once('value').then((snapshot) => {
    if (!snapshot.exists()) {
      productContainer.innerHTML = '<p>RTDB me products nahi mile.</p>';
      return;
    }
    
    let productsHTML = '';
    
    snapshot.forEach((childSnapshot) => {
      let productId = childSnapshot.key; 

      let product = childSnapshot.val();
      let nm = String(product.name || '').trim();
if(!product || !nm || nm === 'Product' || nm === 'No Name') return;
      
      productsHTML += `
        <a href="product.html?id=${productId}&from=rtdb" class="product-card">
          <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
          <h3>${product.name || 'No Name'}</h3>
          <p>Rs. ${product.price || 0}</p>
        </a>
      `;
    });
    
    productContainer.innerHTML = productsHTML;
    
  }).catch((error) => {
    productContainer.innerHTML = `<p>RTDB Error: ${error.message}</p>`;
    console.log("RTDB Error:", error);
  });
}

// 4. FIRESTORE SE PRODUCTS LOAD KARO - Backup ke liye
function loadProductsFromFirestore() {
  const productContainer = document.getElementById('allProducts'); 
  if (!productContainer) return;
  
  productContainer.innerHTML = 'Loading from Firestore...';
  
  db.collection('products').get().then((snapshot) => {
    if (snapshot.empty) {
      productContainer.innerHTML = '<p>Firestore me products nahi mile.</p>';
      return;
    }
    
    let productsHTML = '';
    snapshot.forEach((doc) => {
      let product = doc.data();
      let productId = doc.id;
      
      productsHTML += `
        <a href="product.html?id=${productId}&from=firestore" class="product-card">
          <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name}">
          <h3>${product.name || 'No Name'}</h3>
          <p>Rs. ${product.price || 0}</p>
        </a>
      `;
    });
    
    productContainer.innerHTML = productsHTML;
    
  }).catch((error) => {
    console.log("Firestore Error:", error);
  });
}

// 5. Page load hote hi RTDB se products dikhao
document.addEventListener('DOMContentLoaded', loadProductsFromRTDB);

// Agar RTDB fail ho to Firestore try karna ho to ye line use kar:
// document.addEventListener('DOMContentLoaded', loadProductsFromFirestore);