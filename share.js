// share.js - SANTRA MALL

/**
 * Share My Cart Function - Direct WhatsApp Open
 * Ye function Cart tab ke items ko WhatsApp pe share karega
 */
function shareCart() {
    let cart = JSON.parse(localStorage.getItem("santra_cart") || "{}");
    let baseURL = "https://santramarketshoppingmall.firebaseapp.com";

    if (Object.keys(cart).length === 0) {
        alert("❌ Cart is empty!");
        return;
    }

    // Grand Total Calculate
    let subtotal = Object.values(cart).reduce((sum, item) => {
        let qty = parseInt(item.qty) || 1;
        let price = parseFloat(item.price) || 0;
        return sum + price * qty;
    }, 0);
    let delivery = subtotal >= 500 ? 0 : 49;
    let grandTotal = subtotal + delivery;

    // Share Text Banao
    let text = "🛒 *My Cart - SANTRA MALL* 🛒\n\n";
    let count = 1;

    Object.keys(cart).forEach(key => {
        let item = cart[key];
        let qty = parseInt(item.qty) || 1;
        let price = parseFloat(item.price) || 0;
        let itemTotal = price * qty;

        text += `${count}. *${item.name}*\n`;
        text += `Qty: ${qty} x ₹${price} = ₹${itemTotal}\n`;
        text += `Link: ${baseURL}/product.html?id=${item.id || key}\n\n`;
        count++;
    });

    text += `━━━━━━━━━━━━━━━━━━\n`;
    text += `*🧾 GRAND TOTAL: ₹${grandTotal}*\n`;
    text += `━━━━━━━━━━━━━━━━━━\n\n`;

    // Order Details Blank
    text += `*📝 Order Details:*\n`;
    text += `Customer Name: ________________\n`;
    text += `Address: ________________\n`;
    text += `Payment Mode: Online / Cash on Delivery\n\n`;
    text += `Shop now at SANTRA MALL 🛒`;

    // Direct WhatsApp App Open
    let whatsappURL = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.location.href = whatsappURL;
}

/**
 * Share My Choice Function
 */
function shareWishlist() {
    let wishlist = JSON.parse(localStorage.getItem("santra_mychoice") || "{}");
    let baseURL = "https://santramarketshoppingmall.firebaseapp.com";

    if (Object.keys(wishlist).length === 0) {
        alert("❌ My Choice is empty!");
        return;
    }

    let text = "💝 *My Choice - SANTRA MALL* 💝\n\n";
    let count = 1;

    Object.keys(wishlist).forEach(key => {
        let item = wishlist[key];
        text += `${count}. *${item.name}*\n`;
        text += `${baseURL}/product.html?id=${item.id || key}\n\n`;
        count++;
    });

    text += `Shop now at SANTRA MALL 🛒`;

    let whatsappURL = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.location.href = whatsappURL;
}

/**
 * Share Single Product Function
 */
function shareProduct(productId, productName, price) {
    const link = `https://santramarketshoppingmall.firebaseapp.com/product.html?id=${productId}`;
    const text = `Check this out: *${productName}*\nPrice: ₹${price}\n\nBuy here: ${link}`;

    let whatsappURL = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.location.href = whatsappURL;
}
