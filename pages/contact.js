import "bootstrap/dist/css/bootstrap.min.css";

export default function ContactPage() {
    return (
        <div className="container-fluid d-flex flex-column min-vh-100 p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="/">🚗 PARKING LUX</a>
                </div>
            </nav>

            {/* Contact Section */}
            <div className="container-fluid text-center my-5 flex-grow-1 bg-light py-5 rounded shadow-lg">
                <h2 className="fw-bold text-primary">📞 Contact Us</h2>
                <p className="lead">Get in touch with our support team for any inquiries.</p>

                <div className="row mt-4 justify-content-center">
                    {[
                        { icon: "📍", title: "Address", desc: "123 Parking Street, New York, USA" },
                        { icon: "📧", title: "Email", desc: "support@parkinglux.com" },
                        { icon: "📞", title: "Phone", desc: "+1 234 567 890" },
                    ].map((contact, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="p-4 shadow-lg rounded contact-card bg-white">
                                <h3 className="text-primary">{contact.icon} {contact.title}</h3>
                                <p>{contact.desc}</p>
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
                .contact-card {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
                }
                .contact-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}
