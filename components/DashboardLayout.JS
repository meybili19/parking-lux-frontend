import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export default function DashboardLayout({ children, selectedSection, setSelectedSection }) {
    return (
        <div className="dashboard-container d-flex flex-column min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
                <div className="container">
                    <Link href="/" legacyBehavior>
                        <a className="navbar-brand fw-bold logo-effect">🚗 PARKING LUX</a>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
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

            {/* Main Content */}
            <main className="flex-grow-1">{children}</main>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3">
                <p className="mb-0">© 2025 PARKING LUX. All rights reserved.</p>
            </footer>
        </div>
    );
}
