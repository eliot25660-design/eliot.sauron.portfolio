document.addEventListener('DOMContentLoaded', () => {
  console.log("⚡ Portfolio Eliot - Ready");

  // --- 1. THEME MANAGER ---
  const initTheme = () => {
    const toggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('theme') || 'dark'; // Dark default for premium feel
    
    html.setAttribute('data-theme', saved);
    if(toggle) toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

    if(toggle) {
      toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        toggle.textContent = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', next);
      });
    }
  };

  // --- 2. PARALLAX & TILT (Active Theory Style) ---
  const initParallax = () => {
    const blobs = document.querySelectorAll('.blob');
    const scene = document.querySelector('.scene-container');
    let mx = 0, my = 0; // Mouse coords
    let cx = 0, cy = 0; // Current smooth coords

    window.addEventListener('mousemove', (e) => {
      mx = (e.clientX / window.innerWidth) - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
    });

    const loop = () => {
      cx += (mx - cx) * 0.05; // Smooth lerp
      cy += (my - cy) * 0.05;

      // Move Blobs
      blobs.forEach((b, i) => {
        const speed = (i + 1) * 30;
        b.style.transform = `translate(${cx * speed}px, ${cy * speed}px)`;
      });

      // Tilt Scene (Very subtle)
      if(scene) {
        scene.style.transform = `rotateY(${cx * 2}deg) rotateX(${-cy * 2}deg)`;
      }

      requestAnimationFrame(loop);
    };
    loop();
  };

  // --- 3. VIDEO BLOB (Home Only) ---
  const initVideo = () => {
    const wrapper = document.querySelector('.video-blob-wrapper');
    const video = document.getElementById('heroVideo');
    if(!wrapper || !video) return;

    const badgeText = wrapper.querySelector('.sb-text');
    const badgeIcon = wrapper.querySelector('.sb-icon');

    // Attempt autoplay
    video.muted = true;
    video.play().catch(() => console.log("Autoplay blocked"));

    wrapper.addEventListener('click', () => {
      if(video.muted) {
        video.muted = false;
        video.currentTime = 0;
        video.play();
        badgeIcon.textContent = "🔊";
        badgeText.textContent = "Son activé — Tap pour couper";
        wrapper.style.borderColor = "var(--accent)";
      } else {
        video.muted = true;
        badgeIcon.textContent = "🔇";
        badgeText.textContent = "Vidéo muette — Tap pour son";
        wrapper.style.borderColor = "var(--glass-border)";
      }
    });
  };

  // --- 4. PROJECTS (Filters & Lightbox) ---
  const initProjects = () => {
    // A. Filters
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    
    if(btns.length > 0) {
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;

          cards.forEach(card => {
            const cat = card.dataset.category;
            // GSAP for smooth hiding/showing
            if(filter === 'all' || cat === filter) {
              card.style.display = 'flex';
              gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, clearProps: "all" });
            } else {
              gsap.to(card, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => card.style.display = 'none' });
            }
          });
        });
      });
    }

    // B. Lightbox Logic
    const lb = document.querySelector('.lightbox');
    if(lb) {
      const lbImg = lb.querySelector('.lb-img');
      const lbPrev = lb.querySelector('.lb-prev');
      const lbNext = lb.querySelector('.lb-next');
      const lbClose = lb.querySelector('.lb-close');
      
      let currentSet = [];
      let currentIndex = 0;

      const openLb = (images, index) => {
        currentSet = images;
        currentIndex = index;
        updateLb();
        lb.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
      };

      const closeLb = () => {
        lb.classList.remove('active');
        document.body.style.overflow = '';
      };

      const updateLb = () => {
        lbImg.style.opacity = 0.5;
        setTimeout(() => {
          lbImg.src = currentSet[currentIndex];
          lbImg.style.opacity = 1;
        }, 150);
      };

      // Event Listeners for Cards
      document.querySelectorAll('.card').forEach(card => {
        const triggers = card.querySelectorAll('.open-lb'); // Images inside card
        // Collect all images in this card for the gallery
        const images = Array.from(card.querySelectorAll('img')).map(img => img.src);
        
        triggers.forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedSrc = trigger.getAttribute('src') || trigger.querySelector('img').src;
            const startIdx = images.indexOf(clickedSrc);
            openLb(images, startIdx !== -1 ? startIdx : 0);
          });
        });
      });

      // Controls
      lbClose.addEventListener('click', closeLb);
      lb.addEventListener('click', (e) => { if(e.target === lb) closeLb(); });
      
      lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % currentSet.length;
        updateLb();
      });
      
      lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
        updateLb();
      });

      // Keyboard
      document.addEventListener('keydown', (e) => {
        if(!lb.classList.contains('active')) return;
        if(e.key === 'Escape') closeLb();
        if(e.key === 'ArrowRight') lbNext.click();
        if(e.key === 'ArrowLeft') lbPrev.click();
      });
    }
  };

  // --- 5. SCROLL REVEAL ---
  const initScroll = () => {
    gsap.utils.toArray('.reveal').forEach(elem => {
      gsap.fromTo(elem, 
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: elem, start: 'top 85%' }
        }
      );
    });
  };

  // INIT
  initTheme();
  initParallax();
  initVideo();
  initProjects();
  initScroll();
});