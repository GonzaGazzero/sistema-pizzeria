const API_URLS = {
    users: `https://691399ccf34a2ff1170c8f45.mockapi.io/Usuario`,
    menu:`https://691399ccf34a2ff1170c8f45.mockapi.io/Menu`,
    orders:`https://6913af22f34a2ff1170cdd9f.mockapi.io/orders`
}

// obtener datos
const obtenerDatos = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// enviar datos
const enviarDatos = async (url, data) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// actualizar datos
const actDatos = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// eliminar datos
const eliminarDatos = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Apis de usuarios
const getUsers = () => obtenerDatos(API_URLS.users);
const getUserById = (id) => obtenerDatos(`${API_URLS.users}/${id}`);
const postUser = (data) => enviarDatos(API_URLS.users, data);
const putUser = (id, data) => actDatos(`${API_URLS.users}/${id}`, data);
const deleteUser = (id) => eliminarDatos(`${API_URLS.users}/${id}`);

// apis de menu
const getMenu = () => obtenerDatos(API_URLS.menu);
const getMenuById = (id) => obtenerDatos(`${API_URLS.menu}/${id}`);
const postMenuItem = (data) => enviarDatos(API_URLS.menu, data);
const putMenuItem = (id, data) => actDatos(`${API_URLS.menu}/${id}`, data);
const deleteMenuItem = (id) => eliminarDatos(`${API_URLS.menu}/${id}`);

// apis de ordenes
const getOrders = async () => obtenerDatos(API_URLS.orders);
const getOrderById = async (orderId) => obtenerDatos(`${API_URLS.orders}/${orderId}`);

// Obtener pedidos de un usuario específico (filtrado en cliente)
const getOrdersByUserId = async (userId) => {
    const orders = await getOrders();
    if (!Array.isArray(orders)) {
        console.warn('getOrders no devolvió un array:', orders);
        return [];
    }
    return orders.filter(order => compareIds(order.userId, userId));
};

const createOrder = async (orderData) => enviarDatos(API_URLS.orders, orderData);
const updateOrder = async (orderId, orderData) => actDatos(`${API_URLS.orders}/${orderId}`, orderData);
const deleteOrder = async (orderId) => eliminarDatos(`${API_URLS.orders}/${orderId}`);