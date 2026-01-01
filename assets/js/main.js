document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Initialisation Portfolio - Safe Mode");

  // 1. SCROLL REVEAL (ActiveTheory-lite)
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObs.observe(el));

  // 2. GESTION DU THÈME
  const themeBtn = document.getElementById('themeBtn');
  const html = document.documentElement;
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

  // 3. MENU MOBILE
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if(menuBtn && nav) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('active'));
    nav.addEventListener('click', () => nav.classList.remove('active'));
  }

  // 4. VIDEO PLAYER (Sécurisé)
  const video = document.getElementById('myVideo');
  const label = document.getElementById('soundLabel');
  const wrapper = document.querySelector('.blob-video');

  if(video && wrapper && label) {
    video.muted = true;
    
    // Autoplay sécurisé
    video.play().catch(() => {
        label.textContent = "Cliquer pour lire";
    });

    wrapper.addEventListener('click', () => {
      if(video.muted) {
        video.muted = false;
        label.textContent = "🔊 Son activé";
        if(video.paused) video.play();
      } else {
        video.muted = true;
        label.textContent = "🔇 Muet";
      }
    });
  }

  // 5. PARALLAX SOURIS (Optimisé)
  const blobs = document.querySelectorAll('.blob');
  if(blobs.length > 0 && window.matchMedia("(min-width: 900px)").matches) {
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    const animateBlobs = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      blobs.forEach((blob, index) => {
        const speed = 20 + (index * 10);
        blob.style.transform = `translate(${targetX * speed}px, ${targetY * speed}px)`;
      });
      requestAnimationFrame(animateBlobs);
    };
    animateBlobs();
  }

  // 6. FILTRES (Si présents)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card'); // Gardé la classe .card d'origine

  if(filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');

        cards.forEach(card => {
          if(cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // 7. LIGHTBOX SIMPLE
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.querySelector('.lb-close');

  if(lb && lbImg) {
    document.querySelectorAll('.lb-trigger').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lb.classList.add('active');
      });
    });
    const closeLb = () => lb.classList.remove('active');
    if(lbClose) lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLb(); });
  }
});