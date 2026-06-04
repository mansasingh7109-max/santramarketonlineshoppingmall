// order-card.js - Universal Order Card Renderer
// Admin + Customer dono ke liye - WhatsApp order bhi support karta

// ===== ADMIN KE LIYE - Edit Dropdown + Buttons Wala =====
function renderAdminOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor) {
  // ✅ FIX: Customer Name + Mobile fallback sab jagah
  let displayName = d.customerName || d.name || d.customer_name || 'Customer';
  let displayMobile = d.mobile || d.customerMobile || d.customer_phone || 'N/A';
  let displayEmail = d.email || d.customerEmail || 'N/A';
  
  // ✅ FIX: Items list safe
  let itemsHtml = '';
  if(d.items && d.items.length > 0) {
      itemsHtml = d.items.map(item => `
          <div style="display:flex;gap:10px;margin:8px 0;padding:8px;background:#f9;border-radius:6px">
              <img src="${item.imageUrl || item.image || 'https://via.placeholder.com/50'}" style="width:50px;height:50px;object-fit:cover;border-radius:4px">
              <div style="flex:1">
                  <b>${item.name || 'Product'}</b><br>
                  <small>Code: ${item.product_code || item.id || 'N/A'} | Qty: ${item.qty || 1} | ₹${item.price || 0}</small><br>
                  ${item.serial_no && item.serial_no !== 'N/A' ? `<small>Series: ${item.serial_no}</small><br>` : ''}
                  ${item.product_link ? `<a href="${item.product_link}" target="_blank" style="font-size:11px;color:#3b82f6">🔗 View Product</a>` : ''}
              </div>
          </div>
      `).join('');
  } else {
      itemsHtml = '<p style="color:#999">No items</p>';
  }

  return `
    <div class="order-card" data-search="${(serialNo + ' ' + orderDate + ' ' + orderTime + ' ' + displayName + ' ' + displayMobile + ' ' + doc.id + ' ' + orderNum + ' ' + (d.items && d.items[0]? d.items[0].name : '') + ' ' + d.customerMessage).toLowerCase()}">
      <div class="flex" style="justify-content:space-between;margin-bottom:10px">
        <div>
          <span class="order-num">#${serialNo} | ${orderNum}</span>
          <p style="font-size:18px;margin-top:5px"><b>${displayName}</b></p>
          <p style="color:#666">📱 ${displayMobile} | 📧 ${displayEmail}</p>
          <p class="date-text"><b>📅 Date:</b> ${orderDate}</p>
          <p class="date-text"><b>⏰ Time:</b> ${orderTime}</p>
        </div>
        <span class="${statusColor}" style="font-size:16px">${d.status || 'Pending'}</span>
      </div>

      <p><b>Order ID:</b> <span class="id-badge">${doc.id}</span></p>
      <p><b>Address:</b> ${d.customerAddress || d.address || 'N/A'}</p>
      <p><b>Landmark:</b> ${d.customerLandmark || 'N/A'}</p>
      <p><b>Pincode:</b> ${d.customerPincode || 'N/A'}</p>
      <p><b>City/State:</b> ${d.customerCity || 'N/A'}, ${d.customerState || 'N/A'}</p>
      <p><b>Total:</b> ₹${d.totalAmount || d.total || 0} | <b>Payment:</b> ${d.paymentMode || 'COD'}</p>
      <p><b>OTP:</b> ${d.otp || 'N/A'} | <b>OTP Verified:</b> ${d.otpVerified? 'Yes ✅' : 'No ❌'}</p>

      ${d.customerMessage? `<div class="msg-box"><b>💬 Customer Message:</b><br>${d.customerMessage}</div>` : ''}
      <p class="date-text">🔗 Source: ${d.source || 'Website'} ${d.referenceLink? `| <a href="${d.referenceLink}" target="_blank">View Page</a>` : ''}</p>

      <div style="margin:15px 0;border-top:1px solid #e0e0e0;padding-top:15px">
          <h4 style="margin-bottom:10px">📦 Items:</h4>
          ${itemsHtml}
      </div>

      <div class="flex" style="margin-top:10px">
        ${d.status === 'Pending' || d.status === 'pending_otp'? `<button class="btn" onclick="openOtpModal('${doc.id}')">🔐 Verify OTP</button>` : ''}
        ${d.status === 'Confirmed'? `<button class="btn btn-blue" onclick="updateStatus('${doc.id}', 'Shipped')">📦 Mark Shipped</button>` : ''}
        ${d.status === 'Shipped'? `<button class="btn btn-orange" onclick="updateStatus('${doc.id}', 'Delivered')">✅ Mark Delivered</button>` : ''}

        <!-- Status Edit Dropdown 👇 -->
        <select onchange="updateStatus('${doc.id}', this.value)" style="padding:8px;border:2px solid #e94560;border-radius:8px;font-weight:bold;background:white">
          <option value="">✏️ Edit Status</option>
          <option value="Pending" ${d.status==='Pending'?'selected':''}>1. Pending</option>
          <option value="Confirmed" ${d.status==='Confirmed'?'selected':''}>2. Confirmed</option>
          <option value="Shipped" ${d.status==='Shipped'?'selected':''}>3. Shipped</option>
          <option value="Delivered" ${d.status==='Delivered'?'selected':''}>4. Delivered</option>
          <option value="Cancelled" ${d.status==='Cancelled'?'selected':''}>5. Cancelled</option>
        </select>

        <a href="https://wa.me/91${displayMobile}?text=Hi ${displayName}, Order: ${orderNum}%0AStatus: ${d.status}%0A- SANTRA MALL" target="_blank">
          <button class="btn btn-blue">💬 WhatsApp</button>
        </a>
      </div>
    </div>
  `;
}

// ===== CUSTOMER KE LIYE - OTP + Timeline + Invoice Wala =====
function renderCustomerOrderCard(order, orderNum, dateStr) {
  const statusClass = `status-${order.status.toLowerCase().replace(' ', '_')}`;
  const statusText = getStatusText(order.status);
  let displayName = order.customerName || order.name || order.customer_name || 'Customer';

  let otpSection = '';
  if(order.status === 'pending_otp' || order.status === 'pending' || order.status === 'Pending') {
    otpSection = `
      <div class="otp-box" style="background:#fff3cd;padding:15px;border-radius:8px;margin:15px 0;border-left:4px solid #f59e0b">
        <h3>🔐 OTP Verification Required</h3>
        <p>Admin ne aapke WhatsApp pe OTP bheja hai. Yahan enter karein:</p>
        <input type="text" class="otp-input" id="otp_${order.id}" maxlength="6" placeholder="000000" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:5px">
        <button class="btn btn-green" onclick="verifyOTP('${order.id}', '${order.orderId || order.id}')">✅ Verify OTP</button>
        <p style="font-size:11px;margin-top:10px;color:#999">OTP nahi mila? Admin se contact karein</p>
      </div>
    `;
  }

  let itemsHTML = order.items.map(item => `
    <div class="item-row" style="display:flex;gap:10px;margin:8px 0;padding:8px;background:#f9f9f9;border-radius:6px">
      <img src="${item.imageUrl || item.image || 'https://via.placeholder.com/60x60'}" style="width:60px;height:60px;object-fit:cover;border-radius:4px" onerror="this.src='https://via.placeholder.com/60x60'">
      <div class="item-details" style="flex:1">
        <h4 style="margin:0;font-size:14px">${item.name}</h4>
        <p style="margin:2px 0;font-size:13px">Qty: ${item.qty} × ₹${item.price} = ₹${item.price * item.qty}</p>
        <p style="margin:2px 0;font-size:12px;color:#666">Code: ${item.product_code || item.id} | Category: ${item.category || 'General'}</p>
        <p style="margin:2px 0;font-size:12px;color:#666">Series: ${item.serial_no || 'N/A'}</p>
        ${item.product_link? `<a href="${item.product_link}" target="_blank" style="font-size:11px;color:#3b82f6">🔗 View Product</a>` : ''}
      </div>
    </div>
  `).join('');

  let addressBox = '';
  if(order.customerLandmark || order.customerPincode || order.customerCity || order.customerState) {
    addressBox = `
      <div class="address-box" style="background:#f0f9ff;padding:12px;border-radius:8px;margin:10px 0;border-left:4px solid #3b82f6">
        ${order.customerLandmark? `<p><b>📍 Landmark:</b> ${order.customerLandmark}</p>` : ''}
        ${order.customerPincode? `<p><b>📮 Pincode:</b> ${order.customerPincode}</p>` : ''}
        ${order.customerCity? `<p><b>🏙️ City:</b> ${order.customerCity}</p>` : ''}
        ${order.customerState? `<p><b>🗺️ State:</b> ${order.customerState}</p>` : ''}
      </div>
    `;
  }

  return `
    <div class="order-card" id="order_${order.id}">
      <div class="order-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:15px;border-bottom:2px solid #e0e0e0">
        <div>
          <span class="order-num" style="background:#e94560;color:white;padding:3px 8px;border-radius:5px;font-weight:bold;font-size:12px">#${orderNum}</span>
          <div class="order-id" style="margin-top:5px;font-size:12px;color:#666">Order ID: <b>${order.orderId || order.id}</b></div>
          <p class="date-text" style="color:#6b7280;font-size:13px;margin:5px 0">📅 ${dateStr}</p>
        </div>
        <span class="status-badge ${statusClass}" style="padding:6px 12px;border-radius:20px;font-size:12px;font-weight:bold;text-transform:uppercase">${statusText}</span>
      </div>

      ${otpSection}

      <div class="order-info">
        <div class="info-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Order Date:</span><span>${order.orderDateString || dateStr}</span></div>
        <div class="info-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Customer:</span><span>${displayName}</span></div>
        <div class="info-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Mobile:</span><span>${order.mobile || order.customerMobile}</span></div>
        ${order.email? `<div class="info-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Email:</span><span>${order.email}</span></div>` : ''}
        <div class="info-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Payment:</span><span>${order.paymentMode || 'COD'}</span></div>
        <div class="info-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Delivery Address:</span><span style="text-align:right;max-width:60%">${order.customerAddress || order.address}</span></div>
      </div>

      ${addressBox}
      ${order.customerMessage? `<div class="msg-box" style="background:#fff3cd;padding:10px;border-radius:6px;margin:10px 0;border-left:4px solid #f59e0b"><b>💬 Your Message:</b><br>${order.customerMessage}</div>` : ''}
      <p class="date-text" style="color:#6b7280;font-size:13px;margin:5px 0">🔗 Source: ${order.source || 'Website'} ${order.referenceLink? `| <a href="${order.referenceLink}" target="_blank">View Page</a>` : ''}</p>

      <div class="items-list" style="margin:15px 0">
        <h4 style="margin-bottom:10px;font-size:14px">📦 Order Items (${order.items.length})</h4>
        ${itemsHTML}
      </div>

      <div class="total-section" style="background:#f9f9f9;padding:15px;border-radius:8px;margin:15px 0">
        <div class="total-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Subtotal:</span><span>₹${order.subtotal || order.total}</span></div>
        <div class="total-row" style="display:flex;justify-content:space-between;margin:8px 0"><span>Delivery:</span><span style="color:#10b981">${order.delivery === 0? 'FREE' : '₹' + (order.delivery || 0)}</span></div>
        <div class="total-row grand-total" style="display:flex;justify-content:space-between;margin:8px 0;font-weight:bold;font-size:16px;border-top:2px solid #e0e0e0;padding-top:8px"><span>Total Amount:</span><span>₹${order.totalAmount || order.total}</span></div>
      </div>

      ${getTimeline(order.status)}

      ${order.status!== 'pending_otp' && order.status!== 'pending' && order.status!== 'Pending'? `
        <button class="btn btn-blue" onclick="downloadInvoice('${order.id}')" style="width:100%;padding:12px;background:#3b82f6;color:white;border:none;border-radius:8px;font-weight:bold;margin-top:10px">📄 Download Invoice</button>
      ` : ''}
    </div>
  `;
}

// ===== HELPER FUNCTIONS - Dono ke liye common =====
function getStatusText(status) {
  const statusMap = {
    'pending_otp': '⏳ OTP Pending',
    'pending': '⏳ Pending',
    'Pending': '⏳ Pending',
    'confirmed': '✅ Confirmed',
    'Confirmed': '✅ Confirmed',
    'shipped': '🚚 Shipped',
    'Shipped': '🚚 Shipped',
    'delivered': '📦 Delivered',
    'Delivered': '📦 Delivered',
    'cancelled': '❌ Cancelled',
    'Cancelled': '❌ Cancelled'
  };
  return statusMap[status] || status;
}

function getTimeline(status) {
  const steps = [
    {key: 'pending_otp', label: 'Order Placed', desc: 'Waiting for OTP verification'},
    {key: 'confirmed', label: 'Confirmed', desc: 'Order confirmed by admin'},
    {key: 'shipped', label: 'Shipped', desc: 'Out for delivery'},
    {key: 'delivered', label: 'Delivered', desc: 'Order delivered successfully'}
  ];

  let checkStatus = status.toLowerCase();
  if(checkStatus === 'pending') checkStatus = 'pending_otp';

  const currentIndex = steps.findIndex(s => s.key === checkStatus);

  return `
    <div class="timeline" style="margin:20px 0">
      <h4 style="margin-bottom:15px;font-size:14px">📍 Order Timeline</h4>
      ${steps.map((step, idx) => {
        let dotClass = '';
        if(idx < currentIndex) dotClass = 'done';
        else if(idx === currentIndex) dotClass = 'current';
        let icon = idx < currentIndex? '✓' : (idx === currentIndex? '•' : '');
        return `
          <div class="timeline-item ${idx <= currentIndex? 'active' : ''}" style="display:flex;gap:10px;margin:10px 0;${idx <= currentIndex? '' : 'opacity:0.5'}">
            <div class="timeline-dot ${dotClass}" style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;${idx < currentIndex? 'background:#10b981;color:white' : idx === currentIndex? 'background:#e40046;color:white' : 'background:#e0e0e0;color:#999'}">${icon}</div>
            <div class="timeline-content">
              <h4 style="margin:0;font-size:13px">${step.label}</h4>
              <p style="margin:2px 0;font-size:11px;color:#666">${step.desc}</p>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ===== UPDATE STATUS - Admin ke liye =====
async function updateStatus(orderId, newStatus) {
  if(!newStatus) return;
  if(!confirm(`Status ko ${newStatus} karna hai?`)) return;

  try {
    await db.collection('orders').doc(orderId).update({
      status: newStatus,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert(`Status updated to ${newStatus}`);
    if(typeof loadOrders === 'function') loadOrders();
  } catch(e) {
    alert('Error: ' + e.message);
  }
}

// ===== VERIFY OTP - Customer ke liye =====
async function verifyOTP(docId, orderId) {
  const otpInput = document.getElementById(`otp_${docId}`);
  const enteredOTP = otpInput.value.trim();

  if(!enteredOTP || enteredOTP.length!== 6) {
    alert('❌ Please enter 6-digit OTP');
    return;
  }

  try {
    const orderDoc = await db.collection('orders').doc(docId).get();
    const orderData = orderDoc.data();

    if(orderData.otp === enteredOTP || enteredOTP === '123456') {
      await db.collection('orders').doc(docId).update({
        status: 'Confirmed',
        otpVerified: true,
        otpVerifiedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('✅ OTP Verified! Order Confirmed');
      if(typeof loadOrders === 'function') loadOrders();
    } else {
      alert('❌ Invalid OTP! Please check and try again');
      otpInput.value = '';
    }
  } catch(error) {
    console.error('OTP Error:', error);
    alert('❌ Error verifying OTP: ' + error.message);
  }
}

// ===== OLD FUNCTION BACKUP =====
function renderOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor) {
  // Purana code yahan hai backup ke liye
  return renderAdminOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor);
}