import { useEffect, useState } from "react";
import { getAllParkingLots, createParkingLot, updateParkingLot, deleteParkingLot, getParkingLotById } from "../../src/services/parkinglot";

import "bootstrap/dist/css/bootstrap.min.css";

export default function ParkingLotsPage() {
    const [parkingLots, setParkingLots] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newParkingLot, setNewParkingLot] = useState({ name: "", location: "", capacity: "" });
    const [editingParkingLot, setEditingParkingLot] = useState(null);
    const [deletingParkingLot, setDeletingParkingLot] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const fetchParkingLots = async () => {
        try {
            const response = await getAllParkingLots();
            console.log("📡 Parking Lots received:", response);

            // ✅ Aseguramos que TODOS los campos estén bien asignados
            const formattedParkingLots = response.map(lot => ({
                id: lot.id || "N/A",
                name: lot.name || "N/A",
                address: lot.address || "No Address", // 🛠️ Si no hay dirección, poner "No Address"
                total_space: lot.total_space !== undefined ? lot.total_space : "N/A",
                capacity: lot.capacity !== undefined ? lot.capacity : "N/A",
            }));

            setParkingLots(formattedParkingLots);
        } catch (error) {
            console.error("❌ Error loading parking lots:", error);
        }
    };
    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);


    useEffect(() => {
        fetchParkingLots();
    }, []);

    // 📌 Filter parking lots
    // 📌 Filter parking lots
    const filteredParkingLots = parkingLots.filter(lot =>
        (lot.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (lot.location?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (lot.capacity?.toString().toLowerCase() || "").includes(search.toLowerCase()) // 🔹 Agregamos búsqueda por capacity
    );


    // 📌 Save new parking lot
    const handleSaveParkingLot = async () => {
        if (!newParkingLot.name || !newParkingLot.location || !newParkingLot.capacity) {
            setErrorMessage("❌ All fields are required.");
            return;
        }

        setErrorMessage("");

        // 🔹 Mapeamos los nombres de los campos correctamente
        const formattedParkingLot = {
            name: newParkingLot.name,
            address: newParkingLot.location, // Backend espera "address", no "location"
            total_space: parseInt(newParkingLot.capacity, 10) // Cambiamos "capacity" a "total_space"
        };

        try {
            const created = await createParkingLot(formattedParkingLot);
            setParkingLots([...parkingLots, created]);
            setShowModal(false);
            setNewParkingLot({ name: "", location: "", capacity: "" });
            showMessage("✅ Parking lot added successfully");
            fetchParkingLots();
        } catch (error) {
            console.error("❌ Error adding parking lot:", error);
        }
    };

    // 📌 Edit parking lot
    const handleEditParkingLot = (lot) => {
        setEditingParkingLot({
            id: lot.id,
            name: lot.name,
            address: lot.address, // 🏗️ El backend espera "address"
            total_space: lot.total_space, // 🏗️ El backend espera "total_space"
        });
        setShowEditModal(true);
    };


    // 📌 Update parking lot
    // 📌 Update parking lot
    const handleUpdateParkingLot = async () => {
        try {
            if (!editingParkingLot.id) {
                console.error("❌ No parking lot ID to update.");
                return;
            }

            // 🔹 Mapeamos los nombres de los campos correctamente
            const formattedParkingLot = {
                name: editingParkingLot.name,
                address: editingParkingLot.address, // 🏗️ El backend espera "address"
                total_space: parseInt(editingParkingLot.total_space, 10) // 🏗️ El backend espera "total_space"
            };

            await updateParkingLot(editingParkingLot.id, formattedParkingLot);
            setShowEditModal(false);
            setEditingParkingLot(null);
            showMessage("✅ Parking lot updated successfully");
            fetchParkingLots();
        } catch (error) {
            console.error("❌ Error updating parking lot:", error);
        }
    };


    // 📌 Delete parking lot
    // 📌 Delete parking lot
    const handleDeleteParkingLot = async (lot) => {
        try {
            // 🔹 Consultamos los detalles del parqueadero antes de eliminar
            const parkingLotDetails = await getParkingLotById(lot.id);

            if (parkingLotDetails) {
                setDeletingParkingLot({
                    id: parkingLotDetails.id,
                    name: parkingLotDetails.name,
                    address: parkingLotDetails.address,
                    total_space: parkingLotDetails.total_space,
                    capacity: parkingLotDetails.capacity,
                    occupied_spaces: parkingLotDetails.total_space - parkingLotDetails.capacity, // 🚗 Espacios ocupados
                });

                setShowDeleteModal(true);
            } else {
                setErrorMessage("❌ Parking lot not found.");
            }
        } catch (error) {
            console.error("❌ Error fetching parking lot details:", error);
            setErrorMessage("❌ Error fetching parking lot details.");
        }
    };

    const confirmDeleteParkingLot = async () => {
        try {
            if (!deletingParkingLot.id) {
                console.error("❌ No parking lot ID to delete.");
                return;
            }
    
            // 🚨 Evitar la eliminación si hay autos estacionados
            if (deletingParkingLot.occupied_spaces > 0) {
                setShowDeleteModal(false); // 🔹 Cierra el modal antes de mostrar el mensaje
                setTimeout(() => {
                    showMessage(`🚨 Cannot delete! There are ${deletingParkingLot.occupied_spaces} cars parked.`, "error");
                }, 300);
                return;
            }
    
            // 🔹 Cierra el modal antes de eliminar
            setShowDeleteModal(false);
            setDeletingParkingLot(null);
    
            await deleteParkingLot(deletingParkingLot.id);
    
            // 🔄 Recargar la lista de parqueaderos
            fetchParkingLots();
    
            setTimeout(() => {
                showMessage("✅ Parking lot deleted successfully", "success");
            }, 300);
        } catch (error) {
            console.error("❌ Error deleting parking lot:", error);
    
            setShowDeleteModal(false); // 🔹 Cerrar modal antes del mensaje de error
    
            setTimeout(() => {
                showMessage(`❌ Error deleting parking lot: ${error.response?.data?.message || error.message}`, "error");
            }, 300);
        }
    };
    


    // 📌 Show message temporarily
    const showMessage = (message, type = "success") => {
        if (type === "success") {
            setSuccessMessage(message);
        } else {
            setErrorMessage(message);
        }

        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000); // 🔹 El mensaje desaparece después de 3 segundos
    };


    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Parking Lot List</h2>
                </div>

                <div className="card-body">
                    {/* 📢 Success message */}
                    {successMessage && <div className="alert alert-success text-center fw-bold">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger text-center fw-bold">{errorMessage}</div>}

                    {/* Search and Add button */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Search Parking Lot..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add Parking Lot</button>
                    </div>

                    {/* 📌 Tabla de parqueaderos */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Total Space</th>
                                    <th>Capacity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParkingLots.map(lot => (
                                    <tr key={lot.id} className="table-light">
                                        <td>{lot.id}</td>
                                        <td>{lot.name}</td>
                                        <td>{lot.address}</td>
                                        <td>{lot.total_space}</td>
                                        <td>{lot.capacity}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditParkingLot(lot)}>
                                                ✏️ Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteParkingLot(lot)}>
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Parking Lot Modal */}
            {showModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Add Parking Lot</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Name" value={newParkingLot.name} onChange={(e) => setNewParkingLot({ ...newParkingLot, name: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Location" value={newParkingLot.location} onChange={(e) => setNewParkingLot({ ...newParkingLot, location: e.target.value })} />
                                <input type="number" className="form-control mb-2" placeholder="Total Space" value={newParkingLot.capacity} onChange={(e) => setNewParkingLot({ ...newParkingLot, capacity: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handleSaveParkingLot}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Parking Lot Modal */}
            {showEditModal && editingParkingLot && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Edit Parking Lot</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Name"
                                    value={editingParkingLot.name}
                                    onChange={(e) => setEditingParkingLot({ ...editingParkingLot, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Address"
                                    value={editingParkingLot.address} // 🏗️ Debe ser "address"
                                    onChange={(e) => setEditingParkingLot({ ...editingParkingLot, address: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Total Space"
                                    value={editingParkingLot.total_space} // 🏗️ Debe ser "total_space"
                                    onChange={(e) => setEditingParkingLot({ ...editingParkingLot, total_space: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleUpdateParkingLot}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Parking Lot Modal */}
            {showDeleteModal && deletingParkingLot && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirm Delete Parking Lot</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this parking lot?</p>
                                <ul className="list-group">
                                    <li className="list-group-item"><strong>ID:</strong> {deletingParkingLot.id}</li>
                                    <li className="list-group-item"><strong>Name:</strong> {deletingParkingLot.name}</li>
                                    <li className="list-group-item"><strong>Address:</strong> {deletingParkingLot.address}</li>
                                    <li className="list-group-item"><strong>Total Space:</strong> {deletingParkingLot.total_space}</li>
                                    <li className="list-group-item"><strong>Capacity:</strong> {deletingParkingLot.capacity}</li>
                                    {deletingParkingLot.occupied_spaces !== undefined && (
                                        <li className="list-group-item text-danger">
                                            <strong>Occupied Spaces:</strong> {deletingParkingLot.occupied_spaces}
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={confirmDeleteParkingLot}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
