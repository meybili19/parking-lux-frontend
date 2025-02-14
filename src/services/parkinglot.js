import axios from "axios";

// 📌 Definición de endpoints con las nuevas IPs
const CREATE_PARKINGLOT_API = "http://3.212.111.181:7002/parkinglots";
const GET_PARKINGLOT_BY_ID_API = "http://34.196.247.137:7003/parkinglots";
const GET_ALL_PARKINGLOTS_API = "http://34.196.247.137:7003/all/parkinglots";
const UPDATE_PARKINGLOT_API = "http://44.195.136.238:7005/update";
const DELETE_PARKINGLOT_API = "http://44.209.8.164:7006/parkinglot/delete";

// 🏗️ Crear un parqueadero
export const createParkingLot = async (parkingLotData) => {
    try {
        const response = await axios.post(CREATE_PARKINGLOT_API, parkingLotData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });
        console.log("✅ Parking lot created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in createParkingLot:", error.response?.data || error.message);
        throw error;
    }
};


// 🔍 Obtener un parqueadero por ID
export const getParkingLotById = async (id) => {
    try {
        const response = await axios.get(`${GET_PARKINGLOT_BY_ID_API}/${id}`, {
            headers: { "Accept": "application/json" },
        });
        console.log("✅ Parking lot details:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in getParkingLotById:", error.response?.data || error.message);
        throw error;
    }
};

// 📋 Obtener todos los parqueaderos
export const getAllParkingLots = async () => {
    try {
        const response = await axios.get(GET_ALL_PARKINGLOTS_API);
        console.log("✅ All parking lots:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in getAllParkingLots:", error.response?.data || error.message);
        throw error;
    }
};

// 🔄 Actualizar un parqueadero
export const updateParkingLot = async (id, parkingLotData) => {
    try {
        const response = await axios.put(`${UPDATE_PARKINGLOT_API}/${id}`, parkingLotData, {
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
        });
        console.log("✅ Parking lot updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in updateParkingLot:", error.response?.data || error.message);
        throw error;
    }
};

// ❌ Eliminar un parqueadero
export const deleteParkingLot = async (id) => {
    try {
        const response = await axios.delete(`${DELETE_PARKINGLOT_API}/${id}`, {
            headers: { "Accept": "application/json" },
        });
        console.log("✅ Parking lot deleted:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in deleteParkingLot:", error.response?.data || error.message);
        throw error;
    }
};

