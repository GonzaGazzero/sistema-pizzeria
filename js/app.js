// Iniciar cuando el DOM este cargado
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const initApp = () => {
    if (checkSession()) { //si hay sesion activa, buscamos el usuario y comprobamos su rol
        const user = getActiveUser();
        isAdmin() ? //mostrar seccion de admin : mostrar seccion de usuario
    } else {
        // mostrar seccion login
    }
}

// ocultar todas las secciones
const hideSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => { section.classList.add('hidden')});
}

// funcion para mostrar secciones especificas
const showSection = (section) => {
    hideSections();
    section.classList.remove('hidden');
}

// mostrar secciones segun rol

showLoginSection = () => {
    showSection('loginSection');
    // mostrar nav segun rol
}

showUserSection = () => {
    showSection('userSection');
    // mostrar nav segun rol
}

showAdminSection = () => {
    showSection('adminSection');
    // mostrar nav segun rol  
}

// navs segun roles
