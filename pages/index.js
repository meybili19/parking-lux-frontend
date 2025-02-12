import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
    return (
        <div className="container mt-5 text-center">
            <h1 className="fw-bold">🚀 Sistema de Gestión</h1>
            <p>Administra usuarios con autenticación segura.</p>
            <Link href="/login">
                <button className="btn btn-primary mx-2">🔐 Iniciar Sesión</button>
            </Link>
            <Link href="/profile">
                <button className="btn btn-secondary mx-2">👤 Ver Perfil</button>
            </Link>
        </div>
    );
}
