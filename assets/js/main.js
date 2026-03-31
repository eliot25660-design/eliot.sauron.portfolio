// ===== ELIOT SAURON PORTFOLIO - MODERN JS =====

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initPageTransition();
    initScrollAnimations();
    initSkillBars();
    initCarousels();
    initForm();
    initVideoToggle();
    initMagneticButtons();
});

// === THEME MANAGEMENT ===
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme') || 'theme-dark';
    document.body.className = saved;
    if (toggle) {
        toggle.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
            document.body.className = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }
}

// === HEADER SCROLL EFFECT ===
function initHeader() {
    const header = document.querySelector('header');
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastY = y;
    }, { passive: true });
}

// === PAGE TRANSITIONS ===
function initPageTransition() {
    document.querySelectorAll('a:not([target]):not([href^="#"]):not([href*="mailto"]):not([href*="tel"])').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('javascript')) {
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => window.location.href = href, 250);
            }
        });
    });
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// === SKILL BARS ANIMATION ===
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.progress-bar');
                bars.forEach(bar => {
                    const fill = bar.parentElement.parentElement.querySelector('.skill-head span:last-child').textContent;
                    const percent = parseInt(fill);
                    bar.style.setProperty('--fill', percent + '%');
                    bar.classList.add('animate');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const skillsContainer = document.querySelector('.skills');
    if (skillsContainer) observer.observe(skillsContainer);
}

// === VIDEO TOGGLE ===
function initVideoToggle() {
    const video = document.getElementById('hero-video');
    const btn = document.querySelector('.video-btn');
    if (!video || !btn) return;

    const toggle = (e) => {
        e?.preventDefault();
        video.muted = !video.muted;
        btn.textContent = video.muted ? '🔇 Vidéo muette' : '🔊 Son actif';
    };

    btn.addEventListener('click', toggle);
    video.addEventListener('click', toggle);
    video.play().catch(() => {});
}

// === CAROUSELS ===
function initCarousels() {
    document.querySelectorAll('.creation-grid').forEach(grid => {
        grid.addEventListener('click', () => {
            window.location.href = 'creations.html';
        });
    });

    // Carousel logic for creations page
    document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
        const slides = wrapper.querySelector('.carousel-slides');
        const imgs = wrapper.querySelectorAll('img');
        const prevBtn = wrapper.querySelector('.carousel-nav.prev');
        const nextBtn = wrapper.querySelector('.carousel-nav.next');
        const indicators = wrapper.querySelector('.carousel-indicators');

        if (imgs.length <= 1) return;

        let current = 0;

        // Create indicators
        imgs.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.style.cssText = 'width:7px;height:7px;bg:rgba(255,255,255,.4);border-radius:50%;cursor:pointer;transition:all .2s';
            if (i === 0) {
                dot.style.background = 'rgba(255,255,255,1)';
                dot.style.width = '10px';
            }
            dot.addEventListener('click', () => goToSlide(i));
            indicators?.appendChild(dot);
        });

        const goToSlide = (n) => {
            current = n;
            slides.style.transform = `translateX(-${current * 100}%)`;
            updateIndicators();
        };

        const updateIndicators = () => {
            indicators?.querySelectorAll('div').forEach((dot, i) => {
                if (i === current) {
                    dot.style.background = 'rgba(255,255,255,1)';
                    dot.style.width = '10px';
                } else {
                    dot.style.background = 'rgba(255,255,255,.4)';
                    dot.style.width = '7px';
                }
            });
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide((current - 1 + imgs.length) % imgs.length);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide((current + 1) % imgs.length);
            });
        }
    });
}

// === FORM HANDLING ===
function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const status = document.getElementById('form-status');
        const originalText = btn.textContent;

        btn.textContent = 'Envoi...';
        btn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                btn.textContent = 'Envoyé ✓';
                status.textContent = 'Message reçu ! Merci.';
                status.style.color = 'var(--c-accent-2)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    status.textContent = '';
                }, 3000);
            } else throw new Error();
        } catch {
            btn.textContent = originalText;
            btn.disabled = false;
            status.textContent = 'Erreur. Réessayez.';
            status.style.color = 'var(--c-accent-1)';
            setTimeout(() => status.textContent = '', 4000);
        }
    });
}

// === MAGNETIC BUTTONS ===
function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const dist = Math.sqrt(x * x + y * y);

            if (dist < 80) {
                const angle = Math.atan2(y, x);
                const pull = (80 - dist) * 0.08;
                btn.style.transform = `translate(${Math.cos(angle) * pull}px, ${Math.sin(angle) * pull}px)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// === SMOOTH SCROLL FOR HASH LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
