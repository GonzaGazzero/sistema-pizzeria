const renderMenuManagement = async () => {
    try {
        const menuItems = await getMenu();
        const grid = document.getElementById('menuManagementGrid');
        if (!grid) return;

        grid.innerHTML = menuItems.map(item => `
            <div class="management-item">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p>Tipo: ${item.tipo}</p>
                    <p>Precio: $${item.precio}</p>
                    <p class="status ${item.disponible ? 'available' : 'unavailable'}">
                        ${item.disponible ? '✓ Disponible' : '✗ No disponible'}
                    </p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-warning" onclick="editMenuItem('${item.id_menu}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMenuItemConfirm('${item.id_menu}')">Eliminar</button>
                    <button class="btn btn-sm btn-secondary" onclick="toggleAvailability('${item.id_menu}', ${!item.disponible})">
                        ${item.disponible ? 'Deshabilitar' : 'Habilitar'}
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos');
    }
};

// Editar un producto
const editMenuItem = async (itemId) => {
    try {
        const item = await getMenuById(itemId);
        const formContainer = document.getElementById('menuItemFormContainer');
        const form = document.getElementById('menuItemForm');

        // Llenar el formulario con los datos del producto
        document.getElementById('itemId').value = item.id_menu;
        document.getElementById('itemName').value = item.nombre;
        document.getElementById('itemType').value = item.tipo;
        document.getElementById('itemPrice').value = item.precio;
        document.getElementById('itemAvailable').checked = item.disponible;
        document.getElementById('formTitle').textContent = 'Editar Producto';

        formContainer.classList.remove('hidden');
        formContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar producto');
    }
};

// Eliminar producto con confirmación
const deleteMenuItemConfirm = async (itemId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        await deleteMenuItem(itemId);
        alert('Producto eliminado correctamente');
        renderMenuManagement();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto');
    }
};

// Cambiar disponibilidad de un producto
const toggleAvailability = async (itemId, newStatus) => {
    try {
        const item = await getMenuById(itemId);
        await putMenuItem(itemId, { ...item, disponible: newStatus });
        renderMenuManagement();
    } catch (error) {
        console.error('Error al actualizar disponibilidad:', error);
        alert('Error al actualizar disponibilidad');
    }
};

const renderOrdersManagement = async () => {
    try {
        const orders = await getOrders();
        const list = document.getElementById('ordersManagementList');
        if (!list) return;

        if (orders.length === 0) {
            list.innerHTML = '<p>No hay pedidos aún.</p>';
            return;
        }

        list.innerHTML = orders.map(order => {
            const statusClass = getStatusClass(order.estado);
            return `
                <div class="order-management-item">
                    <div class="order-header">
                        <h4>Pedido #${order.id}</h4>
                        <span class="badge ${statusClass}">${order.estado}</span>
                    </div>
                    <p>Fecha: ${new Date(order.fecha).toLocaleString()}</p>
                    <p>Total: $${order.total}</p>
                    <p>Usuario ID: ${order.userId}</p>
                    <details>
                        <summary>Ver productos</summary>
                        <ul>
                            ${order.items.map(item => `
                                <li>${item.nombre} x${item.quantity} - $${item.precio * item.quantity}</li>
                            `).join('')}
                        </ul>
                    </details>
                    <div class="order-actions">
                        <select id="status-${order.id}" class="form-select form-select-sm">
                            <option value="pendiente" ${order.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="en preparación" ${order.estado === 'en preparación' ? 'selected' : ''}>En preparación</option>
                            <option value="listo" ${order.estado === 'listo' ? 'selected' : ''}>Listo</option>
                            <option value="entregado" ${order.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                            <option value="cancelado" ${order.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                        <button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${order.id}')">Actualizar</button>
                    </div>
                </div>
            `;
        }).join('');

        updateDashboardStats(orders);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        alert('Error al cargar pedidos');
    }
};

const getStatusClass = (estado) => {
    const classes = {
        'pendiente': 'bg-warning',
        'en preparación': 'bg-info',
        'listo': 'bg-success',
        'entregado': 'bg-secondary',
        'cancelado': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary';
};

const updateOrderStatus = async (orderId) => {
    try {
        const newStatus = document.getElementById(`status-${orderId}`).value;
        const order = await getOrderById(orderId);
        
        await updateOrder(orderId, { ...order, estado: newStatus });
        alert('Estado actualizado correctamente');
        renderOrdersManagement();
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        alert('Error al actualizar estado');
    }
};

const updateDashboardStats = (orders) => {
    const stats = {
        pending: orders.filter(o => o.estado === 'pendiente').length,
        preparing: orders.filter(o => o.estado === 'en preparación').length,
        delivered: orders.filter(o => o.estado === 'entregado').length,
        total: orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
    };

    const statPending = document.getElementById('statPending');
    const statPreparing = document.getElementById('statPreparing');
    const statDelivered = document.getElementById('statDelivered');
    const statSales = document.getElementById('statSales');

    if (statPending) statPending.textContent = stats.pending;
    if (statPreparing) statPreparing.textContent = stats.preparing;
    if (statDelivered) statDelivered.textContent = stats.delivered;
    if (statSales) statSales.textContent = `$${stats.total.toFixed(2)}`;
};

const loadAdminDashboard = async () => {
    try {
        const orders = await getOrders();
        updateDashboardStats(orders);
    } catch (error) {
        console.error('Error al cargar dashboard:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (checkSession() && isAdmin()) {
        loadAdminDashboard();
    }
});
