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

    // 📌 Cargar Cars al inicio
    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await getAllCars();
                console.log("📡 Cars recibidos:", response);
                setCars(response);
            } catch (error) {
                console.error("❌ Error cargando Cars:", error);
            }
        }
        fetchCars();
    }, []);

    // 📌 Filtrar Cars
    const filteredCars = cars.filter(car =>
        (car.licensePlate?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (car.brand?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (car.model?.toLowerCase() || "").includes(search.toLowerCase())
    );

    // 📌 Guardar nuevo Car
    const handleSaveCar = async () => {
        try {
            const created = await createCar(newCar);
            setCars([...cars, created]);
            setShowModal(false);
            setNewCar({ userIdentifier: "", licensePlate: "", brand: "", model: "", color: "" });
        } catch (error) {
            console.error("❌ Error al agregar Car:", error);
        }
    };

    // 📌 Editar Car
    const handleEditCar = (car) => {
        console.log("🖊️ Editar carro:", car); // Debug
        setEditingCar({
            id: car.id,
            userIdentifier: car.userIdentifier || "",
            licensePlate: car.licensePlate || "",
            brand: car.brand || "",
            model: car.model || "",
            color: car.color || "",
        });

        setShowEditModal(true);
    };

    // 📌 Actualizar Car
    const handleUpdateCar = async () => {
        try {
            if (!editingCar.id) {
                console.error("❌ No hay ID de carro para actualizar.");
                return;
            }

            const updatedCarData = {
                userIdentifier: editingCar.userIdentifier,
                licensePlate: editingCar.licensePlate,
                brand: editingCar.brand,
                model: editingCar.model,
                color: editingCar.color,
            };

            console.log("📤 Enviando datos de actualización:", updatedCarData); // Debug

            const updated = await updateCar(editingCar.id, updatedCarData);
            setCars(cars.map(c => (c.id === updated.id ? updated : c)));
            setShowEditModal(false);
            setEditingCar(null);
        } catch (error) {
            console.error("❌ Error al actualizar Car:", error.response?.data || error.message);
        }
    };

    // 📌 Eliminar Car
    const handleDeleteCar = async () => {
        try {
            if (!deletingCar) {
                console.error("❌ No se ha seleccionado un carro para eliminar");
                return;
            }

            // Llamada a la API para eliminar el carro
            const response = await deleteCar(deletingCar.id);
            console.log("✅ Respuesta de eliminación:", response); // Verifica la respuesta de la API

            setCars(cars.filter(c => c.id !== deletingCar.id));
            setShowDeleteModal(false);
            setDeletingCar(null);
        } catch (error) {
            console.error("❌ Error al eliminar Car:", error.response?.data || error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Carros</h2>
                </div>

                <div className="card-body">
                    {/* Barra de búsqueda y botón de agregar */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Buscar Carro..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Carro</button>
                    </div>

                    {/* Tabla de Carros */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Identificación Usuario</th>
                                    <th>Placa</th>
                                    <th>Marca</th>
                                    <th>Modelo</th>
                                    <th>Color</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map(car => (
                                    <tr key={car.id} className="table-light">
                                        <td>{car.id}</td>
                                        <td>{car.userIdentifier}</td>
                                        <td>{car.licensePlate}</td>
                                        <td>{car.brand}</td>
                                        <td>{car.model}</td>
                                        <td>{car.color}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm mx-1"
                                                onClick={() => handleEditCar(car)}
                                            >
                                                ✏️ Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm mx-1"
                                                onClick={() => {
                                                    console.log("🗑️ Eliminando carro:", car);
                                                    setDeletingCar(car);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para Editar Car */}
            {showEditModal && editingCar && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Carro</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Identificación Usuario" value={editingCar.userIdentifier} onChange={(e) => setEditingCar({ ...editingCar, userIdentifier: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Placa" value={editingCar.licensePlate} onChange={(e) => setEditingCar({ ...editingCar, licensePlate: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Marca" value={editingCar.brand} onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Modelo" value={editingCar.model} onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Color" value={editingCar.color} onChange={(e) => setEditingCar({ ...editingCar, color: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleUpdateCar}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Eliminar Car */}
            {showDeleteModal && deletingCar && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar el carro con placa <strong>{deletingCar.licensePlate}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={handleDeleteCar}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
