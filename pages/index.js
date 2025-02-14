import Link from "next/link";
import Layout from "../components/Layout";

export default function HomePage() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            require("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);
    return (
        <Layout>
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
        </Layout>
    );
}
