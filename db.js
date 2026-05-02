// SANTRA MALL DATABASE - FINAL VERSION v7 - SECURE
// Fix: Removed console logs, Fixed variable conflict, Old data safe

var SANTRA_DB = {
    products: [],
    categories: [],
    orders: [],
    users: [],
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

// FIX 1: Load saved data from localStorage - Old data safe rahega
const saved = localStorage.getItem('santra_db');
if(saved) {
    try {
        const oldDB = JSON.parse(saved);
        // Merge old data with new structure
        SANTRA_DB = {
            ...SANTRA_DB,
            ...oldDB,
            products: oldDB.products || SANTRA_DB.products,
            categories: oldDB.categories || SANTRA_DB.categories,
            users: oldDB.users || SANTRA_DB.users,
            orders: oldDB.orders || SANTRA_DB.orders,
            cart: oldDB.cart || SANTRA_DB.cart,
            settings: { ...SANTRA_DB.settings, ...oldDB.settings },
            formSettings: { ...SANTRA_DB.formSettings, ...oldDB.formSettings }
        };
        // Ensure arrays exist
        if(!SANTRA_DB.otps) SANTRA_DB.otps = [];
        if(!SANTRA_DB.enquiries) SANTRA_DB.enquiries = [];
        if(!SANTRA_DB.searchHistory) SANTRA_DB.searchHistory = [];
        if(!SANTRA_DB.customerForms) SANTRA_DB.customerForms = [];
        if(!SANTRA_DB.media) SANTRA_DB.media = [];
    } catch(e) {
        console.log('Error loading DB, using default');
    }
}

// FIX 2: Ensure admin exists - Password hardcoded hata diya
if(!SANTRA_DB.users || SANTRA_DB.users.length === 0){
    // Sirf pehli baar admin banega - Firebase Auth use karna hai
    SANTRA_DB.users = [{id:1, name:"Manisha Tak", email:"mansasingh7109@gmail.com", pass:"", role:"admin", mobile:"9001654667", mobileVerified:true}];
} else {
    // Agar admin hai to details update kar de, password nahi
    let adminExists = SANTRA_DB.users.find(u => u.role === 'admin');
    if(!adminExists){
        SANTRA_DB.users.push({id:Date.now(), name:"Manisha Tak", email:"mansasingh7109@gmail.com", pass:"", role:"admin", mobile:"9001654667", mobileVerified:true});
    } else {
        // Existing admin ko update kar - PASSWORD NAHI
        adminExists.email = "mansasingh7109@gmail.com";
        adminExists.mobile = "9001654667";
        adminExists.name = "Manisha Tak";
    }
}

// FIX 3: Default products/categories agar khali hai to
if(!SANTRA_DB.products || SANTRA_DB.products.length === 0){
    SANTRA_DB.products = [
        {id: 1, name: "Coffee Set", price: 80, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", category: "Home", desc: "Premium Coffee Set", stock: 50},
        {id: 2, name: "Bluetooth Speaker", price: 1299, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", category: "Electronics", desc: "Wireless Speaker", stock: 30},
        {id: 3, name: "Cotton Kurti", price: 599, img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", category: "Fashion", desc: "Comfortable Kurti", stock: 100},
        {id: 4, name: "Face Cream", price: 249, img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", category: "Beauty", desc: "Herbal Face Cream", stock: 75}
    ];
}

if(!SANTRA_DB.categories || SANTRA_DB.categories.length === 0){
    SANTRA_DB.categories = [
        {id:1, name:"Fashion", img:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200", type:"image"},
        {id:2, name:"Electronics", img:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200", type:"image"},
        {id:3, name:"Home", img:"https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200", type:"image"},
        {id:4, name:"Beauty", img:"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200", type:"image"}
    ];
}

// Core functions
function saveDB(){ 
    localStorage.setItem('santra_db', JSON.stringify(SANTRA_DB)); 
    console.log('DB Saved. Products:', SANTRA_DB.products.length, 'Orders:', SANTRA_DB.orders.length);
}

function addProduct(productData) {
    productData.id = Date.now();
    productData.date = new Date().toISOString();
    SANTRA_DB.products.push(productData);
    saveDB();
    return productData;
}

function deleteProduct(productId) {
    SANTRA_DB.products = SANTRA_DB.products.filter(p => p.id != productId);
    saveDB();
}

function generateOTP(){ 
    return Math.floor(100000 + Math.random() * 900000).toString(); 
}

function sendOTP(type, value, otp){
    alert(`📱 OTP for ${value}: ${otp}\n\nNote: Demo mode - Production me SMS/Email jayega`); 
    console.log(`OTP sent for ${type}: ${value}`); // Password hataya
    SANTRA_DB.otps.push({ type: type, value: value, otp: otp, time: Date.now(), used: false });
    saveDB();
}

function verifyOTP(type, value, userOTP){
    SANTRA_DB.otps = SANTRA_DB.otps.filter(o => Date.now() - o.time < 5*60*1000);
    const found = SANTRA_DB.otps.find(o => o.type === type && o.value === value && o.otp === userOTP && !o.used);
    if(found){ found.used = true; saveDB(); return true; }
    return false;
}

function saveCustomerForm(uid, formType, data){
    SANTRA_DB.customerForms.push({ uid: uid, formType: formType, data: data, time: Date.now() });
    saveDB();
}

// First time setup
if(!localStorage.getItem('santra_db')){
    saveDB();
    console.log('New DB created with key: santra_db');
}

// SECURITY: Password console me print nahi hoga
console.log('DB Loaded Successfully. Users:', SANTRA_DB.users.length);
// console.log('Admin Email:', SANTRA_DB.users.find(u=>u.role==='admin')?.email); // HATA DIYA
// console.log('Admin Password:', SANTRA_DB.users.find(u=>u.role==='admin')?.pass); // HATA DIYA