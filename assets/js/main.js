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
          videoWrapper.style.borderColor = "var(--peach)";
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
          // Petit délai pour l'anim opacity
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // --- 5. GESTION LIGHTBOX & CARROUSELS ---
  const lb = document.querySelector('.lightbox');
  
  // Variables globales pour la lightbox
  let currentLbImages = [];
  let currentLbIndex = 0;
  let lbImg, lbCounter;

  // Initialisation de la Lightbox si elle existe dans le DOM
  if(lb) {
    lbImg = lb.querySelector('img');
    lbCounter = lb.querySelector('.lb-counter');
    const closeBtn = lb.querySelector('.lb-close');
    const nextBtn = lb.querySelector('.lb-next');
    const prevBtn = lb.querySelector('.lb-prev');

    // Fonction d'ouverture accessible globalement
    window.openLightbox = (imgArray, index) => {
      currentLbImages = imgArray;
      currentLbIndex = index;
      updateLbImage();
      lb.classList.add('active');
    };

    // Mise à jour de l'image de la lightbox
    const updateLbImage = () => {
      lbImg.src = currentLbImages[currentLbIndex];
      if(lbCounter) {
        lbCounter.textContent = `${currentLbIndex + 1} / ${currentLbImages.length}`;
      }
    };

    // Fermeture
    const closeLightbox = () => lb.classList.remove('active');
    closeBtn.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLightbox(); });

    // Navigation Lightbox
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLbIndex = (currentLbIndex + 1) % currentLbImages.length;
      updateLbImage();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLbIndex = (currentLbIndex - 1 + currentLbImages.length) % currentLbImages.length;
      updateLbImage();
    });
  }

  // --- 6. LOGIQUE DES CARROUSELS (Cartes Projets) ---
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    // Récupération sécurisée des données JSON
    let images = [];
    try {
      images = JSON.parse(carousel.dataset.images || '[]');
    } catch (e) {
      console.error("Erreur parsing JSON images", e);
      return;
    }

    if (images.length === 0) return;

    const slideImg = carousel.querySelector('.slide');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const indicator = carousel.querySelector('.slide-indicator');
    let currentIndex = 0;

    // Fonction de mise à jour de la slide locale
    const updateSlide = () => {
      slideImg.src = images[currentIndex];
      if (indicator) indicator.textContent = `${currentIndex + 1}/${images.length}`;
    };

    // Clic image -> Ouvre la Lightbox
    slideImg.addEventListener('click', () => {
      if(window.openLightbox) {
        window.openLightbox(images, currentIndex);
      }
    });

    // Bouton Suivant (Carte)
    if(nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche l'ouverture de la lightbox
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide();
      });
    }

    // Bouton Précédent (Carte)
    if(prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlide();
      });
    }
  });

});