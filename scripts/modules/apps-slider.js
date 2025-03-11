/**
 * Module pour gérer le slider des applications supportées
 */

export function initAppsSlider() {
    const slider = document.querySelector('.apps-slider');
    if (!slider) return;

    const track = slider.querySelector('.apps-slider__track');
    const slides = slider.querySelectorAll('.app-slide');
    const dotsContainer = slider.querySelector('.apps-slider__dots');
    const prevButton = slider.querySelector('.apps-slider__control--prev');
    const nextButton = slider.querySelector('.apps-slider__control--next');
    
    let currentIndex = 0;
    let slidesPerView = 3;
    let slideWidth = 100 / slidesPerView;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Initialisation
    function init() {
        // Déterminer le nombre de slides visibles en fonction de la largeur de l'écran
        updateSlidesPerView();
        
        // Créer les points de navigation
        createDots();
        
        // Positionner les slides
        updateSlidePositions();
        
        // Ajouter les écouteurs d'événements
        addEventListeners();
    }
    
    // Mettre à jour le nombre de slides visibles en fonction de la largeur de l'écran
    function updateSlidesPerView() {
        if (window.innerWidth <= 480) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 768) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        slideWidth = 100 / slidesPerView;
        
        // Mettre à jour la largeur des slides
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
            slide.style.minWidth = `${slideWidth}%`;
        });
    }
    
    // Créer les points de navigation
    function createDots() {
        const totalDots = Math.ceil(slides.length / slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('apps-slider__dot');
            dot.setAttribute('aria-label', `Voir les applications ${i * slidesPerView + 1} à ${Math.min((i + 1) * slidesPerView, slides.length)}`);
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(i * slidesPerView);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Mettre à jour la position des slides
    function updateSlidePositions() {
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        // Mettre à jour les points de navigation
        const dots = dotsContainer.querySelectorAll('.apps-slider__dot');
        const activeDotIndex = Math.floor(currentIndex / slidesPerView);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }
    
    // Aller à un slide spécifique
    function goToSlide(index) {
        const maxIndex = slides.length - slidesPerView;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlidePositions();
    }
    
    // Aller au slide suivant
    function goToNextSlide() {
        goToSlide(currentIndex + slidesPerView);
    }
    
    // Aller au slide précédent
    function goToPrevSlide() {
        goToSlide(currentIndex - slidesPerView);
    }
    
    // Ajouter les écouteurs d'événements
    function addEventListeners() {
        // Boutons de navigation
        prevButton.addEventListener('click', goToPrevSlide);
        nextButton.addEventListener('click', goToNextSlide);
        
        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            updateSlidePositions();
        });
        
        // Gestion du swipe sur mobile
        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Gérer le début du toucher
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    // Gérer la fin du toucher
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    // Gérer le swipe
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe vers la gauche
            goToNextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe vers la droite
            goToPrevSlide();
        }
    }
    
    // Initialiser le slider
    init();
} 