import axios from "axios";

// API URLs
const ENTRY_API_URL = "http://3.232.113.126:7000/entry";
const EXIT_API_URL = "http://3.211.81.157:7001/exit";
const RESERVATION_API_URL = "http://75.101.158.182:4003/reservation";
const USER_API_URL = "http://52.3.1.74:5002/users";
const VEHICLE_API_URL = "http://3.226.178.228:3003/api/vehicle";

// Function to get reservation details
export const getReservationById = async (reservationId) => {
  try {
    const query = {
      query: `
        query {
          getReservationById(id: ${reservationId}) {
            id
            userId
            vehicleId
            parkingLotId
            status
          }
        }
      `,
    };

    console.log(`📡 Fetching reservation ${reservationId} from API...`);
    const response = await axios.post(RESERVATION_API_URL, query, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data || !response.data.data || !response.data.data.getReservationById) {
      throw new Error("❌ Reservation not found.");
    }

    const reservation = response.data.data.getReservationById;

    // Fetch user details
    const userResponse = await axios.get(`${USER_API_URL}/${reservation.userId}`);
    reservation.user = userResponse.data;

    // Fetch vehicle details
    const vehicleResponse = await axios.get(`${VEHICLE_API_URL}/${reservation.vehicleId}`);
    reservation.vehicle = vehicleResponse.data;

    console.log("✅ Reservation details:", reservation);
    return reservation;
  } catch (error) {
    console.error("❌ Error fetching reservation:", error.response?.data || error.message);
    throw error;
  }
};

// Function to handle entry registration
export const entryControl = async (reservationId) => {
  try {
    console.log("📡 Sending request to ENTRY_API_URL:", ENTRY_API_URL);
    console.log("📝 Payload:", { reservationId });

    const response = await axios.post(ENTRY_API_URL, { reservationId });

    console.log("✅ Entry registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error in entry control:", error.response?.data || error.message);
    
    if (error.response) {
      console.error("❌ Server response:", error.response.data);
    }

    throw error;
  }
};


// Function to handle exit registration
export const exitControl = async (vehicleId) => {
  try {
    const response = await axios.post(EXIT_API_URL, { vehicleId });
    console.log("✅ Exit registered:", response.data);
  } catch (error) {
    console.error("❌ Error in exit control:", error.response?.data || error.message);
    throw error;
  }
};
