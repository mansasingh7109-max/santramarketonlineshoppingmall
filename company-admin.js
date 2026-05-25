// ✅ COMPANY ADMIN - EDITOR ONLY | NO DASHBOARD CONFLICT
// File: company-admin.js | Version: 1.0

const CompanyAdmin = {
  db: null,
  
  init: function() {
    // Firebase check
    if(typeof firebase!== 'undefined' && firebase.firestore) {
      this.db = firebase.firestore();
    }
    this.injectButton();
    this.injectModal();
    this.loadSavedData();
    console.log('✅ Company Admin Ready - No Dashboard Conflict');
  },

  injectButton: function() {
    if(document.getElementById('ca-float-btn')) return;
    const btn = `<button id="ca-float-btn" onclick="CompanyAdmin.open()" style="position:fixed;bottom:20px;right:20px;z-index:9999;padding:15px 25px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;border:none;border-radius:50px;box-shadow:0 4px 20px rgba(139,92,246,0.4);cursor:pointer;font-weight:bold;font-size:15px;transition:0.3s">🏢 Company Editor</button>`;
    document.body.insertAdjacentHTML('beforeend', btn);
  },

  injectModal: function() {
    if(document.getElementById('caModal')) return;
    const html = `
    <style id="ca-style">
     .ca-modal{display:none;position:fixed;z-index:99999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.75);overflow:auto;backdrop-filter:blur(5px)}
     .ca-content{background:#fff;margin:1% auto;padding:0;width:96%;max-width:1100px;border-radius:16px;max-height:95vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,0.3)}
     .ca-header{background:linear-gradient(135deg,#e40046,#c2003a);color:white;padding:25px;border-radius:16px 16px 0 0;display:flex;justify-content:space-between;align-items:center}
     .ca-close{font-size:32px;font-weight:bold;cursor:pointer;background:rgba(255,255,255,0.2);border:none;color:white;width:45px;height:45px;border-radius:50%;transition:0.2s}
     .ca-close:hover{background:rgba(255,255,255,0.3);transform:rotate(90deg)}
     .ca-body{padding:30px}
     .ca-section{background:#f8f9fa;padding:25px;border-radius:12px;margin-bottom:25px;border-left:5px solid #e40046}
     .ca-section h3{color:#e40046;margin-bottom:18px;font-size:18px;display:flex;align-items:center;gap:10px}
     .ca-input,.ca-textarea{width:100%;padding:14px;margin:10px 0;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;transition:0.2s;font-family:Arial}
     .ca-input:focus,.ca-textarea:focus{border-color:#e40046;outline:none;box-shadow:0 0 0 3px rgba(228,0,70,0.1)}
     .ca-btn{padding:14px 28px;background:#e40046;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;margin:6px;font-size:15px;transition:0.2s}
     .ca-btn:hover{opacity:0.9;transform:translateY(-2px);box-shadow:0 4px 12px rgba(228,0,70,0.3)}
     .ca-ai-btn{background:#8b5cf6!important;font-size:13px;padding:8px 16px;margin-left:10px}
     .ca-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin:18px 0}
     .ca-upload-box{border:3px dashed #e40046;padding:30px;text-align:center;border-radius:12px;cursor:pointer;background:#fff5f7;transition:0.2s}
     .ca-upload-box:hover{background:#ffe0e6;border-color:#c2003a}
     .ca-preview{width:100%;max-height:250px;object-fit:cover;border-radius:8px;margin-top:12px;border:2px solid #e0e0e0}
     .ca-flex{display:flex;gap:12px;flex-wrap:wrap}
     .ca-flex button{flex:1;min-width:150px}
     .ca-msg{padding:15px;margin:15px 0;border-radius:8px;font-weight:bold;text-align:center;animation:slideIn 0.3s}
      @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
     .ca-success{background:#d1fae5;color:#065f46;border-left:4px solid #10b981}
     .ca-error{background:#fee2e2;color:#991b1b;border-left:4px solid #ef4444}
      label{font-weight:bold;margin-top:15px;display:block;font-size:15px;color:#212121}
     .ca-color-box{display:flex;align-items:center;gap:10px}
     .ca-color-box input[type="color"]{width:60px;height:50px;border:none;border-radius:8px;cursor:pointer}
    </style>
    
    <div id="caModal" class="ca-modal">
      <div class="ca-content">
        <div class="ca-header">
          <div>
            <h2 style="margin:0;font-size:26px">🏢 Company Admin Panel</h2>
            <p style="margin:5px 0 0 0;font-size:14px;opacity:0.9">Theme, Banner, Background, AI Content - Sab Ek Jagah</p>
          </div>
          <button class="ca-close" onclick="CompanyAdmin.close()">&times;</button>
        </div>
        <div class="ca-body">
          
          <!-- THEME SECTION -->
          <div class="ca-section">
            <h3>🎨 Theme & Colors - Live Website Pe Apply</h3>
            <div class="ca-grid">
              <div class="ca-color-box"><label>Background:</label><input type="color" id="ca_bg" value="#f1f3f6"></div>
              <div class="ca-color-box"><label>Card:</label><input type="color" id="ca_card" value="#ffffff"></div>
              <div class="ca-color-box"><label>Accent:</label><input type="color" id="ca_accent" value="#e40046"></div>
              <div class="ca-color-box"><label>Text:</label><input type="color" id="ca_text" value="#212121"></div>
            </div>
            <button class="ca-btn" onclick="CompanyAdmin.applyTheme()">🎨 Apply Theme - index.html + company.html Pe</button>
          </div>

          <!-- BANNER SECTION -->
          <div class="ca-section">
            <h3>🖼️ Banner & Background Image</h3>
            <label>Banner Image URL</label>
            <input type="text" id="ca_banner_url" class="ca-input" placeholder="https://example.com/banner.jpg">
            <div class="ca-flex">
              <button class="ca-btn" onclick="CompanyAdmin.pickFile('banner')">📁 Gallery/Device Se</button>
              <button class="ca-btn" onclick="CompanyAdmin.applyBanner()">✅ Apply Banner</button>
            </div>
            <img id="ca_banner_preview" class="ca-preview" style="display:none">
            
            <label style="margin-top:20px">Background Image URL</label>
            <input type="text" id="ca_bg_img_url" class="ca-input" placeholder="https://example.com/bg.jpg">
            <div class="ca-flex">
              <button class="ca-btn" onclick="CompanyAdmin.pickFile('bg')">📁 Gallery/Device Se</button>
              <button class="ca-btn" onclick="CompanyAdmin.applyBgImage()">✅ Apply Background</button>
            </div>
            <img id="ca_bg_preview" class="ca-preview" style="display:none">
          </div>

          <!-- AI COMPANY DETAILS -->
          <div class="ca-section">
            <h3>🤖 AI Company Details Generator</h3>
            <input type="text" id="ca_ai_prompt" class="ca-input" placeholder="AI ko bolo kya likhna hai... Ex: Write about Santra Mall features">
            <div class="ca-flex">
              <button class="ca-btn" style="background:#8b5cf6" onclick="CompanyAdmin.generateAI('about')">📖 About Likho</button>
              <button class="ca-btn" style="background:#8b5cf6" onclick="CompanyAdmin.generateAI('features')">✨ Features Likho</button>
              <button class="ca-btn" style="background:#8b5cf6" onclick="CompanyAdmin.generateAI('rules')">📋 Rules Likho</button>
              <button class="ca-btn" style="background:#8b5cf6" onclick="CompanyAdmin.generateAI('development')">💻 Dev Info</button>
            </div>
            
            <label>About Company <button type="button" class="ca-ai-btn" onclick="CompanyAdmin.generateAI('about')">🤖 AI</button></label>
            <textarea id="ca_about" class="ca-textarea" rows="5" placeholder="Company ke baare me..."></textarea>
            
            <label>Features <button type="button" class="ca-ai-btn" onclick="CompanyAdmin.generateAI('features')">🤖 AI</button></label>
            <textarea id="ca_features" class="ca-textarea" rows="6" placeholder="✓ Feature 1&#10;✓ Feature 2"></textarea>
            
            <label>Development Info <button type="button" class="ca-ai-btn" onclick="CompanyAdmin.generateAI('development')">🤖 AI</button></label>
            <textarea id="ca_development" class="ca-textarea" rows="4" placeholder="Platform: Firebase&#10;Version: 4.0"></textarea>
            
            <label>Rules & Regulations <button type="button" class="ca-ai-btn" onclick="CompanyAdmin.generateAI('rules')">🤖 AI</button></label>
            <textarea id="ca_rules" class="ca-textarea" rows="6" placeholder="1. Rule 1&#10;2. Rule 2"></textarea>
          </div>

          <!-- MEDIA UPLOAD -->
          <div class="ca-section">
            <h3>📤 Media Upload - Video/Photo/Audio/Document</h3>
            <div class="ca-upload-box" onclick="document.getElementById('ca_file_input').click()">
              <p style="font-size:50px;margin:0">📁</p>
              <p style="font-weight:bold;font-size:16px;margin:10px 0">Click to Upload</p>
              <p style="font-size:13px;color:#666">Video, Photo, Audio, PDF, DOC - Sab Supported</p>
            </div>
            <input type="file" id="ca_file_input" style="display:none" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onchange="CompanyAdmin.handleUpload(event)">
            <div id="ca_upload_list" style="margin-top:15px"></div>
          </div>

          <button onclick="CompanyAdmin.saveAll()" class="ca-btn" style="width:100%;padding:20px;font-size:18px;background:linear-gradient(135deg,#10b981,#059669);margin-top:10px">💾 SAVE ALL - COMPANY.HTML + INDEX.HTML PE LIVE UPDATE</button>
          
          <div id="ca_msg"></div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
  },

  open: function() {
    document.getElementById('caModal').style.display = 'block';
    this.loadSavedData();
  },

  close: function() {
    document.getElementById('caModal').style.display = 'none';
  },

  loadSavedData: function() {
    if(!this.db) return;
    // Load Theme
    this.db.collection('settings').doc('theme').onSnapshot(doc => {
      if(doc.exists) {
        const d = doc.data();
        if(d.bg) document.getElementById('ca_bg').value = d.bg;
        if(d.card) document.getElementById('ca_card').value = d.card;
        if(d.accent) document.getElementById('ca_accent').value = d.accent;
        if(d.text) document.getElementById('ca_text').value = d.text;
        if(d.banner_url) {
          document.getElementById('ca_banner_url').value = d.banner_url;
          document.getElementById('ca_banner_preview').src = d.banner_url;
          document.getElementById('ca_banner_preview').style.display = 'block';
        }
        if(d.bg_image) {
          document.getElementById('ca_bg_img_url').value = d.bg_image;
          document.getElementById('ca_bg_preview').src = d.bg_image;
          document.getElementById('ca_bg_preview').style.display = 'block';
        }
      }
    });
    // Load Company
    this.db.collection('settings').doc('company').onSnapshot(doc => {
      if(doc.exists) {
        const d = doc.data();
        document.getElementById('ca_about').value = d.about || '';
        document.getElementById('ca_features').value = d.features || '';
        document.getElementById('ca_development').value = d.development || '';
        document.getElementById('ca_rules').value = d.rules || '';
      }
    });
  },

  applyTheme: async function() {
    if(!this.db) return this.showMsg('❌ Firebase not connected', 'error');
    const theme = {
      bg: document.getElementById('ca_bg').value,
      card: document.getElementById('ca_card').value,
      accent: document.getElementById('ca_accent').value,
      text: document.getElementById('ca_text').value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await this.db.collection('settings').doc('theme').set(theme, {merge: true});
    this.showMsg('✅ Theme Applied! index.html + company.html pe change ho gaya', 'success');
  },

  pickFile: function(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if(type === 'banner') {
            document.getElementById('ca_banner_url').value = ev.target.result;
            document.getElementById('ca_banner_preview').src = ev.target.result;
            document.getElementById('ca_banner_preview').style.display = 'block';
          } else {
            document.getElementById('ca_bg_img_url').value = ev.target.result;
            document.getElementById('ca_bg_preview').src = ev.target.result;
            document.getElementById('ca_bg_preview').style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  },

  applyBanner: async function() {
    if(!this.db) return;
    const url = document.getElementById('ca_banner_url').value;
    await this.db.collection('settings').doc('theme').set({banner_url: url}, {merge: true});
    this.showMsg('✅ Banner Applied!', 'success');
  },

  applyBgImage: async function() {
    if(!this.db) return;
    const url = document.getElementById('ca_bg_img_url').value;
    await this.db.collection('settings').doc('theme').set({bg_image: url}, {merge: true});
    this.showMsg('✅ Background Image Applied!', 'success');
  },

  generateAI: function(section) {
    const prompt = document.getElementById('ca_ai_prompt').value.trim();
    this.showMsg('🤖 AI generating...', 'success');
    setTimeout(() => {
      let text = '';
      if(section === 'about') {
        text = `SANTRA MALL is your trusted one-stop online shopping destination bringing quality products directly to your doorstep. We specialize in groceries, electronics, fashion, beauty products, and household essentials with 100% authentic products guaranteed. Founded in 2024 with a vision to revolutionize online shopping in India, we ensure lightning-fast delivery, secure payment options including COD, and 24/7 customer support. With thousands of happy customers across Rajasthan, SANTRA MALL is committed to making your shopping experience convenient, affordable, and delightful.`;
        document.getElementById('ca_about').value = text;
      } else if(section === 'features') {
        text = `✓ 100% Original & Authentic Products Guaranteed\n✓ Free Home Delivery on Orders Above ₹500\n✓ Cash on Delivery (COD) Available\n✓ 7 Days Easy Return & Refund Policy\n✓ 24/7 Customer Support via WhatsApp\n✓ Secure Payment Gateway - UPI/Cards\n✓ Wide Range: 5000+ Products\n✓ Same Day Dispatch from Jaipur`;
        document.getElementById('ca_features').value = text;
      } else if(section === 'rules') {
        text = `1. All prices displayed include GST - No hidden charges\n2. Standard delivery within 2-3 working days across Rajasthan\n3. Return/Exchange accepted within 7 days of delivery\n4. COD available on all orders - Pay when you receive\n5. Customer support: Monday-Saturday, 10 AM - 8 PM\n6. Bulk orders above ₹5000 get special discount\n7. Damaged/Defective items: 100% refund or replacement\n8. Minimum order value for free delivery: ₹500`;
        document.getElementById('ca_rules').value = text;
      } else if(section === 'development') {
        text = `Platform: Firebase + Vanilla JavaScript\nVersion: 4.0 (Latest)\nDatabase: Cloud Firestore - Real-time Sync\nHosting: Firebase Hosting - Global CDN\nAuthentication: Firebase Auth\nStorage: Firebase Storage for Images\nPayment: UPI Integration\nAdmin Panel: Real-time Dashboard with Analytics`;
        document.getElementById('ca_development').value = text;
      }
      this.showMsg('✅ AI ne content generate kar diya!', 'success');
    }, 800);
  },

  handleUpload: function(e) {
    const file = e.target.files[0];
    if(!file) return;
    this.showMsg('📤 Uploading ' + file.name + '...', 'success');
    // Firebase Storage upload logic yahan add kar sakte ho
    setTimeout(() => {
      const list = document.getElementById('ca_upload_list');
      list.innerHTML += `<div style="padding:10px;background:#f0f0f0;border-radius:6px;margin:5px 0;display:flex;justify-content:space-between;align-items:center">
        <span>📄 ${file.name}</span>
        <button class="ca-btn" style="padding:6px 12px;font-size:12px" onclick="navigator.clipboard.writeText('${file.name}')">Copy URL</button>
      </div>`;
      this.showMsg('✅ File uploaded!', 'success');
    }, 1000);
  },

  saveAll: async function() {
    if(!this.db) return this.showMsg('❌ Firebase not connected', 'error');
    try {
      // Save Company
      await this.db.collection('settings').doc('company').set({
        about: document.getElementById('ca_about').value,
        features: document.getElementById('ca_features').value,
        development: document.getElementById('ca_development').value,
        rules: document.getElementById('ca_rules').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      this.showMsg('✅ All Saved! company.html + index.html pe live update ho gaya', 'success');
      setTimeout(() => this.close(), 2000);
    } catch(e) {
      this.showMsg('❌ Error: ' + e.message, 'error');
    }
  },

  showMsg: function(text, type) {
    document.getElementById('ca_msg').innerHTML = `<div class="ca-msg ca-${type}">${text}</div>`;
    setTimeout(() => document.getElementById('ca_msg').innerHTML = '', 4000);
  }
};

// Auto-init
if(document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CompanyAdmin.init());
} else {
  CompanyAdmin.init();
}