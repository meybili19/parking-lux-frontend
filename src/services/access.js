import axios from "axios";

// URLs for entry and exit control APIs
const ENTRY_API_URL = "http://3.232.113.126:7000/entry";
const EXIT_API_URL = "http://3.211.81.157:7001/exit";

// Function to handle entry registration
export const entryControl = async (reservationId) => {
  try {
    const response = await axios.post(ENTRY_API_URL, {
      reservationId,
    });
    console.log("✅ Entry registered:", response.data);
  } catch (error) {
    console.error("❌ Error in entry control:", error.response?.data || error.message);
    throw error;
  }
};

// Function to handle exit registration
export const exitControl = async (vehicleId) => {
  try {
    const response = await axios.post(EXIT_API_URL, {
      vehicleId,
    });
    console.log("✅ Exit registered:", response.data);
  } catch (error) {
    console.error("❌ Error in exit control:", error.response?.data || error.message);
    throw error;
  }
};
