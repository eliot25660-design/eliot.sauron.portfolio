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
    initLightbox();
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
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    });
}

// === LIGHTBOX / MODAL ===
function initLightbox() {
    const cards = document.querySelectorAll('.creation-card');
    
    cards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            openLightbox(idx);
        });
    });
}

function openLightbox(index) {
    const allCards = document.querySelectorAll('.creation-card');
    const visibleCards = Array.from(allCards).filter(card => card.style.display !== 'none');
    
    if (visibleCards.length === 0) return;
    
    // Trouver l'index dans les cartes visibles
    const visibleIndex = visibleCards.findIndex(card => allCards[index] === card);
    
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        position: relative;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        background: var(--c-bg-alt);
        border: 1px solid var(--c-border);
        border-radius: var(--rad);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `;

    // Bouton fermer
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 10000;
        transition: all 0.2s;
        outline: none;
    `;
    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = 'rgba(0, 0, 0, 0.8)';
    });
    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    });

    // Container pour l'image et la nav
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        overflow: hidden;
    `;

    const img = document.createElement('img');
    img.src = visibleCards[visibleIndex].querySelector('img').src;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    `;
    imageContainer.appendChild(img);

    // Flèches navigation
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.style.cssText = `
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        background: rgba(164, 200, 230, 0.2);
        border: 2px solid var(--c-accent-2);
        border-radius: 50%;
        color: var(--c-accent-2);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;
        outline: none;
        z-index: 10001;
    `;
    prevBtn.addEventListener('click', () => {
        const newIndex = (visibleIndex - 1 + visibleCards.length) % visibleCards.length;
        modal.remove();
        openLightbox(allCards.indexOf(visibleCards[newIndex]));
    });
    prevBtn.addEventListener('mouseover', () => {
        prevBtn.style.background = 'rgba(164, 200, 230, 0.4)';
        prevBtn.style.boxShadow = '0 0 20px rgba(164, 200, 230, 0.5)';
    });
    prevBtn.addEventListener('mouseout', () => {
        prevBtn.style.background = 'rgba(164, 200, 230, 0.2)';
        prevBtn.style.boxShadow = 'none';
    });
    imageContainer.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.style.cssText = `
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        background: rgba(164, 200, 230, 0.2);
        border: 2px solid var(--c-accent-2);
        border-radius: 50%;
        color: var(--c-accent-2);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;
        outline: none;
        z-index: 10001;
    `;
    nextBtn.addEventListener('click', () => {
        const newIndex = (visibleIndex + 1) % visibleCards.length;
        modal.remove();
        openLightbox(allCards.indexOf(visibleCards[newIndex]));
    });
    nextBtn.addEventListener('mouseover', () => {
        nextBtn.style.background = 'rgba(164, 200, 230, 0.4)';
        nextBtn.style.boxShadow = '0 0 20px rgba(164, 200, 230, 0.5)';
    });
    nextBtn.addEventListener('mouseout', () => {
        nextBtn.style.background = 'rgba(164, 200, 230, 0.2)';
        nextBtn.style.boxShadow = 'none';
    });
    imageContainer.appendChild(nextBtn);

    content.appendChild(imageContainer);

    // Info carte
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = `
        padding: 30px;
        background: var(--c-bg-alt);
    `;
    infoDiv.innerHTML = `
        <h2 style="font: 700 1.5rem var(--ff-head); margin-bottom: 10px;">${visibleCards[visibleIndex].querySelector('h3').textContent}</h2>
        <p style="color: var(--c-text-sec); font-size: 0.95rem;">${visibleCards[visibleIndex].querySelector('p').textContent}</p>
        <p style="color: var(--c-text-sec); font-size: 0.85rem; margin-top: 15px;">${visibleIndex + 1} / ${visibleCards.length}</p>
    `;
    content.appendChild(infoDiv);

    modal.appendChild(content);
    modal.appendChild(closeBtn);

    // Fermer au clic sur le fond
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Clavier
    const handleKeydown = (e) => {
        if (e.key === 'ArrowLeft') {
            const newIndex = (visibleIndex - 1 + visibleCards.length) % visibleCards.length;
            modal.remove();
            document.removeEventListener('keydown', handleKeydown);
            openLightbox(allCards.indexOf(visibleCards[newIndex]));
        } else if (e.key === 'ArrowRight') {
            const newIndex = (visibleIndex + 1) % visibleCards.length;
            modal.remove();
            document.removeEventListener('keydown', handleKeydown);
            openLightbox(allCards.indexOf(visibleCards[newIndex]));
        } else if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleKeydown);
        }
    };

    document.addEventListener('keydown', handleKeydown);
    document.body.appendChild(modal);
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
