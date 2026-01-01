document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Portfolio Init - Safe Mode");

  // --- 1. REVEAL SCROLL (PRIORITÉ ABSOLUE) ---
  // On lance ça en premier pour que le contenu apparaisse quoi qu'il arrive
  const reveals = document.querySelectorAll('.reveal-text');
  
  if (reveals.length > 0) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target); // On arrête d'observer une fois affiché
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObs.observe(el));
  }

  // --- 2. GESTION DU THÈME ---
  const themeBtn = document.getElementById('themeBtn');
  const html = document.documentElement;
  
  // Appliquer le thème sauvegardé immédiatement
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  
  if(themeBtn) {
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      localStorage.setItem('theme', newTheme);
    });
  }

  // --- 3. MENU MOBILE ---
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  
  if(menuBtn && nav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('active');
    });
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== menuBtn) {
        nav.classList.remove('active');
      }
    });
  }

  // --- 4. VIDEO PLAYER (Uniquement si présent) ---
  const videoWrapper = document.getElementById('videoWrapper');
  const video = document.getElementById('myVideo');
  const soundLabel = document.getElementById('soundLabel');

  if(video && videoWrapper && soundLabel) {
    // Initialisation
    video.muted = true; 
    
    // Gestionnaire de clic
    videoWrapper.addEventListener('click', () => {
      if(video.muted) {
        video.muted = false;
        soundLabel.textContent = "🔊 Son activé";
        soundLabel.classList.add('active');
        // Sécurité autoplay
        if(video.paused) video.play().catch(e => console.warn("Autoplay prevent", e));
      } else {
        video.muted = true;
        soundLabel.textContent = "🔇 Vidéo muette";
        soundLabel.classList.remove('active');
      }
    });
  }

  // --- 5. PARALLAX SOURIS (Optimisé) ---
  const blobs = document.querySelectorAll('.blob');
  // On ne lance la boucle que s'il y a des blobs
  if (blobs.length > 0 && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    const animateBlobs = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;

      blobs.forEach((blob, i) => {
        const speed = 0.05 + (i * 0.03); // Vitesse variable
        const x = currentX * 50 * speed;
        const y = currentY * 50 * speed;
        blob.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(animateBlobs);
    };
    animateBlobs();
  }

  // --- 6. TILT 3D (CV) ---
  const tilts = document.querySelectorAll('.tilt-element');
  if(tilts.length > 0 && window.matchMedia("(min-width: 900px)").matches) {
    tilts.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Rotation limitée pour éviter les bugs visuels
        const rotateX = ((y - centerY) / centerY) * -2;
        const rotateY = ((x - centerX) / centerX) * 2;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
      });
    });
  }

  // --- 7. FILTRES PROJETS ---
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if (filters.length > 0 && cards.length > 0) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if(cat === 'all' || cardCat === cat) {
            card.style.display = 'flex';
            // Petit délai pour permettre au display:flex de s'appliquer avant l'opacité
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => card.style.display = 'none', 300);
          }
        });
      });
    });
  }

  // --- 8. CARROUSEL ---
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const slidesContainer = wrapper.querySelector('.carousel-slides');
    const slides = wrapper.querySelectorAll('.c-slide');
    const nextBtn = wrapper.querySelector('.c-next');
    const prevBtn = wrapper.querySelector('.c-prev');
    const dotsContainer = wrapper.querySelector('.c-dots');

    if(!slidesContainer || slides.length <= 1) {
        if(nextBtn) nextBtn.style.display = 'none';
        if(prevBtn) prevBtn.style.display = 'none';
        return;
    }

    let index = 0;

    // Dots creation
    if(dotsContainer) {
        dotsContainer.innerHTML = ''; // Clean
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'active' : '';
            dotsContainer.appendChild(dot);
        });
    }

    const updateCarousel = () => {
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
      if(dotsContainer) {
          const allDots = dotsContainer.querySelectorAll('span');
          allDots.forEach((d, i) => d.className = i === index ? 'active' : '');
      }
    };

    if(nextBtn) nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index + 1) % slides.length;
      updateCarousel();
    });

    if(prevBtn) prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  });

  // --- 9. LIGHTBOX ---
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.querySelector('.lb-close');

  if(lb && lbImg) {
    document.querySelectorAll('.lb-trigger').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        lbImg.src = img.src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
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
});