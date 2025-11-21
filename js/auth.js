// login (autenticar usuario con mail y contraseña)

const login = async (email, password) => {
    try {
        const users = await getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            return { success: true, user };
        } else {
            return { success: false, message: 'email o contraseña incorrectos' };
        }
    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        return { success: false, message: 'Error al iniciar sesion' };
    }
}

// registrar usuario nuevo (por defecto tendra rol usuario)
const register = async (userData) => {
    try {
        const users = await getUsers();
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return {
                success: false,
                message: 'El mail ya posee un usuario asociado'
            }
        }
        const newUser ={
            ...userData,
            role: 'USER'
        };

        const crearUser = await postUser(newUser);
        return {
            success: true,
            user: crearUser
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return { success: false, message: 'Error al registrar usuario' };
    }
}

// cerrar sesion 
const logout = () => {
    sessionStorage.removeItem('user');
    // borrar carrito del local storage
    window.location.href = '/'
}

// comprobar que no haya sesion activa
const checkSession = () => {
    return sessionStorage.getItem('user') !== null;
}

// obtener usuario activo

const getActiveUser = () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// verificar roles de usuario

// verificar si el usuario es admin
const isAdmin = () => {
    const user = getActiveUser();
    return user && user.role === 'ADMIN';
}

const isUser =() => {
    const user = getActiveUser();
    return user && user.role === 'USER';
}

// redirigir si no esta logueado
const redirectNotLog = () => {
    if (!checkSession()) {
        window.location.href = '/';
        return false
    }
    return true
}