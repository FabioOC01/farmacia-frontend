
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutButton = document.getElementById('logoutButton');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const navLinksContainer = document.getElementById('navLinks'); // Para añadir listeners a los links de nav


function addNavLinksListeners() {
    if (navLinksContainer) {
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.removeEventListener('click', handleNavLinkClick); // Necesitamos una función nombrada
            link.addEventListener('click', handleNavLinkClick);
        });
    }
}

/**
 * Manejador para los clics en los enlaces de navegación.
 * @param {Event} event - El evento de clic.
 */
function handleNavLinkClick(event) {
    event.preventDefault();
    const section = event.target.dataset.section;
    if (section) {
        navigateToSection(section); // navigateToSection se define en ui.js
    }
}



function initApp() {
    const token = localStorage.getItem('accessToken');
    const userString = localStorage.getItem('user');

    if (token && userString) {
        try {
            const user = JSON.parse(userString);
            

            showPage('mainApp');    // showPage se define en ui.js
            updateNavbar(user); // updateNavbar se define en ui.js
            addNavLinksListeners(); // Añadir listeners a los links de la navbar
            navigateToSection('home'); // navigateToSection se define en ui.js

        } catch (e) {
            console.error("Error al parsear datos de usuario desde localStorage:", e);
            // Si los datos del usuario están corruptos, desloguear.
            handleLogout(); // handleLogout se define en auth.js
        }
    } else {
        // No hay token o datos de usuario, mostrar página de login.
        showPage('loginPage');    // showPage se define en ui.js
        updateNavbar(null); // Asegurar que la navbar esté en estado "no logueado"
        addNavLinksListeners(); // Aunque no haya links de usuario, puede haber un link de "Inicio"
    }
}

// --- Configuración de Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Listeners para formularios
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit); // handleLoginSubmit se define en auth.js
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit); // handleRegisterSubmit se define en auth.js
    }

    // Listener para el botón de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout); // handleLogout se define en auth.js
    }

    // Listeners para los enlaces de mostrar/ocultar login/registro
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('registerPage'); // showPage se define en ui.js
            clearFormErrors(loginForm); // Limpiar errores del form de login al cambiar
            document.getElementById('loginError').textContent = ''; // Limpiar mensaje general de error de login
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('loginPage');    // showPage se define en ui.js
            clearFormErrors(registerForm); // Limpiar errores del form de registro al cambiar
            document.getElementById('registerMessage').textContent = ''; // Limpiar mensaje general de registro
        });
    }

    // Inicializar la aplicación
    initApp();
});
