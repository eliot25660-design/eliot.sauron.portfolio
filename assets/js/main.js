document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        document.body.style.setProperty('--scroll', scrollPercent + '%');
        document.body.style.width = scrollPercent + '%';
    });

    // --- 2. Header Scroll Effect ---
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- 3. Page Transition ---
    document.body.classList.add('page-transition');
    
    document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href*="formspree"])').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('http') && href !== '#') {
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // --- 4. Theme Toggle ---
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

    // --- 5. Smooth Scroll Reveal avec Stagger ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // --- 6. Animated Progress Bars ---
    const fillBars = document.querySelectorAll('.fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const width = entry.target.parentElement.parentElement.parentElement.textContent.match(/\d+/)?.[0] || '80';
                entry.target.style.setProperty('--fill-width', width + '%');
                entry.target.classList.add('animated');
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    fillBars.forEach(bar => progressObserver.observe(bar));

    // --- 7. Video Mute/Unmute Logic ---
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

    // --- 8. Projects Filtering avec Stagger Animation ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                let visibleIndex = 0;

                projects.forEach((project) => {
                    const category = project.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        }, visibleIndex * 80);
                        visibleIndex++;
                    } else {
                        project.style.opacity = '0';
                        project.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    // --- 9. Carousel & Lightbox ---
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

    // Lightbox
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

    // --- 10. Form Handling ---
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

    // --- 11. Smooth scroll for hash links ---
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

    // --- 12. Magnetic Button Effect (Optional hover follow) ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            if (distance < 100) {
                const angle = Math.atan2(y, x);
                const pull = (100 - distance) * 0.05;
                btn.style.transform = `translate(${Math.cos(angle) * pull}px, ${Math.sin(angle) * pull}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // --- 13. Creations Preview Click Navigation ---
    document.querySelectorAll('.preview-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.href = 'creations.html';
        });
    });
});
