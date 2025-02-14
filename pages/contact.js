import Layout from "../components/Layout";

export default function ContactPage() {
    return (
        <Layout>
            <div className="container text-center mt-5">
                <h2 className="fw-bold text-primary">📞 Contact Us</h2>
                <p className="lead">Get in touch with our support team for any inquiries.</p>

                <div className="row mt-4 justify-content-center">
                    {[
                        { icon: "📍", title: "Address", desc: "Quito - Ecuador" },
                        { icon: "📧", title: "Email", desc: "support@parkinglux.com" },
                        { icon: "📞", title: "Phone", desc: "+593 99 156 3372 / +593 99 610 9719" },
                    ].map((contact, index) => (
                        <div className="col-lg-4 col-md-6 d-flex justify-content-center" key={index}>
                            <div className="p-4 shadow-lg rounded contact-card bg-white w-100 d-flex flex-column justify-content-center"
                                style={{ minHeight: "150px", maxWidth: "400px" }}>
                                <h3 className="text-primary">{contact.icon} {contact.title}</h3>
                                <p>{contact.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div className="py-5"></div>

    
            <style jsx>{`
                .contact-card {
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
                    text-align: center;
                }
                .contact-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </Layout>
    );
}
