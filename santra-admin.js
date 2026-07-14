// santra-admin.js - v2.3 FIXED (CART_KEY duplicate + null safety)
(function () {
    if (window.SantraAdminLoaded) return;
    window.SantraAdminLoaded = true;
    console.log("🛠️ Santra Admin v2.3 Loaded");

    // ✅ FIX: CART_KEY dobara declare nahi kiya, window se le rahe
    const CART_KEY = window.CART_KEY || "santraMallCart_v2";

    const Admin = {
        logs: [],
        log(m) {
            this.logs.unshift("[" + new Date().toLocaleTimeString() + "] " + m);
            if (this.logs.length > 50) this.logs.pop();
            this.update();
        },
        update() {
            const l = document.getElementById("sa-log");
            if (l) l.innerHTML = this.logs.slice(0, 10).join("<br>");
        },
        create() {
            const d = document.createElement("div");
            d.id = "santra-admin-panel";
            d.innerHTML = `<div id="sa-box" style="position:fixed;bottom:70px;right:10px;width:300px;background:#1a1a1a;color:#0f0;border:2px solid #0f0;border-radius:10px;padding:12px;font:13px monospace;z-index:999999;display:none;box-shadow:0 0 20px #0f0"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>⚙️ SANTRA ADMIN v2.3</b><span id="sa-close" style="cursor:pointer;color:red;font-size:18px">×</span></div><div>Status: <span id="sa-status" style="color:lime">RUNNING</span></div><div>Home Alive: <span id="sa-home">-</span></div><div>Cart Items: <span id="sa-cart">0</span></div><div style="margin:8px 0;display:grid;grid-template-columns:1fr 1fr;gap:5px"><button onclick="location.reload()" style="background:#0f0;border:none;padding:5px;border-radius:4px">Reload</button><button onclick="localStorage.clear();alert('Cleared');location.reload()" style="background:orange;border:none;padding:5px;border-radius:4px">Clear All</button><button onclick="localStorage.removeItem('${CART_KEY}');location.reload()" style="background:#f00;color:white;border:none;padding:5px;border-radius:4px">Empty Cart</button><button onclick="window.open('https://github.com')" style="background:#2196f3;color:white;border:none;padding:5px;border-radius:4px">GitHub</button></div><div style="background:#000;padding:5px;height:80px;overflow:auto;margin-top:5px" id="sa-log"></div><div style="font-size:10px;margin-top:5px;opacity:0.7">Ctrl+Shift+A</div></div>`;
            document.body.appendChild(d);
            document.getElementById("sa-close").onclick = () =>
                (document.getElementById("sa-box").style.display = "none");
            
            // ✅ Safety: Element check karke update karo
            setInterval(() => {
                const homeEl = document.getElementById("sa-home");
                const cartEl = document.getElementById("sa-cart");
                if (!homeEl || !cartEl) return;

                const alive = localStorage.getItem("homeAlive");
                homeEl.textContent = alive
                   ? Math.floor((Date.now() - alive) / 1000) + "s"
                    : "OFF";
                
                try {
                    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
                    cartEl.textContent = cart.reduce(
                        (s, i) => s + (i.qty || 1),
                        0
                    );
                } catch(e) {
                    cartEl.textContent = "0";
                }
            }, 1000);
        },
        toggle() {
            const b = document.getElementById("sa-box");
            if (b)
                b.style.display = b.style.display === "none" ? "block" : "none";
            this.log("Toggled");
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        Admin.create();
        Admin.log("Ready v2.3");
    });
    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
            e.preventDefault();
            Admin.toggle();
        }
    });
    if (location.search.includes("admin=1"))
        setTimeout(() => Admin.toggle(), 1000);
    window.SantraAdmin = Admin;
})();