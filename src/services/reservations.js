import axios from "axios";

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
            try {
                let vehicleData = null;
                let parkingLotData = null;

                if (reservation.vehicleId) {
                    try {
                        const vehicleResponse = await axios.get(`${VEHICLE_API}/${reservation.vehicleId}`);
                        vehicleData = vehicleResponse.data;
                    } catch (error) {
                        if (error.response?.status === 404) {
                            console.warn(`⚠️ Vehículo con ID ${reservation.vehicleId} no encontrado.`);
                        } else {
                            console.error(`❌ Error obteniendo vehículo ID ${reservation.vehicleId}:`, error);
                        }
                    }
                }

                if (reservation.parkingLotId) {
                    try {
                        const parkingResponse = await axios.get(`${PARKING_LOT_API}/${reservation.parkingLotId}`);
                        parkingLotData = parkingResponse.data;
                    } catch (error) {
                        if (error.response?.status === 404) {
                            console.warn(`⚠️ Parqueadero con ID ${reservation.parkingLotId} no encontrado.`);
                        } else {
                            console.error(`❌ Error obteniendo parqueadero ID ${reservation.parkingLotId}:`, error);
                        }
                    }
                }

                return {
                    ...reservation,
                    vehicle: vehicleData, // 🚗 Datos del vehículo (si existen)
                    parkingLot: parkingLotData // 🏢 Datos del parqueadero (si existen)
                };
            } catch (error) {
                console.error(`❌ Error obteniendo datos adicionales para reserva ${reservation.id}:`, error);
                return { ...reservation, vehicle: null, parkingLot: null };
            }
        });

        reservations = await Promise.all(promises);
        console.log("✅ Reservas completadas con datos de vehículos y parqueaderos:", reservations);
        return reservations;
    } catch (error) {
        console.error("❌ Error obteniendo reservas desde GraphQL:", error.response?.data || error.message);
        throw error;
    }
};

//
// ✍️ Crear una nueva reserva (POST)
//
export const createReservation = async (reservationData) => {
    try {
        console.log("📡 Enviando nueva reserva:", reservationData);
        const response = await axios.post(CREATE_RESERVATION_API, {
            car_id: reservationData.vehicleId,
            parking_lot_id: reservationData.parkingLotId,
            start_date: reservationData.startDate,
            end_date: reservationData.endDate
        }, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Reserva creada:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error creando reserva:", error.response?.data || error.message);
        throw error;
    }
};

//
// 🔄 Editar una reserva (PUT)
//
export const updateReservation = async (id, reservationData) => {
    try {
        console.log("📡 Actualizando reserva ID:", id);
        const response = await axios.put(UPDATE_RESERVATION_API, {
            id: id,
            car_id: reservationData.vehicleId,
            parking_lot_id: reservationData.parkingLotId,
            start_date: reservationData.startDate,
            end_date: reservationData.endDate
        }, {
            headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Reserva actualizada:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error actualizando reserva:", error.response?.data || error.message);
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