"use client";  // ✅ Indica que es un componente del cliente

import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between">
      <h1 className="text-xl font-bold">ParkingLux</h1>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:underline">
            Inicio
          </Link>
        </li>
        {token ? (
          <>
            <li className="text-green-300">Bienvenido</li>
            <li>
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
