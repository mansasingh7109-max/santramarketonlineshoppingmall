// lang-switcher.js - FIXED VERSION
// Santrajet Mall - Pure Page Hindi/English

// 1. CSS - Fixed for span, button, div sabke liye
const langCSS = `
.lang-hi, .lang-en { display: none; }
body:not(.english) .lang-hi { display: inline-block; }
body.english .lang-en { display: inline-block; }

/* h1, h2, p, div ke liye block chahiye */
h1 .lang-hi, h1 .lang-en, h2 .lang-hi, h2 .lang-en, 
p .lang-hi, p .lang-en, div .lang-hi, div .lang-en {
    display: none;
}
body:not(.english) h1 .lang-hi,
body:not(.english) h2 .lang-hi,
body:not(.english) p .lang-hi,
body:not(.english) div .lang-hi { display: block; }

body.english h1 .lang-en,
body.english h2 .lang-en,
body.english p .lang-en,
body.english div .lang-en { display: block; }

.lang-toggle {
  position: fixed; top: 15px; right: 15px; z-index: 99999;
  padding: 10px 18px; background: #d35400; color: white;
  border: none; border-radius: 25px; font-weight: 600;
  box-shadow: 0 3px 10px rgba(0,0,0,0.3); cursor: pointer;
}
`;
const styleTag = document.createElement('style');
styleTag.innerHTML = langCSS;
document.head.appendChild(styleTag);

// 2. Button Add Karo
const langBtn = document.createElement('button');
langBtn.className = 'lang-toggle';
langBtn.innerHTML = 'EN';
langBtn.onclick = toggleLanguage;
document.body.appendChild(langBtn);

// 3. Language Change Function
function toggleLanguage() {
  document.body.classList.toggle('english');
  if(document.body.classList.contains('english')) {
    localStorage.setItem('santrajetLang', 'en');
    langBtn.innerHTML = 'हिं';
  } else {
    localStorage.setItem('santrajetLang', 'hi');
    langBtn.innerHTML = 'EN';
  }
}

// 4. Page Load Pe Check Karo
document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('santrajetLang') === 'en') {
    document.body.classList.add('english');
    langBtn.innerHTML = 'हिं';
  } else {
    langBtn.innerHTML = 'EN';
  }
});