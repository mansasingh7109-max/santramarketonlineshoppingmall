
// SANTRA MALL V8 FINAL - NO VERSION NEEDED - 4 SCREENSHOT MIX - OLD share22julyjan.js RESTORED
console.log("V8 FINAL NO VERSION - Old long message");
window.getBaseId=window.getBaseId||function(id){return String(id).split('_')[0].split('-')[0].split(' ')[0].trim();};
window.getProductPageLink=function(id){return (location.pathname.includes('/santramarketonlineshoppingmall/')?'/santramarketonlineshoppingmall/':'/')+"product.html?id="+window.getBaseId(id);};
window.getUniversalImage=function(p){if(!p)return null;let f=['image','imageUrl','thumbnail','photo','img'];for(let k of f){let v=p[k];if(v&&typeof v==='string'&&v.startsWith('http')&&!v.includes('placeholder'))return v.trim();}return null;};
window.buildSantraMallWhatsAppMessage=function(o){
 let orderId=o.orderId||localStorage.getItem('lastOrderId')||'SM'+Date.now();
 let dateStr=new Date().toLocaleString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
 let cart=[];try{cart=JSON.parse(localStorage.getItem(window.CART_KEY||"santraMallCart_v2")||"[]");if(!Array.isArray(cart)) cart=Object.values(cart);}catch(e){}
 let c=o.customer||JSON.parse(localStorage.getItem('santra_customer')||'{}')||{};let name=c.name||o.name||"__________";let mobile=c.mobile||localStorage.getItem('santra_mobile')||o.mobile||"__________";let email=c.email||o.email||"";let address=c.address||o.address||"__________";
 let BASE_URL="https://santramarketshoppingmall.web.app";let subtotal=0;let txt="";
 txt+=`🛒 *NEW ORDER - SANTRA MALL - FINAL orders.html* 🛒\nOrder ID: ${orderId}\nDate: ${dateStr}\nVia: Share Cart -> share-otp-verify.html -> orders.html FINAL\n_________________________________\n\n`;
 cart.forEach((it,idx)=>{let size=it.size||it.variant||'M';let qty=parseInt(it.qty)||1;let price=parseFloat(it.price)||0;let itemTotal=price*qty;subtotal+=itemTotal;let code=it.code||it.productCode||it.id||'N/A';let nameP=it.name||it.productName||'Product';let cleanId=(it.id||code||'').toString().split('_')[0].split('-')[0];txt+=`${idx+1}. *${nameP}* - ${BASE_URL}/product.html?id=${cleanId}\nSize: ${size}\nQty: ${qty} x ₹${price} = ₹${itemTotal}\nCode: ${code}\n\n`;});
 let delivery=subtotal>=500?0:49;let grandTotal=subtotal+delivery;
 txt+=`_________________________________\n*Subtotal: ₹${subtotal}*\n*Delivery: ${delivery===0?"FREE":"₹"+delivery}*\n*🧾 GRAND TOTAL: ₹${grandTotal}*\n_________________________________\n\n*♦️ Customer Details:*\nName: ${name}\nMobile: ${mobile}\nEmail: ${email||'-'}\nAddress: ${address}\n\n*📝 Verify: ${BASE_URL}/share-otp-verify.html?mobile=${mobile}&orderId=${orderId}*\n*📦 Orders: ${BASE_URL}/orders.html?mobile=${mobile} - FINAL*\n\n*>> OTP ke bina order confirm nahi hoga - share-otp-verify.html <<*`;
 return txt;
};
window.shareCart=function(){let oid='SM'+Date.now();localStorage.setItem('lastOrderId',oid);let m=window.buildSantraMallWhatsAppMessage({orderId:oid});window.open("https://wa.me/"+(window.ADMIN_WHATSAPP||"918769171078")+"?text="+encodeURIComponent(m),'_blank');setTimeout(()=>{if(typeof goToVerifyPage==='function')goToVerifyPage(oid,localStorage.getItem('santra_mobile')||'', 'share_link','8769171078','share_js_shareCart');else location.href="https://santramarketshoppingmall.web.app/share-otp-verify.html?orderId="+oid;},800);};
console.log("V8 FINAL - OLD LONG MESSAGE - NO VERSION - LAST LINE OK");