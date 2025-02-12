import { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import UsersPage from "./users"; // Importamos la página de usuarios

export default function DashboardPage() {
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        // Cargar Bootstrap JS manualmente
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    return (
        <div className="container-fluid">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <a 
                        className="navbar-brand fw-bold" 
                        style={{ cursor: "pointer" }} 
                        onClick={() => setSelectedSection(null)}
                    >
                        PARKING LUX
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto text-center">
                            <li className="nav-item">
                                <a className="nav-link" style={{ cursor: "pointer" }} onClick={() => setSelectedSection("users")}>
                                    Registrar Usuario
                                </a>
                            </li>
                            <li className="nav-item"><a className="nav-link" href="#">Registrar Vehículo</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Registrar Reserva</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Control de Acceso</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Sección Dinámica: Se muestra dependiendo de la opción seleccionada */}
            <div className="container text-center py-5">
                {selectedSection === "users" ? (
                    <UsersPage />
                ) : (
                    <>
                        <h2 className="fw-bold">📌 Panel de Control - Gestión de Parqueadero</h2>
                        <p>Seleccione una de las opciones del menú para continuar.</p>

                        {/* Sección de imágenes y texto responsivo */}
                        <div className="row mt-4 d-flex align-items-center">
                            <div className="col-md-6">
                                <img src="https://via.placeholder.com/400" className="img-fluid rounded shadow" alt="Parqueadero" />
                            </div>
                            <div className="col-md-6 text-start mt-3 mt-md-0">
                                <h4>🚗 Administración de parqueos</h4>
                                <p>Gestione sus reservas, usuarios y vehículos de manera eficiente con nuestro sistema.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
