const login = (username, password) => {
    try {
        const users = await getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        } else {
            return { success: false, message: 'Email o contraseña incorrectos' };
        }
    } catch (error) {
        console.error('Error al iniciar sesion:', error);
        return { success: false, message: 'Error del servidor. Inténtalo de nuevo más tarde.' };
    }
};

const register = async (userData) => {
    try {
        const users = await getUsers();
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'El correo electrónico ya está en uso' };
        }

        const newUser ={
            nombre: userData.nombre,
            email: userData.email,
            password: userData.password,
            role: 'USER'
        };

        const createdUser = await createUser(newUser);
        return { success: true, user: createdUser };
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return { success: false, message: 'Error del servidor. Inténtalo de nuevo más tarde.' };
    }   
};

const logout = () => {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
};

const isLoggedIn = () => {
    return sessionStorage.getItem('currentUser') !== null;
};

const getCurentUser = () => {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

const isAdmin = () => {
    const user = getCurentUser();
    return user && user.role === 'ADMIN';
};

const isUser = () => {
    const user = getCurentUser();
    return user && user.role === 'USER';
};


const changePassword = async (email, newPassword, currentUser = null) => {
    try {
        const currentUser = getCurrentUser();

        if (!isAdmin() && currentPassword) {
            return { success: false, message: 'Solo los administradores pueden cambiar la contraseña de otros usuarios' };
        }

        if (!isAdmin() && currentPassword) {
            const users = await getUserById(userId);
            if (user.password !== currentPassword) {
                return { success: false, message: 'La contraseña actual es incorrecta' };
            }
        }

        const user = await getUserByID(userId);
        user.password = newPassword;
        const updatedUser = await updateUser(userId, user);

        if (currentUser === userId) {
            seccionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        return { seccess: true, message: 'Contraseña actualizada correctamente' };
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return { success: false, message: 'Error del servidor. Inténtalo de nuevo más tarde.' };
    }


    const createUserByAdmin = async (userData) => {
    try {
        if (!isAdmin()) {
            return { success: false, message: 'Solo los administradores pueden crear nuevos usuarios' };
        }

        const users = await getUsers();
        const existingUser = users.find(u => u.email === userData.email);

        if (existingUser) {
            return { success: false, message: 'El correo electrónico ya está en uso' };
        }

        const newUser = await createUser(userData);
        return { success: true, user: newUser };

    } catch (error) {
        console.error('Error al crear usuario por admin:', error);
        return { success: false, message: 'Error del servidor. Inténtalo de nuevo más tarde.' };
    }
};};

const requireAuth = () => {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true
};


const requireAdmin = () => {
    if (!isLoggedIn() || !isAdmin()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
};

