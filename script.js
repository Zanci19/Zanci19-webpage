const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach((anchor) => {
        anchor.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function setupScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = `${progress}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

function setupRevealOnScroll() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (prefersReducedMotion) {
        targets.forEach((el) => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -30px 0px' });

    targets.forEach((el) => observer.observe(el));
}

function setupCounters() {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    const animate = (el) => {
        const target = Number(el.dataset.target || 0);
        let current = 0;
        const step = Math.max(1, Math.round(target / 40));

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = `${current}${target === 100 ? '%' : '+'}`;
        }, 28);
    };

    if (prefersReducedMotion) {
        counters.forEach((counter) => {
            const target = Number(counter.dataset.target || 0);
            counter.textContent = `${target}${target === 100 ? '%' : '+'}`;
        });
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animate(entry.target);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.7 });

    counters.forEach((counter) => observer.observe(counter));
}

function setupTiltCards() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.tilt');
    cards.forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = (0.5 - (y / rect.height)) * 8;
            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

function setupActiveNav() {
    const links = Array.from(document.querySelectorAll('.nav-links a'));
    if (!links.length) return;

    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = (id) => {
        links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, { threshold: 0.5 });

    sections.forEach((section) => observer.observe(section));
}

function init() {
    setupMobileMenu();
    setupScrollProgress();
    setupRevealOnScroll();
    setupCounters();
    setupTiltCards();
    setupActiveNav();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
