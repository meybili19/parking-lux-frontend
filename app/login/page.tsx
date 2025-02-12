"use client";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";  // ✅ Importación correcta

export default function Login() {
  const { login } = useAuth();
  const router = useRouter(); // ✅ Asegurar que está bien definido

  const [email, setEmail] = useState("tatiana@gmail.com");
  const [password, setPassword] = useState("Tatiana");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);

    router.push("/"); // ✅ Redirige a la página principal después de iniciar sesión
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}
