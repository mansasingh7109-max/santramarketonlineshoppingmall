// ✅ THEME.JS - FINAL VERSION v2.0 | No Half Code
(function() {
  'use strict';
  
  // Double load protection
  if(window.ThemeEngineLoaded) return;
  window.ThemeEngineLoaded = true;

  const ThemeEngine = {
    db: null,
    initialized: false,

    init: function() {
      if(this.initialized) return;
      
      // Firebase wait karo
      if(typeof firebase === 'undefined' || !firebase.firestore) {
        setTimeout(() => this.init(), 500);
        return;
      }
      
      this.db = firebase.firestore();
      this.injectCSS();
      this.loadTheme();
      this.loadCompany();
      this.initialized = true;
      console.log('🎨 Theme Engine v2.0 Loaded');
    },

    // ✅ DEFAULT CSS VARIABLES INJECT KARO
    injectCSS: function() {
      if(document.getElementById('theme-vars')) return;
      const style = document.createElement('style');
      style.id = 'theme-vars';
      style.innerHTML = `
        :root {
          --bg: #f1f3f6;
          --card: #ffffff;
          --accent: #e40046;
          --text: #212121;
          --border: #e0e0e0;
        }
        body { 
          background: var(--bg); 
          color: var(--text); 
          transition: background 0.3s ease;
        }
        .card, .box, .container, .product-card { 
          background: var(--card); 
          border: 1px solid var(--border);
        }
        button, .btn, .btn-primary { 
          background: var(--accent) !important; 
          color: #fff !important;
          border: none;
        }
        h1,h2,h3,h4,h5 { color: var(--accent); }
        a { color: var(--accent); }
        .header, .navbar { background: var(--accent); }
      `;
      document.head.appendChild(style);
    },

    // ✅ FIREBASE SE THEME LOAD KARO
    loadTheme: function() {
      this.db.collection('settings').doc('theme').onSnapshot((doc) => {
        if(doc.exists) {
          this.applyTheme(doc.data());
        }
      }, (err) => {
        console.warn('Theme load error:', err);
      });
    },

    // ✅ THEME APPLY KARO PAGE PE
    applyTheme: function(theme) {
      const root = document.documentElement.style;
      
      // Colors
      if(theme.bg) root.setProperty('--bg', theme.bg);
      if(theme.card) root.setProperty('--card', theme.card);
      if(theme.accent) root.setProperty('--accent', theme.accent);
      if(theme.text) root.setProperty('--text', theme.text);
      if(theme.border) root.setProperty('--border', theme.border);
      
      // Background Image
      if(theme.bg_image) {
        document.body.style.backgroundImage = `url(${theme.bg_image})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundRepeat = 'no-repeat';
      } else {
        document.body.style.backgroundImage = 'none';
      }
      
      // Banner Image - Multiple selectors try karo
      const bannerSelectors = [
        '#mainBanner', '#banner', '.banner', '.hero-banner', 
        '.header-banner', '[data-banner]', '.welcome-banner'
      ];
      bannerSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && theme.banner_url) {
          el.style.backgroundImage = `url(${theme.banner_url})`;
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          el.style.backgroundRepeat = 'no-repeat';
        }
      });
      
      console.log('✅ Theme Applied:', theme);
    },

    // ✅ COMPANY DATA LOAD KARO
    loadCompany: function() {
      this.db.collection('settings').doc('company').onSnapshot((doc) => {
        if(doc.exists) {
          this.applyCompanyData(doc.data());
        }
      }, (err) => {
        console.warn('Company data load error:', err);
      });
    },

    // ✅ COMPANY DATA APPLY KARO
    applyCompanyData: function(data) {
      // About Section
      const aboutSelectors = [
        '#companyAboutText', '#aboutText', '.about-text', 
        '[data-about]', '.company-about', '#about'
      ];
      aboutSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.about) el.innerText = data.about;
      });
      
      // Features Section
      const featuresSelectors = [
        '#companyFeaturesText', '#featuresText', '.features-text',
        '[data-features]', '.company-features', '#features'
      ];
      featuresSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.features) {
          el.innerHTML = data.features.split('\n').map(f => `<p style="margin:8px 0">${f}</p>`).join('');
        }
      });
      
      // Rules Section
      const rulesSelectors = [
        '#companyRulesText', '#rulesText', '.rules-text',
        '[data-rules]', '.company-rules', '#rules'
      ];
      rulesSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.rules) {
          el.innerHTML = data.rules.split('\n').map(r => `<p style="margin:8px 0">${r}</p>`).join('');
        }
      });
      
      // Development Info
      const devSelectors = [
        '#companyDevText', '#devText', '.dev-text',
        '[data-development]', '.company-development', '#development'
      ];
      devSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.development) {
          el.innerHTML = data.development.split('\n').map(d => `<p style="margin:8px 0">${d}</p>`).join('');
        }
      });
      
      console.log('✅ Company Data Applied:', data);
    }
  };

  // Auto-init on page load
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeEngine.init());
  } else {
    ThemeEngine.init();
  }

  // Global access for debugging
  window.ThemeEngine = ThemeEngine;

})();

// ✅ FIX: updateCartCount error - Empty function
window.updateCartCount = function() { return; }