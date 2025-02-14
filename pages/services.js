import Layout from "../components/Layout";

export default function ServicesPage() {
    return (
        <Layout>
            <div className="container text-center my-5">
                <h2 className="fw-bold text-primary">🛠 Our Parking Services</h2>
                <p className="lead">Explore our premium services for an easy and secure parking experience.</p>

                <div className="row mt-4 justify-content-center">
                    {[
                        { icon: "🚗", title: "Automated Reservations", desc: "Book your parking spot online in seconds." },
                        { icon: "🛡️", title: "24/7 Security", desc: "Enjoy maximum security with surveillance cameras." },
                    
                    ].map((service, index) => (
                        <div className="col-lg-4 col-md-6 d-flex justify-content-center" key={index}>
                            <div className="p-4 shadow-lg rounded service-card bg-white w-100 d-flex flex-column justify-content-center"
                                 style={{ minHeight: "150px", maxWidth: "400px" }}>
                                <h3 className="text-primary">{service.icon} {service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hover Effects */}
            <style jsx>{`
                .service-card {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
                    text-align: center;
                }
                .service-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </Layout>
    );
}
