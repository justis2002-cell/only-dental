document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav ul');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // 스크롤 감지
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const logoImg = document.getElementById('logo-img');

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 히어로 슬라이더
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;

    if (slides.length > 0) {
        setInterval(() => {
            slides[current].classList.remove('active');
            if (dots.length > 0) dots[current].classList.remove('active');
            
            current = (current + 1) % slides.length;
            
            slides[current].classList.add('active');
            if (dots.length > 0) dots[current].classList.add('active');
        }, 4000);
    }
});
