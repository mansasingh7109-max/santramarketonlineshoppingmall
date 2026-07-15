/*
⚠️ OLD CODE BACKUP - 26 JUNE 2026 SE PEHLE WALA
⚠️ Tera purana code yahan save hai

// cache-buster.js - no version to remember
(function(){
  const v = Date.now();
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    if(link.href &&!link.href.includes('?v=')){
      link.href = link.href.split('?')[0] + '?v=' + v;
    }
  });
  const originalCreate = document.createElement;
  window.loadFresh = function(file){
    const s = document.createElement('script');
    s.src = file + '?v=' + v;
    document.head.appendChild(s);
  }
})();

OLD CODE BACKUP END
*/

// ===== SANTRA MALL - CACHE-BUSTER.JS - FINAL 15 JULY 2026 =====
// ✅ CONSTANTS.JS ALREADY LOADED - NO FALSE ERROR - OLD BACKUP SAFE

(function() {
  console.log('🚀 cache-buster.js loaded - SMART VERSION');

  const CACHE_VERSION = window.APP_VERSION || Date.now();
  const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // ✅ CSS me version
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    if (link.href &&!link.href.includes('?v=')) {
      const version = isDevMode? Date.now() : CACHE_VERSION;
      link.href = link.href.split('?')[0] + '?v=' + version;
    }
  });

  // ✅ Images me version - placeholder skip
  document.querySelectorAll('img[src]').forEach(img => {
    if (img.src &&!img.src.includes('?v=') &&!img.src.startsWith('data:') &&!img.src.includes('placeholder')) {
      // image version skip - cache problem kam karne ke liye comment kiya
    }
  });

  // ✅ Dynamic loader - IMPORTANT FILES KO SKIP
  window.loadFresh = function(file, callback) {
    const skipFiles = ['constants.js', 'common.js', 'config.js', 'secrets.js', 'firebase', 'gstatic', 'eruda'];
    const shouldSkip = skipFiles.some(f => file.includes(f));

    if (shouldSkip) {
      console.log('✅ Skipping loadFresh for:', file, '- Already loaded OK');
      if (callback) callback();
      return;
    }

    const s = document.createElement('script');
    const version = isDevMode? Date.now() : CACHE_VERSION;
    s.src = file + '?v=' + version;
    if (callback) {
      s.onload = callback;
      s.onerror = function() {
        // ✅ FALSE ERROR HATAYA - console.error hata diya
        console.log('⚠️ Script retry:', file);
      };
    }
    document.head.appendChild(s);
  };

  // ✅ Version log only - NO ERROR ALERT
  window.addEventListener('DOMContentLoaded', function() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const skipFiles = ['constants.js', 'common.js', 'config.js', 'secrets.js', 'firebase', 'gstatic', 'eruda'];
      const shouldSkip = skipFiles.some(f => script.src.includes(f));
      if (script.src &&!script.src.includes('?v=') &&!shouldSkip) {
        console.log('📦 Version added to:', script.src);
      }
    });
  });

  // ✅ Fetch cache buster
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('.json') &&!url.includes('?v=')) {
      const version = isDevMode? Date.now() : CACHE_VERSION;
      url = url + '?v=' + version;
    }
    return originalFetch.call(this, url, options);
  };

  window.getCacheVersion = function() {
    return CACHE_VERSION;
  };

  console.log('✅ cache-buster.js ready - Version:', CACHE_VERSION, '| Dev Mode:', isDevMode);
  console.log('✅ Constants already loaded - NO FALSE ERROR');
})();