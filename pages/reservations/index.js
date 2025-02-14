import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { getAllReservations, createReservation, updateReservation, deleteReservation } from "../../src/services/reservations";
import "bootstrap/dist/css/bootstrap.min.css";

// Cargar Bootstrap dinámicamente solo en el cliente para evitar errores SSR
const BootstrapModal = dynamic(() => import("bootstrap/dist/js/bootstrap.bundle.min.js"), { ssr: false });

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 🔹 Limpiar mensajes de alerta después de 3 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

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

    const fetchReservations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllReservations();
            setReservations(response);
        } catch (error) {
            console.error("❌ Error al cargar reservas:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🔹 Agregar nueva reserva
    const handleSaveReservation = async () => {
        if (!newReservation.vehicleId || !newReservation.parkingLotId || !newReservation.startDate || !newReservation.endDate) {
            setMessage("❌ Todos los campos son obligatorios.");
            return;
        }

        try {
            const formattedStartDate = dayjs(newReservation.startDate).format("YYYY-MM-DD HH:mm:ss");
            const formattedEndDate = dayjs(newReservation.endDate).format("YYYY-MM-DD HH:mm:ss");

            const reservationData = {
                vehicleId: newReservation.vehicleId,
                parkingLotId: newReservation.parkingLotId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            };

            await createReservation(reservationData);

            setShowModal(false);
            setNewReservation({ vehicleId: "", parkingLotId: "", startDate: "", endDate: "" });
            setMessage("✅ Reserva agregada con éxito.");
            fetchReservations();
        } catch (error) {
            setMessage(error.message || "❌ Error al agregar la reserva.");
        }
    };

    // 🔹 Editar reserva
    const handleEditReservation = (reservation) => {
        setEditingReservation({ ...reservation });
        setShowEditModal(true);
    };

    const handleUpdateReservation = async () => {
        if (!editingReservation?.id) return;

        try {
            await updateReservation(editingReservation.id, {
                vehicleId: editingReservation.vehicle?.id ?? editingReservation.car_id,
                parkingLotId: editingReservation.parkingLot?.id ?? editingReservation.parking_lot_id,
                startDate: editingReservation.startDate,
                endDate: editingReservation.endDate
            });

            setShowEditModal(false);
            setEditingReservation(null);
            setMessage("✅ Reserva actualizada con éxito.");
            fetchReservations();
        } catch (error) {
            setMessage("❌ Error al actualizar la reserva.");
        }
    };

    // 🔹 Eliminar reserva
    const handleDeleteReservation = (reservation) => {
        setDeletingReservation(reservation);
        setShowDeleteModal(true);
    };

    const confirmDeleteReservation = async () => {
        if (!deletingReservation || !deletingReservation.id) return;

        try {
            await deleteReservation(deletingReservation.id);
            setShowDeleteModal(false);
            setDeletingReservation(null);
            setMessage(`✅ Reserva eliminada con éxito.`);
            fetchReservations();
        } catch (error) {
            setMessage("❌ Error al eliminar la reserva.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Reservation List</h2>
                </div>

                <div className="card-body">
                    {message && <div className="alert alert-info">{message}</div>}

                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Search reservation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add Reservation</button>
                    </div>

                    <div className="table-responsive">
                        {isLoading ? (
                            <div className="text-center p-3">
                                <span className="spinner-border text-primary"></span> <br />
                                <span>Loading reservations...</span>
                            </div>
                        ) : (
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
                                    {reservations.map(reservation => (
                                        <tr key={reservation.id}>
                                            <td>{reservation.id}</td>
                                            <td>{reservation.vehicle?.licensePlate || "No Data"}</td>
                                            <td>{reservation.parkingLot?.name || "No Data"}</td>
                                            <td>{dayjs(reservation.startDate).format("YYYY-MM-DD HH:mm")}</td>
                                            <td>{dayjs(reservation.endDate).format("YYYY-MM-DD HH:mm")}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditReservation(reservation)}>✏️ Edit</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteReservation(reservation)}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            {/* Modal para Agregar Nueva Reserva */}
            {showModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content border-success">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Agregar Nueva Reserva</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {message && <div className="alert alert-danger">{message}</div>}

                                <div className="border rounded p-3 bg-light">
                                    {/* 🚗 Vehículo ID */}
                                    <label className="fw-bold">🚗 Vehículo ID</label>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        placeholder="Ejemplo: 4"
                                        value={newReservation.vehicleId}
                                        onChange={(e) => setNewReservation({ ...newReservation, vehicleId: e.target.value })}
                                    />

                                    {/* 🏢 Parqueadero ID */}
                                    <label className="fw-bold">🏢 Parqueadero ID</label>
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        placeholder="Ejemplo: 1"
                                        value={newReservation.parkingLotId}
                                        onChange={(e) => setNewReservation({ ...newReservation, parkingLotId: e.target.value })}
                                    />

                                    {/* 📅 Fecha de Inicio */}
                                    <label className="fw-bold">📅 Fecha de Inicio</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={newReservation.startDate}
                                        onChange={(e) => setNewReservation({ ...newReservation, startDate: e.target.value })}
                                    />

                                    {/* 📅 Fecha de Fin */}
                                    <label className="fw-bold">📅 Fecha de Fin</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control mb-2"
                                        value={newReservation.endDate}
                                        onChange={(e) => setNewReservation({ ...newReservation, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer d-flex justify-content-between">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    ❌ Cancelar
                                </button>
                                <button className="btn btn-success fw-bold" onClick={handleSaveReservation}>
                                    💾 Guardar Reserva
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔵 Modal para editar reserva */}
            {showEditModal && editingReservation && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Reserva</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                <label className="fw-bold">🚗 Vehículo ID</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editingReservation.vehicleId}
                                    onChange={(e) => setEditingReservation({ ...editingReservation, vehicleId: e.target.value })}
                                />

                                <label className="fw-bold">🏢 Parqueadero ID</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={editingReservation.parkingLotId}
                                    onChange={(e) => setEditingReservation({ ...editingReservation, parkingLotId: e.target.value })}
                                />

                                <label className="fw-bold">📅 Fecha de Inicio</label>
                                <input
                                    type="datetime-local"
                                    className="form-control mb-2"
                                    value={dayjs(editingReservation.startDate).format("YYYY-MM-DDTHH:mm")}
                                    onChange={(e) => setEditingReservation({ ...editingReservation, startDate: e.target.value })}
                                />

                                <label className="fw-bold">📅 Fecha de Fin</label>
                                <input
                                    type="datetime-local"
                                    className="form-control mb-2"
                                    value={dayjs(editingReservation.endDate).format("YYYY-MM-DDTHH:mm")}
                                    onChange={(e) => setEditingReservation({ ...editingReservation, endDate: e.target.value })}
                                />
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
                        <div className="modal-content border-danger">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">⚠️ Confirmar Eliminación</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                <p className="text-center fw-bold text-danger">
                                    ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
                                </p>

                                <div className="border rounded p-3 bg-light">
                                    <p className="mb-2"><strong>🆔 ID:</strong> {deletingReservation.id}</p>
                                    <p className="mb-2"><strong>🚗 Vehículo:</strong> {deletingReservation.vehicle?.licensePlate || "No disponible"}</p>
                                    <p className="mb-2"><strong>🏢 Parqueadero:</strong> {deletingReservation.parkingLot?.name || "No disponible"}</p>
                                    <p className="mb-2"><strong>📅 Inicio:</strong> {new Date(parseInt(deletingReservation.startDate)).toLocaleString()}</p>
                                    <p className="mb-0"><strong>⏳ Fin:</strong> {new Date(parseInt(deletingReservation.endDate)).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="modal-footer d-flex justify-content-between">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                    ❌ Cancelar
                                </button>
                                <button className="btn btn-danger fw-bold" onClick={confirmDeleteReservation}>
                                    🗑️ Eliminar Reserva
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
