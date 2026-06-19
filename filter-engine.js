let FILTER_CONFIG = {};
let CURRENT_FILTERS = {};

// ✅ Category mapping - Purane/Present/Future sab naam handle karega
const CATEGORY_MAP = {
    // Soap
    soap: "Soap",
    Soap: "Soap",
    "lux soap": "Lux soap",
    "Lux soap": "Lux soap",
    "combo soap": "Combo soap",
    "Combo soap": "Combo soap",

    // Dress/Gown
    dress: "Gown",
    Dress: "Gown",
    gown: "Gown",
    Gown: "Gown",
    "red gown western": "Red gown western",
    "Red gown western": "Red gown western",
    "dress western": "Gown",
    "Dress western": "Gown",

    // Jeans
    jeans: "Blue Denim Jeans",
    Jeans: "Blue Denim Jeans",
    "blue denim jeans": "Blue Denim Jeans",
    "Blue Denim Jeans": "Blue Denim Jeans",

    // Jewellery
    jewellery: "Jewellery combo",
    Jewellery: "Jewellery combo",
    "jewellery combo": "Jewellery combo",
    "Jewellery combo": "Jewellery combo",
    "jewellery set": "Jewellery set",
    "Jewellery set": "Jewellery set",
    bangles: "Bangles",
    Bangles: "Bangles",
    "necklace set": "Necklace set",
    "Necklace set": "Necklace set",

    // Dish wash
    "dish soap": "Dish wash",
    "Dish soap": "Dish wash",
    "dish wash": "Dish wash",
    "Dish wash": "Dish wash",

    // Home item
    "home item": "Plastic Item",
    "Home item": "Plastic Item",
    "plastic item": "Plastic Item",
    "Plastic Item": "Plastic Item",

    // Liquids
    "liquids/oil": "Liquids/Oil",
    "Liquids/Oil": "Liquids/Oil",
    oil: "Liquids/Oil",
    Oil: "Liquids/Oil",

    // General
    general: "General",
    General: "General",

    // Future categories - yahan add kar sakti hai
    furniture: "Furniture",
    Furniture: "Furniture",
    electronics: "Electronics",
    Electronics: "Electronics",
    toys: "Toys",
    Toys: "Toys",
    books: "Books",
    Books: "Books",
    grocery: "Grocery",
    Grocery: "Grocery",
    fabric: "Fabric",
    Fabric: "Fabric"
};

// ✅ AUTO VARIANTS GENERATOR - Nayi category ke liye khud filter banayega
function generateAutoVariants(categoryName) {
    const cat = categoryName.toLowerCase();

    // Common patterns check karke auto filter banao
    if (
        cat.includes("furniture") ||
        cat.includes("sofa") ||
        cat.includes("chair") ||
        cat.includes("table")
    ) {
        return {
            displayName: categoryName,
            filters: [
                {
                    field: "material",
                    label: "Material",
                    type: "checkbox",
                    options: [
                        "Wood",
                        "Metal",
                        "Plastic",
                        "Sheesham",
                        "MDF",
                        "Teak"
                    ]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: ["Brown", "Black", "White", "Walnut", "Natural"]
                },
                {
                    field: "size",
                    label: "Size",
                    type: "radio",
                    options: ["Small", "Medium", "Large", "XL"]
                }
            ]
        };
    }

    if (
        cat.includes("electronic") ||
        cat.includes("mobile") ||
        cat.includes("tv") ||
        cat.includes("laptop")
    ) {
        return {
            displayName: categoryName,
            filters: [
                {
                    field: "brand",
                    label: "Brand",
                    type: "checkbox",
                    options: [
                        "Samsung",
                        "Mi",
                        "Boat",
                        "Apple",
                        "Realme",
                        "OnePlus",
                        "Sony"
                    ]
                },
                {
                    field: "warranty",
                    label: "Warranty",
                    type: "radio",
                    options: ["6 Months", "1 Year", "2 Years"]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: ["Black", "White", "Blue", "Silver"]
                }
            ]
        };
    }

    if (cat.includes("toys") || cat.includes("game")) {
        return {
            displayName: categoryName,
            filters: [
                {
                    field: "age",
                    label: "Age Group",
                    type: "radio",
                    options: ["0-2 Years", "3-5 Years", "6-8 Years", "9+ Years"]
                },
                {
                    field: "type",
                    label: "Type",
                    type: "checkbox",
                    options: [
                        "Educational",
                        "Soft Toys",
                        "Action Figures",
                        "Board Games"
                    ]
                }
            ]
        };
    }

    if (cat.includes("books") || cat.includes("book")) {
        return {
            displayName: categoryName,
            filters: [
                {
                    field: "genre",
                    label: "Genre",
                    type: "checkbox",
                    options: [
                        "Fiction",
                        "Non-Fiction",
                        "Comics",
                        "Educational",
                        "Biography"
                    ]
                },
                {
                    field: "language",
                    label: "Language",
                    type: "radio",
                    options: ["Hindi", "English", "Marathi"]
                }
            ]
        };
    }

    if (
        cat.includes("grocery") ||
        cat.includes("kirana") ||
        cat.includes("food")
    ) {
        return {
            displayName: categoryName,
            filters: [
                {
                    field: "weight",
                    label: "Weight",
                    type: "radio",
                    options: ["250g", "500g", "1kg", "2kg", "5kg"]
                },
                {
                    field: "type",
                    label: "Type",
                    type: "checkbox",
                    options: ["Organic", "Regular", "Premium"]
                },
                {
                    field: "brand",
                    label: "Brand",
                    type: "checkbox",
                    options: ["Tata", "Patanjali", "Fortune", "Aashirvaad"]
                }
            ]
        };
    }

    if (
        cat.includes("fabric") ||
        cat.includes("cloth") ||
        cat.includes("kapda")
    ) {
        return {
            displayName: categoryName,
            filters: [
                {
                    field: "length",
                    label: "Length",
                    type: "radio",
                    options: ["1 Meter", "2 Meter", "3 Meter", "5 Meter"]
                },
                {
                    field: "material",
                    label: "Material",
                    type: "checkbox",
                    options: [
                        "Cotton",
                        "Silk",
                        "Polyester",
                        "Linen",
                        "Georgette",
                        "Chiffon"
                    ]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: [
                        "Red",
                        "Blue",
                        "Green",
                        "Black",
                        "White",
                        "Yellow"
                    ]
                }
            ]
        };
    }

    // Default filter - agar kuch match nahi hua to ye dikhega
    return {
        displayName: categoryName,
        filters: [
            {
                field: "price",
                label: "Price Range",
                type: "radio",
                options: [
                    "Under ₹100",
                    "₹100-₹500",
                    "₹500-₹1000",
                    "Above ₹1000"
                ]
            },
            {
                field: "brand",
                label: "Brand",
                type: "checkbox",
                options: ["Local", "Branded", "Premium"]
            }
        ]
    };
}

function initSmartFilters() {
    console.log("🔥 Filter engine start ho raha hai");

    FILTER_CONFIG = {
        Soap: {
            displayName: "Soap",
            filters: [
                {
                    field: "weight",
                    label: "Weight",
                    type: "radio",
                    options: ["75g", "100g", "125g", "200g"]
                },
                {
                    field: "brand",
                    label: "Brand",
                    type: "checkbox",
                    options: ["Lux", "Dove", "Dettol", "Pears"]
                }
            ]
        },
        "Lux soap": {
            displayName: "Lux Soap",
            filters: [
                {
                    field: "weight",
                    label: "Weight",
                    type: "radio",
                    options: ["75g", "100g", "125g"]
                },
                {
                    field: "variant",
                    label: "Variant",
                    type: "checkbox",
                    options: ["Rose", "Jasmine", "Aloe Vera"]
                }
            ]
        },
        "Combo soap": {
            displayName: "Combo Soap",
            filters: [
                {
                    field: "pack",
                    label: "Pack Size",
                    type: "radio",
                    options: ["Pack of 3", "Pack of 4", "Pack of 6"]
                },
                {
                    field: "weight",
                    label: "Weight Per Soap",
                    type: "radio",
                    options: ["75g", "100g", "125g"]
                }
            ]
        },
        "Dish wash": {
            displayName: "Dish Wash",
            filters: [
                {
                    field: "volume",
                    label: "Volume",
                    type: "radio",
                    options: ["250ml", "500ml", "1L", "2L"]
                },
                {
                    field: "brand",
                    label: "Brand",
                    type: "checkbox",
                    options: ["Vim", "Pril", "Exo", "Dettol"]
                }
            ]
        },
        Gown: {
            displayName: "Gown",
            filters: [
                {
                    field: "size",
                    label: "Size",
                    type: "checkbox",
                    options: ["S", "M", "L", "XL", "XXL", "Free Size"]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: ["Red", "Blue", "Black", "Pink", "White", "Green"]
                },
                {
                    field: "fabric",
                    label: "Fabric",
                    type: "checkbox",
                    options: ["Georgette", "Silk", "Net", "Cotton", "Satin"]
                }
            ]
        },
        "Red gown western": {
            displayName: "Red Gown",
            filters: [
                {
                    field: "size",
                    label: "Size",
                    type: "checkbox",
                    options: ["S", "M", "L", "XL"]
                },
                {
                    field: "fabric",
                    label: "Fabric",
                    type: "checkbox",
                    options: ["Georgette", "Silk", "Net"]
                }
            ]
        },
        "Blue Denim Jeans": {
            displayName: "Jeans",
            filters: [
                {
                    field: "size",
                    label: "Size",
                    type: "checkbox",
                    options: ["28", "30", "32", "34", "36", "38"]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: ["Blue", "Black", "Grey", "Light Blue"]
                },
                {
                    field: "fit",
                    label: "Fit",
                    type: "radio",
                    options: ["Slim Fit", "Regular Fit", "Skinny", "Bootcut"]
                }
            ]
        },
        "Jewellery combo": {
            displayName: "Jewellery Combo",
            filters: [
                {
                    field: "material",
                    label: "Material",
                    type: "checkbox",
                    options: ["Gold Plated", "Silver", "Artificial", "Kundan"]
                },
                {
                    field: "occasion",
                    label: "Occasion",
                    type: "radio",
                    options: ["Wedding", "Party", "Festival", "Daily Wear"]
                }
            ]
        },
        "Jewellery set": {
            displayName: "Jewellery Set",
            filters: [
                {
                    field: "material",
                    label: "Material",
                    type: "checkbox",
                    options: ["Gold Plated", "Silver", "Artificial"]
                },
                {
                    field: "includes",
                    label: "Includes",
                    type: "checkbox",
                    options: [
                        "Necklace",
                        "Earrings",
                        "Bangles",
                        "Maang Tikka",
                        "Ring"
                    ]
                }
            ]
        },
        Bangles: {
            displayName: "Bangles",
            filters: [
                {
                    field: "size",
                    label: "Size",
                    type: "checkbox",
                    options: ["2.2", "2.4", "2.6", "2.8", "2.10"]
                },
                {
                    field: "material",
                    label: "Material",
                    type: "checkbox",
                    options: ["Glass", "Metal", "Plastic", "Gold Plated"]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: ["Red", "Green", "Blue", "Golden", "Multi", "Pink"]
                }
            ]
        },
        "Necklace set": {
            displayName: "Necklace Set",
            filters: [
                {
                    field: "material",
                    label: "Material",
                    type: "checkbox",
                    options: ["Gold Plated", "Silver", "Artificial", "Kundan"]
                },
                {
                    field: "length",
                    label: "Length",
                    type: "radio",
                    options: ["Short", "Medium", "Long", "Choker"]
                }
            ]
        },
        "Plastic Item": {
            displayName: "Plastic Item",
            filters: [
                {
                    field: "type",
                    label: "Item Type",
                    type: "checkbox",
                    options: ["Container", "Bucket", "Mug", "Tub"]
                },
                {
                    field: "color",
                    label: "Color",
                    type: "checkbox",
                    options: ["Red", "Blue", "Green", "Yellow", "White"]
                },
                {
                    field: "capacity",
                    label: "Capacity",
                    type: "radio",
                    options: ["500ml", "1L", "2L", "5L"]
                }
            ]
        },
        "Liquids/Oil": {
            displayName: "Liquids/Oil",
            filters: [
                {
                    field: "volume",
                    label: "Volume",
                    type: "radio",
                    options: ["500ml", "1L", "2L", "5L"]
                },
                {
                    field: "brand",
                    label: "Brand",
                    type: "checkbox",
                    options: ["Fortune", "Saffola", "Dhara", "Nature Fresh"]
                }
            ]
        },
        General: {
            displayName: "General Items",
            filters: [
                {
                    field: "price",
                    label: "Price Range",
                    type: "radio",
                    options: [
                        "Under ₹100",
                        "₹100-₹500",
                        "₹500-₹1000",
                        "Above ₹1000"
                    ]
                }
            ]
        }
    };

    populateCategoryDropdown();
}

// ✅ Products se categories utha kar dropdown me daalo
function populateCategoryDropdown() {
    const select = document.getElementById("categorySelect");
    if (!select) {
        console.log("❌ categorySelect nahi mila");
        return;
    }

    // Products se sab unique categories nikalo
    const categoriesFromProducts = [
        ...new Set(allProducts.map(p => p.category).filter(c => c))
    ];
    console.log("✅ Products se mili categories:", categoriesFromProducts);

    select.innerHTML = '<option value="">All Categories</option>';

    categoriesFromProducts.forEach(cat => {
        // Mapping check karo
        const mappedCat =
            CATEGORY_MAP[cat.toLowerCase()] || CATEGORY_MAP[cat] || cat;

        // Agar config me hai to displayName use karo, warna category name
        const displayName = FILTER_CONFIG[mappedCat]
            ? FILTER_CONFIG[mappedCat].displayName
            : cat;
        select.innerHTML += `<option value="${cat}">${displayName}</option>`;
    });
    console.log("✅ Dropdown bhar gaya");
}

function onCategoryChange() {
    const selectedValue = document.getElementById("categorySelect").value;
    const container = document.getElementById("dynamicFilters");
    container.innerHTML = "";
    CURRENT_FILTERS = { category: selectedValue };

    if (!selectedValue) {
        renderProducts(allProducts);
        return;
    }

    // Mapping se actual config category nikalo
    const configCat =
        CATEGORY_MAP[selectedValue.toLowerCase()] ||
        CATEGORY_MAP[selectedValue] ||
        selectedValue;

    // ✅ Agar config me nahi mila to AUTO GENERATE karo
    if (!FILTER_CONFIG[configCat]) {
        console.log("🤖 Auto generating variants for:", selectedValue);
        FILTER_CONFIG[configCat] = generateAutoVariants(selectedValue);
        showToast(`✨ Auto variants created for ${selectedValue}`);
    }

    const filters = FILTER_CONFIG[configCat].filters;
    filters.forEach(filter => {
        let html = `<div class="filter-group" style="margin:15px 0;padding-bottom:10px;border-bottom:1px solid #eee;">
            <label style="font-weight:bold;display:block;margin-bottom:8px;color:#333;">${filter.label}</label>`;

        if (filter.type === "radio") {
            filter.options.forEach(opt => {
                html += `<label style="display:block;margin:6px 0;font-size:14px;cursor:pointer;">
                    <input type="radio" name="${filter.field}" value="${opt}" onchange="updateFilter('${filter.field}','${opt}')"> ${opt}
                </label>`;
            });
        } else if (filter.type === "checkbox") {
            filter.options.forEach(opt => {
                html += `<label style="display:block;margin:6px 0;font-size:14px;cursor:pointer;">
                    <input type="checkbox" name="${filter.field}" value="${opt}" onchange="updateCheckboxFilter('${filter.field}','${opt}',this)"> ${opt}
                </label>`;
            });
        }
        html += `</div>`;
        container.innerHTML += html;
    });

    // Category select karte hi products filter karo
    filterByCategory(selectedValue);
    console.log("✅ Variants dikh gaye:", configCat);
}

function updateFilter(field, value) {
    CURRENT_FILTERS[field] = value;
    console.log("Filter updated:", CURRENT_FILTERS);
}

function updateCheckboxFilter(field, value, checkbox) {
    if (!CURRENT_FILTERS[field]) CURRENT_FILTERS[field] = [];
    if (checkbox.checked) {
        CURRENT_FILTERS[field].push(value);
    } else {
        CURRENT_FILTERS[field] = CURRENT_FILTERS[field].filter(
            v => v !== value
        );
        if (CURRENT_FILTERS[field].length === 0) delete CURRENT_FILTERS[field];
    }
    console.log("Checkbox Filter updated:", CURRENT_FILTERS);
}

function applySmartFilters() {
    let filtered = allProducts.filter(p => {
        // 1. Category check - mapping ke saath
        if (CURRENT_FILTERS.category) {
            const productCat =
                CATEGORY_MAP[p.category.toLowerCase()] ||
                CATEGORY_MAP[p.category] ||
                p.category;
            const filterCat =
                CATEGORY_MAP[CURRENT_FILTERS.category.toLowerCase()] ||
                CATEGORY_MAP[CURRENT_FILTERS.category] ||
                CURRENT_FILTERS.category;
            if (productCat !== filterCat) return false;
        }

        // 2. Baaki filters check karo
        for (let key in CURRENT_FILTERS) {
            if (key === "category") continue;

            if (CURRENT_FILTERS[key] && CURRENT_FILTERS[key].length !== 0) {
                if (Array.isArray(CURRENT_FILTERS[key])) {
                    if (!CURRENT_FILTERS[key].includes(p[key])) return false;
                } else {
                    if (p[key] != CURRENT_FILTERS[key]) return false;
                }
            }
        }
        return true;
    });

    renderProducts(filtered);
    showToast(`✅ ${filtered.length} products found`);
    console.log("✅ Filtered products:", filtered.length);
}

function clearSmartFilters() {
    CURRENT_FILTERS = {};
    document.getElementById("categorySelect").value = "";
    document.getElementById("dynamicFilters").innerHTML = "";
    renderProducts(allProducts);
    showToast("Filters cleared");
}

function filterByCategory(catName) {
    // Mapping ke saath filter karo
    const mappedCat =
        CATEGORY_MAP[catName.toLowerCase()] || CATEGORY_MAP[catName] || catName;
    let filtered = allProducts.filter(p => {
        const productCat =
            CATEGORY_MAP[p.category.toLowerCase()] ||
            CATEGORY_MAP[p.category] ||
            p.category;
        return productCat === mappedCat;
    });
    renderProducts(filtered);
    document
        .getElementById("productGrid")
        .scrollIntoView({ behavior: "smooth" });
}

// ✅ Products load hone ke baad init karo
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof allProducts !== "undefined" && allProducts.length > 0) {
            initSmartFilters();
        } else {
            // Agar abhi products nahi aaye to check karte raho
            const checkInterval = setInterval(() => {
                if (
                    typeof allProducts !== "undefined" &&
                    allProducts.length > 0
                ) {
                    initSmartFilters();
                    clearInterval(checkInterval);
                }
            }, 1000);
        }
    }, 3000);
});
