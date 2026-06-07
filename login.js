// ===== SANTRA MALL - WhatsApp Manual OTP Login =====

// 1. Login Popup HTML - index.html me ye div daal de body ke end me
const loginPopupHTML = `
<div id="loginPopup" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;align-items:center;justify-content:center;">
  <div style="background:white;padding:25px;border-radius:12px;max-width:400px;width:90%;max-height:90vh;overflow-y:auto">
    
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
      <h2 style="color:#e40046;margin:0">🔐 Customer Login</h2>
      <button onclick="closeLogin()" style="background:none;border:none;font-size:24px;cursor:pointer">×</button>
    </div>

    <!-- Step 1: Mobile + Name Form -->
    <div id="step1_mobile">
      <p style="color:#666;font-size:13px;margin-bottom:15px">WhatsApp pe OTP bhejenge verification ke liye</p>
      <input type="text" id="custName" placeholder="Full Name *" style="width:100%;padding:12px;margin:8px 0;border:1px solid #ddd;border-radius:8px;box-sizing:border-box">
      <input type="tel" id="custMobile" placeholder="WhatsApp Mobile Number *" maxlength="10" style="width:100%;padding:12px;margin:8px 0;border:1px solid #ddd;border-radius:8px;box-sizing:border-box">
      <input type="email" id="custEmail" placeholder="Email (Optional)" style="width:100%;padding:12px;margin:8px 0;border:1px solid #ddd;border-radius:8px;box-sizing:border-box">
      <button onclick="requestOTP()" style="width:100%;padding:14px;background:#25D366;color:white;border:none;border-radius:8px;font-weight:bold;margin-top:10px;cursor:pointer">📱 Get OTP on WhatsApp</button>
      <p style="font-size:11px;color:#999;text-align:center;margin-top:10px">Admin aapko WhatsApp pe OTP bhejega</p>
    </div>

    <!-- Step 2: OTP Box - Teri requirement -->
    <div id="step2_otp" style="display:none">
      <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:15px;border-radius:8px;margin-bottom:15px">
        <h3 style="margin:0 0 8px 0;color:#856404;font-size:16px">🔐 OTP Verification Required</h3>
        <p style="margin:5px 0;color:#856404;font-size:13px">Santrajet ne aapke WhatsApp <b id="showMobileOTP"></b> pe OTP bheja hai.</p>
        <p style="margin:5px 0;color:#856404;font-size:13px"><b>WhatsApp OTP yahan enter karein:</b></p>
      </div>
      
      <input type="text" id="custOTP" placeholder="Enter 6-digit OTP" maxlength="6" style="width:100%;padding:15px;margin:10px 0;border:2px solid #ffc107;border-radius:8px;text-align:center;font-size:20px;letter-spacing:10px;font-weight:bold;box-sizing:border-box">
      
      <button onclick="verifyOTP()" style="width:100%;padding:14px;background:#25D366;color:white;border:none;border-radius:8px;font-weight:bold;margin-top:10px;cursor:pointer">✅ Verify & Continue</button>
      
      <button onclick="changeNumber()" style="width:100%;padding:12px;background:#666;color:white;border:none;border-radius:8px;margin-top:8px;cursor:pointer">← Login as Other Number</button>
      
      <p style="font-size:11px;color:#999;text-align:center;margin-top:10px">OTP nahi mila? Admin se WhatsApp pe contact karein</p>
    </div>

  </div>
</div>
`;

// Page load pe popup HTML add karo
document.addEventListener('DOMContentLoaded', function() {
  if(!document.getElementById('loginPopup')) {
    document.body.insertAdjacentHTML('beforeend', loginPopupHTML);
  }
  updateHeader();
  updateCartCount();
  checkExistingLogin();
});

// 2. Login Popup Open
function openLoginPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
  checkExistingLogin();
}

function closeLogin() {
  document.getElementById('loginPopup').style.display = 'none';
}

// 3. Check karo pehle se pending OTP hai kya
function checkExistingLogin() {
  let tempData = localStorage.getItem('temp_login_data');
  if(tempData) {
    let data = JSON.parse(tempData);
    document.getElementById('custName').value = data.name;
    document.getElementById('custMobile').value = data.mobile;
    document.getElementById('custEmail').value = data.email || '';
    document.getElementById('showMobileOTP').innerText = data.mobile;
    document.getElementById('step1_mobile').style.display = 'none';
    document.getElementById('step2_otp').style.display = 'block';
  }
}

// 4. OTP Request - Firebase me save
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

  // Firebase me request save - Admin dekhega
  firebase.database().ref('login_requests/' + mobile).set({
    name: name,
    mobile: mobile,
    email: email,
    time: new Date().toLocaleString(),
    status: 'pending',
    otp: '' // Admin yahan OTP daalega
  });
  
  // Temp save karo
  localStorage.setItem('temp_login_data', JSON.stringify({name, mobile, email}));
  
  // Step 2 dikhao - OTP Box
  document.getElementById('showMobileOTP').innerText = mobile;
  document.getElementById('step1_mobile').style.display = 'none';
  document.getElementById('step2_otp').style.display = 'block';
  
  alert('Request sent to Admin ✅\nAdmin aapko WhatsApp pe OTP bhejega');
}

// 5. OTP Verify - Admin ne jo OTP daala wo check karo
function verifyOTP() {
  let mobile = document.getElementById('custMobile').value.trim();
  let enteredOTP = document.getElementById('custOTP').value.trim();
  
  if(!enteredOTP || enteredOTP.length !== 6) {
    alert('6 digit OTP daalo');
    return;
  }
  
  // Firebase se OTP check karo
  firebase.database().ref('login_requests/' + mobile).once('value', (snap) => {
    let data = snap.val();
    
    if(!data) {
      alert('❌ Request nahi mili. Dubara try karo');
      changeNumber();
      return;
    }
    
    if(!data.otp) {
      alert('⏳ Admin ne abhi OTP nahi bheja. Thoda wait karo');
      return;
    }
    
    if(data.otp == enteredOTP || enteredOTP === '123456') { // Master OTP for testing
      
      // ✅ LOGIN SUCCESS - Object save karo
      let customerData = {
        name: data.name,
        mobile: data.mobile,
        email: data.email || '',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('santra_customer', JSON.stringify(customerData));
      
      // Firebase customers me save
      firebase.database().ref('customers/' + mobile).set({
        name: data.name,
        mobile: mobile,
        email: data.email || '',
        lastLogin: new Date().toISOString()
      });
      
      // Request delete karo
      firebase.database().ref('login_requests/' + mobile).remove();
      localStorage.removeItem('temp_login_data');
      
      alert('✅ Login Successful! Welcome ' + data.name);
      closeLogin();
      updateHeader();
      location.reload(); // Page refresh taki sab jagah dikhe
      
    } else {
      alert('❌ Galat OTP! Sahi OTP daalo');
      document.getElementById('custOTP').value = '';
    }
  });
}

// 6. Login as Other Number
function changeNumber() {
  localStorage.removeItem('temp_login_data');
  document.getElementById('step1_mobile').style.display = 'block';
  document.getElementById('step2_otp').style.display = 'none';
  document.getElementById('custName').value = '';
  document.getElementById('custMobile').value = '';
  document.getElementById('custEmail').value = '';
  document.getElementById('custOTP').value = '';
}

// 7. Header Update - Welcome Name
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

function logout() {
  localStorage.removeItem('santra_customer');
  alert('Logged out successfully');
  location.reload();
}

// Guest Cart - Login jaruri nahi
function addToCart(productId, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  let existing = cart.find(item => item.id === productId);
  if(existing) {
    existing.qty += 1;
  } else {
    cart.push({id: productId, name, price, image, qty: 1});
  }
  localStorage.setItem('santra_cart', JSON.stringify(cart));
  updateCartCount();
  alert('✅ Added to Cart!');
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('santra_cart') || '[]');
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  let cartBadge = document.getElementById('cartCount');
  if(cartBadge) cartBadge.innerText = count;
}