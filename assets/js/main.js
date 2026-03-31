document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'theme-dark';

    body.className = savedTheme;

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('theme-dark')) {
                body.classList.replace('theme-dark', 'theme-light');
                localStorage.setItem('theme', 'theme-light');
            } else {
                body.classList.replace('theme-light', 'theme-dark');
                localStorage.setItem('theme', 'theme-dark');
            }
        });
    }

    // --- 2. Scroll Reveal Animation (Improved) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // --- 3. Video Mute/Unmute Logic ---
    const video = document.getElementById('hero-video');
    const videoBtn = document.getElementById('video-toggle');
    
    if (video && videoBtn) {
        video.play().catch(() => {});
        video.style.cursor = "pointer"; 

        const toggleSound = (e) => {
            if(e) e.preventDefault();
            if (video.muted) {
                video.muted = false;
                videoBtn.innerHTML = '<span class="icon-state">🔊</span><span class="text-state">Son activé — cliquer pour couper</span>';
            } else {
                video.muted = true;
                videoBtn.innerHTML = '<span class="icon-state">🔇</span><span class="text-state">Vidéo muette — cliquer pour activer</span>';
            }
        };

        videoBtn.addEventListener('click', toggleSound);
        video.addEventListener('click', toggleSound);
    }

    // --- 4. Projects Filtering (Improved) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                let visibleCount = 0;

                projects.forEach((project, index) => {
                    const category = project.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.classList.add('visible');
                        }, index * 50);
                        visibleCount++;
                    } else {
                        project.classList.remove('visible');
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    // --- 5. Carousel & Lightbox Logic (Enhanced) ---
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
        const slides = wrapper.querySelector('.carousel-slides');
        const images = slides.querySelectorAll('img');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const indicators = wrapper.querySelector('.carousel-indicators');
        
        let currentIndex = 0;

        if (images.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
        } else {
            images.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.style.cssText = `
                    width: 7px; 
                    height: 7px; 
                    background: rgba(255,255,255,0.4); 
                    border-radius: 50%; 
                    display: inline-block; 
                    margin: 0 4px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                `;
                if(i === 0) {
                    dot.style.background = 'rgba(255,255,255,1)';
                    dot.style.width = '10px';
                }
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                indicators.appendChild(dot);
            });
        }

        const updateCarousel = () => {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (indicators.children.length > 0) {
                Array.from(indicators.children).forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.style.background = 'rgba(255,255,255,1)';
                        dot.style.width = '10px';
                    } else {
                        dot.style.background = 'rgba(255,255,255,0.4)';
                        dot.style.width = '7px';
                    }
                });
            }
        };

        if(prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
                updateCarousel();
            });
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            });
        }
    });

    // Lightbox Global (Enhanced)
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    const lbClose = document.getElementById('lightbox-close');

    if (lightbox) {
        let currentGroup = [];
        let currentGroupIndex = 0;

        document.querySelectorAll('.lightbox-trigger').forEach(img => {
            img.addEventListener('click', () => {
                const groupName = img.getAttribute('data-group');
                currentGroup = Array.from(document.querySelectorAll(`.lightbox-trigger[data-group="${groupName}"]`));
                currentGroupIndex = currentGroup.indexOf(img);
                
                updateLightboxImage();
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        const updateLightboxImage = () => {
            const sourceImg = currentGroup[currentGroupIndex];
            lbImg.src = sourceImg.src;
            lbImg.alt = sourceImg.alt;
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const nextImage = (e) => {
            if(e) e.stopPropagation();
            currentGroupIndex = (currentGroupIndex === currentGroup.length - 1) ? 0 : currentGroupIndex + 1;
            updateLightboxImage();
        };

        const prevImage = (e) => {
            if(e) e.stopPropagation();
            currentGroupIndex = (currentGroupIndex === 0) ? currentGroup.length - 1 : currentGroupIndex - 1;
            updateLightboxImage();
        };

        lbClose.addEventListener('click', closeLightbox);
        lbNext.addEventListener('click', nextImage);
        lbPrev.addEventListener('click', prevImage);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    // --- 6. Form Handling (Enhanced) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.innerText;
            
            btn.innerText = 'Envoi...';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.reset();
                    formStatus.style.color = 'var(--accent-blue)';
                    formStatus.innerHTML = 'Message envoyé avec succès ! Merci.';
                    btn.innerText = 'Envoyé ✓';
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                        formStatus.innerHTML = '';
                    }, 3000);
                } else {
                    throw new Error('Erreur Formspree');
                }
            } catch (error) {
                formStatus.style.color = 'var(--accent-peach)';
                formStatus.innerHTML = 'Une erreur est survenue. Réessayez.';
                btn.innerText = originalBtnText;
                btn.disabled = false;
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 4000);
            }
        });
    }

    // --- 7. Smooth scroll for hash links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- 8. Animated counters for skills (Optional, but nice touch) ---
    const fillBars = document.querySelectorAll('.fill');
    if (fillBars.length > 0) {
        const observerSkills = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    observerSkills.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        fillBars.forEach(bar => observerSkills.observe(bar));
    }
});
