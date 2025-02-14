import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children, selectedSection, setSelectedSection }) {
    const router = useRouter();
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.replace("/");
    };

    const handleGoToDashboard = () => {
        router.push("/dashboard");
    };

    useEffect(() => {
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    return (
        <div className="dashboard-container d-flex flex-column min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
                <div className="container">
                    {/* Título con acción de ir al Dashboard */}
                    <a className="navbar-brand fw-bold logo-effect" style={{ cursor: "pointer" }} onClick={handleGoToDashboard}>
                        🚗 PARKING LUX
                    </a>

                    {/* Botón hamburguesa para pantallas pequeñas */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Menú colapsable */}
                    <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto text-center">
                            {[
                                { id: "reservations", label: "📅 Register Reservation" },
                                { id: "access", label: "🔑 Access Control" },
                                { id: "users", label: "🕵️ Register User" },
                                { id: "cars", label: "🚗 Register Vehicle" },
                                { id: "parkings", label: "🅿️ Register Parking Lot" },
                            ].map((item) => (
                                <li className="nav-item" key={item.id}>
                                    <a
                                        className={`nav-link fw-semibold nav-item-effect ${selectedSection === item.id ? "active-link" : "text-light"}`}
                                        style={{ cursor: "pointer", transition: "0.3s" }}
                                        onClick={() => {
                                            setSelectedSection(item.id);
                                            setIsNavOpen(false); // Cierra el menú al hacer clic
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Botón de Logout */}
                        <button className="btn btn-danger ms-3" onClick={handleLogout}>🚪 Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow-1">{children}</main>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3">
                <p className="mb-0">© 2025 PARKING LUX. All rights reserved.</p>
            </footer>
        </div>
    );
}
