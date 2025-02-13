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
        console.log("📡 Consultando reservas desde GraphQL...");
        const response = await axios.post(GRAPHQL_RESERVATIONS_API, query, {
            headers: { "Content-Type": "application/json" },
        });

        let reservations = response.data.data.getAllReservations;

        // 🔄 Obtener datos de vehículos y parqueaderos para cada reserva
        const promises = reservations.map(async (reservation) => {
            let vehicleData = null;
            let parkingLotData = null;

            if (reservation.vehicleId) {
                try {
                    const vehicleResponse = await axios.get(`${VEHICLE_API}/${reservation.vehicleId}`);
                    vehicleData = vehicleResponse.data;
                } catch (error) {
                    console.warn(`⚠️ No se pudo obtener información del vehículo ${reservation.vehicleId}.`);
                }
            }

            if (reservation.parkingLotId) {
                try {
                    const parkingResponse = await axios.get(`${PARKING_LOT_API}/${reservation.parkingLotId}`);
                    parkingLotData = parkingResponse.data;
                } catch (error) {
                    console.warn(`⚠️ No se pudo obtener información del parqueadero ${reservation.parkingLotId}.`);
                }
            }

            return {
                ...reservation,
                vehicle: vehicleData, // 🚗 Datos del vehículo
                parkingLot: parkingLotData // 🏢 Datos del parqueadero
            };
        });

        reservations = await Promise.all(promises);
        console.log("✅ Reservas completadas con datos de vehículos y parqueaderos:", reservations);
        return reservations;
    } catch (error) {
        console.error("❌ Error obteniendo reservas desde GraphQL:", error.response?.data || error.message);
        return []; // Evita que el frontend se rompa
    }
};

//
// ✍️ Crear una nueva reserva (POST)
//
export const createReservation = async (reservationData) => {
    try {
        console.log("📡 Enviando nueva reserva:", reservationData);

        // 🔹 Formatear fechas en el formato esperado por el backend
        const formattedStartDate = dayjs(reservationData.startDate).format("YYYY-MM-DD HH:mm:ss");
        const formattedEndDate = dayjs(reservationData.endDate).format("YYYY-MM-DD HH:mm:ss");

        const payload = {
            car_id: parseInt(reservationData.vehicleId),  // Convertimos a número
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

        if (error.response) {
            console.error("❌ Respuesta del servidor:", error.response.data);
            throw new Error(`❌ Error del servidor: ${error.response.data.message || "Error desconocido"}`);
        } else if (error.request) {
            console.error("❌ No hubo respuesta del servidor.");
            throw new Error("❌ No se pudo conectar al servidor. Verifica la URL o si el servicio está corriendo.");
        } else {
            console.error("❌ Error en la configuración de la solicitud.");
            throw new Error("❌ Error inesperado al procesar la reserva.");
        }
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