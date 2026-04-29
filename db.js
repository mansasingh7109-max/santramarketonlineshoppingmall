// SANTRA MALL DATABASE - FINAL VERSION v4
var DB = {
    products: [
        {id: 1, name: "Coffee Set", price: 80, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", category: "Home", desc: "Premium Coffee Set", stock: 50},
        {id: 2, name: "Bluetooth Speaker", price: 1299, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", category: "Electronics", desc: "Wireless Speaker", stock: 30},
        {id: 3, name: "Cotton Kurti", price: 599, img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", category: "Fashion", desc: "Comfortable Kurti", stock: 100},
        {id: 4, name: "Face Cream", price: 249, img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", category: "Beauty", desc: "Herbal Face Cream", stock: 75}
    ],
    categories: [
        {id:1, name:"Fashion", img:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200", type:"image"},
        {id:2, name:"Electronics", img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200", type:"image"},
        {id:3, name:"Home", img:"https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200", type:"image"},
        {id:4, name:"Beauty", img:"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200", type:"image"}
    ],
    users: [
        {id:1, name:"Manisha Tak", email:"manishatak07@gmail.com", pass:"admin123", role:"admin", mobile:"9001654667", mobileVerified: true}
    ],
    orders: [],
    cart: [],
    otps: [],
    enquiries: [],
    searchHistory: [],
    customerForms: [],
    media: [],
    formSettings: {
        name: true,
        mobile: true,
        email: false,
        address: true,
        city: true,
        pincode: true,
        landmark: false
    },
    settings: {
        siteName: "SANTRA SHOPPING MALL", 
        logo: "🛍️ SANTRA MALL", 
        primaryColor: "#e40046",
        bgColor: "#f1f3f6", 
        textColor: "#212121", 
        fontFamily: "Arial, sans-serif",
        fontSize: "16px", 
        bgImage: "", 
        delivery: 49, 
        freeDeliveryAbove: 499, 
        paytmQR: "",
        upiId: "",
        siteStatus: "active",
        requiredFields: { checkout: ["name", "mobile", "address", "city", "pin"], signup: ["email", "pass", "mobile"] }
    }
};

// Load saved data from localStorage
const saved = localStorage.getItem('SANTRA_DB');
if(saved) {
    try {
        const oldDB = JSON.parse(saved);
        DB = {
            ...DB,
            ...oldDB,
            products: oldDB.products?.length ? oldDB.products : DB.products,
            categories: oldDB.categories?.length ? oldDB.categories : DB.categories,
            users: oldDB.users?.length ? oldDB.users : DB.users,
            settings: { ...DB.settings, ...oldDB.settings },
            formSettings: { ...DB.formSettings, ...oldDB.formSettings }
        };
        // Ensure arrays exist
        if(!DB.otps) DB.otps = [];
        if(!DB.enquiries) DB.enquiries = [];
        if(!DB.searchHistory) DB.searchHistory = [];
        if(!DB.customerForms) DB.customerForms = [];
        if(!DB.media) DB.media = [];
        if(!DB.orders) DB.orders = [];
        if(!DB.cart) DB.cart = [];
        if(!DB.categories) DB.categories = [];
    } catch(e) {
        console.log('Error loading DB, using default');
    }
}

// Ensure admin exists - only if not in users array
if(!DB.users.find(u=>u.email==="manishatak07@gmail.com")){
    DB.users.push({id:1,name:"Manisha Tak",email:"manishatak07@gmail.com",pass:"admin123",role:"admin",mobile:"9001654667",mobileVerified:true});
}

// Core functions
function saveDB(){ 
    localStorage.setItem('SANTRA_DB', JSON.stringify(DB)); 
    console.log('DB Saved. Products:', DB.products.length, 'Orders:', DB.orders.length, 'Cart:', DB.cart.length, 'Categories:', DB.categories.length);
}

function addProduct(productData) {
    productData.id = Date.now();
    productData.date = new Date().toISOString();
    DB.products.push(productData);
    saveDB();
    return productData;
}

function deleteProduct(productId) {
    DB.products = DB.products.filter(p => p.id != productId);
    saveDB();
}

function generateOTP(){ 
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}

function sendOTP(type, value, otp){
    alert(`📱 OTP for ${value}: ${otp}\n\nNote: Demo mode - Production me SMS/Email jayega`); 
    console.log(`OTP for ${type} ${value}: ${otp}`);
    DB.otps.push({ type: type, value: value, otp: otp, time: Date.now(), used: false });
    saveDB();
}

function verifyOTP(type, value, userOTP){
    DB.otps = DB.otps.filter(o => Date.now() - o.time < 5*60*1000); // 5 min expiry
    const found = DB.otps.find(o => o.type === type && o.value === value && o.otp === userOTP && !o.used);
    if(found){ found.used = true; saveDB(); return true; }
    return false;
}

function saveCustomerForm(uid, formType, data){
    DB.customerForms.push({ uid: uid, formType: formType, data: data, time: Date.now() });
    saveDB();
}

// First time setup
if(!localStorage.getItem('SANTRA_DB')){
    saveDB();
    console.log('New DB created');
}

console.log('DB Loaded Successfully:', DB);