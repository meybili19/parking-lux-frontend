import { useEffect, useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import UsersPage from "./users";
import CarsPage from "./cars";
import AccessControl from "./access/control";
import ParkingLotPage from "./parkinglot";
import ReservationsPage from "./reservations";
import Image from "next/image";

export default function DashboardPage() {
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    return (
        <div className="container-fluid p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
                <div className="container">
                <Link href="/" legacyBehavior>
    <a className="navbar-brand fw-bold logo-effect">
        🚗 PARKING LUX
    </a>
</Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto text-center">
                            {[
                                { id: "parkings", label: "🅿️ Register Parking Lot" },
                                { id: "users", label: "🕵️ Register User" },
                                { id: "cars", label: "🚗 Register Vehicle" },
                                { id: "access", label: "🔑 Access Control" },
                                { id: "reservations", label: "📅 Register Reservation" },
                            ].map((item) => (
                                <li className="nav-item" key={item.id}>
                                    <a
                                        className={`nav-link fw-semibold nav-item-effect ${
                                            selectedSection === item.id ? "active-link" : "text-light"
                                        }`}
                                        style={{ cursor: "pointer", transition: "0.3s" }}
                                        onClick={() => setSelectedSection(item.id)}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Section with better layout */}
            <div className="container text-center py-5 fade-in">
                {selectedSection ? (
                     selectedSection === "users" ? (
                        <UsersPage />
                    ) : selectedSection === "cars" ? (
                        <CarsPage />
                    ) : selectedSection === "access" ? (
                        <AccessControl />
                    ) : selectedSection === "parkings" ? ( 
                        <ParkingLotPage /> 
                    ) : (
                        <ReservationsPage />
                    )
                ) : (
                    <div className="container">
                        <h2 className="fw-bold text-primary mb-3">
                            📌 Parking Management System
                        </h2>
                        <p className="lead text-muted">
                            Manage your reservations, users, and vehicles efficiently with our system.
                        </p>

                        {/* Improved Layout */}
                        <div className="row mt-5 d-flex align-items-center">
                            <div className="col-md-6 text-center">
                                <Image 
                                    src="/parking.jpg" 
                                    width={550} 
                                    height={350} 
                                    className="img-fluid rounded shadow-lg" 
                                    alt="Parking Lot" 
                                />
                            </div>
                            <div className="col-md-6 text-start">
                                <h3 className="text-primary">🚗 Efficient & Secure Parking</h3>
                                <p className="text-muted">
                                    Our intelligent parking system ensures a seamless experience, allowing you to manage spaces, monitor vehicles, and handle reservations with ease.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3 mt-5">
                <p className="mb-0">© 2025 PARKING LUX. All rights reserved.</p>
            </footer>

            {/* CSS Animations */}
            <style jsx>{`
                .logo-effect {
                    color: #ffc107 !important;
                    transition: all 0.3s ease-in-out;
                    font-size: 1.8rem;
                    display: inline-block;
                    text-decoration: none;
                }

                .logo-effect:hover {
                    color: #ffdd57 !important;
                    transform: scale(1.1);
                    text-shadow: 0px 4px 15px rgba(255, 193, 7, 0.8);
                }

                .logo-effect:active {
                    transform: scale(0.95);
                }

                .nav-item-effect {
                    transition: all 0.3s ease-in-out;
                    display: inline-block;
                }

                .nav-item-effect:hover {
                    color: #ffc107 !important;
                    transform: scale(1.1);
                    text-shadow: 0px 4px 10px rgba(255, 193, 7, 0.5);
                }

                .active-link {
                    color: #ffc107 !important;
                    font-weight: bold;
                    border-bottom: 3px solid #ffc107;
                    transform: scale(1.1);
                    transition: all 0.3s ease-in-out;
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Animated Button */
                .pulse-button {
                    font-size: 1.2rem;
                    padding: 10px 20px;
                    border-radius: 10px;
                    background: #007bff;
                    color: white;
                    border: none;
                    transition: all 0.3s ease-in-out;
                    animation: pulse 1.5s infinite;
                }

                .pulse-button:hover {
                    background: #0056b3;
                    transform: scale(1.05);
                }

                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(0, 123, 255, 0.8);
                    }
                    100% {
                        box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
                    }
                }
            `}</style>
        </div>
    );
}
