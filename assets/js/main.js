document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Portfolio Loaded - Enhanced Mode");

  // --- 1. THÈME MANAGER ---
  const themeBtn = document.getElementById('themeBtn');
  const html = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if(themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  if(themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- 2. MENU MOBILE ---
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if(menuBtn && nav) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('active'));
    nav.addEventListener('click', () => nav.classList.remove('active'));
  }

  // --- 3. VIDEO PLAYER ROBUSTE ---
  const videoWrapper = document.getElementById('videoWrapper');
  const video = document.getElementById('myVideo');
  const soundLabel = document.getElementById('soundLabel');

  if(video && videoWrapper && soundLabel) {
    // Initialisation
    video.muted = true; 
    soundLabel.textContent = "🔇 Vidéo muette";

    videoWrapper.addEventListener('click', () => {
      if(video.muted) {
        video.muted = false;
        soundLabel.textContent = "🔊 Son activé";
        // Petite sécurité si autoplay avait échoué
        if(video.paused) video.play().catch(e => console.log("Play error", e));
      } else {
        video.muted = true;
        soundLabel.textContent = "🔇 Vidéo muette";
      }
    });
  }

  // --- 4. PARALLAX "ACTIVE THEORY LITE" ---
  const parallaxContainer = document.querySelector('.parallax-container');
  const blobs = document.querySelectorAll('.blob');
  
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    // Normalisé -1 à 1
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Animation Loop
  const animate = () => {
    // Lerp (Linear Interpolation) pour fluidité
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    // Blobs movement
    if(blobs.length) {
      blobs.forEach((blob, i) => {
        const speed = parseFloat(blob.getAttribute('data-speed')) || 0.05 + (i * 0.02);
        const x = currentX * 100 * speed;
        const y = currentY * 100 * speed;
        blob.style.transform = `translate(${x}px, ${y}px)`;
      });
    }

    // Hero content parallax
    const heroElements = document.querySelectorAll('.parallax-element');
    heroElements.forEach(el => {
      const speed = 20;
      el.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
    });

    requestAnimationFrame(animate);
  };
  animate();

  // --- 5. TILT 3D (CV) ---
  const tilts = document.querySelectorAll('.tilt-element');
  if(tilts.length && window.matchMedia("(min-width: 900px)").matches) {
    tilts.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -3; // Rotation subtile
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
      });
    });
  }

  // --- 6. FILTRES PROJETS ---
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if(cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 400); // Wait transition
        }
      });
    });
  });

  // --- 7. CARROUSEL INTERNE ---
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const slidesContainer = wrapper.querySelector('.carousel-slides');
    const slides = wrapper.querySelectorAll('.c-slide');
    const nextBtn = wrapper.querySelector('.c-next');
    const prevBtn = wrapper.querySelector('.c-prev');
    const dotsContainer = wrapper.querySelector('.c-dots');

    if(slides.length <= 1) {
      if(nextBtn) nextBtn.style.display = 'none';
      if(prevBtn) prevBtn.style.display = 'none';
      return;
    }

    let index = 0;

    // Create Dots
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.style.cssText = `width:6px; height:6px; background:white; border-radius:50%; display:inline-block; margin:0 3px; opacity:${i===0?1:0.4};`;
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('span');

    const update = () => {
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.style.opacity = i === index ? 1 : 0.4);
    };

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop lightbox trigger
      index = (index + 1) % slides.length;
      update();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      update();
    });
  });

  // --- 8. LIGHTBOX ---
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.querySelector('.lb-close');

  if(lb && lbImg) {
    document.querySelectorAll('.lb-trigger').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
      });
    });

    const closeLb = () => {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    };

    if(lbClose) lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => { if(e.key === "Escape") closeLb(); });
  }

  // --- 9. REVEAL SCROLL ---
  const reveals = document.querySelectorAll('.reveal-text');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObs.observe(el);
  });
});