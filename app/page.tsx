"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <section className="d-flex flex-column justify-content-center align-items-center text-center vh-100 bg-light">
        <div className="container">
          {/* Imagen Principal */}
          <Image 
            src="/rocket.png" 
            alt="Parking Illustration" 
            width={150} 
            height={150} 
            className="mb-4"
          />

          <h1 className="display-3 fw-bold text-dark">Bienvenido a ParkingLux</h1>
          <p className="lead text-muted">
            Optimiza y gestiona tu parqueadero de manera eficiente con nuestra plataforma.
          </p>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="display-5 fw-bold">Gestión Inteligente</h2>
            <p className="text-muted">
              Controla el ingreso y salida de vehículos en tiempo real con nuestra plataforma segura.
            </p>
          </div>
          <div className="col-md-6 text-center">
            <Image 
              src="/rocket.png" 
              alt="Sistema de parqueadero" 
              width={400} 
              height={250} 
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

