import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
    return (
        <div className="container-fluid bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold" href="#">PARKING LUX</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item"><a className="nav-link" href="#">Inicio</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Servicios</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Reservaciones</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Contacto</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container text-center py-5" style={{ background: "#00AEEF", color: "white", borderRadius: "10px" }}>
                <h1 className="fw-bold">🚗 Sistema de Parqueo Inteligente</h1>
                <p className="lead">Gestiona tus reservas y espacios de estacionamiento de manera fácil y rápida.</p>
                <div className="mt-4">
                    <Link href="/dashboard">
                        <button className="btn btn-dark mx-2">Reservar Ahora</button>
                    </Link>
                    <button className="btn btn-outline-light mx-2">Más Información</button>
                </div>
            </div>
        </div>
    );
}
