import axios from "axios";

// URLs de las API
const CREATE_CAR_API = "http://18.232.8.105:3000/api/vehicle/register";
const UPDATE_CAR_API = "http://52.203.50.226:3001/api/vehicle";
const DELETE_CAR_API = "http://23.21.100.227:3002/api/vehicle";
const GET_CAR_API = "http://3.226.178.228:3003/api/vehicle"; 
const GET_ALL_CARS_API = "http://3.226.178.228:3003/api/all/vehicles";

// Crear Carro
export const createCar = async (carData) => {
    try {
        const response = await axios.post(CREATE_CAR_API, carData);
        return response.data;
    } catch (error) {
        console.error("❌ Error al crear el Carro:", error);
        throw error;
    }
};

// Actualizar Carro
export const updateCar = async (id, carData) => {
    try {
        const response = await axios.put(`${UPDATE_CAR_API}/${id}`, carData);
        return response.data;
    } catch (error) {
        console.error("❌ Error al actualizar el Carro:", error);
        throw error;
    }
};

// Eliminar Carro
export const deleteCar = async (id) => {
    try {
        await axios.delete(`${DELETE_CAR_API}/${id}`);
        return { id };
    } catch (error) {
        console.error("❌ Error al eliminar el Carro:", error);
        throw error;
    }
};

// Obtener Carro
export const getCar = async (id) => {
    try {
        const response = await axios.get(`${GET_CAR_API}/${id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error al obtener el Carro:", error);
        throw error;
    }
};

// Obtener todos los carros
export const getAllCars = async () => {
    try {
        const response = await axios.get(GET_ALL_CARS_API);
        return response.data;
    } catch (error) {
        console.error("❌ Error obteniendo todos los Carros:", error);
        throw error;
    }
};
