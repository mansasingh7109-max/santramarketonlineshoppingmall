// SANTRA DB - FINAL v24 - Firebase Migration Complete - 13/5/2026
var SANTRA_DB = {products:[],users:[],cart:[],orders:[],settings:{},categories:[],otps:[],enquiries:[],searchHistory:[],customerForms:[],media:[],formSettings:{name:true,mobile:true,email:false,address:true,city:true,pincode:true,landmark:false}};

var DB_VERSION = "v24";
var savedVersion = localStorage.getItem('santra_db_version');
var saved = localStorage.getItem('santra_db');

if(saved && savedVersion === DB_VERSION) {
    try {
        SANTRA_DB = JSON.parse(saved);
    } catch(e) {
        console.log('Old data corrupt, using fresh');
    }
}

// ========== SETTINGS - DEFAULT ==========
if(!SANTRA_DB.settings ||!SANTRA_DB.settings.siteName) {
    SANTRA_DB.settings = {
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
        helpdeskPhone: "9829508335",
        helpdeskEmail: "mansasingh7109@gmail.com",
        helpdeskWhatsapp: "9829508335",
        helpdeskHours: "Mon-Sat: 12 AM - 12 PM",
        helpdeskAbout: "Welcome to SANTRA MALL!",
        requiredFields: { checkout: ["name", "mobile", "address", "city", "pin"], signup: ["email", "pass", "mobile"] }
    };
}

// ===== ADMIN USER - FIREBASE MIGRATION =====
if(!SANTRA_DB.users || SANTRA_DB.users.length === 0){
    SANTRA_DB.users = [{
        id:1,
        name:"Manisha Tak",
        email:"mansasingh7109@gmail.com",
        pass:"", // FIREBASE USE KAR RAHE HAIN - YAHAN PASSWORD NAHI RAKHENGE
        role:"admin",
        mobile:"9001654667",
        mobileVerified:true
    }];
} else {
    var adminExists = false;
    for(var u=0; u<SANTRA_DB.users.length; u++) {
        if(SANTRA_DB.users[u].role === 'admin') {
            adminExists = true;
            SANTRA_DB.users[u].email = "mansasingh7109@gmail.com";
            SANTRA_DB.users[u].mobile = "9001654667";
            SANTRA_DB.users[u].name = "Manisha Tak";
            SANTRA_DB.users[u].pass = ""; // FIREBASE MIGRATION - PASSWORD KHALI KAR DIYA
            break;
        }
    }
    if(!adminExists){
        SANTRA_DB.users.push({
            id:Date.now(),
            name:"Manisha Tak",
            email:"mansasingh7109@gmail.com",
            pass:"", // FIREBASE USE
            role:"admin",
            mobile:"9001654667",
            mobileVerified:true
        });
    }
}

/*
========== OLD CODE BACKUP ==========
Purana code jisme hardcoded password tha.
Security ke liye hata diya. Firebase use karo.
========== OLD CODE BACKUP END ==========
*/

// ========== PRODUCTS ==========
if(!SANTRA_DB.products || SANTRA_DB.products.length === 0){
    SANTRA_DB.products = [
        {id: 1, name: "Coffee Set", price: 80, mrp: 120, img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", cat: "Home", category: "Home", desc: "Premium Coffee Set", stock: 50, product_code: "H-1"},
        {id: 2, name: "Bluetooth Speaker", price: 1299, mrp: 1999, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", cat: "Electronics", category: "Electronics", desc: "Wireless Speaker", stock: 30, product_code: "E-1"},
        {id: 3, name: "Cotton Kurti", price: 599, mrp: 999, img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", cat: "Fashion", category: "Fashion", desc: "Comfortable Kurti", stock: 100, product_code: "D-1"},
        {id: 4, name: "Face Cream", price: 249, mrp: 399, img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", cat: "Beauty", category: "Beauty", desc: "Herbal Face Cream", stock: 75, product_code: "B-1"},
        {id: 5, name: "Pn", price: 500, mrp: 800, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400", cat: "Fashion", category: "Fashion", desc: "Stylish Dress", stock: 50, product_code: "Dress-1"},
        {id: 6, name: "Pins", price: 1300, mrp: 2000, img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", cat: "Beauty", category: "Beauty", desc: "Designer Pins", stock: 30, product_code: "Beauty-1"},
        {id: 7, name: "Pink", price: 13005, mrp: 20000, img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400", cat: "Fashion", category: "Fashion", desc: "Pink Designer Outfit", stock: 25, product_code: "Fashion-5"},
        {id: 8, name: "Blue", price: 13005, mrp: 20000, img: "https://images.unsplash.com/photo-1595777457580-95e0592d32d0?w=400", cat: "Fashion", category: "Fashion", desc: "Blue Designer Suit", stock: 20, product_code: "Fashion-1"},
        {id: 9, name: "Detol handwash", price: 1000, mrp: 1200, img: "https://i.ibb.co/xyz123/detol.jpg", cat: "Home", category: "Home", desc: "Dettol Handwash 200ml", stock: 100, product_code: "H-2"}
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

var CATEGORY_PREFIX = {"Home":"H","Fashion":"D","Dress":"D","Beauty":"B","Electronics":"E","Food":"F","Pins":"P","General":"X"};

function ensureProductCodes() {
    var categoryCount = {};
    SANTRA_DB.products.sort(function(a, b) {
        var catA = a.category || a.cat || "General";
        if(typeof catA === 'object' && catA!== null) catA = catA.name || catA.id || "General";
        var catB = b.category || b.cat || "General";
        if(typeof catB === 'object' && catB!== null) catB = catB.name || catB.id || "General";
        return String(catA).localeCompare(String(catB));
    });
    for(var i=0; i<SANTRA_DB.products.length; i++) {
        var p = SANTRA_DB.products[i];
        var c = p.category || p.cat || "General";
        if(typeof c === 'object' && c!== null) c = c.name || c.id || "General";

        if(!p.product_code) {
            if (!categoryCount[c]) {
                categoryCount[c] = 1;
            } else {
                categoryCount[c]++;
            }
            var pr = CATEGORY_PREFIX[c] || "X";
            p.serial_no = categoryCount[c];
            p.category_prefix = pr;
            p.product_code = pr + '-' + categoryCount[c];
            p.cat = c;
            p.category = c;
        } else {
            p.cat = c;
            p.category = c;
        }
        p.product_link = 'https://santramall.com/product/' + String(p.product_code).toLowerCase();
    }
}

ensureProductCodes();

function saveDB(){
    try {
        localStorage.setItem('santra_db', JSON.stringify(SANTRA_DB));
        localStorage.setItem('santra_db_version', DB_VERSION);
    } catch(e) {
        console.log('Save failed:', e);
        if(e.name === 'QuotaExceededError'){
            localStorage.removeItem('santra_cart');
            localStorage.removeItem('pending_whatsapp_order_general');
            alert('Storage full! Cart clear kar diya. Refresh karo.');
        }
    }
}

saveDB();
console.log('DB v24 Loaded. Products:', SANTRA_DB.products.length, 'Users:', SANTRA_DB.users.length, 'Admin Pass:', SANTRA_DB.users[0]?.pass === ''? 'EMPTY-Firebase Use' : 'HARDCODED');