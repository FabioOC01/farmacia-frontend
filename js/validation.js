
/**
 
 * @param {HTMLInputElement} inputElement - El elemento input a validar.
 * @param {HTMLElement} errorElement - El elemento donde se mostrará el mensaje de error.
 * @param {string} message - El mensaje de error a mostrar si la validación falla.
 * @returns {boolean} - True si el campo es válido, false en caso contrario.
 */
function validateField(inputElement, errorElement, message) {
    if (!inputElement.value.trim()) {
        errorElement.textContent = message;
        inputElement.classList.add('border-red-500'); // Asume Tailwind para estilizar el error
        inputElement.classList.remove('border-gray-300');
        return false;
    }
    errorElement.textContent = '';
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
    return true;
}

/**
 * Valida un campo de email.
 * @param {HTMLInputElement} inputElement - El elemento input de email.
 * @param {HTMLElement} errorElement - El elemento para el mensaje de error.
 * @returns {boolean} - True si el email es válido, false en caso contrario.
 */
function validateEmail(inputElement, errorElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputElement.value.trim()) {
        errorElement.textContent = 'El email es requerido.';
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
        return false;
    } else if (!emailRegex.test(inputElement.value.trim())) {
        errorElement.textContent = 'Formato de email inválido.';
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
        return false;
    }
    errorElement.textContent = '';
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
    return true;
}

/**
 * Valida un campo de contraseña.
 * @param {HTMLInputElement} inputElement - El elemento input de contraseña.
 * @param {HTMLElement} errorElement - El elemento para el mensaje de error.
 * @returns {boolean} - True si la contraseña es válida, false en caso contrario.
 */
function validatePassword(inputElement, errorElement) {
    if (!inputElement.value) { // No usar trim() para contraseñas, ya que pueden contener espacios intencionales
        errorElement.textContent = 'La contraseña es requerida.';
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
        return false;
    } else if (inputElement.value.length < 6) { // Ejemplo: mínimo 6 caracteres
        errorElement.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
        return false;
    }
    errorElement.textContent = '';
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
    return true;
}

/**
 * Limpia los mensajes de error y estilos de un formulario.
 * @param {HTMLFormElement} formElement - El formulario cuyos errores se limpiarán.
 */
function clearFormErrors(formElement) {
    const errorMessages = formElement.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.textContent = '');

    const errorInputs = formElement.querySelectorAll('.border-red-500');
    errorInputs.forEach(el => {
        el.classList.remove('border-red-500');
        if (!el.classList.contains('border-gray-300')) { // Evitar añadir si ya está
             el.classList.add('border-gray-300');
        }
    });
}
