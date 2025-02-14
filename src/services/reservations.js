import axios from "axios";
import dayjs from "dayjs";

// 📌 URLs de los microservicios de reservas
const CREATE_RESERVATION_API = "http://54.146.206.135:4000/reservations";
const UPDATE_RESERVATION_API = "http://54.173.122.236:4001/reservations/update";
const DELETE_RESERVATION_API = "http://98.85.118.42:4002/reservations/delete";
const GRAPHQL_RESERVATIONS_API = "http://75.101.158.182:4003/reservation";
const VEHICLE_API = "http://3.226.178.228:3003/api/vehicle"; 
const PARKING_LOT_API = "http://34.196.247.137:7003/parkinglots";
//
// 🔍 Obtener todas las reservas (GraphQL)
//
export const getAllReservations = async () => {
    const query = {
        query: `
            query {
                getAllReservations {
                    id
                    userId
                    vehicleId
                    parkingLotId
                    startDate
                    endDate
                    status
                    totalAmount
                }
            }
        `
    };

    try {
        console.log("📡 Fetching reservations from GraphQL...");
        const response = await axios.post(GRAPHQL_RESERVATIONS_API, query, {
            headers: { "Content-Type": "application/json" },
        });

        let reservations = response.data.data?.getAllReservations ?? [];
        if (reservations.length === 0) {
            console.warn("⚠️ No reservations found in the database.");
            return [];
        }

        // Fetch vehicle and parking lot details for each reservation
        const promises = reservations.map(async (reservation) => {
            let vehicleData = null;
            let parkingLotData = null;

            try {
                if (reservation.vehicleId) {
                    const vehicleResponse = await axios.get(`${VEHICLE_API}/${reservation.vehicleId}`);
                    vehicleData = vehicleResponse.data ?? null;
                }
            } catch (error) {
                console.warn(`⚠️ Could not fetch vehicle data for ID: ${reservation.vehicleId}`);
            }

            try {
                if (reservation.parkingLotId) {
                    const parkingResponse = await axios.get(`${PARKING_LOT_API}/${reservation.parkingLotId}`);
                    parkingLotData = parkingResponse.data ?? null;
                }
            } catch (error) {
                console.warn(`⚠️ Could not fetch parking lot data for ID: ${reservation.parkingLotId}`);
            }

            return {
                ...reservation,
                vehicle: vehicleData || { brand: "Unknown", model: "Unknown", licensePlate: "N/A" },
                parkingLot: parkingLotData || { name: "Unknown", address: "N/A" }
            };
        });

        reservations = await Promise.all(promises);
        console.log("✅ Reservations with vehicle and parking lot data:", reservations);
        return reservations;
    } catch (error) {
        console.error("❌ Error fetching reservations:", error.response?.data || error.message);
        return [];
    }
};


export const createReservation = async (reservationData) => {
    try {
        console.log("📡 Enviando nueva reserva:", reservationData);

        // 🔹 Validaciones antes de enviar la solicitud
        if (!reservationData.vehicleId || !reservationData.parkingLotId || !reservationData.startDate || !reservationData.endDate) {
            throw new Error("❌ Todos los campos son obligatorios.");
        }

        if (isNaN(reservationData.vehicleId) || isNaN(reservationData.parkingLotId)) {
            throw new Error("❌ Los IDs del vehículo y parqueadero deben ser números.");
        }

        const startDate = new Date(reservationData.startDate);
        const endDate = new Date(reservationData.endDate);

        if (startDate >= endDate) {
            throw new Error("❌ La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        // 🔎 Validar existencia del vehículo
        let vehicleExists;
        try {
            await axios.get(`${VEHICLE_API}/${reservationData.vehicleId}`);
            vehicleExists = true;
        } catch (error) {
            vehicleExists = false;
        }
        if (!vehicleExists) {
            throw new Error(`❌ El vehículo con ID ${reservationData.vehicleId} no existe.`);
        }

        // 🔎 Validar existencia del parqueadero
        let parkingLotExists;
        try {
            await axios.get(`${PARKING_LOT_API}/${reservationData.parkingLotId}`);
            parkingLotExists = true;
        } catch (error) {
            parkingLotExists = false;
        }
        if (!parkingLotExists) {
            throw new Error(`❌ El parqueadero con ID ${reservationData.parkingLotId} no existe.`);
        }

        // 🔹 Formatear fechas en el formato esperado por el backend
        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
        const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");

        const payload = {
            car_id: parseInt(reservationData.vehicleId), 
            parking_lot_id: parseInt(reservationData.parkingLotId),
            start_date: formattedStartDate,
            end_date: formattedEndDate,
        };

        console.log("📡 Datos enviados al backend:", payload);

        const response = await axios.post(CREATE_RESERVATION_API, payload, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Reserva creada exitosamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error creando reserva:", error);
        throw error; // Lanza el error para que sea capturado en handleSaveReservation
    }
};
//
// 🔄 Editar una reserva (PUT)
//
export const updateReservation = async (id, reservationData) => {
    try {
        console.log("📡 Enviando actualización para reserva ID:", id);

        // 🔹 Formatear fechas en el formato esperado por el backend
        const formattedStartDate = dayjs(reservationData.startDate).format("YYYY-MM-DDTHH:mm:ss[Z]");
        const formattedEndDate = dayjs(reservationData.endDate).format("YYYY-MM-DDTHH:mm:ss[Z]");

        const payload = {
            id: id,
            car_id: reservationData.vehicleId ?? reservationData.car_id,
            parking_lot_id: reservationData.parkingLotId ?? reservationData.parking_lot_id,
            start_date: formattedStartDate,
            end_date: formattedEndDate
        };

        console.log("📡 Datos enviados en `PUT`:", payload);

        const response = await axios.put(UPDATE_RESERVATION_API, payload, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("✅ Reserva actualizada correctamente:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en `updateReservation`:", error.response?.data || error.message);
        throw error;
    }
};
//
// 🗑️ Eliminar una reserva (DELETE)
//
export const deleteReservation = async (id) => {
    try {
        console.log(`📡 Eliminando reserva con ID: ${id}`);
        await axios.delete(`${DELETE_RESERVATION_API}?id=${id}`, {
            headers: { "Content-Type": "application/json" },
        });
        console.log(`✅ Reserva ${id} eliminada correctamente.`);
        return id;
    } catch (error) {
        console.error("❌ Error eliminando reserva:", error.response?.data || error.message);
        throw error;
    }
};