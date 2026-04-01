// Rate limiting & bot protection for contact form
const FORM_SUBMISSION_DELAY = 3000; // 3 secondes minimum entre les envois
let lastSubmissionTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Honeypot field - champ caché pour attraper les bots
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.setAttribute('tabindex', '-1');
    honeypot.setAttribute('autocomplete', 'off');
    form.appendChild(honeypot);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check honeypot
        if (honeypot.value.trim() !== '') {
            console.warn('Bot detected: honeypot field filled');
            return;
        }

        // Rate limiting
        const now = Date.now();
        if (now - lastSubmissionTime < FORM_SUBMISSION_DELAY) {
            const btn = form.querySelector('button');
            const status = document.getElementById('form-status');
            status.textContent = `Attends ${Math.ceil((FORM_SUBMISSION_DELAY - (now - lastSubmissionTime)) / 1000)}s avant de renvoyer`;
            status.style.color = 'var(--c-accent-1)';
            return;
        }

        lastSubmissionTime = now;

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
                honeypot.value = '';
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
});
