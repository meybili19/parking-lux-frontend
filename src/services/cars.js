import axios from "axios";

const CREATE_CAR_API = "http://18.232.8.105:3000/api/vehicle/register";
const UPDATE_CAR_API = "http://52.203.50.226:3001/api/vehicle";
const DELETE_CAR_API = "http://23.21.100.227:3002/api/vehicle";
const GET_CAR_API = "http://3.226.178.228:3003/api/vehicle"; 
const GET_ALL_CARS_API = "http://3.226.178.228:3003/api/all/vehicles";

export const createCar = async (carData) => {
    try {
        const response = await axios.post(CREATE_CAR_API, carData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json", 
            },
        });
        console.log("✅ Car created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in createCar:", error.response?.data || error.message);
        throw error;
    }
};

export const updateCar = async (id, carData) => {
    try {
        const response = await axios.put(`${UPDATE_CAR_API}/${id}`, carData);
        console.log("✅ Car updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in updateCar:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteCar = async (id) => {
    try {
        const response = await axios.delete(`${DELETE_CAR_API}/${id}`);
        console.log("✅ Car deleted:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in deleteCar:", error.response?.data || error.message);
        throw error;
    }
};

export const getCar = async (id) => {
    try {
        const response = await axios.get(`${GET_CAR_API}/${id}`);
        console.log("✅ Car details:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in getCar:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllCars = async () => {
    try {
        const response = await axios.get(GET_ALL_CARS_API);
        console.log("✅ All cars:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error in getAllCars:", error.response?.data || error.message);
        throw error;
    }
};
