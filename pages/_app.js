import { useEffect } from "react";
import dynamic from "next/dynamic";
import "bootstrap/dist/css/bootstrap.min.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../src/styles/dashboard.css";  
import "../src/styles/login.css";
const BootstrapClient = dynamic(() => import("bootstrap/dist/js/bootstrap.bundle.min.js"), { ssr: false });


function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("bootstrap/dist/js/bootstrap.bundle.min.js");
        }
    }, []);

    return (
        <>
            <BootstrapClient />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;