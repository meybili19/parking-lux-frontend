"use client";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import Image from "next/image";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage({ email: "", password: "" });
    setLoading(true);

    // Validaciones de campos vacíos antes de enviar la solicitud
    if (!email) {
      setErrorMessage((prev) => ({ ...prev, email: "Email is required." }));
      setLoading(false);
      return;
    }
    if (!password) {
      setErrorMessage((prev) => ({ ...prev, password: "Password is required." }));
      setLoading(false);
      return;
    }

    // Intentar iniciar sesión
    try {
      await login(email, password);
      window.location.href = "/"; // ✅ Redirige solo si es exitoso
    } catch {
      setErrorMessage((prev) => ({
        ...prev,
        password: "Invalid email or password.",
      }));
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ 
      background: "url('/background.jpg') no-repeat center center / cover"
    }}>
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "15px" }}>
        {/* Profile Icon */}
        <div className="text-center">
          <Image src="/user-icon.png" alt="User Icon" width={60} height={60} />
        </div>

        <h3 className="text-center fw-bold mt-2">Welcome Back</h3>

        <form onSubmit={handleSubmit} className="mt-3">
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email *</label>
            <input 
              type="email" 
              className={`form-control ${errorMessage.email ? "is-invalid" : ""}`} 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            {errorMessage.email && <div className="text-danger">{errorMessage.email}</div>}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password *</label>
            <input 
              type="password" 
              className={`form-control ${errorMessage.password ? "is-invalid" : ""}`} 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage.password && <div className="text-danger">{errorMessage.password}</div>}
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3">
          <a href="#" className="text-decoration-none">Forgot your password?</a>
          <br />
          <a href="#" className="text-decoration-none">Don't have an account?</a>
        </div>
      </div>
    </div>
  );
}
