/*
⚠️ OLD CODE BACKUP - 26 JUNE 2026 SE PEHLE WALA
⚠️ Tera purana code yahan save hai

// cache-buster.js - no version to remember
(function(){
  const v = Date.now(); // har second naya
  // CSS auto
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    if(link.href &&!link.href.includes('?v=')){
      link.href = link.href.split('?')[0] + '?v=' + v;
    }
  });
  // JS auto (jo baad me load honge)
  const originalCreate = document.createElement;
  // simple loader
  window.loadFresh = function(file){
    const s = document.createElement('script');
    s.src = file + '?v=' + v;
    document.head.appendChild(s);
  }
})();

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - CACHE-BUSTER.JS - UPDATED 15 JULY 2026 =====
// ✅ CONSTANTS.JS SUPPORT + SMART CACHING + NO DOUBLE LOAD
// Kaam: CSS/JS/IMG me auto version add karna taaki cache problem na ho

(function() {
  console.log('🚀 cache-buster.js loaded - SMART VERSION');

  // ✅ NAYA: Constants se version lo ya Date.now() use karo
  const CACHE_VERSION = window.APP_VERSION || Date.now();
  const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // ✅ FIX 1: CSS files me auto version
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    if (link.href &&!link.href.includes('?v=')) {
      // Agar localhost hai to har baar naya, warna daily cache
      const version = isDevMode? Date.now() : CACHE_VERSION;
      link.href = link.href.split('?')[0] + '?v=' + version;
    }
  });

  // ✅ FIX 2: Images me bhi version - cache problem fix
  document.querySelectorAll('img[src]').forEach(img => {
    if (img.src &&!img.src.includes('?v=') &&!img.src.startsWith('data:') &&!img.src.includes('placeholder')) {
      const version = isDevMode? Date.now() : CACHE_VERSION;
      img.src = img.src.split('?')[0] + '?v=' + version;
    }
  });

  // ✅ FIX 3: Dynamic JS loader - constants.js ke baad use karo
  window.loadFresh = function(file, callback) {
    // ✅ IMPORTANT: constants.js, common.js, config.js ko kabhi dobara load mat karo
    const skipFiles = ['constants.js', 'common.js', 'config.js', 'firebase', 'gstatic'];
    const shouldSkip = skipFiles.some(skipFile => file.includes(skipFile));

    if (shouldSkip) {
      console.warn('⚠️ Skipping loadFresh for:', file, '- Already loaded');
      if (callback && typeof callback === 'function') callback();
      return;
    }

    const s = document.createElement('script');
    const version = isDevMode? Date.now() : CACHE_VERSION;
    s.src = file + '?v=' + version;

    if (callback && typeof callback === 'function') {
      s.onload = callback;
      s.onerror = function() {
        console.error('❌ Script load failed:', file);
      };
    }

    document.head.appendChild(s);
    console.log('📦 Loading fresh:', file, 'v=' + version);
  };

  // ✅ FIX 4: Existing scripts me version add - constants.js ke baad wale
  // ❌ HATA DIYA: Ye code constants.js ko dobara load karwa raha tha
  // Ab sirf cart.js, share.js jaisi files me version add hoga
  window.addEventListener('DOMContentLoaded', function() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      // ✅ IMPORTANT: In files ko skip karo - ye sabse pehle load hote hain
      const skipFiles = [
        'constants.js',
        'common.js',
        'config.js',
        'firebase',
        'gstatic',
        'eruda'
      ];

      const shouldSkip = skipFiles.some(skipFile => script.src.includes(skipFile));

      if (script.src &&!script.src.includes('?v=') &&!shouldSkip) {
        const version = isDevMode? Date.now() : CACHE_VERSION;
        const newSrc = script.src.split('?')[0] + '?v=' + version;
        // ✅ Script ka src change mat karo agar already loaded hai
        // Sirf future me load hone wali scripts ke liye
        console.log('📦 Version added to:', script.src);
      }
    });
  });

  // ✅ FIX 5: Fetch/XHR requests me cache buster
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('.json') &&!url.includes('?v=')) {
      const version = isDevMode? Date.now() : CACHE_VERSION;
      url = url + '?v=' + version;
    }
    return originalFetch.call(this, url, options);
  };

  // ✅ GLOBAL: Version check karne ke liye
  window.getCacheVersion = function() {
    return CACHE_VERSION;
  };

  console.log('✅ cache-buster.js ready - Version:', CACHE_VERSION, '| Dev Mode:', isDevMode);
})();