async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`; // API_BASE_URL se define en config.js
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            // Este error será capturado por el llamador, que podría redirigir a login.
            throw new Error('No hay token de acceso. Por favor, inicia sesión.');
        }
        headers['x-access-token'] = token; // Asegúrate que este es el header que tu backend espera
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        // Si el token es inválido o ha expirado (401 Unauthorized, 403 Forbidden)
        if (response.status === 401 || response.status === 403) {
            // El llamador debería manejar esto, posiblemente llamando a handleLogout()
            // y mostrando la página de login.
            const errorData = await response.json().catch(() => ({ message: `Acceso denegado: ${response.statusText}` }));
            throw new Error(errorData.message || `Error de autenticación (${response.status}). Por favor, inicia sesión de nuevo.`);
        }

        if (!response.ok) {
            // Intenta parsear el error del cuerpo de la respuesta si existe
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
        }

        // Si la respuesta no tiene contenido (ej. DELETE exitoso con 204 No Content)
        if (response.status === 204) {
            return {}; // Devuelve un objeto vacío o null según prefieras
        }

        return await response.json(); // Parsea la respuesta JSON

    } catch (error) {
        console.error(`Error en la llamada API a ${method} ${url}:`, error.message);
        // Re-lanza el error para que el llamador pueda manejarlo y mostrar un mensaje al usuario.
        throw error;
    }
}