import { useEffect, useState } from "react";
import { getAllReservations, createReservation, updateReservation, deleteReservation } from "../../src/services/reservations";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    // Modales
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Datos de reserva
    const [newReservation, setNewReservation] = useState({ vehicleId: "", parkingLotId: "", startDate: "", endDate: "" });
    const [editingReservation, setEditingReservation] = useState(null);
    const [deletingReservation, setDeletingReservation] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await getAllReservations();
            console.log("📌 Reservas obtenidas en el frontend:", response);
            setReservations(response);
        } catch (error) {
            console.error("❌ Error cargando reservas:", error);
        }
    };

    const handleSaveReservation = async () => {
        if (!newReservation.vehicleId || !newReservation.parkingLotId || !newReservation.startDate || !newReservation.endDate) {
            setMessage("❌ Todos los campos son obligatorios.");
            return;
        }

        try {
            await createReservation(newReservation);
            setShowModal(false);
            setNewReservation({ vehicleId: "", parkingLotId: "", startDate: "", endDate: "" });
            fetchReservations();
            setMessage("✅ Reserva creada con éxito.");
        } catch (error) {
            setMessage("❌ Error creando reserva: " + error.message);
        }
    };

    const handleEditReservation = (reservation) => {
        setEditingReservation(reservation);
        setShowEditModal(true);
    };

    const handleUpdateReservation = async () => {
        try {
            await updateReservation(editingReservation.id, editingReservation);
            setShowEditModal(false);
            fetchReservations();
            setMessage("✅ Reserva actualizada con éxito.");
        } catch (error) {
            setMessage("❌ Error actualizando reserva: " + error.message);
        }
    };

    const handleDeleteReservation = (reservation) => {
        setDeletingReservation(reservation);
        setShowDeleteModal(true);
    };

    const confirmDeleteReservation = async () => {
        try {
            await deleteReservation(deletingReservation.id);
            setShowDeleteModal(false);
            fetchReservations();
            setMessage("✅ Reserva eliminada con éxito.");
        } catch (error) {
            setMessage("❌ Error eliminando reserva: " + error.message);
        }
    };

    const filteredReservations = reservations.filter(reservation =>
        reservation.vehicle?.licensePlate?.toLowerCase().includes(search.toLowerCase()) ||
        reservation.parkingLot?.name?.toLowerCase().includes(search.toLowerCase()) ||
        reservation.startDate?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Reservas</h2>
                </div>

                <div className="card-body">
                    {message && <div className="alert alert-info">{message}</div>}

                    <div className="d-flex justify-content-between mb-4">
                        <input 
                            type="text" 
                            className="form-control w-50" 
                            placeholder="🔍 Buscar reserva..." 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Reserva</button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Vehicle</th>
                                    <th>Parking Lot</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservations.length > 0 ? (
                                    filteredReservations.map(reservation => (
                                        <tr key={reservation.id} className="table-light">
                                            <td>{reservation.id}</td>
                                            <td>
                                                {reservation.vehicle ? 
                                                    `${reservation.vehicle.brand} ${reservation.vehicle.model} (${reservation.vehicle.licensePlate})`
                                                    : "No Data"}
                                            </td>
                                            <td>
                                                {reservation.parkingLot ? 
                                                    `${reservation.parkingLot.name} - ${reservation.parkingLot.address}`
                                                    : "No Data"}
                                            </td>
                                            <td>{new Date(parseInt(reservation.startDate)).toLocaleString()}</td>
                                            <td>{new Date(parseInt(reservation.endDate)).toLocaleString()}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditReservation(reservation)}>✏️ Edit</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteReservation(reservation)}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted">No reservations found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Edición */}
            {showEditModal && editingReservation && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Reserva</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Vehicle ID" value={editingReservation.vehicleId} onChange={(e) => setEditingReservation({ ...editingReservation, vehicleId: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Parking Lot ID" value={editingReservation.parkingLotId} onChange={(e) => setEditingReservation({ ...editingReservation, parkingLotId: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleUpdateReservation}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Eliminación */}
            {showDeleteModal && deletingReservation && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Seguro que deseas eliminar la reserva <strong>ID {deletingReservation.id}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={confirmDeleteReservation}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
