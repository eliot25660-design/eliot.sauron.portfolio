/**
 * ELIOT SAURON PORTFOLIO - CORE ENGINE
 * Version: 2.0 (Stable & Robust)
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ System Initialized');
  
  initTheme();
  initNavigation();
  initParallax();
  initVideoPlayer();
  initFilters();
  initCarousel();
  initLightbox();
  initScrollReveal();
});

/* --- 1. THEME MANAGER --- */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Load saved theme
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  
  if (toggleBtn) {
    toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    
    toggleBtn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('theme', newTheme);
    });
  }
}

/* --- 2. NAVIGATION MOBILE --- */
function initNavigation() {
  const menuBtn = document.getElementById('menuToggle');
  const nav = document.getElementById('navMenu');
  
  if (!menuBtn || !nav) return;

  const toggleMenu = () => {
    const isOpen = nav.classList.contains('is-open');
    nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', !isOpen);
    menuBtn.textContent = !isOpen ? '✕' : '☰';
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuBtn.textContent = '☰';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && e.target !== menuBtn) {
      nav.classList.remove('is-open');
      menuBtn.textContent = '☰';
    }
  });
}

/* --- 3. VIDEO PLAYER (ACCUEIL) --- */
function initVideoPlayer() {
  const wrapper = document.getElementById('videoWrapper');
  const video = document.getElementById('heroVideo');
  const badge = document.getElementById('soundBadge');

  if (!wrapper || !video || !badge) return;

  // Default state
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  // Safe Autoplay
  const startPlay = async () => {
    try {
      await video.play();
    } catch (err) {
      console.warn('Autoplay prevented:', err);
      badge.textContent = "Cliquer pour lancer";
    }
  };
  startPlay();

  // Interaction logic
  wrapper.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      badge.textContent = "🔊 Son activé";
      badge.style.opacity = '1';
      if(video.paused) video.play();
    } else {
      video.muted = true;
      badge.textContent = "🔇 Muet";
    }
  });
}

/* --- 4. PARALLAX ENGINE (MOUSE) --- */
function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  if (blobs.length === 0 || window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', (e) => {
    // Normalize coordinates (-1 to 1)
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const animate = () => {
    // Linear Interpolation (Lerp) for smoothness
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    blobs.forEach((blob, i) => {
      // Different speed per blob for depth effect
      const speed = 20 + (i * 15);
      const x = currentX * speed;
      const y = currentY * speed;
      
      blob.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animate);
  };
  animate();
}

/* --- 5. FILTRES PROJETS --- */
function initFilters() {
  const buttons = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.project-item');

  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          // Delay for transition
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            if(card.style.opacity === '0') card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --- 6. CAROUSEL SYSTEM --- */
function initCarousel() {
  const carousels = document.querySelectorAll('.carousel-view');

  carousels.forEach(view => {
    const track = view.querySelector('.carousel-track');
    const slides = view.querySelectorAll('.carousel-img');
    const prev = view.querySelector('.prev-btn');
    const next = view.querySelector('.next-btn');

    // Hide controls if single image
    if (slides.length <= 1) {
      if(prev) prev.style.display = 'none';
      if(next) next.style.display = 'none';
      return;
    }

    let index = 0;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    next.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index + 1) % slides.length;
      update();
    });

    prev.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      update();
    });
  });
}

/* --- 7. LIGHTBOX SYSTEM --- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const triggers = document.querySelectorAll('.carousel-img'); // Images triggers

  if (!modal || !triggers.length) return;

  const open = (src) => {
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
  };

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(img => {
    img.addEventListener('click', () => open(img.src));
  });

  if(closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

/* --- 8. SCROLL REVEAL --- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.glass-card, h1, h2, .btns');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    observer.observe(el);
  });
}