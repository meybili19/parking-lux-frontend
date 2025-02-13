import "bootstrap/dist/css/bootstrap.min.css";

export default function ServicesPage() {
    return (
        <div className="container-fluid d-flex flex-column min-vh-100 p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="/">🚗 PARKING LUX</a>
                </div>
            </nav>

            {/* Services Section */}
            <div className="container-fluid text-center my-5 flex-grow-1 bg-light py-5 rounded shadow-lg">
                <h2 className="fw-bold text-primary">🛠 Our Parking Services</h2>
                <p className="lead">Explore our premium services for an easy and secure parking experience.</p>

                <div className="row mt-4 justify-content-center">
                    {[
                        { icon: "🚗", title: "Automated Reservations", desc: "Book your parking spot online in seconds." },
                        { icon: "🛡️", title: "24/7 Security", desc: "Enjoy maximum security with surveillance cameras." },
                        { icon: "💳", title: "Cashless Payments", desc: "Pay conveniently using digital methods." },
                    ].map((service, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="p-4 shadow-lg rounded service-card bg-white">
                                <h3 className="text-primary">{service.icon} {service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <p className="mb-0">© 2025 PARKING LUX. All rights reserved.</p>
            </footer>

            {/* Hover Effects */}
            <style jsx>{`
                .service-card {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
                }
                .service-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}
