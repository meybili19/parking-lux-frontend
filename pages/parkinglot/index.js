import { useEffect, useState } from "react";
import { getParkingLots, createParkingLot, updateParkingLot, deleteParkingLot } from "../../src/services/parkinglot";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ParkingLotPage() {
    const [parkingLots, setParkingLots] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newParkingLot, setNewParkingLot] = useState({ name: "", address: "", total_space: "" });
    const [editingParkingLot, setEditingParkingLot] = useState(null);
    const [deletingParkingLot, setDeletingParkingLot] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // 📌 Cargar la lista de parqueaderos
    const fetchParkingLots = async () => {
        try {
            const response = await getParkingLots();
            setParkingLots(response);
        } catch (error) {
            setErrorMessage("❌ Error al cargar la lista de parqueaderos.");
        }
    };

    useEffect(() => {
        fetchParkingLots();
    }, []);

    // 📌 Guardar un nuevo parqueadero
    const handleSaveParkingLot = async () => {
        if (!newParkingLot.name || !newParkingLot.address || !newParkingLot.total_space) {
            setErrorMessage("❌ Todos los campos son obligatorios.");
            return;
        }

        setErrorMessage("");

        try {
            await createParkingLot(newParkingLot);
            setShowModal(false);
            fetchParkingLots();
            setSuccessMessage("✅ Parqueadero agregado correctamente.");
        } catch (error) {
            setErrorMessage("❌ Hubo un error al agregar el parqueadero.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Parqueaderos</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Buscar parqueadero..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Parqueadero</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Espacios Totales</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parkingLots.map(parkingLot => (
                                    <tr key={parkingLot.id}>
                                        <td>{parkingLot.id}</td>
                                        <td>{parkingLot.name}</td>
                                        <td>{parkingLot.address}</td>
                                        <td>{parkingLot.total_space}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm">✏️ Editar</button>
                                            <button className="btn btn-danger btn-sm">🗑️ Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
