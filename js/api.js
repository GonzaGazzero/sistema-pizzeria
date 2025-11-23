const API_URLS = {
    user: 'https://691399ccf34a2ff1170c8f45.mockapi.io/Usuario',
    menu : 'https://691399ccf34a2ff1170c8f45.mockapi.io/Menu',
    orders : 'https://6913af22f34a2ff1170cdd9f.mockapi.io/orders',
};

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('HTTP error! status: ${response.status}');
        return await await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('HTTP error! status: ${response.status}');
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

const putData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

const deleteData = async (url) => {
    try {
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) throw new Error('HTTP error! status: ${response.status}');
        return await response.json();
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};

const getUsers = () => fetchData(API_URLS.user);
const getUserById = (id) => fetchData(`${API_URLS.user}/${id}`);
const createUser = (userData) => postData(API_URLS.user, userData);
const updateUser = (id, userData) => putData(`${API_URLS.user}/${id}`, userData);
const deleteUser = (id) => deleteData(`${API_URLS.user}/${id}`);


const getMenu = () => fetchData(API_URLS.menu);
const getMenuItem = async (itemId) => fetchData(`${API_URLS.menu}/${itemId}`);
const createMenuItem = (itemData) => postData(API_URLS.menu, itemData);
const updateMenuItem = (itemId, itemData) => putData(`${API_URLS.menu}/${itemId}`, itemData);
const deleteMenuItem = (itemId) => deleteData(`${API_URLS.menu}/${itemId}`);


const getOrders = () => fetchData(API_URLS.orders);
const getOrderById = (orderId) => fetchData(`${API_URLS.orders}/${orderId}`);

const getOrderByUserId = async (userID) => {
    const orders = await getOrders();
    return orders.filter(order => String(order.userID) === String(userID));
};

const createOrder = async (orderData) => postData(API_URLS.orders, orderData);
const updateOrder = (orderId, orderData) => putData(`${API_URLS.orders}/${orderId}`, orderData);
const deleteOrder = (orderId) => deleteData(`${API_URLS.orders}/${orderId}`);