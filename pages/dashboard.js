import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
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
        <DashboardLayout selectedSection={selectedSection} setSelectedSection={setSelectedSection}>
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
                        <h2 className="fw-bold text-primary mb-3">📌 Parking Management System</h2>
                        <p className="lead text-muted">
                            Manage your reservations, users, and vehicles efficiently with our system.
                        </p>

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
        </DashboardLayout>
    );
}
