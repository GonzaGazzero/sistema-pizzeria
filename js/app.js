// Iniciar cuando el DOM este cargado
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const initApp = () => {
    if (checkSession()) { //si hay sesion activa, buscamos el usuario y comprobamos su rol
        const user = getActiveUser();
        isAdmin() ? showAdminSection() : showUserSection();
    } else {
        showLoginSection();
    }
    initEventListeners(); // inicializar listeners globales
    initAdminListeners(); // inicializar listeners de admin
}

// ocultar todas las secciones
const hideSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => { section.classList.add('hidden') });
}

// funcion para mostrar secciones especificas
const showSection = (section) => {
    hideSections();
    document.getElementById(section).classList.remove('hidden');
}

// mostrar secciones segun rol

const showLoginSection = () => {
    showSection('loginSection');
    // mostrar nav segun rol
}

const showUserSection = () => {
    showSection('userSection');
    navUser();
}

const showAdminSection = () => {
    showSection('adminSection');
    navAdmin();
}

// navs segun roles

const navUser = () => {
    const user = getActiveUser();
    document.getElementById('navMenu').innerHTML = `
    <button class="nav-btn" onclick="showSection('menuSection')">Menú</button>
    <button class="nav-btn" onclick="showSection('cartSection')">Carrito</button>
    <button class="nav-btn" onclick="showSection('userOrdersSection')">Mis pedidos</button>
    <button class="nav-btn" onclick="logout()">Cerrar Sesión</button>
    `;
};
const navAdmin = () => {
    const user = getActiveUser();
    document.getElementById('navMenu').innerHTML = `
    <button class="nav-btn" onclick="showSection('adminSection')">Panel Admin</button>
    <button class="nav-btn" onclick="showSection('adminMenuSection')">Menu</button>
    <button class="nav-btn" onclick="showSection('adminOrdersSection')">Pedidos</button>
    <button class="nav-btn" onclick="logout()">Cerrar Sesión</button>
    `;
}

const initEventListeners = () => {
    // logica login 
    const loginForm = document.getElementById('loginForm');
    // usamos if para comprobar que el formulario exista y ejecutar la function, ya que el eventlistener es para muchas funcionalidades
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const result = await login(email, password);
            if (result.success) {
                isAdmin() ? showAdminSection() : showUserSection();
            } else {
                alert('email o contraseña incorrectos');
            }
        }
        )
    };

    // logica registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerPasswordConfirm').value;
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return
            }
            const userData = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: password
            }
            const result = await register(userData);

            if (result.success) {
                alert('Usuario registrado con exito');
                showLoginSection();
            } else {
                alert('Registro fallido, verifique los datos ingresados');
            }
        })
    };

    // alternar entre el login y el registro
    const registerLink = document.getElementById('registerLink');
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('registerSection');
        });
    };

    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('loginSection');
        });
    }
}

const initAdminListeners = () => {
    // agregar producto
    const btnAddProduct = document.getElementById('addMenuItemBtn');
    const formContainer = document.getElementById('menuItemFormContainer');
    const form = document.getElementById('menuItemForm');
    const cancelBtn = document.getElementById('cancelBtn');

    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', () => {
            form.reset();
            document.getElementById('itemId').value = '';
            document.getElementById('formTitle').textContent = 'Agregar Producto';
            formContainer.classList.remove('hidden');
            formContainer.scrollIntoView({ behavior: 'smooth' });
        });

        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const itemData = {
                nombre: document.getElementById('itemName').value,
                tipo: document.getElementById('itemType').value,
                precio: parseFloat(document.getElementById('itemPrice').value),
                disponible: document.getElementById('itemAvailable').checked
            }
            const itemId = document.getElementById('itemId').value;
            try {
                if (itemId) {
                    await putMenuItem(itemId, itemData);
                    alert('Producto actualizado');
                } else {
                    await postMenuItem(itemData);
                    alert('Producto creado');
                }
                formContainer.classList.add('hidden');
                // funcion para recargar el menu admin(pendiente de crear en admin.js)
            } catch (error) {
                console.log('Error al guardar el producto:', error);
                alert('Error al guardar');
            }
        })
    }
}