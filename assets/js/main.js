console.log("🚀 Portfolio Eliot SAURON - V3 Ready");

// --- 1. GESTION DU THÈME ---
const updateTheme = () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('themeBtn');
  if(btn) btn.textContent = isDark ? '☀️' : '🌙';
};

// --- 2. ACTIVE THEORY LITE (Scene 3D + Parallaxe) ---
class Scene3D {
  constructor() {
    this.scene = document.querySelector('.scene-wrapper');
    this.blobs = document.querySelectorAll('.blob');
    this.x = 0; this.y = 0;
    this.targetX = 0; this.targetY = 0;
    this.scrollY = 0;
    
    // Listeners
    window.addEventListener('mousemove', (e) => {
      this.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    window.addEventListener('scroll', () => this.scrollY = window.scrollY);

    // Loop
    this.raf();
  }

  raf() {
    // Lerp pour fluidité
    this.x += (this.targetX - this.x) * 0.05;
    this.y += (this.targetY - this.y) * 0.05;

    // A. Parallaxe Blobs
    if(this.blobs.length) {
      this.blobs.forEach((blob, i) => {
        const speed = (i + 1) * 15;
        blob.style.transform = `translate(${this.x * speed}px, ${this.y * speed}px)`;
      });
    }

    // B. Rotation Scene au scroll (Axe X)
    // Rotation légère : max 3deg
    if(this.scene) {
      const rot = Math.min(3, Math.max(-3, this.scrollY * 0.002));
      const lift = this.scrollY * -0.05;
      this.scene.style.transform = `rotateX(${rot}deg) translateY(${lift}px)`;
    }

    requestAnimationFrame(this.raf.bind(this));
  }
}

// --- 3. PROJECT SYSTEM (Carousel + Lightbox + Filtres) ---
class ProjectSystem {
  constructor() {
    this.initFilters();
    this.initCarousels();
    this.initLightbox();
  }

  // A. FILTRES
  initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active Class
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        
        const filter = btn.dataset.filter;
        
        // GSAP Animation
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          
          if(match) {
            card.classList.remove('hidden');
            gsap.to(card, { 
              display: 'flex', autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' 
            });
          } else {
            gsap.to(card, { 
              autoAlpha: 0, scale: 0.9, duration: 0.3, 
              onComplete: () => { card.style.display = 'none'; card.classList.add('hidden'); }
            });
          }
        });
      });
    });
  }

  // B. CAROUSELS (Logique par carte)
  initCarousels() {
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
      const container = wrapper.querySelector('.slides-container');
      const slides = wrapper.querySelectorAll('.slide');
      const prevBtn = wrapper.querySelector('.prev');
      const nextBtn = wrapper.querySelector('.next');
      const indicator = wrapper.querySelector('.slide-indicator');
      
      if(slides.length <= 1) {
        wrapper.classList.add('single');
        return; 
      }

      let index = 0;
      const update = () => {
        container.style.transform = `translateX(-${index * 100}%)`;
        if(indicator) indicator.textContent = `${index + 1}/${slides.length}`;
      };

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        index = (index + 1) % slides.length;
        update();
      });

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        index = (index - 1 + slides.length) % slides.length;
        update();
      });
    });
  }

  // C. LIGHTBOX (Globale mais contextuelle)
  initLightbox() {
    // Créer la lightbox si elle n'existe pas
    if(!document.querySelector('.lightbox')) {
      const lbHTML = `
        <div class="lightbox">
          <div class="lb-close">&times;</div>
          <div class="lb-nav lb-prev">&#10094;</div>
          <div class="lb-nav lb-next">&#10095;</div>
          <img src="" alt="Zoom Projet">
        </div>`;
      document.body.insertAdjacentHTML('beforeend', lbHTML);
    }

    const lb = document.querySelector('.lightbox');
    const lbImg = lb.querySelector('img');
    let currentImages = [];
    let currentIndex = 0;

    const openLb = (imgSrc, allImages) => {
      currentImages = allImages;
      currentIndex = currentImages.indexOf(imgSrc);
      updateImage();
      lb.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scroll
    };

    const closeLb = () => {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    };

    const updateImage = () => {
      lbImg.src = currentImages[currentIndex];
    };

    // Trigger au clic sur une slide
    document.querySelectorAll('.slide').forEach(img => {
      img.addEventListener('click', () => {
        // Récupérer toutes les images de CE carousel spécifique
        const wrapper = img.closest('.slides-container');
        const allSlides = Array.from(wrapper.querySelectorAll('.slide')).map(el => el.src);
        openLb(img.src, allSlides);
      });
    });

    // Events Navigation Lightbox
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-next').addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateImage();
    });
    lb.querySelector('.lb-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateImage();
    });
    
    // Fermer si clic dehors
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLb(); });

    // Clavier
    document.addEventListener('keydown', (e) => {
      if(!lb.classList.contains('active')) return;
      if(e.key === 'Escape') closeLb();
      if(e.key === 'ArrowRight') lb.querySelector('.lb-next').click();
      if(e.key === 'ArrowLeft') lb.querySelector('.lb-prev').click();
    });
  }
}

// --- 4. GLOBAL INIT & BARBA ---
document.addEventListener('DOMContentLoaded', () => {
  // Init Globals
  const lenis = new Lenis({ duration: 1.2 });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Theme
  const themeBtn = document.getElementById('themeBtn');
  if(themeBtn) {
    themeBtn.addEventListener('click', () => {
      localStorage.setItem('theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      updateTheme();
    });
    updateTheme();
  }

  // Active Theory Effect
  new Scene3D();

  // Barba
  initBarba();
});

function initBarba() {
  barba.init({
    sync: true,
    transitions: [{
      name: 'fade',
      leave(data) {
        return gsap.to(data.current.container, { opacity: 0, scale: 0.95, duration: 0.4 });
      },
      enter(data) {
        window.scrollTo(0,0);
        runPageScripts(data.next.namespace);
        return gsap.from(data.next.container, { opacity: 0, scale: 1.05, duration: 0.5 });
      }
    }]
  });
  // Run scripts for the first load
  runPageScripts(document.querySelector('.page-view').dataset.namespace);
}

// --- 5. LOGIQUE PAR PAGE ---
function runPageScripts(namespace) {
  // Update Nav Active State
  document.querySelectorAll('.dock-link').forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href') === window.location.pathname.split('/').pop() || (window.location.pathname === '/' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  if(namespace === 'home') {
    // Audio Manager
    const video = document.getElementById('myVideo');
    const trigger = document.getElementById('videoTrigger');
    const label = document.getElementById('soundLabel');
    
    if(video && trigger) {
      video.play().catch(()=> console.log('Autoplay blocked')); // Force play
      trigger.addEventListener('click', () => {
        video.muted = !video.muted;
        if(video.paused) video.play(); // Fix iOS
        label.textContent = video.muted ? "🔇 Muet" : "🔊 Son activé";
        label.style.background = video.muted ? "rgba(0,0,0,0.6)" : "var(--text-main)";
      });
    }
  }

  if(namespace === 'creations') {
    new ProjectSystem();
  }
}