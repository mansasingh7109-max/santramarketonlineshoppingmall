// ============================================
// SANTRA MALL - PDF GENERATOR + TMPFILES UPLOAD
// Version: 4.0 - 10/06/2026
// ============================================

/*
=================================
OLD CODE BACKUP - PURANA CODE
=================================

// ❌ OLD: Firebase Storage - Spark plan me kaam nahi karta
// async function uploadPDFToFirebase(pdfBlob, orderId) {
//   const storage = firebase.storage();
//   const storageRef = storage.ref(`invoices/${orderId}.pdf`);
//   await storageRef.put(pdfBlob);
//   return await storageRef.getDownloadURL();
// }

// ❌ OLD: Cloudinary - Mobile pe upload preset nahi banta
// const CLOUDINARY_CLOUD_NAME = "dxy123abc";
// const CLOUDINARY_UPLOAD_PRESET = "santra_mall_pdf";

=================================
*/

// ✅ NEW: TMPFILES.ORG UPLOAD FUNCTION
async function uploadPDFToTmpfiles(pdfBlob, orderId) {
    console.log('☁️ Uploading to tmpfiles.org...');
    
    const formData = new FormData();
    formData.append('file', pdfBlob, `Invoice_${orderId}.pdf`);
    
    try {
        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📦 Tmpfiles Response:', result);
        
        if (result.status === 'success' && result.data && result.data.url) {
            // tmpfiles.org ka direct download link banate hain
            // https://tmpfiles.org/abc123/Invoice_SM123.pdf → https://tmpfiles.org/dl/abc123/Invoice_SM123.pdf
            const directLink = result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            console.log('✅ PDF Upload Success:', directLink);
            return directLink;
        } else {
            throw new Error('Upload response invalid: ' + JSON.stringify(result));
        }
    } catch (error) {
        console.error('❌ Tmpfiles upload error:', error);
        throw new Error('PDF upload failed: ' + error.message);
    }
}

// ✅ PDF GENERATE FUNCTION - jsPDF
async function generateInvoicePDF(customer, cart, orderId, serialNo, dateStr) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Page settings
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    
    // ===== HEADER =====
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(228, 0, 70);
    doc.text('SANTRA MALL', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Trusted Shopping Partner', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    
    // Line separator
    doc.setDrawColor(228, 0, 70);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;
    
    // ===== INVOICE DETAILS =====
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 15, yPos);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${orderId}`, pageWidth - 15, yPos - 5, { align: 'right' });
    doc.text(`Serial No: ${serialNo}`, pageWidth - 15, yPos, { align: 'right' });
    doc.text(`Date: ${dateStr}`, pageWidth - 15, yPos + 5, { align: 'right' });
    yPos += 15;
    
    // ===== CUSTOMER DETAILS =====
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(228, 0, 70);
    doc.text('BILL TO:', 15, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${customer.name}`, 15, yPos);
    yPos += 5;
    doc.text(`Mobile: ${customer.mobile}`, 15, yPos);
    yPos += 5;
    if (customer.email) {
        doc.text(`Email: ${customer.email}`, 15, yPos);
        yPos += 5;
    }
    doc.text(`Address: ${customer.house}, ${customer.area}`, 15, yPos);
    yPos += 5;
    doc.text(`${customer.landmark}, ${customer.city}, ${customer.state} - ${customer.pincode}`, 15, yPos);
    yPos += 5;
    doc.text(`Payment Mode: ${customer.payment}`, 15, yPos);
    yPos += 10;
    
    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;
    
    // ===== ITEMS TABLE HEADER =====
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(228, 0, 70);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.text('Item', 17, yPos);
    doc.text('Qty', 110, yPos, { align: 'center' });
    doc.text('Price', 140, yPos, { align: 'center' });
    doc.text('Total', pageWidth - 17, yPos, { align: 'right' });
    yPos += 8;
    
    // ===== ITEMS LIST =====
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    
    let subtotal = 0;
    const cartItems = Object.values(cart);
    
    cartItems.forEach((item, index) => {
        if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }
        
        const itemName = item.name.length > 35 ? item.name.substring(0, 35) + '...' : item.name;
        const qty = item.qty || 1;
        const price = item.price || 0;
        const total = price * qty;
        subtotal += total;
        
        doc.text(`${index + 1}. ${itemName}`, 17, yPos);
        doc.text(`${qty}`, 110, yPos, { align: 'center' });
        doc.text(`Rs.${price}`, 140, yPos, { align: 'center' });
        doc.text(`Rs.${total}`, pageWidth - 17, yPos, { align: 'right' });
        
        yPos += 5;
        
        // Product code
        const code = item.productCode || item.code || 'SM-' + (item.id || '');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Code: ${code}`, 20, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        yPos += 6;
    });
    
    // ===== TOTALS =====
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;
    
    const delivery = subtotal >= 500 ? 0 : 49;
    const grandTotal = subtotal + delivery;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', pageWidth - 60, yPos);
    doc.text(`Rs.${subtotal}`, pageWidth - 17, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Delivery Charge:', pageWidth - 60, yPos);
    doc.text(delivery === 0 ? 'FREE' : `Rs.${delivery}`, pageWidth - 17, yPos, { align: 'right' });
    yPos += 8;
    
    // Total line
    doc.setDrawColor(228, 0, 70);
    doc.setLineWidth(0.8);
    doc.line(pageWidth - 80, yPos, pageWidth - 15, yPos);
    yPos += 6;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(228, 0, 70);
    doc.text('GRAND TOTAL:', pageWidth - 60, yPos);
    doc.text(`Rs.${grandTotal}`, pageWidth - 17, yPos, { align: 'right' });
    yPos += 15;
    
    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for shopping with SANTRA MALL!', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('For support: WhatsApp +91 7725960293 | Email: santramarket@gmail.com', pageWidth / 2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Visit: https://santramarketshoppingmall.firebaseapp.com', pageWidth / 2, yPos, { align: 'center' });
    
    // ===== CONVERT TO BLOB =====
    const pdfBlob = doc.output('blob');
    console.log('✅ PDF Generated Successfully');
    return pdfBlob;
}

console.log('✅ PDF Generator Loaded - Tmpfiles.org Version');
