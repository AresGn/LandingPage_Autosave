/**
 * Module pour gérer le slider des témoignages
 */

export function initSlider() {
    const slider = document.querySelector('.testimonials__slider');
    if (!slider) return;

    const track = slider.querySelector('.testimonials__track');
    const slides = slider.querySelectorAll('.testimonial');
    const dotsContainer = slider.querySelector('.testimonials__dots');
    const prevButton = slider.querySelector('.testimonials__control--prev');
    const nextButton = slider.querySelector('.testimonials__control--next');
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval;
    
    // Initialisation
    function init() {
        // Créer les points de navigation
        createDots();
        
        // Positionner les slides
        updateSlidePositions();
        
        // Ajouter les écouteurs d'événements
        addEventListeners();
        
        // Démarrer l'autoplay
        startAutoplay();
        
        // Activer le premier slide
        updateActiveSlide();
    }
    
    // Créer les points de navigation
    function createDots() {
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonials__dot');
            dot.setAttribute('aria-label', `Voir le témoignage ${i + 1}`);
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                if (!isAnimating) {
                    goToSlide(i);
                }
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Mettre à jour la position des slides
    function updateSlidePositions() {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }
    
    // Mettre à jour le slide actif
    function updateActiveSlide() {
        // Mettre à jour les slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        
        // Mettre à jour les points de navigation
        const dots = dotsContainer.querySelectorAll('.testimonials__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Aller à un slide spécifique
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Mettre à jour l'index
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));
        
        // Animer le déplacement
        updateSlidePositions();
        updateActiveSlide();
        
        // Réinitialiser l'autoplay
        resetAutoplay();
        
        // Permettre une nouvelle animation après la transition
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Aller au slide suivant
    function goToNextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    // Aller au slide précédent
    function goToPrevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    // Démarrer l'autoplay
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                const nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }
        }, 3000); // Réduit à 3 secondes pour une animation plus dynamique
    }
    
    // Réinitialiser l'autoplay
    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        startAutoplay();
    }
    
    // Ajouter les écouteurs d'événements
    function addEventListeners() {
        // Boutons de navigation
        prevButton.addEventListener('click', () => {
            if (!isAnimating) {
                goToPrevSlide();
                resetAutoplay(); // Réinitialise l'autoplay après interaction manuelle
            }
        });
        
        nextButton.addEventListener('click', () => {
            if (!isAnimating) {
                goToNextSlide();
                resetAutoplay(); // Réinitialise l'autoplay après interaction manuelle
            }
        });
        
        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            updateSlidePositions();
        });
        
        // Pause de l'autoplay au survol
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startAutoplay();
        });
        
        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe vers la gauche
                if (!isAnimating) {
                    goToNextSlide();
                }
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe vers la droite
                if (!isAnimating) {
                    goToPrevSlide();
                }
            }
        }
        
        // Gestion du clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                if (!isAnimating) {
                    goToPrevSlide();
                }
            } else if (e.key === 'ArrowRight') {
                if (!isAnimating) {
                    goToNextSlide();
                }
            }
        });
    }
    
    // Initialiser le slider
    init();
} 