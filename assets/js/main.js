document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initPageTransition();
    initHeroAnimations();
    initOrbParallax();
    initScrollAnimations();
    initSkillBars();
    initForm();
    initMagneticButtons();
    initFilters();
    initLightbox();
    init3DCardTilt();
    initCursorFollow();
});

// === THEME ===
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme') || 'theme-dark';
    document.body.className = saved;
    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = document.body.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
            document.body.className = next;
            localStorage.setItem('theme', next);
        });
    }
}

// === HEADER SCROLL ===
function initHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// === PAGE TRANSITIONS ===
function initPageTransition() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity .25s';
    document.querySelectorAll('a:not([target]):not([href^="#"]):not([href*="mailto"]):not([href*="tel"]):not([download])').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('javascript')) {
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => window.location.href = href, 240);
            }
        });
    });
}

// === HERO ANIMATIONS ===
function initHeroAnimations() {
    // Slide-up text reveal
    const lineInners = document.querySelectorAll('.hero-title .line-inner');
    if (lineInners.length) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                lineInners.forEach(el => {
                    el.style.transform = 'translateY(0)';
                });
            });
        });
    }

    // Staggered fade-in for hero elements
    const els = [
        document.querySelector('.hero-tag'),
        document.querySelector('.hero-role'),
        document.querySelector('.hero-desc'),
        document.querySelector('.hero-buttons'),
        document.querySelector('.hero-scroll'),
    ];
    els.forEach(el => {
        if (el) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.classList.add('visible');
                });
            });
        }
    });
}

// === ORB PARALLAX (mouse) ===
function initOrbParallax() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    let ticking = false;
    document.addEventListener('mousemove', e => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            orbs.forEach((orb, i) => {
                const depth = (i + 1) * 18;
                orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
            ticking = false;
        });
    }, { passive: true });
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
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// === SKILL BARS ===
function initSkillBars() {
    const skillsEl = document.querySelector('.skills');
    if (!skillsEl) return;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.progress-bar').forEach((bar, i) => {
                    const pct = bar.parentElement.previousElementSibling?.querySelector('span:last-child')?.textContent;
                    if (pct) bar.style.setProperty('--fill', pct);
                    setTimeout(() => bar.classList.add('animate'), i * 140);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(skillsEl);
}

// === FORM ===
function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const status = document.getElementById('form-status');
        const orig = btn.textContent;
        btn.textContent = 'Envoi…';
        btn.disabled = true;
        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (res.ok) {
                form.reset();
                btn.textContent = 'Envoyé ✓';
                status.textContent = 'Message reçu ! Merci.';
                status.style.color = 'var(--c-accent-2)';
                setTimeout(() => { btn.textContent = orig; btn.disabled = false; status.textContent = ''; }, 3500);
            } else throw new Error();
        } catch {
            btn.textContent = orig;
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
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            const dist = Math.sqrt(x * x + y * y);
            if (dist < 90) {
                const pull = (90 - dist) * 0.07;
                btn.style.transform = `translate(${Math.cos(Math.atan2(y,x))*pull}px, ${Math.sin(Math.atan2(y,x))*pull}px)`;
            }
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// === FILTERS ===
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    if (!btns.length) return;

    // Set initial active state visually
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) applyActiveStyle(activeBtn, btns);

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            document.querySelectorAll('.creation-card').forEach(card => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                card.classList.toggle('hidden', !match);
            });
        });
    });
}

function applyActiveStyle(activeBtn, allBtns) {
    // handled purely via CSS .filter-btn.active
}

// === LIGHTBOX ===
function initLightbox() {
    document.querySelectorAll('.creation-card').forEach((card, idx) => {
        card.addEventListener('click', () => openLightbox(idx));
    });
}

function openLightbox(index) {
    const allCards = Array.from(document.querySelectorAll('.creation-card'));
    const visible = allCards.filter(c => !c.classList.contains('hidden'));
    if (!visible.length) return;

    const card = allCards[index];
    const visIdx = visible.indexOf(card);
    if (visIdx === -1) return;

    const imgSrc  = card.querySelector('img')?.src || '';
    const title   = card.querySelector('h3')?.textContent || '';
    const desc    = card.querySelector('p:last-child')?.textContent || '';

    // Overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.92);
        backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;animation:lbFadeIn .25s ease-out;padding:20px;
    `;

    // Inject keyframes once
    if (!document.getElementById('lb-kf')) {
        const s = document.createElement('style');
        s.id = 'lb-kf';
        s.textContent = `
            @keyframes lbFadeIn { from{opacity:0} to{opacity:1} }
            @keyframes lbScaleIn { from{transform:scale(.94);opacity:0} to{transform:scale(1);opacity:1} }
        `;
        document.head.appendChild(s);
    }

    // Box
    const box = document.createElement('div');
    box.style.cssText = `
        position:relative;width:100%;max-width:860px;max-height:88vh;
        background:var(--c-bg-alt,#0d0d18);border:1px solid rgba(255,255,255,.1);
        border-radius:20px;overflow:hidden;display:flex;flex-direction:column;
        animation:lbScaleIn .3s cubic-bezier(.16,1,.3,1);
    `;

    // Image zone
    const imgZone = document.createElement('div');
    imgZone.style.cssText = `flex:1;min-height:0;background:#000;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;`;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;
    img.style.cssText = `max-width:100%;max-height:62vh;object-fit:contain;`;
    imgZone.appendChild(img);

    // Nav arrows
    const mkArrow = (dir) => {
        const b = document.createElement('button');
        b.innerHTML = dir === 'prev' ? '&#8592;' : '&#8594;';
        b.style.cssText = `
            position:absolute;${dir==='prev'?'left':'right'}:16px;top:50%;transform:translateY(-50%);
            width:44px;height:44px;border-radius:50%;
            background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);
            color:#fff;font-size:18px;cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            transition:background .2s;z-index:2;
        `;
        b.addEventListener('mouseover', () => b.style.background = 'rgba(0,200,255,.2)');
        b.addEventListener('mouseout',  () => b.style.background = 'rgba(255,255,255,.08)');
        b.addEventListener('click', e => {
            e.stopPropagation();
            const newVis = dir === 'prev'
                ? (visIdx - 1 + visible.length) % visible.length
                : (visIdx + 1) % visible.length;
            overlay.remove();
            document.removeEventListener('keydown', onKey);
            openLightbox(allCards.indexOf(visible[newVis]));
        });
        return b;
    };
    if (visible.length > 1) {
        imgZone.appendChild(mkArrow('prev'));
        imgZone.appendChild(mkArrow('next'));
    }

    // Info bar
    const info = document.createElement('div');
    info.style.cssText = `padding:20px 28px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid rgba(255,255,255,.07);`;
    info.innerHTML = `
        <div>
            <div style="font:600 1rem var(--ff-head,'Syne');margin-bottom:3px">${title}</div>
            <div style="font-size:.82rem;color:var(--c-text-sec,'#7a7a9a')">${desc}</div>
        </div>
        <div style="font-size:.75rem;color:var(--c-text-sec,'#7a7a9a');white-space:nowrap">${visIdx+1} / ${visible.length}</div>
    `;

    // Close btn
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&#x2715;';
    closeBtn.style.cssText = `
        position:absolute;top:14px;right:14px;
        width:36px;height:36px;border-radius:50%;
        background:rgba(255,255,255,.1);border:none;
        color:#fff;font-size:16px;cursor:pointer;
        display:flex;align-items:center;justify-content:center;
        transition:background .2s;z-index:10;
    `;
    closeBtn.addEventListener('mouseover', () => closeBtn.style.background = 'rgba(255,84,112,.35)');
    closeBtn.addEventListener('mouseout',  () => closeBtn.style.background = 'rgba(255,255,255,.1)');

    const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    const onKey = e => {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowLeft' && visible.length > 1) {
            const ni = (visIdx - 1 + visible.length) % visible.length;
            overlay.remove(); document.removeEventListener('keydown', onKey);
            openLightbox(allCards.indexOf(visible[ni]));
        }
        if (e.key === 'ArrowRight' && visible.length > 1) {
            const ni = (visIdx + 1) % visible.length;
            overlay.remove(); document.removeEventListener('keydown', onKey);
            openLightbox(allCards.indexOf(visible[ni]));
        }
    };
    document.addEventListener('keydown', onKey);

    box.appendChild(closeBtn);
    box.appendChild(imgZone);
    box.appendChild(info);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

// === 3D CARD TILT ===
function init3DCardTilt() {
    document.querySelectorAll('.creation-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;
            const y = (e.clientY - r.top)  / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateZ(6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)';
            setTimeout(() => { card.style.transform = ''; }, 350);
        });
    });
}

// === CURSOR FOLLOW ===
function initCursorFollow() {
    if (window.matchMedia('(hover:none)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'cursor';
    document.body.appendChild(cursor);

    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    }, { passive: true });

    (function loop() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
        requestAnimationFrame(loop);
    })();

    // Grow on interactive elements
    document.querySelectorAll('a, button, .creation-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; dot.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; dot.style.opacity='1'; });
}

// === SMOOTH SCROLL ANCHORS ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
