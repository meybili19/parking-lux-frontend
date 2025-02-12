import axios from "axios";

const API_URL = "http://localhost:5009"; // Reemplaza con el puerto de AuthService

// ✅ Iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem("token", response.data.token); // Guardar token
        return response.data;
    } catch (error) {
        console.error("❌ Error en login:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Obtener los datos del usuario autenticado
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible");

        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error obteniendo perfil:", error.response?.data || error.message);
        throw error;
    }
};

// ✅ Cerrar sesión
export const logout = () => {
    localStorage.removeItem("token");
};
