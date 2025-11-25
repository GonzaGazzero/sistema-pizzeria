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
    loadMenu();
    cargarPedidosUsuario();
}

const showAdminSection = () => {
    showSection('adminSection');
    navAdmin();
    loadAdminDashboard();
}

// navs segun roles

const navUser = () => {
    const user = getActiveUser();
    document.getElementById('navMenu').innerHTML = `
    <button class="nav-btn" onclick="showSection('userSection'); loadMenu();">Menú</button>
    <button class="nav-btn" onclick="showSection('cartSection'); carritoInstance.actualizarCarrito();">Carrito</button>
    <button class="nav-btn" onclick="showSection('userOrdersSection')">Mis pedidos</button>
    <button class="nav-btn" onclick="logout()">Cerrar Sesión</button>
    `;
};
const navAdmin = () => {
    const user = getActiveUser();
    document.getElementById('navMenu').innerHTML = `
    <button class="nav-btn" onclick="showSection('adminSection'); loadAdminDashboard();">Panel Admin</button>
    <button class="nav-btn" onclick="showSection('adminMenuSection'); renderMenuManagement();">Menu</button>
    <button class="nav-btn" onclick="showSection('adminOrdersSection'); renderOrdersManagement();">Pedidos</button>
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
                renderMenuManagement(); // recargar la lista de productos
            } catch (error) {
                console.log('Error al guardar el producto:', error);
                alert('Error al guardar');
            }
        })
    }

    const checkoutButton = document.getElementById('checkoutButton');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            carritoInstance.checkout();
        });
    }

    const vaciarCarro = document.getElementById('vaciarCarritoBtn');
    if (vaciarCarro) {
        vaciarCarro.addEventListener('click', () => {
            carritoInstance.vaciarCarrito();
        });
    }
}
const mostrarMenu = (menuItems) => {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    // filtrar por prod disponibles
    const disponibles = menuItems.filter(item => item.disponible);
    window.menuItems = disponibles; // guarda en variable global para usar en el carrito
    menuGrid.innerHTML = disponibles.map(item => `
        <div class="menu-item" data-type="${item.tipo}">
            <div class="menu-item-content">
                <h3>${item.nombre}</h3>
                <p class="menu-item-type">${item.tipo}</p>
                <p class="menu-item-price">$${item.precio.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="addToCart('${item.id_menu}')"> 
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

const addToCart = (itemId) => {
    try {
        console.log('addToCart llamado con itemId:', itemId, 'tipo:', typeof itemId);
        console.log('window.menuItems:', window.menuItems);
        
        const menuItem = window.menuItems.find(item => String(item.id_menu) === String(itemId));
        
        if (!menuItem) {
            alert('Error: Producto no encontrado');
            return;
        }
        
        carritoInstance.addItem(itemId);
    } catch (error) {
        console.error('Error agregando al carro:', error);
        alert('Error al agregar al carrito');
    }
};

const loadMenu = async () => {
    try {
        const menuItems = await getMenu();
        mostrarMenu(menuItems);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// cargar pedidos del usuario actual
const cargarPedidosUsuario = async () => {
    const user = getActiveUser();
    if (!user) return;
    try {
        const orders = await getOrdersByUserId(user.id_usuario);
        loadUserOrders(orders);
    } catch (error) {
        console.error('Error al cargar los pedidos del usuario:', error);
    }
}


// cargar pedidos existentes de un usuario
const loadUserOrders = async (orders) => {
    const listaPedidos = document.getElementById('userOrdersList');
    if (!listaPedidos) return;
    
    if(orders.length === 0) {
        listaPedidos.innerHTML = '<p>No tienes pedidos aún.</p>';
        return;
    }

    listaPedidos.innerHTML = orders.map(order => {
        const orderId = order.id;
        return `
        <div class="order-item">
            <h4>Pedido #${orderId}</h4>
            <p>Fecha: ${new Date(order.fecha).toLocaleString()}</p>
            <p>Total: $${order.total}</p>
            <p>Estado: ${order.estado}</p>
            <details>
                <summary>Ver detalles</summary>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.nombre} (x${item.quantity}) - $${(item.precio * item.quantity)}</li>
                    `).join('')}
                </ul>
            </details>
        </div>
        `;
    }).join('');
}