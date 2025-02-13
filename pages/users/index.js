import { useEffect, useState } from "react";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../../src/services/users";
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

    // 📌 Save a new user and update the list in real-time
    const handleSaveUser = async () => {
        try {
            console.log("📤 Attempting to add user with data:", newUser); // Debug

            const response = await createUser(newUser);
            console.log("✅ Server response:", response);

            setShowModal(false);
            setNewUser({ identification: "", name: "", email: "", password: "", type: "" });
            fetchUsers();
            showMessage("✅ User added successfully");
        } catch (error) {
            console.error("❌ Error adding user:", error.response?.data || error.message);
        }
    };


    // 📌 Retrieve user before editing
    const handleEditUser = async (user) => {
        try {
            const userData = await getUserById(user.id); // ✅ Fetch user from the API
            setEditingUser({ ...userData, password: "" }); // 🔹 Password is not displayed
            setShowEditModal(true);
        } catch (error) {
            console.error("❌ Error retrieving user data:", error);
        }
    };

    // 📌 Update user
    const handleUpdateUser = async () => {
        try {
            if (!editingUser.id) {
                console.error("❌ No user ID available for update.");
                return;
            }

            // 🔹 If no new password is provided, do not send it
            const userToUpdate = { ...editingUser };
            if (!userToUpdate.password) {
                delete userToUpdate.password;
            }

            await updateUser(userToUpdate);
            setShowEditModal(false);
            setEditingUser(null);
            fetchUsers();
            showMessage("✅ User updated successfully");
        } catch (error) {
            console.error("❌ Error updating user:", error);
        }
    };


    const handleDeleteUser = (user) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = async () => {
        try {
            if (!deletingUser?.id) return console.error("❌ No user ID available for deletion.");
            await deleteUser(deletingUser.id);
            setShowDeleteModal(false);
            setDeletingUser(null);
            fetchUsers(); // ✅ Refresh the user list
            showMessage(`✅ User ${deletingUser.name} deleted successfully`); // ✅ Display message
        } catch (error) {
            console.error("❌ Error deleting user:", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white text-center">
                    <h2 className="fw-bold">📋 User List</h2>
                </div>
                <div className="card-body">
                    {/* 📢 Success Message */}
                    {successMessage && (
                        <div className="alert alert-success text-center fw-bold">{successMessage}</div>
                    )}
                    {/* Search Bar */}
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Search user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Add User</button>
                    </div>
                    {/* User Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Identification</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter(user =>
                                        Object.values(user).some(value =>
                                            value.toString().toLowerCase().includes(search.toLowerCase())
                                        )
                                    )
                                    .map(user => (
                                        <tr key={user.id} className="table-light">
                                            <td>{user.id}</td>
                                            <td>{user.identification}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.type}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditUser(user)}>
                                                    ✏️ Edit
                                                </button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeleteUser(user)}>
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
            {/* Modal to Add User */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Add User</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Identification" value={newUser.identification} onChange={(e) => setNewUser({ ...newUser, identification: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                <input type="password" className="form-control mb-2" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Type" value={newUser.type} onChange={(e) => setNewUser({ ...newUser, type: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handleSaveUser}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal to Edit User */}
            {showEditModal && editingUser && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Edit User</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Identification"
                                    value={editingUser.identification}
                                    onChange={(e) => setEditingUser({ ...editingUser, identification: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Name"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    placeholder="Email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    placeholder="New Password (Optional)"
                                    value={editingUser.password}
                                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Type"
                                    value={editingUser.type}
                                    onChange={(e) => setEditingUser({ ...editingUser, type: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleUpdateUser}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal to Delete User */}
            {showDeleteModal && deletingUser && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirm Deletion</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body text-center">
                                <p>Are you sure you want to delete this user?</p>
                                <p><strong>{deletingUser.identification} - {deletingUser.name}</strong></p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={confirmDeleteUser}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
