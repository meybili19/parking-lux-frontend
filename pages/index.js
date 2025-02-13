import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
    return (
        <div className="container-fluid p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container">
                    <Link href="/" className="navbar-brand fw-bold text-primary">
                        🚗 PARKING LUX
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link href="/" className="nav-link text-dark fw-semibold">🏠 Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/services" className="nav-link text-dark fw-semibold">🛠 Services</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/dashboard" className="nav-link text-dark fw-semibold">📅 Reservations</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/contact" className="nav-link text-dark fw-semibold">📞 Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container-fluid text-center text-white py-5" style={{
                background: "linear-gradient(135deg, #00AEEF, #005F9E)",
                borderRadius: "0 0 20px 20px"
            }}>
                <h1 className="fw-bold display-4">🚗 Smart Parking System</h1>
                <p className="lead">Manage your reservations and parking spaces quickly and easily.</p>
                <div className="mt-4">
                    <Link href="/dashboard">
                        <button className="btn btn-dark btn-lg mx-2 shadow">Book Now</button>
                    </Link>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="container text-center my-5">
                <h2 className="fw-bold text-primary">🌟 Benefits of Our System</h2>
                <div className="row mt-4">
                    {[
                        { icon: "✅", title: "Fast & Easy", desc: "Make reservations in seconds from any device." },
                        { icon: "🛡️", title: "Secure", desc: "Your information is protected with the highest security standards." },
                        { icon: "💰", title: "Affordable", desc: "Get fair and competitive prices for each reservation." },
                    ].map((benefit, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="p-4 shadow-sm rounded bg-light">
                                <h3 className="text-primary">{benefit.icon} {benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3">
                <p className="mb-0">© 2025 PARKING LUX. All rights reserved.</p>
            </footer>
        </div>
    );
}
