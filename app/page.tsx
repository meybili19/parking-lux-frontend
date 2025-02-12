"use client";
import { useRouter } from "next/navigation";  

export default function Home() {
  const router = useRouter(); // ✅ Usamos `useRouter` para redirigir

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-primary text-white">
      <header className="position-absolute top-0 w-100 d-flex justify-content-between align-items-center p-3 bg-dark">
        <h1 className="text-light">ParkingLux</h1>
        <button 
          className="btn btn-outline-light"
          onClick={() => router.push("/login")} // ✅ Redirige a la página de login
        >
          Iniciar Sesión
        </button>
      </header>

      <div className="text-center mt-5">
        <h2 className="display-4 fw-bold">Creative Process</h2>
        <p className="lead">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.
        </p>
        <button className="btn btn-success btn-lg">Read More</button>
      </div>
    </div>
  );
}

