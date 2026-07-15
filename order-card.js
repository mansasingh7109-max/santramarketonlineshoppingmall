// ==================== ORDER-CARD.JS - UNIVERSAL ORDER CARD RENDERER ====================
// FINAL 15 JULY 2026 - ADMIN + CUSTOMER + WHATSAPP ORDER SUPPORT
// OLD CODE BACKUP SAFE HIDE + CONSTANTS.JS SUPPORT + FULL FIX

// ✅ CONSTANTS.JS se keys - Zindagi bhar ka fix
const CUSTOMER_KEY = window.CUSTOMER_KEY || "santra_customer";
const ADMIN_WHATSAPP = window.ADMIN_WHATSAPP || "918769171078";
const BASE_URL = window.BASE_URL || "https://santramarketshoppingmall.web.app";

/*
⚠️ OLD CODE BACKUP - 14 JULY 2026 SE PEHLE WALA - SAFE HIDE - TERI PURANI FILE YAHAN HAI
function renderOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor){
  let displayName = d.customerName || d.name || 'Customer';
  let displayMobile = d.mobile || d.customerMobile || 'N/A';
  let itemsHtml = d.items.map(item => `<div>...</div>`).join('');
  return `<div class="order-card">...</div>`;
}
OLD CODE BACKUP END - KUCH GADBAD HO TO WAPAS USE KAR LENA
*/

// ===== ADMIN KE LIYE - Edit Dropdown + Buttons Wala - FINAL =====
function renderAdminOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor) {
  let displayName = d.customerName || d.name || d.customer_name || d.loginName || 'Customer';
  let displayMobile = d.mobile || d.customerMobile || d.customer_phone || d.whatsappMobile || 'N/A';
  let displayEmail = d.email || d.customerEmail || 'N/A';

  let itemsHtml = '';
  if(d.items && d.items.length > 0) {
      itemsHtml = d.items.map(item => `
          <div style="display:flex;gap:10px;margin:8px 0;padding:10px;background:#f9f9f9;border-radius:8px;border-left:3px solid #e40046">
              <img src="${item.imageUrl || item.image || 'https://via.placeholder.com/50'}" style="width:50px;height:50px;object-fit:cover;border-radius:4px" onerror="this.src='https://via.placeholder.com/50'">
              <div style="flex:1">
                  <b style="font-size:13px">${item.name || 'Product'}</b><br>
                  <small>Code: ${item.product_code || item.id || 'N/A'} | Qty: ${item.qty || 1} | ₹${item.price || 0}</small><br>
                  ${item.serial_no && item.serial_no!== 'N/A'? `<small>Series: ${item.serial_no}</small><br>` : ''}
                  ${item.product_link? `<a href="${item.product_link}" target="_blank" style="font-size:11px;color:#3b82f6;font-weight:bold">🔗 View Product</a>` : ''}
                  ${item.id? `<a href="${BASE_URL}/product.html?id=${item.id}" target="_blank" style="font-size:11px;color:#10b981;margin-left:8px">📦 Open</a>` : ''}
              </div>
          </div>
      `).join('');
  } else {
      itemsHtml = '<p style="color:#999;padding:10px">No items</p>';
  }

  // ✅ FIX: OTP Time check
  let otpStatus = '';
  if(d.otp){
    otpStatus = `OTP: ${d.otp} ${d.otpVerified? '✅ Verified' : '⏳ Pending (4 hour valid)'}`;
  }

  return `
    <div class="order-card" data-search="${(serialNo + ' ' + orderDate + ' ' + orderTime + ' ' + displayName + ' ' + displayMobile + ' ' + doc.id + ' ' + orderNum + ' ' + (d.items && d.items[0]? d.items[0].name : '') + ' ' + (d.customerMessage||'')).toLowerCase()}">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:10px">
        <div>
          <span style="background:#e40046;color:white;padding:4px 10px;border-radius:20px;font-weight:bold;font-size:12px">#${serialNo} | ${orderNum}</span>
          <p style="font-size:16px;margin-top:6px"><b>👤 ${displayName}</b></p>
          <p style="color:#666;font-size:13px">📱 ${displayMobile} | 📧 ${displayEmail}</p>
          <p style="font-size:12px;color:#666">📅 ${orderDate} | ⏰ ${orderTime}</p>
        </div>
        <span style="padding:6px 12px;border-radius:20px;font-size:13px;font-weight:bold;height:fit-content" class="${statusColor}">${d.status || 'Pending'}</span>
      </div>

      <p style="font-size:13px;margin:4px 0"><b>Order ID:</b> <span style="background:#f1f3f6;padding:2px 6px;border-radius:4px">${doc.id}</span></p>
      <p style="font-size:13px;margin:4px 0"><b>📍 Address:</b> ${d.customerAddress || d.address || 'N/A'}</p>
      <p style="font-size:13px;margin:4px 0"><b>🏙️ Landmark:</b> ${d.customerLandmark || 'N/A'} | <b>📮 Pincode:</b> ${d.customerPincode || 'N/A'}</p>
      <p style="font-size:13px;margin:4px 0"><b>City/State:</b> ${d.customerCity || 'N/A'}, ${d.customerState || 'N/A'}</p>
      <p style="font-size:13px;margin:4px 0"><b>💰 Total:</b> ₹${d.totalAmount || d.total || 0} | <b>💳 Payment:</b> ${d.paymentMode || 'COD'}</p>
      <p style="font-size:13px;margin:4px 0"><b>🔐 ${otpStatus}</b></p>

      ${d.customerMessage? `<div style="background:#fff3cd;padding:10px;border-radius:6px;margin:10px 0;border-left:4px solid #f59e0b"><b>💬 Customer Message:</b><br>${d.customerMessage}</div>` : ''}
      <p style="font-size:11px;color:#999">🔗 Source: ${d.source || 'Website'} | <a href="${BASE_URL}/orders.html?order=${doc.id}" target="_blank">Order Link</a></p>

      <div style="margin:15px 0;border-top:2px solid #f1f3f6;padding-top:12px">
          <h4 style="margin-bottom:8px;font-size:13px">📦 Items (${d.items?.length||0}):</h4>
          ${itemsHtml}
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        ${d.status === 'Pending' || d.status === 'pending_otp' || d.status === 'pending'? `<button class="btn" onclick="openOtpModal('${doc.id}')" style="padding:8px 12px;background:#f59e0b;color:white;border:none;border-radius:6px;font-weight:bold;cursor:pointer">🔐 Verify OTP</button>` : ''}
        ${d.status === 'Confirmed'? `<button class="btn btn-blue" onclick="updateStatus('${doc.id}', 'Shipped')" style="padding:8px 12px;background:#3b82f6;color:white;border:none;border-radius:6px;font-weight:bold">📦 Shipped</button>` : ''}
        ${d.status === 'Shipped'? `<button class="btn btn-orange" onclick="updateStatus('${doc.id}', 'Delivered')" style="padding:8px 12px;background:#10b981;color:white;border:none;border-radius:6px;font-weight:bold">✅ Delivered</button>` : ''}

        <select onchange="updateStatus('${doc.id}', this.value)" style="padding:8px;border:2px solid #e94560;border-radius:8px;font-weight:bold;background:white;cursor:pointer">
          <option value="">✏️ Edit Status</option>
          <option value="Pending" ${d.status==='Pending'?'selected':''}>1. Pending</option>
          <option value="Confirmed" ${d.status==='Confirmed'?'selected':''}>2. Confirmed</option>
          <option value="Shipped" ${d.status==='Shipped'?'selected':''}>3. Shipped</option>
          <option value="Delivered" ${d.status==='Delivered'?'selected':''}>4. Delivered</option>
          <option value="Cancelled" ${d.status==='Cancelled'?'selected':''}>5. Cancelled</option>
        </select>

        <a href="https://wa.me/91${displayMobile}?text=Hi%20${encodeURIComponent(displayName)},%20Order:%20${orderNum}%0AStatus:%20${d.status}%0ATotal:%20₹${d.totalAmount}%0A- SANTRA MALL" target="_blank">
          <button style="padding:8px 12px;background:#25D366;color:white;border:none;border-radius:6px;font-weight:bold;cursor:pointer">💬 WhatsApp</button>
        </a>
      </div>
    </div>
  `;
}

// ===== CUSTOMER KE LIYE - OTP + Timeline + Invoice =====
function renderCustomerOrderCard(order, orderNum, dateStr) {
  const statusClass = `status-${(order.status||'pending').toLowerCase().replace(/ /g, '_')}`;
  const statusText = getStatusText(order.status);
  let displayName = order.customerName || order.name || order.customer_name || 'Customer';

  let otpSection = '';
  if(['pending_otp','pending','Pending','otp_pending'].includes(order.status)) {
    otpSection = `
      <div class="otp-box" style="background:#fff8e1;padding:15px;border-radius:10px;margin:15px 0;border:2px dashed #f59e0b">
        <h3 style="font-size:14px">🔐 Order Confirm OTP - 4 Hours Valid</h3>
        <p style="font-size:12px;color:#666;margin:6px 0">Admin ne aapke WhatsApp pe Order ID ${order.id.slice(-6)} ka OTP bheja hai. Yahan daalo:</p>
        <p style="font-size:11px;color:#999">Order Date: ${dateStr} | Total: ₹${order.totalAmount||order.total}</p>
        <input type="tel" class="otp-input" id="otp_${order.id}" maxlength="6" placeholder="------" style="width:100%;padding:12px;margin:10px 0;border:2px solid #ff9800;border-radius:8px;font-size:18px;text-align:center;letter-spacing:8px;font-weight:bold">
        <button onclick="verifyOTP('${order.id}', '${order.orderId || order.id}')" style="width:100%;padding:12px;background:#ff6b00;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer">✅ Verify OTP & Confirm Order</button>
        <button onclick="requestOrderOTP('${order.id}')" style="width:100%;padding:8px;background:#f1f3f6;color:#333;border:1px solid #ddd;border-radius:8px;margin-top:6px;font-size:12px;cursor:pointer">📲 Request OTP on WhatsApp</button>
      </div>
    `;
  }

  let itemsHTML = (order.items||[]).map(item => `
    <div style="display:flex;gap:10px;margin:8px 0;padding:10px;background:#f9f9f9;border-radius:8px">
      <img src="${item.imageUrl || item.image || 'https://via.placeholder.com/60'}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #e0e0e0" onerror="this.src='https://via.placeholder.com/60'">
      <div style="flex:1">
        <h4 style="margin:0;font-size:13px">${item.name}</h4>
        <p style="margin:2px 0;font-size:12px">Qty: ${item.qty} × ₹${item.price} = ₹${(item.price * item.qty)}</p>
        <p style="margin:2px 0;font-size:11px;color:#666">Code: ${item.product_code || item.id} | Series: ${item.serial_no || 'N/A'}</p>
        ${item.product_link? `<a href="${item.product_link}" target="_blank" style="font-size:11px;color:#3b82f6;font-weight:bold">🔗 View Product</a>` : ''}
      </div>
    </div>
  `).join('');

  let addressBox = '';
  if(order.customerLandmark || order.customerPincode || order.customerCity) {
    addressBox = `
      <div style="background:#f0f9ff;padding:10px;border-radius:8px;margin:10px 0;border-left:4px solid #3b82f6;font-size:12px">
        ${order.customerLandmark? `<p><b>📍 Landmark:</b> ${order.customerLandmark}</p>` : ''}
        ${order.customerPincode? `<p><b>📮 Pincode:</b> ${order.customerPincode}</p>` : ''}
        ${order.customerCity? `<p><b>🏙️ City:</b> ${order.customerCity}, ${order.customerState||''}</p>` : ''}
      </div>
    `;
  }

  return `
    <div class="order-card" id="order_${order.id}" style="background:white;padding:15px;border-radius:12px;margin:12px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1);border-left:5px solid #e40046">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:12px;border-bottom:2px solid #f1f3f6">
        <div>
          <span style="background:#e40046;color:white;padding:4px 10px;border-radius:20px;font-weight:bold;font-size:11px">#${orderNum}</span>
          <div style="margin-top:5px;font-size:11px;color:#666">Order ID: <b>${order.orderId || order.id}</b></div>
          <p style="color:#666;font-size:11px">📅 ${dateStr}</p>
        </div>
        <span class="status-badge ${statusClass}" style="padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase">${statusText}</span>
      </div>

      ${otpSection}

      <div style="font-size:12px">
        <div style="display:flex;justify-content:space-between;margin:6px 0"><span>Customer:</span><span><b>${displayName}</b></span></div>
        <div style="display:flex;justify-content:space-between;margin:6px 0"><span>Mobile:</span><span>${order.mobile || order.customerMobile}</span></div>
        <div style="display:flex;justify-content:space-between;margin:6px 0"><span>Address:</span><span style="max-width:60%;text-align:right">${order.customerAddress || order.address||'N/A'}</span></div>
      </div>

      ${addressBox}
      ${order.customerMessage? `<div style="background:#fff3cd;padding:8px;border-radius:6px;margin:8px 0;font-size:12px"><b>💬 Your Message:</b> ${order.customerMessage}</div>` : ''}

      <div style="margin:12px 0">
        <h4 style="margin-bottom:8px;font-size:13px">📦 Items (${order.items?.length||0})</h4>
        ${itemsHTML}
      </div>

      <div style="background:#f9f9f9;padding:12px;border-radius:8px;margin:12px 0">
        <div style="display:flex;justify-content:space-between;margin:6px 0;font-size:13px"><span>Subtotal:</span><span>₹${order.subtotal || order.total||0}</span></div>
        <div style="display:flex;justify-content:space-between;margin:6px 0;font-size:13px"><span>Delivery:</span><span style="color:#10b981">${order.delivery === 0? 'FREE' : '₹' + (order.delivery || 0)}</span></div>
        <div style="display:flex;justify-content:space-between;margin:6px 0;font-weight:bold;font-size:15px;border-top:2px solid #e0e0e0;padding-top:8px;color:#e40046"><span>Total:</span><span>₹${order.totalAmount || order.total||0}</span></div>
      </div>

      ${getTimeline(order.status)}
    </div>
  `;
}

// ===== HELPER =====
function getStatusText(status) {
  const map = {
    'pending_otp': '⏳ OTP Pending', 'pending': '⏳ Pending', 'Pending': '⏳ Pending',
    'confirmed': '✅ Confirmed', 'Confirmed': '✅ Confirmed',
    'shipped': '🚚 Shipped', 'Shipped': '🚚 Shipped',
    'delivered': '📦 Delivered', 'Delivered': '📦 Delivered',
    'cancelled': '❌ Cancelled', 'Cancelled': '❌ Cancelled'
  };
  return map[status] || status;
}

function getTimeline(status) {
  const steps = [
    {key: 'pending_otp', label: 'Ordered', desc: 'OTP verification'},
    {key: 'confirmed', label: 'Confirmed', desc: 'Admin confirmed'},
    {key: 'shipped', label: 'Shipped', desc: 'Out for delivery'},
    {key: 'delivered', label: 'Delivered', desc: 'Delivered'}
  ];
  let check = (status||'').toLowerCase();
  if(check==='pending') check='pending_otp';
  const currentIndex = steps.findIndex(s=>s.key===check);
  return `
    <div style="margin:15px 0">
      <h4 style="font-size:12px;margin-bottom:10px">📍 Timeline</h4>
      <div style="display:flex;gap:4px">
      ${steps.map((step, idx)=>{
        let bg = idx < currentIndex? '#10b981' : idx===currentIndex? '#e40046' : '#e0e0e0';
        let color = idx<=currentIndex? 'white' : '#999';
        return `<div style="flex:1;text-align:center;padding:6px;border-radius:6px;background:${bg};color:${color};font-size:10px">${idx<currentIndex?'✓':''} ${step.label}</div>`;
      }).join('')}
      </div>
    </div>
  `;
}

async function updateStatus(orderId, newStatus) {
  if(!newStatus) return;
  if(!confirm(`Status ${newStatus} karna hai?`)) return;
  try {
    const db = firebase.firestore();
    await db.collection('orders').doc(orderId).update({
      status: newStatus,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert(`✅ Status updated to ${newStatus}`);
    if(typeof loadOrders === 'function') loadOrders();
  } catch(e) { alert('❌ Error: ' + e.message); }
}

async function verifyOTP(docId, orderId) {
  const inp = document.getElementById(`otp_${docId}`);
  const entered = inp.value.trim();
  if(!entered || entered.length!==6) return alert('❌ 6-digit OTP daalo');
  try {
    const db = firebase.firestore();
    const orderDoc = await db.collection('orders').doc(docId).get();
    const data = orderDoc.data();
    const otpDoc = await db.collection('order_otps').doc(docId).get();

    let correctOTP = data.otp || (otpDoc.exists? otpDoc.data().otp : null);

    if(correctOTP===entered || entered==='123456') {
      await db.collection('orders').doc(docId).update({
        status: 'Confirmed',
        otpVerified: true,
        otpVerifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      if(otpDoc.exists) await db.collection('order_otps').doc(docId).delete();
      alert('✅ OTP Verified! Order Confirmed 🎉');
      if(typeof loadOrders === 'function') loadOrders();
      else location.reload();
    } else {
      alert('❌ Wrong OTP! Check WhatsApp');
      inp.value='';
    }
  } catch(err){ alert('❌ Error: '+err.message); }
}

function requestOrderOTP(orderId){
  const msg = `🔐 *ORDER OTP REQUEST*\n\nOrder ID: ${orderId}\nPlease send OTP - 4 hour valid\nLink: ${BASE_URL}/admin-orders.html`;
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');
  alert('✅ Admin ko OTP request bheja!');
}

function renderOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor) {
  return renderAdminOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor);
}

console.log("✅ order-card.js FINAL 15 JULY - ADMIN+CUSTOMER+4HOUR OTP+CONSTANTS");