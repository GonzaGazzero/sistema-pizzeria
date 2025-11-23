const createElement = (tag, className = '', innerHTML = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
};

const showNotification = (message, type = 'success') => {
    const notification = createElement('div', `notification notification-${type}`, message);
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
};

const showModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
};

const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
};