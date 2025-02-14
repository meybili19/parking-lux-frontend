import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../../src/services/auth";
import { createUser } from "../../src/services/users"; // Import user creation function
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [newUser, setNewUser] = useState({ identification: "", name: "", email: "", password: "", type: "user" });
    const [registrationSuccess, setRegistrationSuccess] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const response = await loginUser(email, password);
        if (response.success) {
            localStorage.setItem("token", response.token);
            router.push("/dashboard"); 
        } else {
            setError(response.message);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await createUser(newUser);
            setShowRegisterModal(false); 
            setRegistrationSuccess({
                email: newUser.email,
                password: newUser.password.replace(/./g, "*"), 
            });

            setTimeout(() => {
                setRegistrationSuccess(null);
                router.push("/auth/login");
            }, 3000);
        } catch (error) {
            console.error("❌ Error registering user:", error);
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            {/* Back button */}
            <button className="btn btn-light position-absolute top-0 start-0 m-3" onClick={() => router.push("/")}>
                ← Back
            </button>

            <div className="login-card glassmorphism">
                {/* Avatar */}
                <div className="avatar-container">
                    <img src="/avatar.png" alt="User Avatar" className="avatar" />
                </div>

                {/* Sign In Title */}
                <h2 className="text-center text-white mb-3">Sign In</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-white">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary-login w-100">Login</button>
                </form>

                {/* Register Button */}
                <div className="text-center mt-3">
                    <button className="btn btn-login w-100" onClick={() => setShowRegisterModal(true)}>Register</button>
                </div>
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Register New User</h5>
                                <button className="btn-close" onClick={() => setShowRegisterModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Identification" value={newUser.identification} onChange={(e) => setNewUser({ ...newUser, identification: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                <input type="email" className="form-control mb-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                <input type="password" className="form-control mb-2" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-login" onClick={() => setShowRegisterModal(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handleRegister}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {registrationSuccess && (
                <div className="alert alert-success position-fixed top-50 start-50 translate-middle text-center">
                    <h4>Welcome!</h4>
                    <p>Email: {registrationSuccess.email}</p>
                    <p>Password: {registrationSuccess.password}</p>
                    <p>Redirecting to login...</p>
                </div>
            )}
        </div>
    );
}
