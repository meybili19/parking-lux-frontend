import { useEffect, useState } from "react";
import { getAllCars, createCar, updateCar, deleteCar } from "../../src/services/cars";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newCar, setNewCar] = useState({ userIdentifier: "", licensePlate: "", brand: "", model: "", color: "" });
    const [editingCar, setEditingCar] = useState(null);
    const [deletingCar, setDeletingCar] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);
    // 📌 Fetch list of cars initially
    const fetchCars = async () => {
        try {
            const response = await getAllCars();
            console.log("📡 Cars received:", response);
            setCars(response);
        } catch (error) {
            console.error("❌ Error loading cars:", error);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    // 📌 Filter cars
    const filteredCars = cars.filter(car =>
        (car.licensePlate?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (car.brand?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (car.model?.toLowerCase() || "").includes(search.toLowerCase())
    );

    // 📌 Save new car
    const handleSaveCar = async () => {
        if (!newCar.userIdentifier || !newCar.licensePlate || !newCar.brand || !newCar.model || !newCar.color) {
            setErrorMessage("❌ All fields are required.");
            return;
        }

        // Validate userIdentifier
        if (isNaN(newCar.userIdentifier) || newCar.userIdentifier <= 0) {
            setErrorMessage("❌ Invalid user identifier.");
            return;
        }

        // Clear error message
        setErrorMessage("");

        try {
            const created = await createCar(newCar);
            setCars([...cars, created]);
            setShowModal(false);
            setNewCar({ userIdentifier: "", licensePlate: "", brand: "", model: "", color: "" });
            showMessage("✅ Car added successfully");
            fetchCars();  // Refresh the list of cars
        } catch (error) {
            console.error("❌ Error adding car:", error);
        }
    };

    // 📌 Edit car
    const handleEditCar = (car) => {
        setEditingCar(car);
        setShowEditModal(true);
    };

    // 📌 Update car
    const handleUpdateCar = async () => {
        try {
            if (!editingCar.id) return console.error("❌ No car ID to update.");
            await updateCar(editingCar.id, editingCar);
            setShowEditModal(false);
            setEditingCar(null);
            showMessage("✅ Car updated successfully");
            fetchCars();  // Refresh the list of cars
        } catch (error) {
            console.error("❌ Error updating car:", error);
        }
    };

    // 📌 Delete car
    const handleDeleteCar = (car) => {
        setDeletingCar(car);
        setShowDeleteModal(true);
    };

    // 📌 Confirm deletion of car
    const confirmDeleteCar = async () => {
        try {
            await deleteCar(deletingCar.id);
            setShowDeleteModal(false);
            setDeletingCar(null);
            showMessage(`✅ Car ${deletingCar.licensePlate} deleted successfully`);
            fetchCars();  // Refresh the list of cars
        } catch (error) {
            console.error("❌ Error deleting car:", error);
        }
    };

    // 📌 Show message temporarily
    const showMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(""); // ✅ Hide message after 3 seconds
        }, 3000);
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Car List</h2>
                </div>

                <div className="card-body">
                    {/* 📢 Success message */}
                    {successMessage && (
                        <div className="alert alert-success text-center fw-bold">{successMessage}</div>
                    )}

                    {/* Error message */}
                    {errorMessage && (
                        <div className="alert alert-danger text-center fw-bold">{errorMessage}</div>
                    )}

                    {/* Search bar and add button */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Search Car..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add Car</button>
                    </div>

                    {/* Car Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>License Plate</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Color</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map(car => (
                                    <tr key={car.id} className="table-light">
                                        <td>{car.id}</td>
                                        <td>{car.licensePlate}</td>
                                        <td>{car.brand}</td>
                                        <td>{car.model}</td>
                                        <td>{car.color}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditCar(car)}>
                                                ✏️ Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteCar(car)}>
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

            {/* Add Car Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Add Car</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {/* Form fields */}
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="User Identifier"
                                    value={newCar.userIdentifier}
                                    onChange={(e) => setNewCar({ ...newCar, userIdentifier: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="License Plate"
                                    value={newCar.licensePlate}
                                    onChange={(e) => setNewCar({ ...newCar, licensePlate: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Brand"
                                    value={newCar.brand}
                                    onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Model"
                                    value={newCar.model}
                                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Color"
                                    value={newCar.color}
                                    onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-success" onClick={handleSaveCar}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Car Modal */}
            {showEditModal && editingCar && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Edit Car</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="License Plate" value={editingCar.licensePlate} onChange={(e) => setEditingCar({ ...editingCar, licensePlate: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Brand" value={editingCar.brand} onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Model" value={editingCar.model} onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Color" value={editingCar.color} onChange={(e) => setEditingCar({ ...editingCar, color: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleUpdateCar}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Car Modal */}
            {showDeleteModal && deletingCar && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirm Deletion</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the car with license plate <strong>{deletingCar.licensePlate}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={confirmDeleteCar}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
