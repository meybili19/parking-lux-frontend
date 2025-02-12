"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand fw-bold fs-3" href="/">
        <img src="/rocket.png" alt="ParkingLux Logo" className="me-2" style={{ height: "40px" }} />
        ParkingLux
      </a>
      <div className="ms-auto">
        {token ? (
          <button
            onClick={logout}
            className="btn btn-outline-danger"
          >
            Cerrar Sesión
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="btn btn-outline-light"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}
