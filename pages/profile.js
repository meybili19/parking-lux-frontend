import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
    });

    const router = useRouter();

    // 📌 Obtener datos del usuario autenticado
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await axios.get("http://localhost:5009/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
                setUpdatedUser({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    phone_number: response.data.phone_number,
                });

            } catch (error) {
                console.error("❌ Error obteniendo usuario:", error);
                setError("No se pudo cargar la información del usuario.");
            }
        };

        fetchUserData();
    }, [router]);

    // 📌 Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    // 📌 Actualizar usuario
    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem("token");
    
            // ✅ Asegurar que no haya valores undefined
            const updatedUser = {
                first_name: user.first_name || "",  // Si es undefined, lo convierte en string vacío
                last_name: user.last_name || "",
                identification_number: user.identification_number || "",  // 🔥 Asegurar que se envía
                email: user.email || "",
                phone_number: user.phone_number || "",  // 🔥 Asegurar que se envía
            };
    
            console.log("📡 Enviando actualización:", updatedUser);
    
            const response = await axios.put("http://localhost:5007/users/me", updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            alert("Usuario actualizado correctamente");
        } catch (error) {
            console.error("❌ Error actualizando usuario:", error);
            alert("Hubo un error al actualizar");
        }
    };
    
    
    

    // 📌 Eliminar usuario
    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem("token");
    
            await axios.delete("http://localhost:5008/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            alert("Usuario eliminado correctamente");
            localStorage.removeItem("token");
            router.push("/login"); // ✅ Redirigir al login tras eliminar cuenta
    
        } catch (error) {
            console.error("❌ Error eliminando usuario:", error);
            alert("Error eliminando usuario");
        }
    };
    

    if (!user) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg">
                <h2 className="text-center mb-3">👤 Perfil de Usuario</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Identificación:</strong> {user.identification_number}</p>
                <p><strong>Teléfono:</strong> {user.phone_number || "No registrado"}</p>

                <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-warning" onClick={() => setShowEditModal(true)}>✏️ Editar</button>
                    <button className="btn btn-danger" onClick={handleDeleteUser}>🗑️ Eliminar</button>
                    <button className="btn btn-secondary" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            </div>

            {/* Modal de Edición */}
            {showEditModal && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">✏️ Editar Usuario</h5>
                                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input className="form-control mb-2" type="text" placeholder="Nombre" value={updatedUser.first_name} onChange={(e) => setUpdatedUser({ ...updatedUser, first_name: e.target.value })} />
                                <input className="form-control mb-2" type="text" placeholder="Apellido" value={updatedUser.last_name} onChange={(e) => setUpdatedUser({ ...updatedUser, last_name: e.target.value })} />
                                <input className="form-control mb-2" type="text" placeholder="Teléfono" value={updatedUser.phone_number} onChange={(e) => setUpdatedUser({ ...updatedUser, phone_number: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleUpdateUser}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
