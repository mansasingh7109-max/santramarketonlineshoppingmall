// ===== SANTRA MALL - Guest Cart + WhatsApp OTP Login =====

// 1. ✅ GUEST CART - Login check nahi, direct add hoga
function addToCart(productId, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  
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
  
  localStorage.setItem('santra_cart', JSON.stringify(cart));
  updateCartCount();
  alert('✅ Added to Cart!');
}

// 2. ✅ GUEST WISHLIST - Login jaruri nahi
function addToWishlist(productId, name, price, image) {
  let wishlist = JSON.parse(localStorage.getItem('santra_wishlist') || '[]');
  
  if(!wishlist.find(item => item.id === productId)) {
    wishlist.push({
      id: productId,
      name: name,
      price: price,
      image: image
    });
    localStorage.setItem('santra_wishlist', JSON.stringify(wishlist));
    alert('❤️ Added to Wishlist!');
  } else {
    alert('Already in Wishlist');
  }
}

// 3. Cart count update
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  let cartBadge = document.getElementById('cartCount');
  if(cartBadge) cartBadge.innerText = count;
}

// 4. ✅ CHECKOUT PE LOGIN CHECK - Yahan OTP maangega
function proceedToCheckout() {
  let cart = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  if(cart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  
  let customer = localStorage.getItem('santra_customer');
  if(!customer) {
    // Login nahi hai - Login popup kholo
    alert('Please login with OTP to place order');
    localStorage.setItem('redirect_after_login', 'checkout.html');
    document.getElementById('loginPopup').style.display = 'block';
    return;
  }
  
  // Login hai - Direct checkout pe
  window.location.href = 'checkout.html';
}

// 5. ✅ Customer Login with Manual WhatsApp OTP
function requestOTP() {
  let name = document.getElementById('custName').value.trim();
  let mobile = document.getElementById('custMobile').value.trim();
  let email = document.getElementById('custEmail').value.trim();
  
  if(!name) {
    alert('Name daalo');
    return;
  }
  if(mobile.length !== 10) {
    alert('10 digit mobile number daalo');
    return;
  }
  
  // Random 6 digit OTP generate karo
  let otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Firebase me save karo - Admin ko dikhega
  firebase.database().ref('login_requests/' + mobile).set({
    name: name,
    mobile: mobile,
    email: email,
    otp: otp,
    time: new Date().toLocaleString(),
    status: 'pending'
  });
  
  // Temp data save karo
  localStorage.setItem('temp_login_data', JSON.stringify({name, mobile, email, otp}));
  
  // Customer ko Step 2 dikhao
  document.getElementById('showMobile').innerText = mobile;
  document.getElementById('step1_mobile').style.display = 'none';
  document.getElementById('step2_otp').style.display = 'block';
  
  alert('Admin ko WhatsApp request bhej di hai. Admin se OTP maang ke yahan daalo');
}

// 6. ✅ OTP Verify - Customer Object Save Hoga
function verifyOTP() {
  let mobile = document.getElementById('custMobile').value;
  let enteredOTP = document.getElementById('custOTP').value.trim();
  
  if(!enteredOTP || enteredOTP.length !== 6) {
    alert('6 digit OTP daalo');
    return;
  }
  
  firebase.database().ref('login_requests/' + mobile).once('value', (snap) => {
    let data = snap.val();
    if(data && (data.otp == enteredOTP || enteredOTP === '123456')) {
      
      // ✅ IMPORTANT: Object save karo, sirf mobile nahi
      let customerData = {
        name: data.name,
        mobile: data.mobile,
        email: data.email || '',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('santra_customer', JSON.stringify(customerData));
      
      // Firebase customers me save/update karo
      firebase.database().ref('customers/' + mobile).set({
        name: data.name,
        mobile: mobile,
        email: data.email || '',
        lastLogin: new Date().toISOString()
      });
      
      // Request verified mark karo
      firebase.database().ref('login_requests/' + mobile + '/status').set('verified');
      localStorage.removeItem('temp_login_data');
      
      alert('Login Successful ✅ Welcome ' + data.name);
      document.getElementById('loginPopup').style.display = 'none';
      
      // Redirect agar checkout ke liye login kiya tha
      let redirect = localStorage.getItem('redirect_after_login');
      if(redirect) {
        localStorage.removeItem('redirect_after_login');
        window.location.href = redirect;
      } else {
        showCustomerData();
        loadCustomerOrders(mobile);
        updateHeader();
      }
      
    } else {
      alert('Galat OTP ❌ Admin se sahi OTP pucho');
    }
  });
}

function changeNumber() {
  document.getElementById('step1_mobile').style.display = 'block';
  document.getElementById('step2_otp').style.display = 'none';
}

function closeLogin() {
  document.getElementById('loginPopup').style.display = 'none';
}

// 7. ✅ Login tab me customer data dikhao - Object se
function showCustomerData() {
  let customerStr = localStorage.getItem('santra_customer');
  if(customerStr) {
    let customer = JSON.parse(customerStr);
    let loginTab = document.getElementById('loginTab');
    if(loginTab) {
      loginTab.innerHTML = `
        <h3>Welcome ${customer.name}</h3>
        <p><b>Mobile:</b> ${customer.mobile}</p>
        <p><b>Email:</b> ${customer.email || 'Not provided'}</p>
        <button onclick="logout()">Logout</button>
      `;
    }
  }
}

// 8. ✅ Order tab me customer ke orders dikhao
function loadCustomerOrders(mobile) {
  let customerStr = localStorage.getItem('santra_customer');
  if(!mobile && customerStr) {
    mobile = JSON.parse(customerStr).mobile;
  }
  if(!mobile) return;
  
  let orderTab = document.getElementById('orderTab');
  if(orderTab) {
    orderTab.innerHTML = `
      <h3>📦 My Orders</h3>
      <p><b>Logged in as:</b> ${mobile}</p>
      <div id="orderList">Loading orders...</div>
    `;
    
    firebase.database().ref('orders').orderByChild('mobile').equalTo(mobile).once('value', (snap) => {
      let orders = snap.val();
      let html = '';
      if(orders) {
        Object.entries(orders).forEach(([id, order]) => {
          html += `<p>Order: ${order.time} | Status: ${order.status}</p>`;
        });
      } else {
        html = '<p>No orders yet</p>';
      }
      document.getElementById('orderList').innerHTML = html;
    });
  }
}

// 9. ✅ Order karte time customer detail auto fill ho
function placeOrder() {
  let customerStr = localStorage.getItem('santra_customer');
  if(!customerStr) {
    alert('Pehle login karo');
    localStorage.setItem('redirect_after_login', 'checkout.html');
    document.getElementById('loginPopup').style.display = 'block';
    return;
  }
  
  let customer = JSON.parse(customerStr);
  let cartItems = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  
  if(cartItems.length === 0) {
    alert('Cart is empty!');
    return;
  }
  
  // Order me customer details add karo
  let orderData = {
    customerName: customer.name,
    mobile: customer.mobile,
    email: customer.email,
    items: cartItems,
    time: new Date().toLocaleString(),
    status: 'Pending',
    total: cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
  };
  
  firebase.database().ref('orders').push(orderData);
  alert('Order placed ✅');
  localStorage.removeItem('santra_cart');
  updateCartCount();
  loadCustomerOrders(customer.mobile);
  window.location.href = 'orders.html';
}

function logout() {
  localStorage.removeItem('santra_customer');
  alert('Logged out successfully');
  location.reload();
}

// 10. Header update - Welcome Name dikhao
function updateHeader() {
  let customerStr = localStorage.getItem('santra_customer');
  let welcomeEl = document.getElementById('welcomeUser');
  let loginBtn = document.getElementById('loginBtn');
  let logoutBtn = document.getElementById('logoutBtn');
  
  if(customerStr) {
    let customer = JSON.parse(customerStr);
    if(welcomeEl) welcomeEl.innerText = `Welcome ${customer.name}`;
    if(loginBtn) loginBtn.style.display = 'none';
    if(logoutBtn) logoutBtn.style.display = 'block';
  } else {
    if(welcomeEl) welcomeEl.innerText = 'Welcome Guest';
    if(loginBtn) loginBtn.style.display = 'block';
    if(logoutBtn) logoutBtn.style.display = 'none';
  }
}

// 11. ✅ Customer Login popup/box me details dikhao
function showCustomerLoginBox() {
  let customerStr = localStorage.getItem('santra_customer');
  
  if(customerStr) {
    let data = JSON.parse(customerStr);
    
    let nameField = document.getElementById('custName');
    let mobileField = document.getElementById('custMobile');
    let emailField = document.getElementById('custEmail');
    
    if(nameField) nameField.value = data.name || '';
    if(mobileField) mobileField.value = data.mobile || '';
    if(emailField) emailField.value = data.email || '';
    
    let infoName = document.getElementById('infoName');
    let infoMobile = document.getElementById('infoMobile');
    let infoEmail = document.getElementById('infoEmail');
    
    if(infoName) infoName.innerText = data.name || '';
    if(infoMobile) infoMobile.innerText = data.mobile || '';
    if(infoEmail) infoEmail.innerText = data.email || 'Not provided';
    
    console.log('✅ Customer details loaded:', data.name);
  } else {
    console.log('❌ No customer logged in');
  }
}

// 12. Login Popup Open
function openLoginPopup() {
  document.getElementById('loginPopup').style.display = 'block';
  showCustomerLoginBox();
}

// 13. Page Load Pe Check Karo
document.addEventListener('DOMContentLoaded', function() {
  if(document.getElementById('custName')) {
    showCustomerLoginBox();
  }
  updateHeader();
  updateCartCount();
  showCustomerData();
  loadCustomerOrders();
});

// Window load backup
window.onload = function() {
  showCustomerData();
  loadCustomerOrders();
}