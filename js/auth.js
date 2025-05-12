// js/auth.js

async function handleLoginSubmit(event) {
    event.preventDefault();
    const loginErrorDiv = document.getElementById('loginError');
    if(loginErrorDiv) loginErrorDiv.textContent = '';

    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const usernameError = document.getElementById('loginUsernameError');
    const passwordError = document.getElementById('loginPasswordError');

    if(usernameError) usernameError.textContent = '';
    if(passwordError) passwordError.textContent = '';
    usernameInput.classList.remove('border-red-500');
    passwordInput.classList.remove('border-red-500');

    let isValid = true;
    isValid = validateField(usernameInput, usernameError, 'El usuario es requerido.') && isValid;
    isValid = validateField(passwordInput, passwordError, 'La contraseña es requerida.') && isValid;

    if (!isValid) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const data = await apiCall('/auth/signin', 'POST', { username, password });

        localStorage.setItem('accessToken', data.accessToken);
        const user = { username: data.username, roles: data.roles, id: data.id };
        localStorage.setItem('user', JSON.stringify(user));

        showPage('mainApp');
        updateNavbar(user);
        addNavLinksListeners();
        navigateToSection('home');
        clearFormErrors(document.getElementById('loginForm'));

    } catch (error) {
        console.error('Login error:', error.message);
        if(loginErrorDiv) loginErrorDiv.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const registerMessageDiv = document.getElementById('registerMessage');
    if(registerMessageDiv) {
        registerMessageDiv.textContent = '';
        registerMessageDiv.className = 'mt-3 text-center';
    }

    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');

    const usernameError = document.getElementById('registerUsernameError');
    const emailError = document.getElementById('registerEmailError');
    const passwordError = document.getElementById('registerPasswordError');

    if(usernameError) usernameError.textContent = '';
    if(emailError) emailError.textContent = '';
    if(passwordError) passwordError.textContent = '';
    usernameInput.classList.remove('border-red-500');
    emailInput.classList.remove('border-red-500');
    passwordInput.classList.remove('border-red-500');

    let isValid = true;
    isValid = validateField(usernameInput, usernameError, 'El nombre de usuario es requerido.') && isValid;
    isValid = validateEmail(emailInput, emailError) && isValid;
    isValid = validatePassword(passwordInput, passwordError) && isValid;

    if (!isValid) return;

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const rolesToSend = ['user'];

    try {
        const data = await apiCall('/auth/signup', 'POST', {
            username,
            email,
            password,
            roles: rolesToSend
        });

        if(registerMessageDiv) {
            registerMessageDiv.textContent = data.message || '¡Registro exitoso! Ahora puedes iniciar sesión.';
            registerMessageDiv.classList.add('text-green-600');
        }
        document.getElementById('registerForm').reset();
        clearFormErrors(document.getElementById('registerForm'));

        setTimeout(() => {
            showPage('loginPage');
        }, 2500);

    } catch (error) {
        console.error('Register error:', error.message);
        if(registerMessageDiv) {
            registerMessageDiv.textContent = error.message || 'Error en el registro.';
            registerMessageDiv.classList.add('error-message');
        }
    }
}

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    showPage('loginPage');
    updateNavbar(null);
    addNavLinksListeners();

    const loginErrorDiv = document.getElementById('loginError');
    const registerMessageDiv = document.getElementById('registerMessage');
    if (loginErrorDiv) loginErrorDiv.textContent = '';
    if (registerMessageDiv) registerMessageDiv.textContent = '';
}
