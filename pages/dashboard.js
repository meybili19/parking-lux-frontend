import { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import UsersPage from "./users"; // Importamos la página de usuarios
import ParkingLotPage from "./parkinglot"; // Importamos la página de parqueaderos
import CarsPage from "./cars"; // Importamos la página de carros
import AccessControl from "./access/control"; // Importar Control de Acceso
import ReservationsPage from "./reservations"; 

import { FaHome } from "react-icons/fa"; // Importamos un icono de FontAwesome


export default function DashboardPage() {
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    return (
        <div className="container-fluid">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <span
                        className="navbar-brand fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedSection(null)}
                    >
                        PARKING LUX
                    </span>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto text-center">
                            <li className="nav-item">
                                <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => setSelectedSection("parkinglot")}>
                                    Registrar Parqueadero
                                </span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => setSelectedSection("users")}>
                                    Registrar Usuario
                                </span>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ cursor: "pointer" }} onClick={() => setSelectedSection("cars")}>
                                    Registrar Vehículo
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ cursor: "pointer" }} onClick={() => setSelectedSection("reservations")}>
                                    Register Reservation
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" style={{ cursor: "pointer" }} onClick={() => setSelectedSection("access")}>
                                    Access Control
                                </a>
                            </li>
                        </ul>

                        {/* 🔹 Icono para volver a Index.js (página principal) */}
                        <Link href="/" title="Ir a inicio" className="text-white fs-4 ms-3">
                            <FaHome />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Sección Dinámica: Se muestra dependiendo de la opción seleccionada */}
            <div className="container text-center py-5">
                {selectedSection === "users" ? (
                    <UsersPage />
                ) : selectedSection === "parkinglot" ? (
                    <ParkingLotPage />
                ) : selectedSection === "cars" ? (
                    <CarsPage />
                ) : selectedSection === "reservations" ? (
                    <ReservationsPage  />
                ) : selectedSection === "access" ? (
                    <AccessControl   />
                ) 
                : (
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
