// ✅ THEME.JS - FINAL VERSION v2.1 | Complete + Social + Dark Mode
(function() {
  'use strict';

  // Double load protection
  if(window.ThemeEngineLoaded) return;
  window.ThemeEngineLoaded = true;

  const ThemeEngine = {
    db: null,
    initialized: false,
    currentTheme: null,

    init: function() {
      if(this.initialized) return;

      // Firebase wait karo
      if(typeof firebase === 'undefined' ||!firebase.firestore) {
        setTimeout(() => this.init(), 500);
        return;
      }

      this.db = firebase.firestore();
      this.injectCSS();
      this.loadTheme();
      this.loadCompany();
      this.setupDarkModeListener();
      this.initialized = true;
      console.log('🎨 Theme Engine v2.1 Loaded');
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
          --text-light: #666666;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --info: #3b82f6;
        }
        body {
          background: var(--bg);
          color: var(--text);
          transition: background 0.3s ease, color 0.3s ease;
        }
       .card,.box,.container,.product-card,.order-card {
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--text);
        }
        button,.btn,.btn-primary {
          background: var(--accent)!important;
          color: #fff!important;
          border: none;
          transition: all 0.3s ease;
        }
        button:hover,.btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        h1,h2,h3,h4,h5 { color: var(--accent); }
        a { color: var(--accent); text-decoration: none; }
        a:hover { text-decoration: underline; }
       .header,.navbar { background: var(--accent); }
        input, textarea, select {
          background: var(--card);
          color: var(--text);
          border: 1px solid var(--border);
        }
        input:focus, textarea:focus, select:focus {
          border-color: var(--accent);
          outline: none;
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          :root.auto-dark {
            --bg: #1a1a1a;
            --card: #2d2d2d;
            --text: #e0e0e0;
            --border: #404040;
            --text-light: #999999;
          }
        }
      `;
      document.head.appendChild(style);
    },

    // ✅ FIREBASE SE THEME LOAD KARO
    loadTheme: function() {
      this.db.collection('settings').doc('theme').onSnapshot((doc) => {
        if(doc.exists) {
          this.currentTheme = doc.data();
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
      if(theme.text_light) root.setProperty('--text-light', theme.text_light);

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
        '.header-banner', '[data-banner]', '.welcome-banner',
        '.main-banner', '#hero'
      ];
      bannerSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && theme.banner_url) {
          el.style.backgroundImage = `url(${theme.banner_url})`;
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.minHeight = theme.banner_height || '300px';
        }
      });

      // Logo Update
      const logoSelectors = ['#siteLogo', '.logo', '.site-logo', '[data-logo]'];
      logoSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && theme.logo_url) {
          if(el.tagName === 'IMG') {
            el.src = theme.logo_url;
          } else {
            el.style.backgroundImage = `url(${theme.logo_url})`;
          }
        }
      });

      // Favicon Update
      if(theme.favicon_url) {
        let favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
        favicon.type = 'image/x-icon';
        favicon.rel = 'shortcut icon';
        favicon.href = theme.favicon_url;
        document.head.appendChild(favicon);
      }

      // Font Family
      if(theme.font_family) {
        document.body.style.fontFamily = theme.font_family;
      }

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
        '[data-about]', '.company-about', '#about', '#aboutContent'
      ];
      aboutSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.about) el.innerHTML = this.formatText(data.about);
      });

      // Features Section
      const featuresSelectors = [
        '#companyFeaturesText', '#featuresText', '.features-text',
        '[data-features]', '.company-features', '#features', '#featuresContent'
      ];
      featuresSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.features) {
          el.innerHTML = this.formatList(data.features);
        }
      });

      // Rules Section
      const rulesSelectors = [
        '#companyRulesText', '#rulesText', '.rules-text',
        '[data-rules]', '.company-rules', '#rules', '#rulesContent'
      ];
      rulesSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.rules) {
          el.innerHTML = this.formatList(data.rules);
        }
      });

      // Development Info
      const devSelectors = [
        '#companyDevText', '#devText', '.dev-text',
        '[data-development]', '.company-development', '#development', '#devContent'
      ];
      devSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.development) {
          el.innerHTML = this.formatText(data.development);
        }
      });

      // Footer Text
      const footerSelectors = ['#footerText', '.footer-text', 'footer', '[data-footer]'];
      footerSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if(el && data.footer_text) {
          el.innerHTML = data.footer_text;
        }
      });

      // Social Links
      this.updateSocialLinks(data);

      // Contact Info
      this.updateContactInfo(data);

      console.log('✅ Company Data Applied:', data);
    },

    // ✅ FORMAT TEXT WITH LINE BREAKS
    formatText: function(text) {
      if(!text) return '';
      return text.split('\n').map(line => `<p style="margin:8px 0;line-height:1.6">${line}</p>`).join('');
    },

    // ✅ FORMAT LIST WITH ICONS
    formatList: function(text) {
      if(!text) return '';
      return text.split('\n').map(line => {
        if(line.trim()) {
          return `<p style="margin:8px 0;display:flex;align-items:start;gap:8px"><span style="color:var(--success);font-weight:bold">✓</span><span>${line}</span></p>`;
        }
        return '';
      }).join('');
    },

    // ✅ UPDATE SOCIAL LINKS
    updateSocialLinks: function(data) {
      const socialLinks = {
        facebook: data.facebook_url,
        instagram: data.instagram_url,
        twitter: data.twitter_url,
        whatsapp: data.whatsapp_number,
        youtube: data.youtube_url,
        telegram: data.telegram_url
      };

      Object.keys(socialLinks).forEach(platform => {
        const url = socialLinks[platform];
        if(url) {
          const selectors = [
            `[data-social="${platform}"]`,
            `.social-${platform}`,
            `#${platform}Link`,
            `.${platform}-icon`
          ];
          selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if(el) {
              if(el.tagName === 'A') {
                el.href = platform === 'whatsapp'? `https://wa.me/${url}` : url;
                el.target = '_blank';
              }
            }
          });
        }
      });
    },

    // ✅ UPDATE CONTACT INFO
    updateContactInfo: function(data) {
      const contactMap = {
        '#companyPhone': data.phone,
        '#companyEmail': data.email,
        '#companyAddress': data.address,
        '#companyName': data.name,
        '.company-phone': data.phone,
        '.company-email': data.email,
        '.company-address': data.address
      };

      Object.keys(contactMap).forEach(sel => {
        const el = document.querySelector(sel);
        if(el && contactMap[sel]) {
          el.innerText = contactMap[sel];
        }
      });
    },

    // ✅ DARK MODE LISTENER
    setupDarkModeListener: function() {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applyDarkMode = (e) => {
        if(e.matches && this.currentTheme?.auto_dark_mode) {
          document.documentElement.classList.add('auto-dark');
        } else {
          document.documentElement.classList.remove('auto-dark');
        }
      };

      darkModeQuery.addListener(applyDarkMode);
      applyDarkMode(darkModeQuery);
    },

    // ✅ MANUAL THEME TOGGLE
    toggleTheme: function() {
      const currentBg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      const isDark = currentBg === '#1a1a1a' || currentBg === '#2d2d2d';

      if(isDark) {
        // Switch to Light
        this.applyTheme({
          bg: '#f1f3f6',
          card: '#ffffff',
          text: '#212121',
          border: '#e0e0e0',
          accent: this.currentTheme?.accent || '#e40046'
        });
      } else {
        // Switch to Dark
        this.applyTheme({
          bg: '#1a1a1a',
          card: '#2d2d2d',
          text: '#e0e0e0',
          border: '#404040',
          accent: this.currentTheme?.accent || '#e40046'
        });
      }
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
window.updateCartCount = function() {
  // Cart count update logic yahan daal sakte ho agar chahiye
  const cart = JSON.parse(localStorage.getItem('SANTRA_CART') || '[]');
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const cartCountEls = document.querySelectorAll('#cartCount,.cart-count, [data-cart-count]');
  cartCountEls.forEach(el => {
    if(el) el.innerText = count;
  });
  return count;
};

// ✅ FIX: updateWishCount error
window.updateWishCount = function() {
  const wishlist = JSON.parse(localStorage.getItem('SANTRA_WISHLIST') || '[]');
  const count = wishlist.length;
  const wishCountEls = document.querySelectorAll('#wishCount,.wish-count, [data-wish-count]');
  wishCountEls.forEach(el => {
    if(el) el.innerText = count;
  });
  return count;
};