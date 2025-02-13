import axios from "axios";

// 📌 Configurar las URLs de los microservicios desde variables de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_PARKING_API || "http://3.212.111.181:6000";
const CREATE_PARKINGLOT_API = `${API_BASE_URL}/parkinglots`;
const UPDATE_PARKINGLOT_API = "http://44.195.136.238:6002/parkinglot/update";
const DELETE_PARKINGLOT_API = "http://44.209.8.164:6003/parkinglot/delete";
const GET_PARKINGLOT_API = "http://34.196.247.137:6001/all/parkinglots";

// 🏢 Obtener todos los parqueaderos
export const getParkingLots = async () => {
    try {
        const response = await axios.get(GET_PARKINGLOT_API, {
            headers: { "Accept": "application/json" },
            timeout: 10000, // Agregar timeout de 10s
        });
        console.log("📡 ParkingLots recibidos:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error obteniendo ParkingLots:", error.message);
        throw new Error("No se pudo obtener la lista de parqueaderos. Verifica la conexión.");
    }
};

// 🏗️ Crear un parqueadero
export const createParkingLot = async (parkingLotData) => {
    try {
        console.log("📤 Enviando datos del parqueadero:", parkingLotData);

        const response = await axios.post(CREATE_PARKINGLOT_API, parkingLotData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            withCredentials: true, // Evita bloqueos de CORS en AWS
            timeout: 10000,
        });

        console.log("✅ Parqueadero creado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en createParkingLot:", error.message);

        if (error.response) {
            console.error("🔴 Respuesta del servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("⚠️ No se recibió respuesta del servidor. Verifica que esté corriendo.");
        } else {
            console.error("❌ Error en la configuración de la solicitud:", error.message);
        }

        throw new Error("No se pudo crear el parqueadero. Verifica la conexión y el servidor.");
    }
};

// 🔄 Actualizar un parqueadero
export const updateParkingLot = async (id, parkingLotData) => {
    try {
        console.log("📝 Actualizando parqueadero con ID:", id);

        const response = await axios.put(`${UPDATE_PARKINGLOT_API}/${id}`, parkingLotData, {
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            timeout: 10000,
        });

        console.log("✅ Parqueadero actualizado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en updateParkingLot:", error.message);
        throw new Error("No se pudo actualizar el parqueadero. Verifica la conexión.");
    }
};

// ❌ Eliminar un parqueadero
export const deleteParkingLot = async (id) => {
    try {
        console.log(`🗑️ Intentando eliminar parqueadero con ID: ${id}`);

        const response = await axios.delete(`${DELETE_PARKINGLOT_API}/${id}`, {
            headers: { "Accept": "application/json" },
            timeout: 10000,
        });

        console.log("✅ Parqueadero eliminado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en deleteParkingLot:", error.message);
        throw new Error("No se pudo eliminar el parqueadero. Verifica la conexión.");
    }
};
