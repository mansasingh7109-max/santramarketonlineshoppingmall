// share.js
function shareCart() {
  alert('Button working!'); // Test ke liye
  let cart = JSON.parse(localStorage.getItem('santra_cart') || '{}');
  console.log(cart);
}

function addShareButtons() {
    const shareHTML = `
    <div style="margin:10px 0; display:flex; gap:8px; align-items:center;">
      <span style="font-size:14px; color:#666;">Share:</span>
      <button onclick="window.open('https://wa.me/?text='+encodeURIComponent(document.title+' - '+location.href),'_blank')" style="background:#25D366;color:white;border:none;padding:6px 10px;border-radius:5px;font-size:13px;">WhatsApp</button>
      <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href),'_blank')" style="background:#1877F2;color:white;border:none;padding:6px 10px;border-radius:5px;font-size:13px;">Facebook</button>
      <button onclick="navigator.share?navigator.share({title:document.title,text:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>alert('Link Copied!'))" style="background:#333;color:white;border:none;padding:6px 10px;border-radius:5px;font-size:13px;">More</button>
    </div>
  `;

    // Current script tag ke baad buttons add kar dega
    const currentScript = document.currentScript;
    if (currentScript) {
        currentScript.insertAdjacentHTML("afterend", shareHTML);
    }
}

addShareButtons();
// share.js - Only for My Cart tab

/**
 * Share My Cart Function
 * Ye function sirf Cart tab ke items ko share karega
 * My Choice tab me iska koi effect nahi hoga
 */
export const shareMyCart = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    alert("Your cart is empty. Add items to share.");
    return;
  }

  let shareText = `🛒 Check out my cart:\n\n`;
  let totalAmount = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    shareText += `${index + 1}. ${item.name}\n`;
    shareText += `   Price: ₹${item.price} x ${item.quantity} = ₹${itemTotal}\n`;
    shareText += `   Code: ${item.code}\n\n`;
  });

  shareText += `Total Amount: ₹${totalAmount}\n`;
  shareText += `Delivery: FREE\n\n`;
  shareText += `Order now: ${window.location.origin}/cart`;

  if (navigator.share) {
    navigator.share({
      title: 'My Shopping Cart',
      text: shareText,
      url: window.location.origin + '/cart'
    })
    .then(() => console.log('Cart shared successfully'))
    .catch((error) => console.log('Error sharing:', error));
  } 
  else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Cart details copied to clipboard! You can paste and share it.');
    }).catch(() => {
      alert('Sharing not supported. Please copy manually:\n\n' + shareText);
    });
  }
};

/**
 * Share Single Product Function
 * Ye Cart me har product ke niche wale "Share" button ke liye hai
 */
export const shareSingleProduct = (product) => {
  const shareText = `Check this out: ${product.name}\nPrice: ₹${product.price}\nCode: ${product.code}\n\nBuy here: ${window.location.origin}/product/${product.code}`;

  if (navigator.share) {
    navigator.share({
      title: product.name,
      text: shareText,
      url: `${window.location.origin}/product/${product.code}`
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Product link copied to clipboard!');
    });
  }
};