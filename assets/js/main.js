document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 Initialisation Portfolio - Mode Sécurisé");

  // ==========================================
  // 1. GESTION DU THÈME (SOMBRE / CLAIR)
  // ==========================================
  const themeBtn = document.querySelector('.theme-btn');
  const html = document.documentElement;
  
  // Récupération de la préférence ou 'dark' par défaut
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

  // ==========================================
  // 2. LECTEUR VIDÉO (PAGE D'ACCUEIL)
  // ==========================================
  const videoWrapper = document.querySelector('.video-wrapper');
  const video = document.getElementById('presentation-video');
  const soundBadge = document.querySelector('.sound-badge');

  if(video && videoWrapper && soundBadge) {
    // Configuration initiale
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    // Tentative de lecture automatique
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        soundBadge.textContent = "🔇 Cliquer pour lancer";
      });
    }

    // Gestion du clic pour le son
    videoWrapper.addEventListener('click', () => {
      if(video.muted) {
        video.muted = false;
        video.currentTime = 0;
        video.play().then(() => {
          soundBadge.textContent = "🔊 Son activé";
          videoWrapper.style.borderColor = "#FFBEAC"; // Couleur Peach
        }).catch(console.error);
      } else {
        video.muted = true;
        soundBadge.textContent = "🔇 Vidéo muette";
        videoWrapper.style.borderColor = "rgba(255,255,255,0.1)";
      }
    });
  }

  // ==========================================
  // 3. EFFET DE FOND (PARALLAXE)
  // ==========================================
  const blobs = document.querySelectorAll('.blob');
  if(blobs.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
      
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        blob.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // ==========================================
  // 4. SYSTÈME DE FILTRES (PAGE PROJETS)
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if(filterBtns.length > 0 && cards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Boutons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-filter');

        // Cartes
        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if(category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            setTimeout(() => card.style.opacity = '1', 10);
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // ==========================================
  // 5. LIGHTBOX (GALERIE PLEIN ÉCRAN)
  // ==========================================
  const lb = document.querySelector('.lightbox');
  let openLightbox = null; // Variable pour stocker la fonction

  if(lb) {
    const lbImg = lb.querySelector('img');
    const lbCounter = lb.querySelector('.lb-counter');
    const closeBtn = lb.querySelector('.lb-close');
    const nextBtn = lb.querySelector('.lb-next');
    const prevBtn = lb.querySelector('.lb-prev');

    let currentImages = [];
    let currentIndex = 0;

    const updateLbImage = () => {
      if(lbImg && currentImages.length > 0) {
        lbImg.src = currentImages[currentIndex];
        if(lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
      }
    };

    // Fonction globale d'ouverture
    openLightbox = (imgArray, index) => {
      currentImages = imgArray;
      currentIndex = index;
      updateLbImage();
      lb.classList.add('active');
    };

    // Fermeture
    const closeLightbox = () => lb.classList.remove('active');
    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if(e.target === lb) closeLightbox(); });

    // Navigation
    if(nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentImages.length > 0) {
          currentIndex = (currentIndex + 1) % currentImages.length;
          updateLbImage();
        }
      });
    }

    if(prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentImages.length > 0) {
          currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
          updateLbImage();
        }
      });
    }
  }

  // ==========================================
  // 6. GESTION DES CARROUSELS (CARTES)
  // ==========================================
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(carousel => {
    // 1. Récupération sécurisée des images
    let images = [];
    try {
      if(carousel.dataset.images) {
        images = JSON.parse(carousel.dataset.images);
      }
    } catch (e) {
      console.warn("Erreur JSON image", e);
      return; // On saute ce carrousel s'il est mal formé
    }

    if(images.length === 0) return;

    // 2. Sélection des éléments internes (avec vérification)
    const slideImg = carousel.querySelector('.slide');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const indicator = carousel.querySelector('.slide-indicator');
    let index = 0;

    // S'il n'y a pas d'image affichée, on arrête pour éviter le crash
    if(!slideImg) return;

    const updateCard = () => {
      slideImg.src = images[index];
      if(indicator) indicator.textContent = `${index + 1}/${images.length}`;
    };

    // 3. Navigation (seulement si les boutons existent)
    if(prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        index = (index - 1 + images.length) % images.length;
        updateCard();
      });
    }

    if(nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        index = (index + 1) % images.length;
        updateCard();
      });
    }

    // 4. Ouverture Lightbox au clic sur l'image
    slideImg.addEventListener('click', () => {
      if(openLightbox) {
        openLightbox(images, index);
      }
    });
  });

});