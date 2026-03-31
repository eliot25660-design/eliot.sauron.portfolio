document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initPageTransition();
    initScrollAnimations();
    initSkillBars();
    initForm();
    initVideoToggle();
    initMagneticButtons();
    initFilters();
    initCarouselArrows();
    initCursorFollow();
});

// === THEME ===
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

// === HEADER SCROLL ===
function initHeader() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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
                }, idx * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// === SKILL BARS ===
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.progress-bar');
                bars.forEach((bar, idx) => {
                    const skillHead = bar.parentElement.previousElementSibling;
                    const percent = parseInt(skillHead.querySelector('span:last-child').textContent);
                    bar.style.setProperty('--fill', percent + '%');
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, idx * 150);
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

// === FORM ===
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

// === FILTERS ===
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.creation-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--c-text-sec)';
                b.style.borderColor = 'var(--c-border)';
            });

            btn.style.background = 'linear-gradient(135deg, var(--c-accent-1), var(--c-accent-2))';
            btn.style.color = 'var(--c-bg)';
            btn.style.borderColor = 'transparent';

            const filter = btn.getAttribute('data-filter');
            cards.forEach((card) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// === CAROUSEL ARROWS ===
function initCarouselArrows() {
    const grid = document.getElementById('creation-grid');
    if (!grid) return;

    const container = grid.parentElement;
    
    // Créer les flèches
    const leftArrow = document.createElement('div');
    leftArrow.className = 'carousel-arrow left';
    leftArrow.textContent = '←';
    leftArrow.style.cursor = 'pointer';

    const rightArrow = document.createElement('div');
    rightArrow.className = 'carousel-arrow right';
    rightArrow.textContent = '→';
    rightArrow.style.cursor = 'pointer';

    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-container';
    
    // Déplacer la grid dans le wrapper
    grid.parentNode.insertBefore(wrapper, grid);
    wrapper.appendChild(grid);
    wrapper.appendChild(leftArrow);
    wrapper.appendChild(rightArrow);

    let scrollPosition = 0;
    const scrollStep = 350; // Px à scroller

    leftArrow.addEventListener('click', () => {
        scrollPosition = Math.max(0, scrollPosition - scrollStep);
        grid.scrollLeft = scrollPosition;
    });

    rightArrow.addEventListener('click', () => {
        scrollPosition += scrollStep;
        grid.scrollLeft = scrollPosition;
    });
}

// === CURSOR FOLLOW ===
function initCursorFollow() {
    const createCursor = document.createElement('div');
    createCursor.id = 'cursor-follow';
    createCursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--c-accent-2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        opacity: 0.6;
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
        transition: opacity 0.2s;
    `;
    document.body.appendChild(createCursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        createCursor.style.left = cursorX + 'px';
        createCursor.style.top = cursorY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseleave', () => {
        createCursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        createCursor.style.opacity = '0.6';
    });
}

// === SMOOTH SCROLL HASH LINKS ===
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
