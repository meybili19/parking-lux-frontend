import { useState } from "react";
import { entryControl, exitControl } from "../../src/services/access";
import "bootstrap/dist/css/bootstrap.min.css";

const EntryControl = () => {
  const [reservationId, setReservationId] = useState("");

  const handleEntry = async () => {
    try {
      await entryControl(reservationId);
      alert("Entry registered successfully!");
    } catch (error) {
      alert("Error registering entry.");
      console.error("❌ Error registering entry:", error);
    }
  };

  return (
    <div>
      <h4>Entry Control</h4>
      <input
        type="number"
        className="form-control mb-3"
        placeholder="Enter Reservation ID"
        value={reservationId}
        onChange={(e) => setReservationId(e.target.value)}
      />
      <button className="btn btn-success" onClick={handleEntry}>
        Register Entry
      </button>
    </div>
  );
};

const ExitControl = () => {
  const [vehicleId, setVehicleId] = useState("");

  const handleExit = async () => {
    try {
      await exitControl(vehicleId);
      alert("Exit registered successfully!");
    } catch (error) {
      alert("Error registering exit.");
      console.error("❌ Error registering exit:", error);
    }
  };

  return (
    <div>
      <h4>Exit Control</h4>
      <input
        type="number"
        className="form-control mb-3"
        placeholder="Enter Vehicle ID"
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      />
      <button className="btn btn-danger" onClick={handleExit}>
        Register Exit
      </button>
    </div>
  );
};

export default function ControlPage() {
  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center">🚗 Control de Acceso al Parqueadero</h2>
      <div className="row">
        {/* Left Column: Entry Control */}
        <div className="col-md-6">
          <EntryControl />
        </div>

        {/* Right Column: Exit Control */}
        <div className="col-md-6">
          <ExitControl />
        </div>
      </div>
    </div>
  );
}
