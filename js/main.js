// Esperamos a que todo el documento HTML se haya cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // ============== MENÚ HAMBURGUESA ==============
    // Seleccionamos los elementos que vamos a usar
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownLink = navDropdown ? navDropdown.querySelector('a') : null;

    // Función para detectar si estamos en móvil
    const isMobile = () => window.innerWidth <= 768;

    // 1. Evento para abrir/cerrar el menú al tocar el ícono de hamburguesa
    mobileMenu.addEventListener('click', () => {
        // La clase 'active' es la que muestra el menú en el CSS
        navLinks.classList.toggle('active');
    });

    // 2. Manejo del dropdown en móviles
    if (dropdownLink) {
        dropdownLink.addEventListener('click', (e) => {
            // En móviles, prevenir navegación y mostrar/ocultar dropdown
            if (isMobile()) {
                e.preventDefault();
                navDropdown.classList.toggle('active');
            }
        });
    }

    // 3. Evento para cerrar el menú cuando se hace clic en cualquier enlace (excepto Servicios en móviles)
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Si es el enlace de Servicios en móviles, no cerrar el menú principal
            if (isMobile() && link === dropdownLink) {
                return;
            }
            // Removemos la clase 'active' para ocultar el menú
            navLinks.classList.remove('active');
            // También cerrar el dropdown
            if (navDropdown) {
                navDropdown.classList.remove('active');
            }
        });
    });

    // 4. Cerrar dropdown al hacer clic en los items del dropdown
    const dropdownItems = navDropdown ? navDropdown.querySelectorAll('.dropdown-menu a') : [];
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMobile()) {
                navDropdown.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // 5. Cerrar dropdown/menú al redimensionar pantalla
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            if (navDropdown) {
                navDropdown.classList.remove('active');
            }
            navLinks.classList.remove('active');
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
    const testimonioSlideWidth = 352; // 320px width + 32px gap
    const totalTestimonios = 6;
    const testimoniosCloneOffset = 3;
    
    // Función para actualizar la posición sin reseteo visible
    function updateTestimonios(animate = true) {
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
    // Para dispositivos móviles, hacer el dropdown clickeable
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (navDropdown && dropdownMenu) {
        // En móviles, prevenir que el dropdown se cierre inmediatamente
        navDropdown.addEventListener('click', (e) => {
            // Si es pantalla pequeña y el dropdown está oculto, mostrarlo
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownMenu.style.opacity = dropdownMenu.style.opacity === '1' ? '0' : '1';
                dropdownMenu.style.visibility = dropdownMenu.style.visibility === 'visible' ? 'hidden' : 'visible';
                dropdownMenu.style.transform = dropdownMenu.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
            }
        });

        // Permettir clicks en los items del dropdown
        const dropdownItems = dropdownMenu.querySelectorAll('a');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // En móviles, cerrar el dropdown después de hacer clic
                if (window.innerWidth <= 768) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }
            });
        });
    }
    
    // Inicializar
    updateTestimonios(false);

});