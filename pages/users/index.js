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

    // 📌 Cargar Users al inicio
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await getUsers();
                console.log("📡 Users recibidos:", response);
                setUsers(response);
            } catch (error) {
                console.error("❌ Error cargando Users:", error);
            }
        }
        fetchUsers();
    }, []);

    // 📌 Filtrar Users
    const filteredUsers = users.filter(user =>
        (user.identification?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(search.toLowerCase())
    );

    // 📌 Guardar nuevo User
    const handleSaveUser = async () => {
        try {
            const created = await createUser(newUser);
            setUsers([...users, created]);
            setShowModal(false);
            setNewUser({ identification: "", name: "", email: "", password: "", type: "" });
        } catch (error) {
            console.error("❌ Error al agregar User:", error);
        }
    };

    // 📌 Editar User
    const handleEditUser = (user) => {
        console.log("🖊️ Editar usuario:", user); // Debug

        setEditingUser({
            id: user.id,
            identification: user.identification || "",
            name: user.name || "",
            email: user.email || "",
            type: user.type || "",
        });

        setShowEditModal(true);
    };

    // 📌 Actualizar User
    const handleUpdateUser = async () => {
        try {
            if (!editingUser.id) {
                console.error("❌ No hay ID de usuario para actualizar.");
                return;
            }

            // 🔍 Asegurar que se envían los datos correctos
            const updatedUserData = {
                identification: editingUser.identification,
                name: editingUser.name,
                email: editingUser.email,
                password: editingUser.password || "defaultPassword123", // Agregar password si no se ingresa
                type: editingUser.type,
            };

            console.log("📤 Enviando datos de actualización:", updatedUserData); // Debug

            const updated = await updateUser({ ...updatedUserData, id: editingUser.id });

            setUsers(users.map(u => (u.id === updated.id ? updated : u)));
            setShowEditModal(false);
            setEditingUser(null);
        } catch (error) {
            console.error("❌ Error al actualizar User:", error.response?.data || error.message);
        }
    };

    // 📌 Eliminar User
    const handleDeleteUser = async () => {
        try {
            if (!deletingUser) {
                console.error("❌ No se ha seleccionado un usuario para eliminar");
                return;
            }

            // Llamada a la API para eliminar el usuario
            const response = await deleteUser(deletingUser.id);
            console.log("✅ Respuesta de eliminación:", response); // Verifica la respuesta de la API

            // Actualiza la lista de usuarios en el frontend
            setUsers(users.filter(u => u.id !== deletingUser.id));
            setShowDeleteModal(false); // Cierra el modal
            setDeletingUser(null); // Limpia el estado de usuario a eliminar
        } catch (error) {
            console.error("❌ Error al eliminar User:", error.response?.data || error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 Lista de Usuarios</h2>
                </div>

                <div className="card-body">
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
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="table-light">
                                        <td>{user.id}</td>
                                        <td>{user.identification}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.type}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm mx-1"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                ✏️ Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm mx-1"
                                                onClick={() => {
                                                    console.log("🗑️ Eliminando usuario:", user);
                                                    setDeletingUser(user); // Pasa el usuario a eliminar
                                                    setShowDeleteModal(true); // Muestra el modal de eliminación
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

            {/* Modal para Editar Usuario */}
            {showEditModal && editingUser && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Usuario</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Identificación" value={editingUser.identification} onChange={(e) => setEditingUser({ ...editingUser, identification: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Correo" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                                <input type="password" className="form-control mb-2" placeholder="Contraseña" value={editingUser.password || ""} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Tipo" value={editingUser.type} onChange={(e) => setEditingUser({ ...editingUser, type: e.target.value })} />
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
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar al usuario <strong>{deletingUser.name}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={handleDeleteUser}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
