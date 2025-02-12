import axios from "axios";

const READ_API = "http://localhost:8082/customers";
const CREATE_API = "http://localhost:8081/customers";
const UPDATE_API = "http://localhost:8083/customers";
const DELETE_API = "http://localhost:8084/customers";

// 🔹 Obtener lista de clientes desde la API REST
export const getCustomers = async () => {
    try {
        const res = await fetch("http://localhost:8082/customers"); // ✅ Endpoint correcto de REST API
        const data = await res.json(); // 🔹 Convertir la respuesta a JSON
        console.log("📡 Clientes recibidos:", data);
        return data; // ✅ La API ya devuelve un array de clientes
    } catch (error) {
        console.error("❌ Error obteniendo clientes:", error);
        throw error;
    }
};



// 🔹 Crear un cliente
export const createCustomer = async (customerData) => {
    try {
        const response = await axios.post(CREATE_API, customerData);
        return response.data;
    } catch (error) {
        console.error("❌ Error al agregar cliente:", error);
        throw error;
    }
};

// 🔹 Actualizar cliente
export const updateCustomer = async (customerData) => {
    try {
        console.log("🔍 Actualizando cliente con ID:", customerData.id);
        const response = await axios.put(`${UPDATE_API}/${customerData.id}`, customerData);
        return response.data;
    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);
        throw error;
    }
};


// 🔹 Eliminar cliente
export const deleteCustomer = async (id) => {
    try {
        await axios.delete(`${DELETE_API}/${id}`);
        return { id };
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        throw error;
    }
};

