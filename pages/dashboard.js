import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
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
            } catch (error) {
                console.error("❌ Error obteniendo usuario:", error);
                router.push("/login");
            }
        };

        fetchUserData();
    }, [router]);

    // 📌 Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (!user) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">📌 Panel de Control</h2>

            <div className="row">
                {/* 🔹 Tarjeta de Clientes */}
                <div className="col-md-4">
                    <div className="card p-4 shadow-lg text-center">
                        <h4 className="text-primary">👥 Clientes</h4>
                        <p>Gestiona los clientes de la tienda</p>
                        <button className="btn btn-primary" onClick={() => router.push("/clients")}>Ir a Clientes</button>
                    </div>
                </div>

                {/* 🔹 Tarjeta de Proveedores */}
                <div className="col-md-4">
                    <div className="card p-4 shadow-lg text-center">
                        <h4 className="text-warning">🚚 Proveedores</h4>
                        <p>Gestiona los proveedores de la tienda</p>
                        <button className="btn btn-warning" onClick={() => router.push("/providers")}>Ir a Proveedores</button>
                    </div>
                </div>
                 {/* Productos */}
                 <div className="col-md-3">
                    <div className="card p-3 text-center shadow">
                        <h5>📦 <span className="text-success">Productos</span></h5>
                        <p>Gestiona los productos de la tienda</p>
                        <button className="btn btn-success" onClick={() => router.push("/products")}>
                            Ir a Productos
                        </button>
                    </div>
                </div>

                {/* 🔹 Tarjeta de Perfil del Usuario */}
                <div className="col-md-4">
                    <div className="card p-4 shadow-lg text-center">
                        <h4 className="text-success">🟢 Mi Perfil</h4>
                        <p><strong>Nombre:</strong> {user.first_name} {user.last_name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Teléfono:</strong> {user.phone_number || "No registrado"}</p>

                        <div className="d-flex justify-content-between">
                            {/* 🔹 Botón de INFO para ver perfil completo */}
                            <button className="btn btn-info" onClick={() => router.push("/profile")}>ℹ️ Info</button>

                            {/* 🔹 Botón de Cerrar Sesión */}
                            <button className="btn btn-danger" onClick={handleLogout}>⬅️ Cerrar Sesión</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
