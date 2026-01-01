document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Initialisation Portfolio - Mode Strict");

  // --- 1. GESTION DU THÈME ---
  const themeBtn = document.querySelector('.theme-btn');
  const html = document.documentElement;
  
  // Charge le thème ou 'dark' par défaut
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

  // --- 2. VIDEO PLAYER (SOLIDE) ---
  const videoWrapper = document.querySelector('.video-wrapper');
  const video = document.getElementById('presentation-video');
  const soundBadge = document.querySelector('.sound-badge');

  if(video && videoWrapper && soundBadge) {
    // Force la configuration initiale
    video.muted = true;
    video.loop = true;
    video.playsInline = true; // Vital pour iOS

    // Tentative d'autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("Autoplay bloqué par le navigateur (normal). Attente d'interaction.", error);
        soundBadge.textContent = "🔇 Cliquer pour lancer";
      });
    }

    // Gestion du clic Mute/Unmute
    videoWrapper.addEventListener('click', () => {
      if(video.muted) {
        // On active le son
        video.muted = false;
        video.currentTime = 0; // Restart pour l'effet
        video.play().then(() => {
          soundBadge.textContent = "🔊 Son activé";
          videoWrapper.style.borderColor = "var(--color-accent)";
        }).catch(e => console.error("Erreur lecture", e));
      } else {
        // On coupe le son
        video.muted = true;
        soundBadge.textContent = "🔇 Vidéo muette";
        videoWrapper.style.borderColor = "rgba(255,255,255,0.1)";
      }
    });
  }

  // --- 3. EFFET PARALLAXE SOURIS (LÉGER) ---
  const blobs = document.querySelectorAll('.blob');
  let mouseX = 0, mouseY = 0;
  
  window.addEventListener('mousemove', (e) => {
    // Normalise entre -1 et 1
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    
    blobs.forEach((blob, index) => {
      const speed = (index + 1) * 20; // Vitesse différente par blob
      const x = mouseX * speed;
      const y = mouseY * speed;
      blob.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // --- 4. SYSTÈME DE FILTRES ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Gestion boutons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-filter');

      // Gestion cartes
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if(category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          // Petit délai pour l'anim opacity si besoin, ici on fait simple
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // --- 5. LIGHTBOX (Galerie) ---
  const lb = document.querySelector('.lightbox');
  if(lb) {
    const lbImg = lb.querySelector('img');
    const closeBtn = lb.querySelector('.lb-close');
    const nextBtn = lb.querySelector('.lb-next');
    const prevBtn = lb.querySelector('.lb-prev');
    
    let currentImages = [];
    let currentIndex = 0;

    // Fonction d'ouverture
    window.openLightbox = (imgArray, index) => {
      currentImages = imgArray;
      currentIndex = index;
      lbImg.src = currentImages[currentIndex];
      lb.classList.add('active');
    };

    // Fermeture
    const closeLightbox = () => lb.classList.remove('active');
    closeBtn.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLightbox(); });

    // Navigation
    const showImage = (idx) => {
      currentIndex = (idx + currentImages.length) % currentImages.length;
      lbImg.src = currentImages[currentIndex];
    };

    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
    
    // Attachement aux cartes
    document.querySelectorAll('.card-image-box').forEach(box => {
      box.addEventListener('click', () => {
        // Récupérer l'image cliquée + les autres images cachées s'il y en a dans la carte (optionnel)
        // Ici on prend simple : l'image cliquée
        const src = box.querySelector('img').src;
        openLightbox([src], 0); 
      });
    });
  }
});