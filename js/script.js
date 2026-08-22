/**
 * Mateus Henrique — xkintaro-Style Portfolio Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 0. SMOOTH SCROLL (Lenis)
    // =========================================================================
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // =========================================================================
    // 1. LOADER — Fade out after progress ring animation
    // =========================================================================
    const loader = document.getElementById('loader');
    if (loader) {
        // Wait for the SVG ring animation (~2s) then hide
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2200);
    }

    // =========================================================================
    // 2. CUSTOM CURSOR (Desktop only)
    // =========================================================================
    const cursorRing = document.getElementById('cursor-ring');
    const cursorDot = document.getElementById('cursor-dot');

    if (window.innerWidth > 1024 && cursorRing && cursorDot) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .project-card, .stack-item, .contact-link-card, .nav-icon-btn, .btn-pill, .btn-ghost'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // =========================================================================
    // 3. SCROLL PROGRESS BAR
    // =========================================================================
    const scrollProgress = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        if (scrollProgress) {
            scrollProgress.style.transform = `scaleX(${progress})`;
        }
    }

    // =========================================================================
    // 4. HEADER — Scroll state (add background blur)
    // =========================================================================
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // =========================================================================
    // 5. ACTIVE NAVIGATION HIGHLIGHT
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        let currentId = '';
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentId}`) {
                item.classList.add('active');
            }
        });
    }

    // =========================================================================
    // 6. SCROLL EVENT — Throttled
    // =========================================================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateHeader();
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial calls
    updateScrollProgress();
    updateHeader();
    updateActiveNav();

    // =========================================================================
    // 7. SCROLL REVEAL — Intersection Observer with blur effect
    // =========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve so it stays visible
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================================================
    // 8. MOBILE MENU TOGGLE
    // =========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================================================
    // 9. SMOOTH SCROLL for anchor links
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================================
    // 10. CANVAS PARTICLES — Subtle dot grid background
    // =========================================================================
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.4;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');

    function drawDots() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const spacing = 60;
        const dotSize = 0.5;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';

        for (let x = spacing; x < canvas.width; x += spacing) {
            for (let y = spacing; y < canvas.height; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    drawDots();
    window.addEventListener('resize', drawDots);

    // =========================================================================
    // 11. HORIZONTAL SCROLL PROJECTS (GSAP)
    // =========================================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const projectsTrack = document.querySelector('.projects-scroll-track');
        if (projectsTrack) {
            gsap.to(projectsTrack, {
                x: () => -(projectsTrack.scrollWidth - window.innerWidth + 80),
                ease: "none",
                scrollTrigger: {
                    trigger: ".projects-section",
                    start: "top top",
                    end: () => "+=" + (projectsTrack.scrollWidth - window.innerWidth + 80),
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        }
    }

});
