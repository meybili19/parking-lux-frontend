import axios from "axios";

const READ_API = "http://localhost:5002/all/users";
const CREATE_API = "http://localhost:5000/users";
const UPDATE_API = "http://localhost:5001/users";
const DELETE_API = "http://localhost:5003/users";

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

