import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold text-primary">
                    🚗 PARKING LUX
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link href="/" className="nav-link text-dark fw-semibold">🏠 Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/services" className="nav-link text-dark fw-semibold">🛠 Services</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/dashboard" className="nav-link text-dark fw-semibold">📅 Reservations</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/contact" className="nav-link text-dark fw-semibold">📞 Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
