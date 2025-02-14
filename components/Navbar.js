import Link from "next/link";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
    const router = useRouter();

    const handleReservationsClick = (e) => {
        e.preventDefault(); // Evitar la navegación predeterminada
        router.push("/auth/login"); // Redirigir a la página de login
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container-fluid"> {/* Cambiado de "container" a "container-fluid" */}
                <Link href="/" className="navbar-brand fw-bold text-primary">
                    🚗 PARKING LUX
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/" className="nav-link text-dark fw-semibold">🏠 Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/services" className="nav-link text-dark fw-semibold">🛠 Services</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/contact" className="nav-link text-dark fw-semibold">📞 Contact</Link>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link text-dark fw-semibold" onClick={handleReservationsClick}>
                                🔐 Sign In
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
