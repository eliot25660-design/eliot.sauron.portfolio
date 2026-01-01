console.log("🚀 Portfolio Eliot SAURON - V4 Final");

class App {
  constructor() {
    this.initGlobals();
    this.initBarba();
    this.scene = new Scene3D(); // Active Theory Logic
  }

  initGlobals() {
    // Lenis Smooth Scroll
    this.lenis = new Lenis({ duration: 1.2 });
    const raf = (time) => { this.lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // Theme Manager
    this.updateTheme();
    const btn = document.getElementById('themeBtn');
    if(btn) btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      localStorage.setItem('theme', current === 'dark' ? 'light' : 'dark');
      this.updateTheme();
    });
  }

  updateTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const btn = document.getElementById('themeBtn');
    if(btn) btn.textContent = isDark ? '☀️' : '🌙';
  }

  // --- BARBA.JS ---
  initBarba() {
    barba.init({
      sync: true,
      transitions: [{
        name: 'fade',
        leave: (data) => gsap.to(data.current.container, { opacity: 0, scale: 0.95, duration: 0.4 }),
        enter: (data) => {
          window.scrollTo(0,0);
          this.handlePageLoad(data.next.namespace);
          return gsap.from(data.next.container, { opacity: 0, scale: 1.05, duration: 0.5 });
        }
      }]
    });
    // First Load
    this.handlePageLoad(document.querySelector('.page-view').dataset.namespace);
  }

  handlePageLoad(namespace) {
    // Nav Update
    document.querySelectorAll('.dock-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if(window.location.pathname.includes(href) || (window.location.pathname === '/' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Page Specifics
    if (namespace === 'home') this.initAudio();
    if (namespace === 'creations') this.initProjects();
  }

  // --- AUDIO LOGIC (Index) ---
  initAudio() {
    const container = document.getElementById('videoTrigger');
    const video = document.getElementById('myVideo');
    const badgeIcon = container?.querySelector('.icon');
    const badgeText = container?.querySelector('.text');

    if (video && container) {
      // Autoplay muet
      video.muted = true;
      video.play().catch(() => console.log('Autoplay prevented'));

      container.addEventListener('click', () => {
        if (video.muted) {
          // UNMUTE
          video.muted = false;
          video.play().then(() => {
            badgeIcon.textContent = "🔊";
            badgeText.textContent = "Son activé — Couper";
            badgeText.parentElement.style.background = "var(--text-main)";
          }).catch(err => console.error("Audio play failed", err));
        } else {
          // MUTE
          video.muted = true;
          badgeIcon.textContent = "🔇";
          badgeText.textContent = "Vidéo muette — Activer";
          badgeText.parentElement.style.background = "rgba(0,0,0,0.6)";
        }
      });
    }
  }

  // --- CREATIONS LOGIC ---
  initProjects() {
    // 1. Filtres
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if(match) {
          card.classList.remove('hidden');
          gsap.to(card, { display:'flex', autoAlpha:1, scale:1, duration:0.4 });
        } else {
          gsap.to(card, { autoAlpha:0, scale:0.9, duration:0.3, onComplete:() => card.classList.add('hidden') });
        }
      });
    }));

    // 2. Carousels
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
      const track = wrapper.querySelector('.track');
      const slides = wrapper.querySelectorAll('.slide');
      if(slides.length <= 1) return;

      let idx = 0;
      const indicator = wrapper.querySelector('.slide-indicator');
      const update = () => {
        track.style.transform = `translateX(-${idx * 100}%)`;
        indicator.textContent = `${idx+1}/${slides.length}`;
      };

      wrapper.querySelector('.next').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx+1)%slides.length; update(); });
      wrapper.querySelector('.prev').addEventListener('click', (e) => { e.stopPropagation(); idx = (idx-1+slides.length)%slides.length; update(); });
    });

    // 3. Lightbox
    this.initLightbox();
  }

  initLightbox() {
    if(!document.querySelector('.lightbox')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="lightbox">
          <div class="lb-close">&times;</div>
          <div class="lb-nav lb-prev">&#10094;</div>
          <div class="lb-nav lb-next">&#10095;</div>
          <img src="">
        </div>`);
    }
    const lb = document.querySelector('.lightbox');
    const lbImg = lb.querySelector('img');
    let currentSet = [];
    let currentIdx = 0;

    const open = (src, set) => {
      currentSet = set; currentIdx = set.indexOf(src);
      lbImg.src = currentSet[currentIdx];
      lb.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    
    // Bind Clicks
    document.querySelectorAll('.slide').forEach(img => {
      img.addEventListener('click', () => {
        const wrapper = img.closest('.track');
        const set = Array.from(wrapper.querySelectorAll('.slide')).map(el => el.src);
        open(img.src, set);
      });
    });

    // Controls
    const close = () => { lb.classList.remove('active'); document.body.style.overflow = ''; };
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.addEventListener('click', (e) => { if(e.target === lb) close(); });
    
    const nav = (dir) => {
      currentIdx = (currentIdx + dir + currentSet.length) % currentSet.length;
      lbImg.src = currentSet[currentIdx];
    };
    lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); nav(1); });
    lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); nav(-1); });
    
    document.addEventListener('keydown', (e) => {
      if(!lb.classList.contains('active')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowRight') nav(1);
      if(e.key === 'ArrowLeft') nav(-1);
    });
  }
}

// --- ACTIVE THEORY LITE ---
class Scene3D {
  constructor() {
    this.blobs = document.querySelectorAll('.blob');
    this.scene = document.querySelector('.scene-wrapper');
    this.mx = 0; this.my = 0;
    this.sx = 0; this.sy = 0;
    
    window.addEventListener('mousemove', e => {
      this.mx = (e.clientX / window.innerWidth) * 2 - 1;
      this.my = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    this.raf();
  }
  
  raf() {
    this.sx += (this.mx - this.sx) * 0.05;
    this.sy += (this.my - this.sy) * 0.05;
    
    // Parallaxe Blobs
    this.blobs.forEach((b, i) => {
      b.style.transform = `translate(${this.sx * (i+1) * 20}px, ${this.sy * (i+1) * 20}px)`;
    });

    // Rotation Scene Scroll
    if(this.scene) {
      const scroll = window.scrollY;
      this.scene.style.transform = `rotateX(${scroll * 0.005}deg) translateY(${-scroll * 0.05}px)`;
    }
    
    requestAnimationFrame(this.raf.bind(this));
  }
}

// START
new App();