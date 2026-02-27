// Esperamos a que todo el documento HTML se haya cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // ============== MENÚ HAMBURGUESA ==============
    // Seleccionamos los elementos que vamos a usar
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navDropdown = document.querySelector('.nav-dropdown');
    
    // Verificar que los elementos existan antes de agregar listeners
    if (!mobileMenu) {
        console.error('Elemento #mobile-menu no encontrado');
        return;
    }
    
    if (!navLinks) {
        console.error('Elemento .nav-links no encontrado');
        return;
    }

    // 1. Evento para abrir/cerrar el menú al tocar el ícono de hamburguesa
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    // 2. Manejo especial del dropdown de Servicios en móviles
    if (navDropdown) {
        const dropdownLink = navDropdown.querySelector('a');
        const dropdownMenu = navDropdown.querySelector('.dropdown-menu');
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    navDropdown.classList.toggle('active');
                }
            });
        }
        
        if (dropdownMenu) {
            const dropdownItems = dropdownMenu.querySelectorAll('a');
            dropdownItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        navDropdown.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                });
            });
        }
    }

    // 3. Cerrar el menú cuando se hace clic en cualquier enlace (excepto Servicios en móviles)
    const links = document.querySelectorAll('.nav-links li:not(.nav-dropdown) a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (navDropdown) {
                navDropdown.classList.remove('active');
            }
        });
    });

    // 4. Cerrar menús al redimensionar a pantalla grande
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            if (navDropdown) {
                navDropdown.classList.remove('active');
            }
        }
    });
    
    // 5. Cerrar el menú si se hace clic afuera de él
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            if (navDropdown) {
                navDropdown.classList.remove('active');
            }
        }
    });

    // ============== FORMULARIO DE CONSULTA ==============
    
    // Inicializar EmailJS - REEMPLAZA CON TU PUBLIC KEY
    // Obtenerlo en: https://dashboard.emailjs.com/admin/account
    emailjs.init('zOz-P2BKIYaQJHONq');

    const formConsulta = document.getElementById('form-consulta');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');

    formConsulta.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        
        if (!recaptchaResponse) {
            mostrarMensaje('Por favor, completa el reCAPTCHA', 'error');
            return;
        }

        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const mensaje = document.getElementById('mensaje').value;

        // Parámetros para el email
        const templateParams = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            mensaje: mensaje
        };

        try {
            // Enviar email - REEMPLAZA CON TU SERVICE ID Y TEMPLATE ID
            // Service ID: obtenerlo en https://dashboard.emailjs.com/admin
            // Template ID: crear una plantilla en el dashboard
            const response = await emailjs.send(
                'service_wva1uh3',
                'template_mp6i6cg',
                templateParams
            );

            if (response.status === 200) {
                mostrarMensaje('¡Consulta enviada correctamente! Te contactaremos pronto.', 'exito');
                formConsulta.reset();
                grecaptcha.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al enviar la consulta. Intenta nuevamente.', 'error');
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensajeRespuesta.textContent = texto;
        mensajeRespuesta.className = `mensaje-respuesta ${tipo}`;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            mensajeRespuesta.className = 'mensaje-respuesta';
            mensajeRespuesta.textContent = '';
        }, 5000);
    }

    // ============== CAROUSEL DE EMPRESAS ==============
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    
    let currentIndex = 3; // Empezar en los logos reales (1, 2, 3)
    const slideWidth = 232; // 200px width + 32px gap
    const totalLogos = 6;
    const cloneOffset = 3;
    
    // Función para actualizar la posición
    function updateCarousel(animate = true) {
        const offset = -currentIndex * slideWidth;
        if (animate) {
            carouselTrack.style.transition = 'transform 0.4s ease';
        } else {
            carouselTrack.style.transition = 'none';
        }
        carouselTrack.style.transform = `translateX(${offset}px)`;
    }
    
    // Evento para el botón siguiente
    carouselNext.addEventListener('click', () => {
        currentIndex++;
        updateCarousel(true);
        
        // Si llegamos a los clones al final, resetear sin que se vea
        if (currentIndex >= cloneOffset + totalLogos) {
            setTimeout(() => {
                currentIndex = cloneOffset;
                updateCarousel(false);
            }, 400);
        }
    });
    
    // Evento para el botón anterior
    carouselPrev.addEventListener('click', () => {
        currentIndex--;
        updateCarousel(true);
        
        // Si vamos antes de los logos reales, saltar a los clones al final
        if (currentIndex < cloneOffset) {
            setTimeout(() => {
                currentIndex = cloneOffset + totalLogos - 1;
                updateCarousel(false);
            }, 400);
        }
    });
    
    // Inicializar
    updateCarousel(false);

    // ============== CAROUSEL DE TESTIMONIOS ==============
    const testimoniosTrack = document.getElementById('testimonios-track');
    const testimoniosPrev = document.getElementById('testimonios-prev');
    const testimoniosNext = document.getElementById('testimonios-next');
    
    let testimoniosIndex = 3; // Empezar en los testimonios reales (1, 2, 3)
    const totalTestimonios = 6;
    const testimoniosCloneOffset = 3;
    
    // Función para obtener el ancho de la tarjeta dinámicamente
    function getTestimonioSlideWidth() {
        const card = document.querySelector('.testimonio-card');
        if (card) {
            const style = window.getComputedStyle(card);
            const width = parseFloat(style.width);
            const gap = 32; // gap del flex
            return width + gap;
        }
        // Fallback para dispositivos
        return window.innerWidth <= 768 ? window.innerWidth : 352;
    }
    
    // Función para actualizar la posición sin reseteo visible
    function updateTestimonios(animate = true) {
        const testimonioSlideWidth = getTestimonioSlideWidth();
        const offset = -testimoniosIndex * testimonioSlideWidth;
        if (animate) {
            testimoniosTrack.style.transition = 'transform 0.4s ease';
        } else {
            testimoniosTrack.style.transition = 'none';
        }
        testimoniosTrack.style.transform = `translateX(${offset}px)`;
    }
    
    // Evento para el botón siguiente
    testimoniosNext.addEventListener('click', () => {
        testimoniosIndex++;
        updateTestimonios(true);
        
        // Esperar a que termine la animación
        setTimeout(() => {
            // Si llegamos a los clones al final, resetear sin transición
            if (testimoniosIndex >= testimoniosCloneOffset + totalTestimonios) {
                testimoniosIndex = testimoniosCloneOffset;
                updateTestimonios(false);
            }
        }, 400);
    });
    
    // Evento para el botón anterior
    testimoniosPrev.addEventListener('click', () => {
        if (testimoniosIndex <= testimoniosCloneOffset) {
            testimoniosIndex = totalTestimonios + testimoniosCloneOffset;
            updateTestimonios(false);
            setTimeout(() => {
                testimoniosIndex--;
                updateTestimonios(true);
            }, 10);
        } else {
            testimoniosIndex--;
            updateTestimonios(true);
        }
    });
    
    
    // ============== MENÚ DESPLEGABLE DE SERVICIOS ==============
    // Este código está integrado arriba en la sección del men hamburguesa
    
    // Inicializar
    updateTestimonios(false);

});