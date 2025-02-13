import { useEffect, useState } from "react";
import { getAllParkingLots, createParkingLot, updateParkingLot, deleteParkingLot } from "../../src/services/parkinglot";
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

    // 📌 Fetch all parking lots
    const fetchParkingLots = async () => {
        try {
            const response = await getAllParkingLots();
            console.log("📡 Parking Lots received:", response);

            // 🔹 Mapear "address" a "location" para que el frontend lo reconozca
            const formattedParkingLots = response.map(lot => ({
                id: lot.id,
                name: lot.name,
                location: lot.address, // 🔹 Cambiamos "address" a "location"
                capacity: lot.total_space, // 🔹 Cambiamos "total_space" a "capacity"
            }));

            setParkingLots(formattedParkingLots);
        } catch (error) {
            console.error("❌ Error loading parking lots:", error);
        }
    };


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

        // 🔹 Mapea correctamente los nombres de los campos
        const formattedParkingLot = {
            name: newParkingLot.name,
            address: newParkingLot.location, // Backend espera "address", no "location"
            total_space: parseInt(newParkingLot.capacity, 10) // Backend espera "total_space"
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
        setEditingParkingLot(lot);
        setShowEditModal(true);
    };

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
                address: editingParkingLot.location, // Backend espera "address"
                total_space: parseInt(editingParkingLot.capacity, 10) // Backend espera "total_space"
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
    const handleDeleteParkingLot = (lot) => {
        setDeletingParkingLot(lot);
        setShowDeleteModal(true);
    };

    // 📌 Confirm deletion of parking lot
    const confirmDeleteParkingLot = async () => {
        try {
            await deleteParkingLot(deletingParkingLot.id);
            setShowDeleteModal(false);
            setDeletingParkingLot(null);
            showMessage(`✅ Parking lot ${deletingParkingLot.name} deleted successfully`);
            fetchParkingLots();
        } catch (error) {
            console.error("❌ Error deleting parking lot:", error);
        }
    };

    // 📌 Show message temporarily
    const showMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
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

                    {/* Parking Lot Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Capacity</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParkingLots.map(lot => (
                                    <tr key={lot.id} className="table-light">
                                        <td>{lot.id}</td>
                                        <td>{lot.name}</td>
                                        <td>{lot.location}</td>
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
                                <input type="number" className="form-control mb-2" placeholder="Capacity" value={newParkingLot.capacity} onChange={(e) => setNewParkingLot({ ...newParkingLot, capacity: e.target.value })} />
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
                                    placeholder="Location"
                                    value={editingParkingLot.location}
                                    onChange={(e) => setEditingParkingLot({ ...editingParkingLot, location: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Capacity"
                                    value={editingParkingLot.capacity}
                                    onChange={(e) => setEditingParkingLot({ ...editingParkingLot, capacity: e.target.value })}
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
                                <p>Are you sure you want to delete the parking lot?</p>
                                <ul className="list-group">
                                    <li className="list-group-item"><strong>Name:</strong> {deletingParkingLot.name}</li>
                                    <li className="list-group-item"><strong>Location:</strong> {deletingParkingLot.location}</li>
                                    <li className="list-group-item"><strong>Capacity:</strong> {deletingParkingLot.capacity}</li>
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
