document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────────────────
    // 1. 모바일 메뉴 토글 + 외부 클릭 시 닫기
    // ──────────────────────────────────────────
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav ul');

    if (toggleButton && nav) {
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            toggleButton.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggleButton.contains(e.target)) {
                nav.classList.remove('active');
                toggleButton.textContent = '☰';
            }
        });
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                toggleButton.textContent = '☰';
            });
        });
    }


    // ──────────────────────────────────────────
    // 2. 스크롤 감지 → 헤더 색상 변경
    // ──────────────────────────────────────────
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });


    // ──────────────────────────────────────────
    // 3. 서브 히어로 텍스트 등장 애니메이션
    //    (about, service, guide, knowledge, notice 공통)
    // ──────────────────────────────────────────
    const subHero = document.querySelector('.sub-hero > div');
    if (subHero) {
        subHero.style.opacity = '0';
        subHero.style.transform = 'translateY(30px)';
        subHero.style.transition = 'none';
        setTimeout(() => {
            subHero.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
            subHero.style.opacity = '1';
            subHero.style.transform = 'translateY(0)';
        }, 200);
    }


    // ──────────────────────────────────────────
    // 4. 메인 히어로 슬라이더 (index.html 전용)
    // ──────────────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    let current = 0;
    let slideTimer = null;

    if (slides.length > 0) {
        const heroSection = document.querySelector('.hero');
        let dotsWrapper = document.querySelector('.hero-dots');

        if (!dotsWrapper) {
            dotsWrapper = document.createElement('div');
            dotsWrapper.className = 'hero-dots';
            heroSection.appendChild(dotsWrapper);
            slides.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(i));
                dotsWrapper.appendChild(dot);
            });
        }

        const dots = document.querySelectorAll('.dot');

        function goToSlide(index) {
            const currentSlide = slides[current];
            const nextSlide = slides[index];

            // 현재 슬라이드 페이드 아웃
            currentSlide.style.transition = 'opacity 0.8s ease';
            currentSlide.style.opacity = '0';
            dots[current]?.classList.remove('active');

            setTimeout(() => {
                currentSlide.classList.remove('active');
                currentSlide.style.opacity = '';
                currentSlide.style.transition = '';

                current = index;

                // 다음 슬라이드 페이드 인
                nextSlide.style.opacity = '0';
                nextSlide.classList.add('active');
                dots[current]?.classList.add('active');

                // 이미지랑 텍스트 동시에 등장!
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        nextSlide.style.transition = 'opacity 0.8s ease';
                        nextSlide.style.opacity = '1';

                        // 텍스트도 같은 타이밍에
                        const content = nextSlide.querySelector('.hero-content-box');
                        if (content) {
                            content.style.transition = 'none';
                            content.style.opacity = '0';
                            content.style.transform = 'translateY(20px)';
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => {
                                    content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                                    content.style.opacity = '1';
                                    content.style.transform = 'translateY(0)';
                                });
                            });
                        }
                    });
                });
            }, 800);
        }

        function startAutoPlay() { slideTimer = setInterval(() => goToSlide((current + 1) % slides.length), 4500); }
        function stopAutoPlay() { clearInterval(slideTimer); }

        const hero = document.querySelector('.hero');
        hero.addEventListener('mouseenter', stopAutoPlay);
        hero.addEventListener('mouseleave', startAutoPlay);

        // 첫 슬라이드 텍스트 등장
        const firstContent = document.querySelector('.hero-slide.active .hero-content-box');
        if (firstContent) {
            firstContent.style.opacity = '0';
            firstContent.style.transform = 'translateY(30px)';
            firstContent.style.transition = 'none';
            setTimeout(() => {
                firstContent.style.transition = 'opacity 1s ease, transform 1s ease';
                firstContent.style.opacity = '1';
                firstContent.style.transform = 'translateY(0)';
            }, 300);

            // 내부 요소 순차 등장
            const heroElements = firstContent.querySelectorAll('*');
            heroElements.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(15px)';
                el.style.transition = 'none';
                setTimeout(() => {
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 400 + (i * 100));
            });
        }

        startAutoPlay();
    }


    // ──────────────────────────────────────────
    // 5. 스크롤 애니메이션 (모든 페이지 공통)
    // ──────────────────────────────────────────
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .anim-hidden {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .anim-hidden.anim-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .anim-hidden-left {
            opacity: 0;
            transform: translateX(-40px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .anim-hidden-left.anim-visible {
            opacity: 1;
            transform: translateX(0);
        }
        .anim-hidden-right {
            opacity: 0;
            transform: translateX(40px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .anim-hidden-right.anim-visible {
            opacity: 1;
            transform: translateX(0);
        }
        .hero-content-box {
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
    `;
    document.head.appendChild(animStyle);

    // 페이지별 애니메이션 대상
    const animTargets = [
        // 공통
        { selector: '.section-title', cls: 'anim-hidden' },
        // index.html
        { selector: '.about-text', cls: 'anim-hidden-left' },
        { selector: '.about-image', cls: 'anim-hidden-right' },
        { selector: '.system-row', cls: 'anim-hidden' },
        { selector: '.service-item', cls: 'anim-hidden' },
        { selector: '#hours > div > div', cls: 'anim-hidden' },
        // about.html
        { selector: '.doctor-card', cls: 'anim-hidden' },
        { selector: '.content-section .section-title', cls: 'anim-hidden' },
        // service.html
        { selector: '.service-detail-item .service-detail-img', cls: 'anim-hidden-left' },
        { selector: '.service-detail-item .service-detail-text', cls: 'anim-hidden-right' },
        // guide.html
        { selector: '.guide-item .guide-image', cls: 'anim-hidden-left' },
        { selector: '.guide-item .guide-text', cls: 'anim-hidden-right' },
        // knowledge.html
        { selector: '.faq-item', cls: 'anim-hidden' },
        // notice.html
        { selector: '.board-table tr', cls: 'anim-hidden' },
    ];

    animTargets.forEach(({ selector, cls }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add(cls);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = [...entry.target.parentElement.children];
                const index = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('anim-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.anim-hidden, .anim-hidden-left, .anim-hidden-right')
        .forEach(el => observer.observe(el));


    // ──────────────────────────────────────────
    // 6. 서비스 카드 틸트 (index.html)
    // ──────────────────────────────────────────
    document.querySelectorAll('.service-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / rect.height) * -5;
            const rotateY = ((x - rect.width / 2) / rect.width) * 5;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s ease';
            card.style.transform = '';
        });
    });


    // ──────────────────────────────────────────
    // 7. System 카드 배지 호버 (index.html)
    // ──────────────────────────────────────────
    document.querySelectorAll('.system-row').forEach(row => {
        row.addEventListener('mouseenter', () => {
            const badge = row.querySelector('.icon-badge');
            if (badge) {
                badge.style.backgroundColor = 'var(--accent-green)';
                badge.style.color = 'white';
                badge.style.transition = 'all 0.3s ease';
            }
        });
        row.addEventListener('mouseleave', () => {
            const badge = row.querySelector('.icon-badge');
            if (badge) {
                badge.style.backgroundColor = '#e3f2fd';
                badge.style.color = 'var(--primary-blue)';
            }
        });
    });


    // ──────────────────────────────────────────
    // 8. 의사 카드 호버 (about.html)
    // ──────────────────────────────────────────
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--accent-green)';
            card.style.transition = 'all 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            const isChief = card.classList.contains('chief');
            card.style.borderColor = isChief ? 'var(--primary-blue)' : '#eee';
        });
    });


    // ──────────────────────────────────────────
    // 9. FAQ 아코디언 (knowledge.html)
    // ──────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            const isActive = parent.classList.contains('active');
            // 다른 항목 닫기
            document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
            if (!isActive) parent.classList.add('active');
        });
    });


    // ──────────────────────────────────────────
    // 10. 전화번호 박스 클릭 (index.html)
    // ──────────────────────────────────────────
    const phoneBox = document.querySelector('#hours [style*="accent-green"]');
    if (phoneBox) {
        phoneBox.style.cursor = 'pointer';
        phoneBox.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        phoneBox.addEventListener('mouseenter', () => {
            phoneBox.style.transform = 'scale(1.02)';
            phoneBox.style.boxShadow = '0 8px 20px rgba(32,201,151,0.4)';
        });
        phoneBox.addEventListener('mouseleave', () => {
            phoneBox.style.transform = '';
            phoneBox.style.boxShadow = '';
        });
        phoneBox.addEventListener('click', () => {
            window.location.href = 'tel:0212345678';
        });
    }


    // ──────────────────────────────────────────
    // 11. 스무스 스크롤
    // ──────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = header?.offsetHeight || 80;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

});
