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

        // 외부 클릭 시 메뉴 닫기
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !toggleButton.contains(e.target)) {
                nav.classList.remove('active');
                toggleButton.textContent = '☰';
            }
        });

        // 메뉴 링크 클릭 시 닫기
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                toggleButton.textContent = '☰';
            });
        });
    }


    // ──────────────────────────────────────────
    // 2. 스크롤 감지 → 헤더 스타일 변경
    //    + 네비게이션 현재 섹션 active 표시
    // ──────────────────────────────────────────
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // 헤더 스크롤 효과
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 현재 섹션 감지 → nav active
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });


    // ──────────────────────────────────────────
    // 3. 히어로 슬라이더 + 도트 동적 생성 + 자동 재생
    // ──────────────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    let current = 0;
    let slideTimer = null;

    // 도트 동적 생성 (HTML에 없어도 자동으로 만들어줌)
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
            // 콘텐츠 박스 페이드 아웃
            const currentContent = slides[current].querySelector('.hero-content-box');
            if (currentContent) {
                currentContent.style.opacity = '0';
                currentContent.style.transform = 'translateY(10px)';
            }

            slides[current].classList.remove('active');
            dots[current]?.classList.remove('active');

            current = index;

            slides[current].classList.add('active');
            dots[current]?.classList.add('active');

            // 콘텐츠 박스 페이드 인
            const nextContent = slides[current].querySelector('.hero-content-box');
            if (nextContent) {
                nextContent.style.transition = 'none';
                nextContent.style.opacity = '0';
                nextContent.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        nextContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        nextContent.style.opacity = '1';
                        nextContent.style.transform = 'translateY(0)';
                    });
                });
            }
        }

        function nextSlide() {
            goToSlide((current + 1) % slides.length);
        }

        function startAutoPlay() {
            slideTimer = setInterval(nextSlide, 4500);
        }

        function stopAutoPlay() {
            clearInterval(slideTimer);
        }

        // 도트 호버 시 자동재생 일시정지
        const hero = document.querySelector('.hero');
        hero.addEventListener('mouseenter', stopAutoPlay);
        hero.addEventListener('mouseleave', startAutoPlay);

        startAutoPlay();
    }


    // ──────────────────────────────────────────
    // 4. 스크롤 진입 애니메이션 (Intersection Observer)
    //    섹션, 카드, 이미지 등 등장 효과
    // ──────────────────────────────────────────

    // 애니메이션 CSS 동적 삽입
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

    // 애니메이션 대상 요소 지정
    const animTargets = [
        { selector: '.section-title', cls: 'anim-hidden' },
        { selector: '.about-text', cls: 'anim-hidden-left' },
        { selector: '.about-image', cls: 'anim-hidden-right' },
        { selector: '.system-row', cls: 'anim-hidden' },
        { selector: '.service-item', cls: 'anim-hidden' },
        { selector: '#hours > div > div', cls: 'anim-hidden' },
        { selector: '#location .section-title', cls: 'anim-hidden' },
        { selector: '#location iframe', cls: 'anim-hidden' },
        { selector: '#location [style*="flex: 1"]', cls: 'anim-hidden' },
    ];

    animTargets.forEach(({ selector, cls }) => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add(cls);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // 여러 카드가 동시에 들어올 때 순차 딜레이
                const siblings = [...entry.target.parentElement.children];
                const index = siblings.indexOf(entry.target);
                const delay = index * 100;

                setTimeout(() => {
                    entry.target.classList.add('anim-visible');
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.anim-hidden, .anim-hidden-left, .anim-hidden-right')
        .forEach(el => observer.observe(el));


    // ──────────────────────────────────────────
    // 5. 서비스 카드 마우스 틸트 효과
    // ──────────────────────────────────────────
    document.querySelectorAll('.service-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
        });
    });


    // ──────────────────────────────────────────
    // 6. System 카드 호버 시 배지 색상 변화
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
    // 7. 진료시간 섹션 전화번호 클릭 피드백
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
    // 8. 스무스 스크롤 (같은 페이지 앵커 링크)
    // ──────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
        });
    });

});
