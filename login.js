// ===== Customer Login with Manual WhatsApp OTP =====

// 1. Jab customer Add to Cart dabaye to Login popup khol
function checkLoginBeforeCart() {
  let user = localStorage.getItem('santra_customer');
  if (!user) {
    document.getElementById('loginPopup').style.display = 'block';
    return false; // Cart me add nahi hoga
  }
  return true; // Login hai to cart me add ho jayega
}

// 2. Customer mobile daale to Firebase me request save karo
function requestOTP() {
  let mobile = document.getElementById('custMobile').value;
  if(mobile.length !== 10) {
    alert('10 digit mobile number daalo');
    return;
  }
  
  // Random 6 digit OTP generate karo
  let otp = Math.floor(100000 + Math.random() * 900000);
  
  // Firebase me save karo - Admin ko dikhega
  firebase.database().ref('login_requests/' + mobile).set({
    mobile: mobile,
    otp: otp,
    time: new Date().toLocaleString(),
    status: 'pending'
  });
  
  // Customer ko Step 2 dikhao
  document.getElementById('showMobile').innerText = mobile;
  document.getElementById('step1_mobile').style.display = 'none';
  document.getElementById('step2_otp').style.display = 'block';
  
  alert('Admin ko WhatsApp request bhej di hai. Admin se OTP maang ke yahan daalo');
}

// 3. Customer OTP daale to verify karo
function verifyOTP() {
  let mobile = document.getElementById('custMobile').value;
  let enteredOTP = document.getElementById('custOTP').value;
  
  firebase.database().ref('login_requests/' + mobile).once('value', (snap) => {
    let data = snap.val();
    if(data && data.otp == enteredOTP) {
      // OTP sahi hai - Login kar do
      localStorage.setItem('santra_customer', mobile);
      
      // Customer ka data save karo
      firebase.database().ref('customers/' + mobile).set({
        mobile: mobile,
        loginTime: new Date().toLocaleString(),
        name: 'Customer ' + mobile
      });
      
      alert('Login Successful ✅');
      document.getElementById('loginPopup').style.display = 'none';
      showCustomerData(); // Login tab me data dikhao
      loadCustomerOrders(mobile); // Order tab me data dikhao
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

// 4. Login tab me customer data dikhao
function showCustomerData() {
  let mobile = localStorage.getItem('santra_customer');
  if(mobile) {
    document.getElementById('loginTab').innerHTML = `
      <h3>Welcome ${mobile}</h3>
      <p>Mobile: ${mobile}</p>
      <button onclick="logout()">Logout</button>
    `;
  }
}

// 5. Order tab me customer ke orders dikhao
function loadCustomerOrders(mobile) {
  if(!mobile) mobile = localStorage.getItem('santra_customer');
  if(!mobile) return;
  
  document.getElementById('orderTab').innerHTML = `
    <h3>📦 My Orders</h3>
    <p><b>Logged in as:</b> ${mobile}</p>
    <div id="orderList">Loading orders...</div>
  `;
  
  firebase.database().ref('orders').orderByChild('customerMobile').equalTo(mobile).once('value', (snap) => {
    let orders = snap.val();
    let html = '';
    if(orders) {
      Object.values(orders).forEach(order => {
        html += `<p>Order: ${order.time} | Status: ${order.status}</p>`;
      });
    } else {
      html = '<p>No orders yet</p>';
    }
    document.getElementById('orderList').innerHTML = html;
  });
}

// 6. Order karte time customer detail auto fill ho
function placeOrder() {
  let mobile = localStorage.getItem('santra_customer');
  if(!mobile) {
    alert('Pehle login karo');
    document.getElementById('loginPopup').style.display = 'block';
    return;
  }
  
  // Order me customer mobile add karo
  let orderData = {
    customerMobile: mobile,
    items: cartItems, // Tera cart variable yahan aayega
    time: new Date().toLocaleString(),
    status: 'New Order'
  };
  firebase.database().ref('orders').push(orderData);
  alert('Order placed ✅');
  loadCustomerOrders(mobile);
}

function logout() {
  localStorage.removeItem('santra_customer');
  location.reload();
}

// Page load pe check karo login hai ya nahi
window.onload = function() {
  showCustomerData();
  loadCustomerOrders();
}