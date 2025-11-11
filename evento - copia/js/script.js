// Contador regresivo exacto
function updateCountdown() {
    // Fecha del evento: 10 de Enero 2026 a las 17:00 (Argentina GMT-3)
    const eventDate = new Date('2026-01-10T17:00:00-03:00').getTime();
    // Fecha actual exacta
    const now = new Date().getTime();
    // Diferencia en milisegundos
    const distance = eventDate - now;

    if (distance < 0) {
        // Si ya pasó el evento
        document.querySelector('.countdown-section').innerHTML = '<p class="countdown-title">¡Es hoy! 🎉</p>';
        return;
    }

    // Cálculos exactos
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Formatear con dos dígitos
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Actualizar cada segundo
setInterval(updateCountdown, 1000);

// Primera actualización inmediata
updateCountdown();

// Control de música MP3
const audio = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const musicStartOverlay = document.getElementById('musicStartOverlay');
let isPlaying = false;
let audioTimer = null;

// Configurar volumen suave
audio.volume = 0.25;

// Función para detener el audio a los 80 segundos
function setupAudioTimer() {
    if (audioTimer) {
        clearTimeout(audioTimer);
    }
    audioTimer = setTimeout(() => {
        if (isPlaying) {
            audio.pause();
            audio.currentTime = 0; // Reiniciar al inicio
            isPlaying = false;
            musicToggle.classList.remove('playing');
            musicIcon.className = 'bi bi-volume-mute-fill';
            console.log('🔇 Música detenida automáticamente a los 80 segundos');
        }
    }, 80000); // 80 segundos
}

// Función para iniciar con música
function startWithMusic() {
    audio.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.className = 'bi bi-volume-up-fill';
        // Configurar timer para detener a los 80 segundos
        setupAudioTimer();
        // Ocultar overlay
        musicStartOverlay.classList.add('hidden');
        setTimeout(() => {
            musicStartOverlay.style.display = 'none';
        }, 500);
        console.log('✅ Eterno Amor reproduciendo (80 segundos)');
    }).catch((error) => {
        console.log('Error al reproducir:', error);
        alert('No se pudo reproducir la música. Intenta de nuevo o usa el botón 🔊 en la esquina.');
    });
}

// Intentar autoplay silencioso al cargar
window.addEventListener('load', function() {
    audio.play().then(() => {
        // Si funciona el autoplay, ocultar overlay inmediatamente
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.className = 'bi bi-volume-up-fill';
        musicStartOverlay.style.display = 'none';
        // Configurar timer para detener a los 80 segundos
        setupAudioTimer();
        console.log('✅ Autoplay exitoso (80 segundos)');
    }).catch(() => {
        // Si falla, mostrar overlay
        console.log('⏸️ Autoplay bloqueado - mostrando overlay');
    });
});

// Toggle música
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        musicToggle.classList.remove('playing');
        musicIcon.className = 'bi bi-volume-mute-fill';
        // Cancelar timer si se pausa manualmente
        if (audioTimer) {
            clearTimeout(audioTimer);
            audioTimer = null;
        }
        console.log('🔇 Música pausada');
    } else {
        audio.play().then(() => {
            isPlaying = true;
            musicToggle.classList.add('playing');
            musicIcon.className = 'bi bi-volume-up-fill';
            // Configurar timer para detener a los 80 segundos
            setupAudioTimer();
            console.log('🔊 Música reanudada (80 segundos)');
        }).catch(err => {
            console.log('Error al reproducir:', err);
        });
    }
}

// Abrir sobre y mostrar pantalla
function openEnvelope(envelopeWrapper) {
    // Agregar clase de apertura
    envelopeWrapper.classList.add('opening');
    // Después de la animación de apertura, mostrar screen2
    setTimeout(() => {
        showScreen('screen2');
    }, 1200);
}

// Mostrar pantallas al hacer click
function showScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen && !screen.classList.contains('show')) {
        screen.classList.add('show');
        // Hacer scroll suave a la pantalla después de un momento
        setTimeout(() => {
            screen.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        // Si es screen2, lanzar confeti
        if (screenId === 'screen2') {
            setTimeout(() => {
                createConfetti();
            }, 600);
        }
    }
}

function createConfetti() {
    const colors = ['#C9A961', '#7B9E89', '#E8DCC4', '#A8C7D8'];
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }, i * 40);
    }
}

// Copiar al portapapeles
function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`¡${type} copiado!`);
    }).catch(err => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`¡${type} copiado!`);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <i class="bi bi-check-circle-fill" style="font-size: 1.5rem;"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Efectos de scroll con colores de margarita
let lastScrollY = 0;
let scrollDirection = 'down';

function createScrollParticle(x, y) {
    const particlesContainer = document.getElementById('scrollParticles');
    const particle = document.createElement('div');
    particle.className = 'scroll-particle';
    // Colores aleatorios de la paleta de margaritas
    const colors = ['particle-gold', 'particle-green', 'particle-cream'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    particle.classList.add(randomColor);
    // Tamaño aleatorio
    const size = Math.random() * 8 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    // Animación con delay aleatorio
    particle.style.animationDelay = Math.random() * 0.5 + 's';
    particlesContainer.appendChild(particle);
    // Remover partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 3000);
}

function createScrollTrail(x, y) {
    const trailContainer = document.getElementById('scrollTrail');
    const trail = document.createElement('div');
    trail.className = 'scroll-trail-line';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.transform = 'rotate(' + (Math.random() * 180 - 90) + 'deg)';
    trailContainer.appendChild(trail);
    // Remover trazo después de la animación
    setTimeout(() => {
        if (trail.parentNode) {
            trail.remove();
        }
    }, 2000);
}

function updateScrollEffects(event) {
    const scrollY = window.scrollY;
    // Determinar dirección del scroll
    if (scrollY > lastScrollY) {
        scrollDirection = 'down';
    } else if (scrollY < lastScrollY) {
        scrollDirection = 'up';
    }
    // Solo crear efectos al hacer scroll hacia abajo
    if (scrollDirection === 'down' && scrollY > lastScrollY + 50) {
        // Crear partículas ocasionalmente (reducido)
        if (Math.random() < 0.15) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.3;
            createScrollParticle(x, y);
        }
        // Crear trazos dorados ocasionalmente (reducido)
        if (Math.random() < 0.1) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.3;
            createScrollTrail(x, y);
        }
    }
    lastScrollY = scrollY;
}

// Activar efectos de scroll
window.addEventListener('scroll', updateScrollEffects, { passive: true });

// Botón volver arriba
const backToTopButton = document.getElementById('backToTop');

// Mostrar/ocultar botón según scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// Función para volver arriba suavemente
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Galería de fotos - Lightbox
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = imageSrc;
    lightbox.classList.add('active');
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

// Cerrar lightbox con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Cerrar lightbox clickeando fuera de la imagen
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Carrusel de ubicaciones
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    // Remover clase active de todos los slides e indicadores
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    // Agregar clase active al slide e indicador actual
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-play del carrusel
function startCarousel() {
    setInterval(() => {
        changeSlide(1);
    }, 4000); // Cambia cada 4 segundos
}

// Pausar auto-play al hacer hover
const carousel = document.querySelector('.location-carousel');
let carouselInterval;

function pauseCarousel() {
    clearInterval(carouselInterval);
}

function resumeCarousel() {
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 4000);
}

// Iniciar carrusel cuando la página cargue
window.addEventListener('load', () => {
    startCarousel();
    // Pausar en hover
    carousel.addEventListener('mouseenter', pauseCarousel);
    carousel.addEventListener('mouseleave', resumeCarousel);
});

// Efecto de aparición al hacer scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-fade-in, .scroll-fade-in-left, .scroll-fade-in-right, .scroll-scale-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Efecto typewriter para títulos
function handleTypewriterTitles() {
    const typewriterElements = document.querySelectorAll('.typewriter-title:not(.typed)');
    typewriterElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            // Activar animación de escritura
            element.classList.add('typing');
            // Después de la animación, remover el cursor
            setTimeout(() => {
                element.classList.remove('typing');
                element.classList.add('typed');
            }, 2500); // Duración de la animación typing
        }
    });
}

// Ejecutar al cargar y al hacer scroll
window.addEventListener('scroll', () => {
    handleScrollAnimations();
    handleTypewriterTitles();
});

window.addEventListener('load', () => {
    handleScrollAnimations();
    handleTypewriterTitles();
});

// Crear partículas flotantes en el modal
function createModalParticles() {
    const particlesContainer = document.getElementById('modalParticles');
    if (!particlesContainer) return;
    // Crear 8 partículas
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'modal-particle';
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        // Delay aleatorio para animación
        particle.style.animationDelay = Math.random() * 4 + 's';
        // Tamaño aleatorio
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particlesContainer.appendChild(particle);
    }
}

// Crear partículas cuando se muestra el modal
window.addEventListener('load', createModalParticles);

// Inicializar AOS (Animate On Scroll)
AOS.init({
    duration: 1000, // Duración de las animaciones en ms
    easing: 'ease-in-out', // Tipo de easing
    once: true, // Las animaciones ocurren solo una vez
    mirror: false, // No animar al volver hacia arriba
    offset: 120, // Offset desde el trigger point
    delay: 0, // Delay global
    anchorPlacement: 'top-bottom' // Define dónde se activa la animación
});

