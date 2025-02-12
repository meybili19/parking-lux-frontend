import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../src/services/users";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newUser, setNewUser] = useState({ identification: "", name: "", email: "", password: "", type: "" });
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [successMessage, setSuccessMessage] = useState(""); // ✅ Estado para mostrar mensajes

    // 📌 Cargar Bootstrap JS para que los modales funcionen correctamente
    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    // 📌 Función para cargar la lista de usuarios
    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            console.log("📡 Users recibidos:", response);
            setUsers(response);
        } catch (error) {
            console.error("❌ Error cargando Users:", error);
        }
    };

    // 📌 Cargar la lista de usuarios al iniciar la página
    useEffect(() => {
        fetchUsers();
    }, []);

    // 📌 Mostrar mensaje temporalmente
    const showMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(""); // ✅ Ocultar mensaje después de 3 segundos
        }, 3000);
    };

    // 📌 Guardar nuevo usuario y actualizar la lista en tiempo real
    const handleSaveUser = async () => {
        try {
            console.log("📤 Intentando agregar usuario con datos:", newUser); // Debug

            const response = await createUser(newUser);
            console.log("✅ Respuesta del servidor:", response);

            setShowModal(false);
            setNewUser({ identification: "", name: "", email: "", password: "", type: "" });
            fetchUsers();
            showMessage("✅ Usuario agregado correctamente");
        } catch (error) {
            console.error("❌ Error al agregar User:", error.response?.data || error.message);
        }
    };

    // 📌 Editar usuario (mostrar modal)
    const handleEditUser = (user) => {
        setEditingUser({ ...user, password: "" });
        setShowEditModal(true);
    };

    // 📌 Actualizar usuario y recargar la tabla
    const handleUpdateUser = async () => {
        try {
            if (!editingUser.id) return console.error("❌ No hay ID de usuario para actualizar.");
            await updateUser(editingUser);
            setShowEditModal(false);
            setEditingUser(null);
            fetchUsers(); // ✅ Recargar lista de usuarios
            showMessage("✅ Usuario actualizado correctamente"); // ✅ Mostrar mensaje
        } catch (error) {
            console.error("❌ Error al actualizar User:", error);
        }
    };

    const handleDeleteUser = (user) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        try {
            if (!deletingUser?.id) return console.error("❌ No hay ID de usuario para eliminar.");
            await deleteUser(deletingUser.id);
            setShowDeleteModal(false);
            setDeletingUser(null);
            fetchUsers(); // ✅ Recargar la lista de usuarios
            showMessage(`✅ Usuario ${deletingUser.name} eliminado correctamente`); // ✅ Mostrar mensaje
        } catch (error) {
            console.error("❌ Error al eliminar User:", error);
        }
    };


    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Usuarios</h2>
                </div>

                <div className="card-body">
                    {/* 📢 Mensaje de éxito */}
                    {successMessage && (
                        <div className="alert alert-success text-center fw-bold">{successMessage}</div>
                    )}

                    {/* Barra de búsqueda y botón de agregar */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Buscar Usuario..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Usuario</button>
                    </div>

                    {/* Tabla de Usuarios */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Identificación</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="table-light">
                                        <td>{user.id}</td>
                                        <td>{user.identification}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.type}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditUser(user)}>
                                                ✏️ Editar
                                            </button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteUser(user)}>
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

            {/* Modal para Agregar Usuario */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Agregar Usuario</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Identificación" value={newUser.identification} onChange={(e) => setNewUser({ ...newUser, identification: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Correo" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                <input type="password" className="form-control mb-2" placeholder="Contraseña" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Tipo" value={newUser.type} onChange={(e) => setNewUser({ ...newUser, type: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handleSaveUser}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Editar Usuario */}
            {showEditModal && editingUser && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Usuario</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Correo" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleUpdateUser}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal para Eliminar Usuario */}
            {showDeleteModal && deletingUser && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body text-center">
                                <p>¿Estás seguro de que deseas eliminar al usuario?</p>
                                <p><strong>{deletingUser.identification} - {deletingUser.name}</strong></p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={confirmDeleteUser}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
