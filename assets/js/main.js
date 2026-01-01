// Initialisation
console.log("🚀 Portfolio V2 Ready - Active Theory Lite Mode");

// --- UTILS ---
const updateTheme = () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
};

// --- INTERACTIVE BACKGROUND (ACTIVE THEORY LITE) ---
class InteractiveBg {
  constructor() {
    this.blobs = document.querySelectorAll('.blob');
    this.scene = document.querySelector('.scene-wrapper'); // Conteneur global
    this.x = 0;
    this.y = 0;
    this.scrollY = 0;
    this.targetX = 0;
    this.targetY = 0;
    
    // Listeners
    window.addEventListener('mousemove', (e) => {
      // Normaliser entre -1 et 1
      this.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    this.raf();
  }

  raf() {
    // Lerp pour fluidité (Smooth easing)
    this.x += (this.targetX - this.x) * 0.05;
    this.y += (this.targetY - this.y) * 0.05;

    // 1. Déplacer les blobs (Parallaxe Souris)
    this.blobs.forEach((blob, i) => {
      const speed = (i + 1) * 20; // Vitesse variable selon l'index
      blob.style.transform = `translate(${this.x * speed}px, ${this.y * speed}px)`;
    });

    // 2. Rotation subtile de la scène au scroll (Effet "Axe")
    // On clamp la rotation pour éviter la nausée
    const rotation = Math.max(-5, Math.min(5, this.scrollY * 0.005));
    if(this.scene) {
      this.scene.style.transform = `rotateX(${rotation}deg) translateY(${-this.scrollY * 0.1}px)`;
    }

    requestAnimationFrame(this.raf.bind(this));
  }
}

// --- PROJECT MANAGER (Filters + Carousel + Lightbox) ---
class ProjectManager {
  constructor() {
    this.initFilters();
    this.initCarousels();
    this.initLightbox();
  }

  initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    
    btns.forEach(btn => btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      // GSAP Animation fluide
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if(match) {
          card.classList.remove('hidden');
          gsap.fromTo(card, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, display: 'flex' });
        } else {
          gsap.to(card, { autoAlpha: 0, y: 20, duration: 0.3, onComplete: () => card.classList.add('hidden') });
        }
      });
    }));
  }

  initCarousels() {
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
      const slides = wrapper.querySelector('.slides-container');
      const imgs = wrapper.querySelectorAll('.slide');
      const prev = wrapper.querySelector('.prev');
      const next = wrapper.querySelector('.next');
      const indicator = wrapper.querySelector('.slide-indicator');
      let idx = 0;

      const update = () => {
        slides.style.transform = `translateX(-${idx * 100}%)`;
        if(indicator) indicator.textContent = `${idx + 1}/${imgs.length}`;
      };

      if(imgs.length <= 1) {
        if(wrapper.querySelector('.carousel-nav')) wrapper.querySelector('.carousel-nav').style.display = 'none';
        if(indicator) indicator.style.display = 'none';
        return;
      }

      // Buttons
      if(next) next.addEventListener('click', (e) => { e.stopPropagation(); idx = (idx + 1) % imgs.length; update(); });
      if(prev) prev.addEventListener('click', (e) => { e.stopPropagation(); idx = (idx - 1 + imgs.length) % imgs.length; update(); });

      // Swipe Mobile
      let touchStartX = 0;
      wrapper.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
      wrapper.addEventListener('touchend', e => {
        if (e.changedTouches[0].screenX < touchStartX - 50) next.click();
        if (e.changedTouches[0].screenX > touchStartX + 50) prev.click();
      });
    });
  }

  initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lb-close">&times;</div>
      <div class="lb-nav lb-prev">&#10094;</div>
      <div class="lb-nav lb-next">&#10095;</div>
      <img src="" alt="Zoom">
    `;
    document.body.appendChild(lightbox);

    const imgTag = lightbox.querySelector('img');
    let currentGroup = [];
    let currentIdx = 0;

    // Trigger open
    document.querySelectorAll('.slide').forEach(img => {
      img.addEventListener('click', () => {
        // Find all images in THIS specific card
        const wrapper = img.closest('.slides-container');
        currentGroup = Array.from(wrapper.querySelectorAll('.slide')).map(el => el.src);
        // Find index of clicked image
        currentIdx = currentGroup.indexOf(img.src);
        
        updateLb();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Scroll lock
      });
    });

    const updateLb = () => { imgTag.src = currentGroup[currentIdx]; };

    // Events
    lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLb(); });
    
    lightbox.querySelector('.lb-next').addEventListener('click', (e) => {
      e.stopPropagation(); currentIdx = (currentIdx + 1) % currentGroup.length; updateLb();
    });
    lightbox.querySelector('.lb-prev').addEventListener('click', (e) => {
      e.stopPropagation(); currentIdx = (currentIdx - 1 + currentGroup.length) % currentGroup.length; updateLb();
    });

    function closeLb() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if(!lightbox.classList.contains('active')) return;
      if(e.key === 'Escape') closeLb();
      if(e.key === 'ArrowRight') lightbox.querySelector('.lb-next').click();
      if(e.key === 'ArrowLeft') lightbox.querySelector('.lb-prev').click();
    });
  }
}

// --- GLOBAL INIT ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Lenis Smooth Scroll
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // 2. Theme
  const themeBtn = document.getElementById('themeBtn');
  if(themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      updateTheme();
    });
    updateTheme();
  }

  // 3. Init Background Interaction
  new InteractiveBg();

  // 4. Init Barba
  initBarba();
});

// --- PAGE SCRIPTS RE-INIT ---
function initPageScripts(namespace) {
  // Update Active Link
  document.querySelectorAll('.dock-link').forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href') === window.location.pathname.split('/').pop() || (window.location.pathname === '/' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  if (namespace === 'home') {
    const video = document.getElementById('myVideo');
    const trigger = document.getElementById('videoTrigger');
    const label = document.getElementById('soundLabel');
    if (video && trigger) {
      video.play().catch(() => {});
      trigger.addEventListener('click', () => {
        video.muted = !video.muted;
        label.textContent = video.muted ? "🔇 Muet" : "🔊 Son activé";
        label.style.background = video.muted ? "rgba(0,0,0,0.6)" : "var(--text-main)";
      });
    }
  } 
  else if (namespace === 'creations') {
    new ProjectManager();
  }
}

function initBarba() {
  barba.init({
    sync: true,
    transitions: [{
      name: 'zoom-transition',
      leave(data) {
        return gsap.to(data.current.container, { opacity: 0, scale: 0.95, filter: "blur(10px)", duration: 0.4 });
      },
      enter(data) {
        window.scrollTo(0, 0);
        initPageScripts(data.next.namespace);
        return gsap.from(data.next.container, { opacity: 0, scale: 1.05, duration: 0.5, delay: 0.1 });
      }
    }]
  });
  initPageScripts(document.querySelector('[data-barba="container"]').dataset.namespace);
}