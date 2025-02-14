import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar global */}
            <Navbar />

            {/* Contenido dinámico de la página */}
            <main className="flex-grow-1">{children}</main>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <p className="mb-0">© 2025 PARKING LUX -PETTER. All rights reserved.</p>
            </footer>
        </div>
    );
}
