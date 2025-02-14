import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import DashboardLayout from "../components/DashboardLayout";
import UsersPage from "./users";
import CarsPage from "./cars";
import AccessControl from "./access/control";
import ParkingLotPage from "./parkinglot";
import ReservationsPage from "./reservations";
import Image from "next/image";

export default function DashboardPage() {
    const router = useRouter();
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/auth/login"); 
        }
    }, []);

    return (
        <DashboardLayout selectedSection={selectedSection} setSelectedSection={setSelectedSection}>
            <motion.div 
                className="container text-center py-5 fade-in"
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }}
            >
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
                    <motion.div 
                        className="container"
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="fw-bold text-primary mb-3 animate-title">📌 Parking Management System</h2>
                        <p className="lead text-muted animate-fade-in">
                            Manage your reservations, users, and vehicles efficiently with our system.
                        </p>

                        <div className="row mt-5 d-flex align-items-center">
                            <motion.div 
                                className="col-md-6 text-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    src="/parking.jpg"
                                    width={550}
                                    height={350}
                                    className="img-fluid rounded shadow-lg"
                                    alt="Parking Lot"
                                />
                            </motion.div>
                            <motion.div 
                                className="col-md-6 text-start"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                            >
                                <h3 className="text-primary">🚗 Efficient & Secure Parking</h3>
                                <p className="text-muted">
                                    Our intelligent parking system ensures a seamless experience, allowing you to manage spaces, monitor vehicles, and handle reservations with ease.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </DashboardLayout>
    );
}
