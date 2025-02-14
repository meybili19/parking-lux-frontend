import axios from "axios";

const READ_API = "http://52.3.1.74:5002/all/users";
const GET_USER_API = "http://52.3.1.74:5002/users";
const CREATE_API = "http://98.85.44.62:5000/users";
const UPDATE_API = "http://44.212.131.29:5001/users";
const DELETE_API = "http://34.196.106.116:5003/users";

// 🔹 Obtener lista de Users desde la API REST
export const getUsers = async () => {
    try {
        const res = await fetch(READ_API); // ✅ Endpoint correcto de REST API
        const data = await res.json(); // 🔹 Convertir la respuesta a JSON
        console.log("📡 Users recibidos:", data);
        return data; // ✅ La API ya devuelve un array de Users
    } catch (error) {
        console.error("❌ Error obteniendo Users:", error);
        throw error;
    }
};
// 🔹 Obtener usuario por ID
export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${GET_USER_API}/${id}`);
        console.log("✅ Usuario encontrado:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener usuario por ID:", error);
        throw error;
    }
};

// 🔹 Crear un User
export const createUser = async (userData) => {
    try {
        console.log("📤 Enviando datos del usuario:", userData);

        const response = await axios.post(CREATE_API, userData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json" // ✅ Asegurar compatibilidad con la API
            }
        });

        console.log("✅ Usuario creado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en createUser:", error.response?.data || error.message);
        throw error;
    }
};


// 🔹 Actualizar usuario con validaciones del backend
export const updateUser = async (userData) => {
    try {
        console.log("🔍 Actualizando usuario con ID:", userData.id);

        // 🔹 Eliminar "password" si está vacío o indefinido antes de enviarlo
        if (!userData.password) delete userData.password;

        const response = await axios.put(`${UPDATE_API}/${userData.id}`, userData, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Usuario actualizado:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error.response?.data || error.message);
        throw error;
    }
};



// 🔹 Eliminar User
export const deleteUser = async (id) => {
    try {
        console.log(`🗑️ Intentando eliminar usuario con ID: ${id}`);
        const response = await axios.delete(`${DELETE_API}/${id}`);
        console.log("✅ Usuario eliminado:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en deleteUser:", error.response?.data || error.message);
        if (error.response) {
            console.error("🔴 Respuesta del servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("⚠️ No se recibió respuesta del servidor:", error.request);
        } else {
            console.error("❌ Error al configurar la solicitud:", error.message);
        }
        throw error;
    }
};

