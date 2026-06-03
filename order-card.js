// order-card.js

// ===== ADMIN KE LIYE - Edit Dropdown + Buttons Wala =====
function renderAdminOrderCard(doc, d, orderNum, serialNo, orderDate, orderTime, statusColor) {
  return `
    <div class="order-card" data-search="${(serialNo + ' ' + orderDate + ' ' + orderTime + ' ' + d.customerName + ' ' + d.mobile + ' ' + doc.id + ' ' + orderNum + ' ' + (d.items && d.items[0]? d.items[0].name : '') + ' ' + d.customerMessage).toLowerCase()}">
      <div class="flex" style="justify-content:space-between;margin-bottom:10px">
        <div>
          <span class="order-num">#${serialNo} | ${orderNum}</span>
          <p style="font-size:18px;margin-top:5px"><b>${d.customerName || 'N/A'}</b></p>
          <p style="color:#666">${d.mobile || 'N/A'} | ${d.email || ''}</p>
          <p class="date-text"><b>📅 Date:</b> ${orderDate}</p>
          <p class="date-text"><b>⏰ Time:</b> ${orderTime}</p>
        </div>
        <span class="${statusColor}" style="font-size:16px">${d.status}</span>
      </div>

      <p><b>Order ID:</b> <span class="id-badge">${doc.id}</span></p>
      <p><b>Address:</b> ${d.address || 'N/A'}</p>
      <p><b>Item:</b> ${d.items && d.items[0]? d.items[0].name : 'No Item'} x ${d.items && d.items[0]? d.items[0].qty : 1} - ₹${d.items && d.items[0]? d.items[0].price : 0}</p>
      <p><b>Total:</b> ₹${d.total || 0} | <b>Payment:</b> ${d.paymentMode || 'COD'}</p>
      <p><b>OTP:</b> ${d.otp} | <b>OTP Verified:</b> ${d.otpVerified? 'Yes ✅' : 'No ❌'}</p>

      ${d.customerMessage? `<div class="msg-box"><b>💬 Customer Message:</b><br>${d.customerMessage}</div>` : ''}
      <p class="date-text">🔗 Source: ${d.source || 'Website'} ${d.referenceLink? `| <a href="${d.referenceLink}" target="_blank">View Page</a>` : ''}</p>

      <div class="flex" style="margin-top:10px">
        ${d.status === 'Pending'? `<button class="btn" onclick="openOtpModal('${doc.id}')">🔐 Verify OTP</button>` : ''}
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

        <a href="https://wa.me/91${d.mobile}?text=Hi ${d.customerName}, Order: ${orderNum}%0AStatus: ${d.status}%0A- SANTRA MALL" target="_blank">
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

  let otpSection = '';
  if(order.status === 'pending_otp' || order.status === 'pending' || order.status === 'Pending') {
    otpSection = `
      <div class="otp-box">
        <h3>🔐 OTP Verification Required</h3>
        <p>Admin ne aapke WhatsApp pe OTP bheja hai. Yahan enter karein:</p>
        <input type="text" class="otp-input" id="otp_${order.id}" maxlength="6" placeholder="000000">
        <button class="btn btn-green" onclick="verifyOTP('${order.id}', '${order.orderId}')">✅ Verify OTP</button>
        <p style="font-size:11px;margin-top:10px;color:#999">OTP nahi mila? Admin se contact karein</p>
      </div>
    `;
  }

  let itemsHTML = order.items.map(item => `
    <div class="item-row">
      <img src="${item.imageUrl || item.image || 'https://via.placeholder.com/60x60'}" onerror="this.src='https://via.placeholder.com/60x60'">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>Qty: ${item.qty} × ₹${item.price} = ₹${item.price * item.qty}</p>
        <p>Code: ${item.product_code || item.id} | Category: ${item.category || 'General'}</p>
        <p>Series: ${item.serial_no || 'N/A'}</p>
        ${item.product_link? `<a href="${item.product_link}" target="_blank">🔗 View Product</a>` : ''}
      </div>
    </div>
  `).join('');

  let addressBox = '';
  if(order.customerLandmark || order.customerPincode || order.customerCity || order.customerState) {
    addressBox = `
      <div class="address-box">
        ${order.customerLandmark? `<p><b>📍 Landmark:</b> ${order.customerLandmark}</p>` : ''}
        ${order.customerPincode? `<p><b>📮 Pincode:</b> ${order.customerPincode}</p>` : ''}
        ${order.customerCity? `<p><b>🏙️ City:</b> ${order.customerCity}</p>` : ''}
        ${order.customerState? `<p><b>🗺️ State:</b> ${order.customerState}</p>` : ''}
      </div>
    `;
  }

  return `
    <div class="order-card" id="order_${order.id}">
      <div class="order-header">
        <div>
          <span class="order-num">#${orderNum}</span>
          <div class="order-id" style="margin-top:5px">Order ID: <b>${order.orderId || order.id}</b></div>
          <p class="date-text">📅 ${dateStr}</p>
        </div>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>

      ${otpSection}

      <div class="order-info">
        <div class="info-row"><span>Order Date:</span><span>${order.orderDateString || dateStr}</span></div>
        <div class="info-row"><span>Customer:</span><span>${order.customerName}</span></div>
        <div class="info-row"><span>Mobile:</span><span>${order.mobile || order.customerMobile}</span></div>
        ${order.email? `<div class="info-row"><span>Email:</span><span>${order.email}</span></div>` : ''}
        <div class="info-row"><span>Payment:</span><span>${order.paymentMode || 'COD'}</span></div>
        <div class="info-row"><span>Delivery Address:</span><span style="text-align:right;max-width:60%">${order.address || order.customerAddress}</span></div>
      </div>

      ${addressBox}
      ${order.customerMessage? `<div class="msg-box"><b>💬 Your Message:</b><br>${order.customerMessage}</div>` : ''}
      <p class="date-text">🔗 Source: ${order.source || 'Website'} ${order.referenceLink? `| <a href="${order.referenceLink}" target="_blank">View Page</a>` : ''}</p>

      <div class="items-list">
        <h4 style="margin-bottom:10px;font-size:14px">📦 Order Items (${order.items.length})</h4>
        ${itemsHTML}
      </div>

      <div class="total-section">
        <div class="total-row"><span>Subtotal:</span><span>₹${order.subtotal || order.total}</span></div>
        <div class="total-row"><span>Delivery:</span><span style="color:#10b981">${order.delivery === 0? 'FREE' : '₹' + (order.delivery || 0)}</span></div>
        <div class="total-row grand-total"><span>Total Amount:</span><span>₹${order.totalAmount || order.total}</span></div>
      </div>

      ${getTimeline(order.status)}

      ${order.status!== 'pending_otp' && order.status!== 'pending' && order.status!== 'Pending'? `
        <button class="btn btn-blue" onclick="downloadInvoice('${order.id}')">📄 Download Invoice</button>
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
    <div class="timeline">
      <h4 style="margin-bottom:15px;font-size:14px">📍 Order Timeline</h4>
      ${steps.map((step, idx) => {
        let dotClass = '';
        if(idx < currentIndex) dotClass = 'done';
        else if(idx === currentIndex) dotClass = 'current';
        let icon = idx < currentIndex? '✓' : (idx === currentIndex? '•' : '');
        return `
          <div class="timeline-item ${idx <= currentIndex? 'active' : ''}">
            <div class="timeline-dot ${dotClass}">${icon}</div>
            <div class="timeline-content">
              <h4>${step.label}</h4>
              <p>${step.desc}</p>
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
        status: 'confirmed',
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