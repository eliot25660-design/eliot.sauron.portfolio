console.log("🚀 Portfolio Eliot SAURON - V5 Final Stable");

class App {
  constructor() {
    this.themeToggle();
    this.initBarba();
    this.initScene3D(); // Active Theory Logic
    this.initLightbox(); // Global Lightbox
  }

  // --- 1. GLOBAL UI ---
  themeToggle() {
    const btn = document.getElementById('themeBtn');
    const html = document.documentElement;
    
    // Init from LocalStorage
    const saved = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', saved);
    if(btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';

    if(btn) {
      btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'dark' ? '☀️' : '🌙';
      });
    }
  }

  // --- 2. 3D SCENE & SCROLL (Active Theory Vibe) ---
  initScene3D() {
    // Smooth Scroll
    this.lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Mouse Parallax & Scene Rotation
    this.blobs = document.querySelectorAll('.blob');
    this.scene = document.querySelector('.scene-wrapper');
    this.mx = 0; this.my = 0;
    this.sx = 0; this.sy = 0;

    window.addEventListener('mousemove', (e) => {
      this.mx = (e.clientX / window.innerWidth) * 2 - 1;
      this.my = (e.clientY / window.innerHeight) * 2 - 1;
    });

    const animate = () => {
      // Lerp for smooth follow
      this.sx += (this.mx - this.sx) * 0.05;
      this.sy += (this.my - this.sy) * 0.05;

      // Blob movement
      this.blobs.forEach((b, i) => {
        const speed = (i + 1) * 20;
        b.style.transform = `translate(${this.sx * speed}px, ${this.sy * speed}px)`;
      });

      // Scene Tilt (Active Theory Signature)
      if(this.scene) {
        const scrollY = window.scrollY;
        this.scene.style.transform = `
          rotateX(${scrollY * 0.002}deg) 
          rotateY(${this.sx * 1}deg)
          translateY(${-scrollY * 0.05}px)
        `;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  // --- 3. BARBA.JS (PAGE TRANSITIONS) ---
  initBarba() {
    barba.init({
      sync: true,
      transitions: [{
        name: 'opacity-transition',
        leave(data) {
          return gsap.to(data.current.container, { opacity: 0, y: -20, duration: 0.4 });
        },
        enter: (data) => {
          window.scrollTo(0, 0); // Important reset
          this.lenis.scrollTo(0, { immediate: true }); 
          
          return gsap.from(data.next.container, { 
            opacity: 0, y: 20, duration: 0.6, 
            onStart: () => {
              this.handlePageLoad(data.next.namespace);
            }
          });
        }
      }]
    });

    // First load
    this.handlePageLoad(document.querySelector('.page-view').dataset.namespace);
  }

  handlePageLoad(namespace) {
    this.updateNav(namespace);
    
    if(namespace === 'home') this.initHome();
    if(namespace === 'creations') this.initProjects();
    if(namespace === 'cv') this.initCV();
  }

  updateNav(ns) {
    document.querySelectorAll('.dock-link').forEach(l => {
      l.classList.remove('active');
      const href = l.getAttribute('href').replace('.html', '');
      if(href === 'index' && ns === 'home') l.classList.add('active');
      else if(href.includes(ns)) l.classList.add('active');
    });
  }

  // --- 4. PAGE LOGIC: HOME ---
  initHome() {
    // 1. Reveal Animation
    gsap.utils.toArray('.reveal-text').forEach(el => {
      gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, scrollTrigger: el });
    });

    // 2. Video Logic
    const container = document.getElementById('videoTrigger');
    const video = document.getElementById('heroVideo');
    if(container && video) {
      const badgeIcon = container.querySelector('.sb-icon');
      const badgeText = container.querySelector('.sb-text');
      
      // Force Muted Play initially
      video.muted = true;
      video.play().catch(e => console.log("Autoplay prevented", e));

      container.addEventListener('click', () => {
        if(video.muted) {
          video.muted = false;
          video.currentTime = 0;
          video.play();
          badgeIcon.textContent = "🔊";
          badgeText.textContent = "Son activé — Couper";
          container.style.borderColor = "var(--accent)";
        } else {
          video.muted = true;
          badgeIcon.textContent = "🔇";
          badgeText.textContent = "Vidéo muette — Activer";
          container.style.borderColor = "var(--glass-border)";
        }
      });
    }
  }

  // --- 5. PAGE LOGIC: CREATIONS ---
  initProjects() {
    // 1. Filters
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');

    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        if(filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          gsap.fromTo(card, {autoAlpha: 0, scale: 0.95}, {autoAlpha: 1, scale: 1, duration: 0.4});
        } else {
          gsap.to(card, {autoAlpha: 0, scale: 0.95, duration: 0.3, onComplete: () => card.style.display = 'none'});
        }
      });
    }));

    // 2. Carousels
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
      const track = wrapper.querySelector('.carousel-track');
      const slides = wrapper.querySelectorAll('.c-slide');
      if(slides.length <= 1) return; // No controls needed

      let idx = 0;
      const dot = wrapper.querySelector('.c-dots');
      
      const update = () => {
        track.style.transform = `translateX(-${idx * 100}%)`;
        if(dot) dot.textContent = `${idx + 1}/${slides.length}`;
      };

      wrapper.querySelector('.c-next').addEventListener('click', (e) => {
        e.stopPropagation();
        idx = (idx + 1) % slides.length;
        update();
      });

      wrapper.querySelector('.c-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        idx = (idx - 1 + slides.length) % slides.length;
        update();
      });
    });

    // 3. Bind Lightbox Triggers
    document.querySelectorAll('.c-slide').forEach(img => {
      img.addEventListener('click', () => {
        const wrapper = img.closest('.carousel-track');
        const images = Array.from(wrapper.querySelectorAll('img')).map(el => el.src);
        const startIdx = images.indexOf(img.src);
        this.openLightbox(images, startIdx);
      });
    });
  }

  // --- 6. LIGHTBOX ---
  initLightbox() {
    // Create DOM if missing
    if(!document.querySelector('.lightbox')) {
      const lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.innerHTML = `
        <div class="lb-close">&times;</div>
        <div class="lb-nav lb-prev">&#10094;</div>
        <div class="lb-nav lb-next">&#10095;</div>
        <img src="" alt="Zoom">
      `;
      document.body.appendChild(lb);
    }

    this.lb = document.querySelector('.lightbox');
    this.lbImg = this.lb.querySelector('img');
    this.lbSet = [];
    this.lbIdx = 0;

    // Events
    this.lb.querySelector('.lb-close').addEventListener('click', () => this.closeLightbox());
    this.lb.addEventListener('click', (e) => { if(e.target === this.lb) this.closeLightbox(); });
    
    this.lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); this.navLightbox(1); });
    this.lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); this.navLightbox(-1); });

    document.addEventListener('keydown', (e) => {
      if(!this.lb.classList.contains('active')) return;
      if(e.key === 'Escape') this.closeLightbox();
      if(e.key === 'ArrowRight') this.navLightbox(1);
      if(e.key === 'ArrowLeft') this.navLightbox(-1);
    });
  }

  openLightbox(set, idx) {
    this.lbSet = set;
    this.lbIdx = idx;
    this.lbImg.src = this.lbSet[this.lbIdx];
    this.lb.classList.add('active');
    this.lenis.stop(); // Stop scroll
  }

  closeLightbox() {
    this.lb.classList.remove('active');
    this.lenis.start();
  }

  navLightbox(dir) {
    this.lbIdx = (this.lbIdx + dir + this.lbSet.length) % this.lbSet.length;
    this.lbImg.style.opacity = 0.5;
    setTimeout(() => {
        this.lbImg.src = this.lbSet[this.lbIdx];
        this.lbImg.style.opacity = 1;
    }, 150);
  }

  // --- 7. PAGE LOGIC: CV ---
  initCV() {
    gsap.from('.cv-card', {
      y: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
    });
  }
}

// Start
window.addEventListener('DOMContentLoaded', () => {
  new App();
});