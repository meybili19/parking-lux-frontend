import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [registerData, setRegisterData] = useState({
        first_name: "",
        last_name: "",
        identification_number: "",
        email: "",
        password: "",
        phone_number: ""
    });

    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5009/login", { email, password });
            localStorage.setItem("token", response.data.token);
            router.push("/dashboard");
        } catch (error) {
            setError("Incorrect email or password.");
        }
    };

    const handleRegister = async () => {
        try {
            await axios.post("http://localhost:5009/register", registerData);
            alert("Registration successful! Please log in.");
            setShowRegister(false);
        } catch (error) {
            setError("Registration failed. Please check your details.");
        }
    };

    return (
        <div className="container mt-5">
            {/* Navbar Superior */}
            <nav className="navbar navbar-dark bg-primary mb-4">
                <div className="container">
                    <span className="navbar-brand fw-bold">🔧 Repuestos Erteo</span>
                </div>
            </nav>
            
            <div className="card p-4 shadow-lg">
                <h2 className="text-center mb-3">🔐 Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn btn-primary w-100" onClick={handleLogin}>Sign In</button>
                
                <button className="btn btn-link mt-2" onClick={() => setShowRegister(true)}>Don't have an account? Register here</button>
            </div>

            {/* Registration Modal */}
            {showRegister && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">📝 Register</h5>
                                <button className="btn-close" onClick={() => setShowRegister(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input className="form-control mb-2" type="text" placeholder="First Name" value={registerData.first_name} onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })} />
                                <input className="form-control mb-2" type="text" placeholder="Last Name" value={registerData.last_name} onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })} />
                                <input className="form-control mb-2" type="text" placeholder="Identification Number" value={registerData.identification_number} onChange={(e) => setRegisterData({ ...registerData, identification_number: e.target.value })} />
                                <input className="form-control mb-2" type="email" placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
                                <input className="form-control mb-2" type="password" placeholder="Password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
                                <input className="form-control mb-2" type="text" placeholder="Phone Number" value={registerData.phone_number} onChange={(e) => setRegisterData({ ...registerData, phone_number: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowRegister(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handleRegister}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Navbar Inferior */}
            <footer className="navbar fixed-bottom navbar-dark bg-dark text-center text-white p-2">
                <div className="container">
                    <span>&copy; 2025 Repuestos Erteo. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
