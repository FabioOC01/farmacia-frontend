// js/ui.js

function showPage(pageIdToShow) {
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    const mainApp = document.getElementById('mainApp');
    const medicamentosSection = document.getElementById('medicamentosSection');
    const especialidadesSection = document.getElementById('especialidadesSection');

    // Ocultar todas las páginas/secciones principales primero
    if (loginPage) loginPage.classList.add('hidden');
    if (registerPage) registerPage.classList.add('hidden');
    if (mainApp) mainApp.classList.add('hidden');

    // Ocultar secciones internas de la app principal
    if (medicamentosSection) medicamentosSection.classList.add('hidden');
    if (especialidadesSection) especialidadesSection.classList.add('hidden');

    // Mostrar la página solicitada
    const pageElement = document.getElementById(pageIdToShow);
    if (pageElement) {
        pageElement.classList.remove('hidden');
    } else {
        console.error(`Elemento con ID '${pageIdToShow}' no encontrado para mostrar.`);
    }
}

/**
 * Actualiza la barra de navegación basada en la información del usuario y sus roles.
 * @param {object|null} user - El objeto de usuario (con username y roles) o null si no está logueado.
 */
function updateNavbar(user) {
    const navLinksContainer = document.getElementById('navLinks');
    const welcomeUserSpan = document.getElementById('welcomeUser');

    if (!navLinksContainer || !welcomeUserSpan) {
        console.error("Elementos de la Navbar no encontrados.");
        return;
    }

    navLinksContainer.innerHTML = ''; // Limpiar enlaces existentes

    // Enlace común de Inicio
    const homeLink = document.createElement('li');
    homeLink.innerHTML = `<a href="#" class="hover:text-blue-200" data-section="home">Inicio</a>`;
    navLinksContainer.appendChild(homeLink);

    if (user && user.roles) {
        welcomeUserSpan.textContent = `Bienvenido/a, ${user.username}`;

        // Enlace para ver Medicamentos (todos los usuarios logueados)
        const medLink = document.createElement('li');
        medLink.innerHTML = `<a href="#" class="hover:text-blue-200" data-section="medicamentos">Medicamentos</a>`;
        navLinksContainer.appendChild(medLink);

        // Enlace para ver Especialidades (todos los usuarios logueados)
        const espLink = document.createElement('li');
        espLink.innerHTML = `<a href="#" class="hover:text-blue-200" data-section="especialidades">Especialidades</a>`;
        navLinksContainer.appendChild(espLink);

        // Enlaces específicos por rol
        if (user.roles.includes('admin')) {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = `<a href="#" class="hover:text-blue-200" data-section="adminPanel">Panel Admin</a>`;
            navLinksContainer.appendChild(adminLink);
        }
        if (user.roles.includes('moderator')) {
            const modLink = document.createElement('li');
            modLink.innerHTML = `<a href="#" class="hover:text-blue-200" data-section="moderatorPanel">Moderar</a>`;
            navLinksContainer.appendChild(modLink);
        }
    } else {
        welcomeUserSpan.textContent = ''; // Limpiar si no hay usuario
    }

    
}

/**
 * Navega a una sección específica dentro de la aplicación principal.
 * @param {string} section - El identificador de la sección a mostrar (ej. 'home', 'medicamentos').
 */
function navigateToSection(section) {
    const mainTitle = document.getElementById('mainTitle');
    const mainMessage = document.getElementById('mainMessage');
    const medicamentosSection = document.getElementById('medicamentosSection');
    const especialidadesSection = document.getElementById('especialidadesSection');
    const generalMessageDiv = document.getElementById('generalMessage');

    // Ocultar todas las secciones principales primero
    if (medicamentosSection) medicamentosSection.classList.add('hidden');
    if (especialidadesSection) especialidadesSection.classList.add('hidden');
    if (generalMessageDiv) generalMessageDiv.classList.add('hidden'); // Ocultar mensajes generales

    // Configurar títulos y mensajes por defecto
    if(mainTitle) mainTitle.textContent = "Menú Principal";
    if(mainMessage) mainMessage.textContent = "Bienvenido/a. Selecciona una opción de la barra de navegación.";

    switch (section) {
        case 'home':
            // El mensaje por defecto ya está configurado.
            break;
        case 'medicamentos':
            if(mainTitle) mainTitle.textContent = "Gestión de Medicamentos";
            if(mainMessage) mainMessage.textContent = "Listado de medicamentos disponibles.";
            if(medicamentosSection) medicamentosSection.classList.remove('hidden');
            loadMedicamentos(); // Cargar datos de medicamentos
            break;
        case 'especialidades':
            if(mainTitle) mainTitle.textContent = "Gestión de Especialidades";
            if(mainMessage) mainMessage.textContent = "Listado de especialidades médicas.";
            if(especialidadesSection) especialidadesSection.classList.remove('hidden');
            loadEspecialidades(); // Cargar datos de especialidades
            break;
        case 'adminPanel':
            if(mainTitle) mainTitle.textContent = "Panel de Administración";
            if(mainMessage) mainMessage.textContent = "Herramientas y configuraciones para administradores.";
            // Aquí se podría cargar contenido específico del panel de admin
            break;
        case 'moderatorPanel':
            if(mainTitle) mainTitle.textContent = "Panel de Moderación";
            if(mainMessage) mainMessage.textContent = "Herramientas para moderadores.";
            // Aquí se podría cargar contenido específico del panel de moderador
            break;
        default:
            console.warn(`Sección desconocida: ${section}`);
            // Volver a la sección 'home' por defecto
            if(mainTitle) mainTitle.textContent = "Menú Principal";
            if(mainMessage) mainMessage.textContent = "Bienvenido/a. Selecciona una opción de la barra de navegación.";
            break;
    }
}

/**
 * Muestra un mensaje general en la UI.
 * @param {string} message - El mensaje a mostrar.
 * @param {boolean} [isError=false] - True si el mensaje es un error (para estilizarlo diferente).
 */
function displayGeneralMessage(message, isError = false) {
    const generalMessageDiv = document.getElementById('generalMessage');
    if (!generalMessageDiv) return;

    generalMessageDiv.textContent = message;
    generalMessageDiv.classList.remove('hidden');
    // Quitar clases de color previas
    generalMessageDiv.classList.remove('bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');

    if (isError) {
        generalMessageDiv.classList.add('bg-red-100', 'text-red-700'); // Estilo de error
    } else {
        generalMessageDiv.classList.add('bg-green-100', 'text-green-700'); // Estilo de éxito/info
    }
}

/**
 * Carga y muestra los datos de medicamentos en su tabla.
 */
async function loadMedicamentos() {
    const tableBody = document.getElementById('medicamentosTableBody');
    const errorDiv = document.getElementById('medicamentosError');
    if (!tableBody || !errorDiv) return;

    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Cargando medicamentos...</td></tr>';
    errorDiv.textContent = '';

    try {
        // Primero, obtener las especialidades para mapear IDs a nombres.
        const especialidadesData = await apiCall('/especialidades', 'GET', null, true);
        const especialidadesMap = especialidadesData.reduce((map, esp) => {
            map[esp.id] = esp.nombre;
            return map;
        }, {});

        // Luego, obtener los medicamentos.
        const medicamentos = await apiCall('/medicamentos', 'GET', null, true);
        tableBody.innerHTML = ''; // Limpiar "Cargando..."

        if (!medicamentos || medicamentos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No hay medicamentos para mostrar.</td></tr>';
            return;
        }

        medicamentos.forEach(med => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = med.id;
            row.insertCell().textContent = med.nombre || 'N/A';
            row.insertCell().textContent = med.descripcion || 'N/A';
            row.insertCell().textContent = med.precio !== undefined ? `$${Number(med.precio).toFixed(2)}` : 'N/A';
            row.insertCell().textContent = med.stock !== undefined ? med.stock : 'N/A';
            row.insertCell().textContent = med.especialidadId ? (especialidadesMap[med.especialidadId] || 'Desconocida') : 'N/A';
        });
    } catch (error) {
        console.error('Error cargando medicamentos:', error.message);
        tableBody.innerHTML = ''; // Limpiar por si acaso
        errorDiv.textContent = `Error al cargar medicamentos: ${error.message}`;
        // Si el error es de autenticación, auth.js o main.js podrían manejar la redirección.
        if (error.message.includes("Error de autenticación") || error.message.includes("No hay token de acceso")) {
            handleLogout(); // Asume que handleLogout está disponible globalmente desde auth.js
        }
    }
}

/**
 * Carga y muestra los datos de especialidades en su tabla.
 */
async function loadEspecialidades() {
    const tableBody = document.getElementById('especialidadesTableBody');
    const errorDiv = document.getElementById('especialidadesError');
    if (!tableBody || !errorDiv) return;

    tableBody.innerHTML = '<tr><td colspan="2" class="text-center py-4">Cargando especialidades...</td></tr>';
    errorDiv.textContent = '';

    try {
        const especialidades = await apiCall('/especialidades', 'GET', null, true);
        tableBody.innerHTML = ''; // Limpiar "Cargando..."

        if (!especialidades || especialidades.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="2" class="text-center py-4">No hay especialidades para mostrar.</td></tr>';
            return;
        }

        especialidades.forEach(esp => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = esp.id;
            row.insertCell().textContent = esp.nombre || 'N/A';
        });
    } catch (error) {
        console.error('Error cargando especialidades:', error.message);
        tableBody.innerHTML = '';
        errorDiv.textContent = `Error al cargar especialidades: ${error.message}`;
        if (error.message.includes("Error de autenticación") || error.message.includes("No hay token de acceso")) {
            handleLogout(); // Asume que handleLogout está disponible globalmente desde auth.js
        }
    }
}
