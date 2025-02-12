import { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../../src/services/customers";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClientsPage() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ first_name: "", last_name: "", email: "", phone_number: "", address: "" });
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);

    // 📌 Cargar clientes al inicio
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await getCustomers();
                console.log("📡 Clientes recibidos:", response);
                setCustomers(response);
            } catch (error) {
                console.error("❌ Error cargando clientes:", error);
            }
        }
        fetchCustomers();
    }, []);

    // 📌 Filtrar clientes
    const filteredCustomers = customers.filter(customer =>
        customer.first_name.toLowerCase().includes(search.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
    );

    // 📌 Guardar nuevo cliente
    const handleSaveCustomer = async () => {
        try {
            const created = await createCustomer(newCustomer);
            setCustomers([...customers, created]);
            setShowModal(false);
            setNewCustomer({ first_name: "", last_name: "", email: "", phone_number: "", address: "" });
        } catch (error) {
            console.error("❌ Error al agregar cliente:", error);
        }
    };

    // 📌 Editar cliente
    const handleUpdateCustomer = async () => {
        try {
            const updated = await updateCustomer({
                ...editingCustomer,
                id: String(editingCustomer.id),
            });

            setCustomers(customers.map(c => (c.id === updated.id ? updated : c)));
            setShowEditModal(false);
            setEditingCustomer(null);
        } catch (error) {
            console.error("❌ Error al actualizar cliente:", error);
        }
    };

    // 📌 Eliminar cliente
    const handleDeleteCustomer = async () => {
        try {
            await deleteCustomer(deletingCustomer.id);
            setCustomers(customers.filter(c => c.id !== deletingCustomer.id));
            setShowDeleteModal(false);
            setDeletingCustomer(null);
        } catch (error) {
            console.error("❌ Error al eliminar cliente:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Clientes</h2>
                </div>

                <div className="card-body">
                    {/* Barra de búsqueda y botón de agregar */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Cliente</button>
                    </div>

                    {/* Tabla de clientes */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer, index) => (
                                    <tr key={customer.id} className={index % 2 === 0 ? "table-warning" : "table-info"}>
                                        <td>{customer.id}</td>
                                        <td>{customer.first_name}</td>
                                        <td>{customer.last_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone_number}</td>
                                        <td>{customer.address}</td>
                                        <td>
                                            <button 
                                                className="btn btn-primary btn-sm mx-1" 
                                                onClick={() => { 
                                                    setEditingCustomer({
                                                        id: String(customer.id),
                                                        first_name: customer.first_name || "",
                                                        last_name: customer.last_name || "",
                                                        email: customer.email || "",
                                                        phone_number: customer.phone_number || "",
                                                        address: customer.address || "",
                                                    });
                                                    setShowEditModal(true); 
                                                }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => { setDeletingCustomer(customer); setShowDeleteModal(true); }}>🗑️ Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para Agregar Cliente */}
            {showModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Agregar Cliente</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={newCustomer.first_name} onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Apellido" value={newCustomer.last_name} onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Correo" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Teléfono" value={newCustomer.phone_number} onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Dirección" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handleSaveCustomer}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Editar Cliente */}
            {showEditModal && editingCustomer && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Cliente</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={editingCustomer.first_name} onChange={(e) => setEditingCustomer({ ...editingCustomer, first_name: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Apellido" value={editingCustomer.last_name} onChange={(e) => setEditingCustomer({ ...editingCustomer, last_name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Correo" value={editingCustomer.email} onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Teléfono" value={editingCustomer.phone_number} onChange={(e) => setEditingCustomer({ ...editingCustomer, phone_number: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Dirección" value={editingCustomer.address} onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleUpdateCustomer}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Eliminar Cliente */}
            {showDeleteModal && deletingCustomer && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar al cliente <strong>{deletingCustomer.first_name} {deletingCustomer.last_name}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={handleDeleteCustomer}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
