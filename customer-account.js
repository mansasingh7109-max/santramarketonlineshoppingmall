// ===== SANTRA MALL - CUSTOMER ACCOUNT JS - 29-JUNE-2026 =====

let currentUser = null;
let generatedOTP = null;
let currentMobile = null;

function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hide');
}
function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hide');
}

window.addEventListener('load', function() {
    setTimeout(checkLoginStatus, 100);
});

function checkLoginStatus() {
    const customerStr = localStorage.getItem('santra_customer');
    
    if (customerStr) {
        try {
            const customer = JSON.parse(customerStr);
            if (customer && customer.isLoggedIn === true && customer.mobile) {
                currentUser = customer;
                showProfile();
                loadMyChoice();
                loadOrders();
                return;
            }
        } catch(e) {
            localStorage.removeItem('santra_customer');
        }
    }
    showLogin();
}

function showLogin() {
    hideElement('profileBox');
    showElement('loginBox');
    document.getElementById('stats').style.display = 'none';
    document.getElementById('myChoiceCard').style.display = 'none';
    document.getElementById('ordersCard').style.display = 'none';
}

function showProfile() {
    hideElement('loginBox');
    showElement('profileBox');
    document.getElementById('stats').style.display = 'flex';
    document.getElementById('myChoiceCard').style.display = 'block';
    document.getElementById('ordersCard').style.display = 'block';
    
    if (currentUser) {
        document.getElementById('profilePic').src = currentUser.photo || 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png';
        document.getElementById('fullName').value = currentUser.name || '';
        document.getElementById('mobileNum').value = currentUser.mobile || '';
        document.getElementById('emailId').value = currentUser.email || '';
        document.getElementById('fullAddress').value = currentUser.address || '';
        document.getElementById('totalOrders').innerText = currentUser.totalOrders || 0;
        document.getElementById('totalSpent').innerText = '₹' + (currentUser.totalSpent || 0);
    }
}

function sendOTP() {
    const mobile = document.getElementById('loginMobile').value.trim();
    if (mobile.length !== 10) {
        alert('Please enter valid 10 digit mobile number');
        return;
    }
    currentMobile = mobile;
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    if(typeof db !== 'undefined') {
        db.collection('login_requests').doc(mobile).set({
            mobile: mobile,
            otp: generatedOTP,
            time: new Date().toISOString(),
            status: 'pending'
        });
    }
    
    const msg = `SANTRAJET MALL OTP: ${generatedOTP}%0A%0AYe OTP 5 minute me expire ho jayega.`;
    window.open(`https://wa.me/91${mobile}?text=${msg}`, '_blank');
    
    document.getElementById('showMobileOTP').innerText = mobile;
    showElement('otpBox');
    document.getElementById('sendOtpBtn').disabled = true;
    document.getElementById('sendOtpBtn').innerText = 'OTP Sent ✓';
}

function verifyOTP() {
    const enteredOTP = document.getElementById('otpInput').value.trim();
    if (enteredOTP === generatedOTP) {
        currentUser = {
            mobile: currentMobile,
            name: '',
            email: '',
            address: '',
            photo: 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png',
            isLoggedIn: true,
            totalOrders: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('santra_customer', JSON.stringify(currentUser));
        
        if(typeof db !== 'undefined') {
            db.collection('customers').doc(currentMobile).set(currentUser, { merge: true });
        }
        
        alert('Login Successful! ✅');
        showProfile();
        loadMyChoice();
        loadOrders();
    } else {
        alert('Wrong OTP! Try again ❌');
    }
}

function changeNumber() {
    hideElement('otpBox');
    document.getElementById('loginMobile').value = '';
    document.getElementById('otpInput').value = '';
    document.getElementById('sendOtpBtn').disabled = false;
    document.getElementById('sendOtpBtn').innerText = '📱 Send OTP on WhatsApp';
}

function saveProfile() {
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('emailId').value.trim();
    const address = document.getElementById('fullAddress').value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    currentUser.name = name;
    currentUser.email = email;
    currentUser.address = address;
    currentUser.lastUpdated = new Date().toISOString();
    
    localStorage.setItem('santra_customer', JSON.stringify(currentUser));
    
    if(typeof db !== 'undefined') {
        db.collection('customers').doc(currentUser.mobile).set(currentUser, { merge: true });
    }
    
    alert('Profile Updated Successfully! ✅');
}

if(document.getElementById('photoInput')) {
    document.getElementById('photoInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('profilePic').src = event.target.result;
            currentUser.photo = event.target.result;
            localStorage.setItem('santra_customer', JSON.stringify(currentUser));
            if(typeof db !== 'undefined') {
                db.collection('customers').doc(currentUser.mobile).update({ 
                    photo: event.target.result,
                    lastUpdated: new Date().toISOString()
                });
            }
        };
        reader.readAsDataURL(file);
    });
}

function loadMyChoice() {
    const myChoice = JSON.parse(localStorage.getItem('santraMallMyChoice_v2') || '[]');
    const listDiv = document.getElementById('myChoiceList');
    if (!listDiv) return;
    
    if (myChoice.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center;color:#999;font-size:13px">No favorites yet</p>';
        return;
    }
    
    let html = '';
    myChoice.slice(0, 4).forEach(item => {
        html += `
            <div class="mychoice-item" onclick="window.location.href='product.html?id=${item.id}'">
                <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}">
                <p>${item.name}</p>
                <b>₹${item.price}</b>
            </div>
        `;
    });
    listDiv.innerHTML = html;
}

function loadOrders() {
    if (!currentUser || typeof db === 'undefined') return;
    db.collection('orders').where('customerMobile', '==', currentUser.mobile).orderBy('verifiedAt', 'desc').limit(3).get().then(snap => {
        const ordersDiv = document.getElementById('ordersList');
        if (!ordersDiv) return;
        
        if (snap.empty) {
            ordersDiv.innerHTML = '<p style="text-align:center;color:#999;font-size:13px">No orders yet</p>';
            return;
        }
        
        let total = 0;
        let count = 0;
        let html = '';
        snap.forEach(doc => {
            const order = doc.data();
            total += order.total || 0;
            count++;
            html += `
                <div class="order-item">
                    <b>Order #${doc.id.substring(0,8)}</b><br>
                    <span>₹${order.total} | ${order.status || 'Pending'}</span>
                </div>
            `;
        });
        
        ordersDiv.innerHTML = html;
        document.getElementById('totalOrders').innerText = count;
        document.getElementById('totalSpent').innerText = '₹' + total;
        
        currentUser.totalOrders = count;
        currentUser.totalSpent = total;
        localStorage.setItem('santra_customer', JSON.stringify(currentUser));
    }).catch(err => {
        console.log('Orders load error:', err);
    });
}

function logout() {
    if (confirm('Logout karna hai?')) {
        localStorage.removeItem('santra_customer');
        localStorage.removeItem('santraMallCart_v2');
        localStorage.removeItem('santraMallMyChoice_v2');
        window.location.href = 'index.html';
    }
}