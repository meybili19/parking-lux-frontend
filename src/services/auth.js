import axios from "axios";

const API_URL = "http://localhost:5009"; // Cambia según el backend

// ✅ Obtener perfil de usuario sin forzar autenticación
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("⚠️ No hay token, usando datos de prueba.");
            return {
                first_name: "Usuario",
                last_name: "Prueba",
                email: "test@example.com",
                phone_number: "123-456-7890"
            };
        }

        const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error obteniendo perfil:", error);
        return {
            first_name: "Usuario",
            last_name: "Prueba",
            email: "test@example.com",
            phone_number: "123-456-7890"
        };
    }
};
