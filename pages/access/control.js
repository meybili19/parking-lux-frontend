import { useState, useEffect } from "react";
import { entryControl, exitControl, getReservationById } from "../../src/services/access";
import "bootstrap/dist/css/bootstrap.min.css";

const EntryControl = () => {
  const [reservationId, setReservationId] = useState("");
  const [reservationDetails, setReservationDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 10000); // Borra los mensajes después de 10 segundos

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const fetchReservationDetails = async () => {
    if (!reservationId) {
      setErrorMessage("⚠️ Please enter a valid Reservation ID.");
      return;
    }

    try {
      setErrorMessage("");
      const reservation = await getReservationById(reservationId);
      setReservationDetails(reservation);
      setSuccessMessage(""); // Reset success message
    } catch (error) {
      setReservationDetails(null);
      setErrorMessage("❌ Reservation not found.");
    }
  };

  const handleEntry = async () => {
    if (!reservationDetails) {
      setErrorMessage("⚠️ Please check the reservation before registering the entry.");
      return;
    }

    try {
      await entryControl(reservationId);
      setSuccessMessage(
        `✅ Welcome ${reservationDetails.user.name}! Your vehicle ${reservationDetails.vehicle.brand} - ${reservationDetails.vehicle.licensePlate} has been registered successfully.`
      );
      setErrorMessage("");
      setReservationDetails(null);
      setReservationId("");
    } catch (error) {
      console.error("❌ Error registering entry:", error);
      setErrorMessage("❌ Error registering entry.");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="text-primary">🚗 Entry Control</h4>
      <input
        type="number"
        className="form-control mb-3"
        placeholder="Enter Reservation ID"
        value={reservationId}
        onChange={(e) => setReservationId(e.target.value)}
      />
      <button className="btn btn-info mb-3" onClick={fetchReservationDetails}>
        🔍 Check Reservation
      </button>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {reservationDetails && (
        <div className="alert alert-success">
          <h5>✅ Reservation Found</h5>
          <p><strong>User:</strong> {reservationDetails.user.name} ({reservationDetails.user.email})</p>
          <p><strong>Vehicle:</strong> {reservationDetails.vehicle.brand} - {reservationDetails.vehicle.licensePlate}</p>
        </div>
      )}
      <button className="btn btn-success" onClick={handleEntry} disabled={!reservationDetails}>
        ✅ Register Entry
      </button>
    </div>
  );
};

const ExitControl = () => {
  const [vehicleId, setVehicleId] = useState("");
  const [exitDetails, setExitDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 10000); // Borra los mensajes después de 10 segundos

      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const handleExit = async () => {
    if (!vehicleId) {
      setErrorMessage("⚠️ Please enter a Vehicle ID.");
      return;
    }

    console.log("📡 Attempting to register exit for Vehicle ID:", vehicleId);

    try {
      const response = await exitControl(vehicleId);
      console.log("✅ Exit registered successfully:", response);

      setSuccessMessage(`✅ Vehicle with ID ${vehicleId} has successfully exited the parking lot.`);
      setExitDetails(response);
      setErrorMessage("");
      setVehicleId(""); // Reset input after success
    } catch (error) {
      console.error("❌ Error registering exit:", error);

      if (error.response && error.response.status === 404) {
        setErrorMessage("❌ No active entry record found for this vehicle.");
      } else {
        setErrorMessage("❌ Error registering exit. Please try again.");
      }
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="text-danger">🚗 Exit Control</h4>
      <input
        type="number"
        className="form-control mb-3"
        placeholder="Enter Vehicle ID"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      />
      <button className="btn btn-danger mb-3" onClick={handleExit}>
        🚗 Register Exit
      </button>

      {/* Mensajes de error y éxito en formato Bootstrap */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {exitDetails && (
        <div className="alert alert-success">
          <h5>✅ Exit Registered</h5>
          <p><strong>Vehicle ID:</strong> {exitDetails.vehicleId}</p>
          <p><strong>Exit Time:</strong> {exitDetails.exitTime}</p>
        </div>
      )}
    </div>
  );
};


export default function ControlPage() {
  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center">🚗 Parking Access Control</h2>
      <div className="row">
        <div className="col-md-6">
          <EntryControl />
        </div>
        <div className="col-md-6">
          <ExitControl />
        </div>
      </div>
    </div>
  );
}
