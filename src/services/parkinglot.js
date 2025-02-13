import axios from "axios";

// 📌 Endpoints del microservicio de Parqueaderos
const CREATE_PARKINGLOT_API = "http://3.212.111.181:6000/parkinglots";
const UPDATE_PARKINGLOT_API = "http://44.195.136.238:6002/parkinglot/update";
const DELETE_PARKINGLOT_API = "http://44.209.8.164:6003/parkinglot/delete";
const GET_PARKINGLOT_API = "http://34.196.247.137:6001/all/parkinglots";

// 🔹 Obtener todos los parqueaderos
export const getParkingLots = async () => {
    try {
        const response = await axios.get(GET_PARKINGLOT_API, {
            headers: { "Accept": "application/json" },
        });
        console.log("📡 ParkingLots recibidos:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error obteniendo ParkingLots:", error.response?.data || error.message);
        throw error;
    }
};

// 🔹 Crear un parqueadero
export const createParkingLot = async (parkingLotData) => {
    try {
        console.log("📤 Enviando datos del parqueadero:", parkingLotData);

        const response = await axios.post(CREATE_PARKINGLOT_API, parkingLotData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            timeout: 10000 // Agregar un tiempo de espera
        });

        console.log("✅ Parqueadero creado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en createParkingLot:", error.response?.data || error.message);

        if (error.response) {
            console.error("🔴 Respuesta del servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("⚠️ No se recibió respuesta del servidor. Verifica que esté corriendo.");
        } else {
            console.error("❌ Error en la configuración de la solicitud:", error.message);
        }

        throw error;
    }
};


// 🔹 Actualizar un parqueadero
export const updateParkingLot = async (id, parkingLotData) => {
    try {
        console.log("📝 Actualizando parqueadero con ID:", id);

        const response = await axios.put(`${UPDATE_PARKINGLOT_API}/${id}`, parkingLotData, {
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
        });

        console.log("✅ Parqueadero actualizado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en updateParkingLot:", error.response?.data || error.message);
        throw error;
    }
};

// 🔹 Eliminar un parqueadero
export const deleteParkingLot = async (id) => {
    try {
        console.log(`🗑️ Intentando eliminar parqueadero con ID: ${id}`);

        const response = await axios.delete(`${DELETE_PARKINGLOT_API}/${id}`, {
            headers: { "Accept": "application/json" },
        });

        console.log("✅ Parqueadero eliminado correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en deleteParkingLot:", error.response?.data || error.message);
        throw error;
    }
};
