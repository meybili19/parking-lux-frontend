import axios from "axios";

const READ_API = "http://52.3.1.74:5002/all/users";
const CREATE_API = "http://98.85.44.62:5000/users";
const UPDATE_API = "http://44.212.131.29:5001/users";
const DELETE_API = "http://34.196.106.116/users";

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



// 🔹 Crear un User
export const createUser = async (UserData) => {
    try {
        const response = await axios.post(CREATE_API, UserData);
        return response.data;
    } catch (error) {
        console.error("❌ Error al agregar User:", error);
        throw error;
    }
};

// 🔹 Actualizar User
export const updateUser = async (UserData) => {
    try {
        console.log("🔍 Actualizando User con ID:", UserData.id);
        const response = await axios.put(`${UPDATE_API}/${UserData.id}`, UserData);
        return response.data;
    } catch (error) {
        console.error("❌ Error al actualizar User:", error);
        throw error;
    }
};


// 🔹 Eliminar User
export const deleteUser = async (id) => {
    try {
        await axios.delete(`${DELETE_API}/${id}`);
        return { id };
    } catch (error) {
        console.error("❌ Error al eliminar User:", error);
        throw error;
    }
};

