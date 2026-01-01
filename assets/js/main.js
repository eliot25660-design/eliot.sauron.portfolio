// Initialisation
console.log("🚀 Portfolio Experience Initialized");

// --- UTILS ---
const updateTheme = () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
};

// --- GLOBAL INIT (Run once) ---
document.addEventListener('DOMContentLoaded', () => {
  // Lenis Smooth Scroll
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Theme Toggle
  const themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateTheme();
  });
  updateTheme(); // Set initial

  // Init Barba
  initBarba();
});

// --- PAGE SPECIFIC LOGIC (Re-run after transitions) ---
function initPageScripts(namespace) {
  // 1. Mise à jour du Dock Nav
  document.querySelectorAll('.dock-link').forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href') === window.location.pathname.split('/').pop() || (window.location.pathname === '/' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 2. Scripts par page
  if (namespace === 'home') {
    const video = document.getElementById('myVideo');
    if(video) video.play().catch(() => {}); // Autoplay fix
  } 
  else if (namespace === 'creations') {
    initFilters();
    initLightbox();
  }
  else if (namespace === 'cv') {
    initTilt();
  }
}

// Logic CV Tilt (Mobile friendly check included)
function initTilt() {
  if(window.innerWidth < 900) return;
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;
      gsap.to(tile, { rotationY: ((x - rect.width/2)/rect.width)*10, rotationX: ((y - rect.height/2)/rect.height)*-10, duration: 0.5 });
    });
    tile.addEventListener('mouseleave', () => {
      gsap.to(tile, { rotationY: 0, rotationX: 0, duration: 0.5 });
    });
  });
}

// Logic Creations
function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');
  btns.forEach(btn => btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    
    // Animation filtre simple
    cards.forEach(card => {
      if(filter === 'all' || card.dataset.category === filter) {
        gsap.to(card, { display: 'flex', opacity: 1, scale: 1, duration: 0.3 });
      } else {
        gsap.to(card, { display: 'none', opacity: 0, scale: 0.9, duration: 0.3 });
      }
    });
  }));
}

function initLightbox() {
    // Simple lightbox logic hooks here if needed
}

// --- BARBA CONFIG ---
function initBarba() {
  barba.init({
    sync: true,
    transitions: [{
      name: 'zoom-transition',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)",
          duration: 0.5,
          ease: "power2.inOut"
        });
      },
      enter(data) {
        // Scroll en haut
        window.scrollTo(0, 0);
        initPageScripts(data.next.namespace);
        return gsap.from(data.next.container, {
          opacity: 0,
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1
        });
      }
    }]
  });
  
  // Init scripts for first load
  initPageScripts(document.querySelector('[data-barba="container"]').dataset.namespace);
}