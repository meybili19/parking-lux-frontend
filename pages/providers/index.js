import { useEffect, useState } from "react";
import { getProviders, createProvider, updateProvider, deleteProvider } from "../../src/services/providers";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProvidersPage() {
    const [providers, setProviders] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newProvider, setNewProvider] = useState({ name: "", address: "", email: "" });
    const [editingProvider, setEditingProvider] = useState(null);
    const [deletingProvider, setDeletingProvider] = useState(null);

    useEffect(() => {
        async function fetchProviders() {
            try {
                const response = await getProviders();
                console.log("📡 Proveedores recibidos:", response);
                setProviders(response);
            } catch (error) {
                console.error("❌ Error cargando proveedores:", error);
            }
        }
        fetchProviders();
    }, []);

    // ✅ Guardar un nuevo proveedor
    const handleSaveProvider = async () => {
        try {
            const created = await createProvider(newProvider);
            setProviders([...providers, created]);
            setShowModal(false);
            setNewProvider({ name: "", address: "", email: "" });
        } catch (error) {
            console.error("❌ Error al agregar proveedor:", error);
        }
    };

    // ✅ Editar proveedor
    const handleUpdateProvider = async () => {
        if (!editingProvider) return;

        try {
            const updated = await updateProvider(editingProvider);
            setProviders(prevProviders =>
                prevProviders.map(p => (p.id === updated.id ? updated : p))
            );
            setShowEditModal(false);
            setEditingProvider(null);
        } catch (error) {
            console.error("❌ Error al actualizar proveedor:", error);
        }
    };

    // ✅ Eliminar proveedor
    const handleDeleteProvider = async () => {
        try {
            await deleteProvider(deletingProvider.id);
            setProviders(prevProviders => prevProviders.filter(p => p.id !== deletingProvider.id));
            setShowDeleteModal(false);
            setDeletingProvider(null);
        } catch (error) {
            console.error("❌ Error al eliminar proveedor:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Proveedores</h2>
                </div>

                <div className="card-body">
                    {/* Barra de búsqueda y botón de agregar */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Buscar proveedor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Proveedor</button>
                    </div>

                    {/* Tabla de proveedores */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Correo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {providers.map((provider, index) => (
                                    <tr key={provider.id} className={index % 2 === 0 ? "table-warning" : "table-info"}>
                                        <td>{provider.id}</td>
                                        <td>{provider.name}</td>
                                        <td>{provider.address}</td>
                                        <td>{provider.email}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => { setEditingProvider(provider); setShowEditModal(true); }}>✏️ Editar</button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => { setDeletingProvider(provider); setShowDeleteModal(true); }}>🗑️ Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para Agregar Proveedor */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Agregar Proveedor</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={newProvider.name} onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Dirección" value={newProvider.address} onChange={(e) => setNewProvider({ ...newProvider, address: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Correo" value={newProvider.email} onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handleSaveProvider}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Editar Proveedor */}
            {showEditModal && editingProvider && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title">✏️ Editar Proveedor</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" value={editingProvider.name} onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })} />
                                <input type="text" className="form-control mb-2" value={editingProvider.address} onChange={(e) => setEditingProvider({ ...editingProvider, address: e.target.value })} />
                                <input type="email" className="form-control mb-2" value={editingProvider.email} onChange={(e) => setEditingProvider({ ...editingProvider, email: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-warning" onClick={handleUpdateProvider}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


             {/* Modal para Confirmar Eliminación */}
             {showDeleteModal && deletingProvider && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{deletingProvider.name}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={handleDeleteProvider}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
