// santra-home.js - v2.3 FIXED (CART_KEY duplicate hataya)
(function () {
    console.log("🏠 Santra Home v2.3 Running");

    // ✅ FIX: CART_KEY dobara declare nahi kiya, window se le rahe
    const CART_KEY = window.CART_KEY || "santraMallCart_v2";

    const Cart = {
        get: () => JSON.parse(localStorage.getItem(CART_KEY) || "[]"),
        save: c => {
            localStorage.setItem(CART_KEY, JSON.stringify(c));
            const n = c.reduce((a, i) => a + (i.qty || 1), 0);
            document
               .querySelectorAll("#cartCount,.cart-count")
               .forEach(e => (e.textContent = n));
        },
        add: p => {
            let c = Cart.get();
            let f = c.find(x => x.id === p.id);
            f? f.qty++ : c.push({...p, qty: 1 });
            Cart.save(c);
            const t = document.createElement("div");
            t.textContent = "✓ " + p.name;
            t.style.cssText =
                "position:fixed;top:20px;right:20px;background:#e91e63;color:white;padding:8px 15px;border-radius:20px;z-index:9999";
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 1500);
        }
    };

    if (typeof window.addToCart!== "function") {
        window.addToCart = p => Cart.add(p);
    }

    function renderProducts() {
        const grid = document.getElementById("productGrid");
        if (!grid) return;

        const products = JSON.parse(
            localStorage.getItem("santraProducts") || "[]"
        ).length
           ? JSON.parse(localStorage.getItem("santraProducts"))
            : [
                  {
                      id: "p1",
                      name: "Designer Frock",
                      price: 499,
                      mrp: 999,
                      image: "https://via.placeholder.com/300x400?text=Frock"
                  },
                  {
                      id: "p2",
                      name: "Cotton Kurti",
                      price: 399,
                      mrp: 799,
                      image: "https://via.placeholder.com/300x400?text=Kurti"
                  },
                  {
                      id: "p3",
                      name: "Silk Saree",
                      price: 899,
                      mrp: 1499,
                      image: "https://via.placeholder.com/300x400?text=Saree"
                  }
              ];

        localStorage.setItem("santraProducts", JSON.stringify(products));

        grid.innerHTML = products
           .map(
                p => `
      <div class="product-card" data-id="${p.id}" style="border:1px solid #eee;padding:10px;margin:10px;border-radius:8px">
        <img src="${p.image}" loading="lazy" style="width:100%;height:200px;object-fit:cover" onclick="window.location='product.html?id=${p.id}'">
        <h3 class="product-title">${p.name}</h3>
        <p>₹${p.price} <s style="color:#888">₹${p.mrp}</s></p>
        <button class="add-to-cart" style="background:#e91e63;color:white;border:none;padding:8px 15px;border-radius:5px;width:100%">Add to Cart</button>
      </div>
    `
            )
           .join("");
    }

    function getProductFromCard(card) {
        return {
            id: card.dataset.id || Math.random().toString(36).slice(2),
            name:
                card
                   .querySelector(".product-title, h3, h4")
                   ?.innerText.trim() || "Product",
            price: +(card.innerText.match(/₹\s?(\d+)/)?.[1] || 0),
            image: card.querySelector("img")?.src || ""
        };
    }

    function healHome() {
        document.querySelectorAll(".add-to-cart").forEach(btn => {
            if (!btn._fixed) {
                btn._fixed = true;
                btn.onclick = e => {
                    e.preventDefault();
                    const card = btn.closest(".product-card");
                    if (card) Cart.add(getProductFromCard(card));
                };
            }
        });
        Cart.save(Cart.get());
    }

    document.addEventListener("DOMContentLoaded", () => {
        renderProducts();
        healHome();
    });

    setInterval(() => localStorage.setItem("homeAlive", Date.now()), 10000);
})();