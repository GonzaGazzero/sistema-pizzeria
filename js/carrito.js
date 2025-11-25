class carrito {
    constructor() {
        this.items = this.obtenerItems();
    }
    obtenerItems() {
        const items = localStorage.getItem('carritoItems');
        return items ? JSON.parse(items) : [];
    }

    guardarItems() {
        localStorage.setItem('carritoItems', JSON.stringify(this.items));
    }

    addItem(itemId) {
        const menuItem = window.menuItems?.find(item => String(item.id_menu) === String(itemId));
        if (!menuItem) {
            console.error('Item no encontrado. ItemId:', itemId);
            console.log('MenuItems disponibles:', window.menuItems);
            return;
        }
        
        const aggItem = this.items.find(item => String(item.id_menu) === String(itemId));
        if (aggItem) {
            aggItem.quantity++;
        } else {
            this.items.push({
                id_menu: menuItem.id_menu,
                nombre: menuItem.nombre,
                tipo: menuItem.tipo,
                precio: menuItem.precio,
                quantity: 1
            });
        }
        this.guardarItems();
        this.actualizarCarrito();
        alert('Producto agregado al carrito');
    }
    eliminarItem(itemId) {
        this.items = this.items.filter(item => String(item.id_menu) !== String(itemId));
        this.guardarItems();
        this.actualizarCarrito();
    }

    actCantidad(itemId, nuevaCantidad) {
        const item = this.items.find(item => String(item.id_menu) === String(itemId));
        if (item) {
            if (nuevaCantidad <= 0) {
                this.eliminarItem(itemId);
            } else {
                item.quantity = nuevaCantidad;
                this.guardarItems();
                this.actualizarCarrito();
            }
        }
    }

    calcularTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.precio * item.quantity);
        }, 0);
    }

    vaciarCarrito(){
        this.items = [];
        this.guardarItems();
        this.actualizarCarrito();
    }

    actualizarCarrito() {
        const carritoContainer = document.getElementById('cartItems');
        const carritoTotal = document.getElementById('cartTotal');
        if (!carritoContainer) return;
        
        if (this.items.length === 0) {
            carritoContainer.innerHTML = '<p>El carrito está vacío</p>';
            if (carritoTotal) carritoTotal.textContent = 'Total: $0.00';
            return;
        }
        
        carritoContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p class="item-type">${item.tipo}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="btn-quantity" onclick="carritoInstance.actCantidad('${item.id_menu}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-quantity" onclick="carritoInstance.actCantidad('${item.id_menu}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">
                    <p>$${(item.precio * item.quantity)}</p>
                </div>
                <button class="btn-remove" onclick="carritoInstance.eliminarItem('${item.id_menu}')">×</button>
            </div>
        `).join('');
        
        const total = this.calcularTotal();
        if (carritoTotal) carritoTotal.textContent = `Total: $${total}`;
    }

    async checkout(){
        const user = getActiveUser();
        if (this.items.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        const orderData = {
            userId: user.id_usuario,
            items: this.items,
            total: this.calcularTotal(),
            estado: 'pendiente',
            fecha: new Date().toISOString()
        }

        try {
            const order = await createOrder(orderData);
            const orderId = order.id;
            alert('Pedido realizado con éxito. Número de orden: ' + orderId);
            this.vaciarCarrito();
            showSection('userOrdersSection');
            cargarPedidosUsuario();
        } catch (error) {
            console.log('Error al realizar el pedido:', error);
            alert('Error al realizar el pedido. Intente nuevamente.');
        }
    }
}


const carritoInstance = new carrito();