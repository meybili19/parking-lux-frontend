import { useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        // 🚀 Si el usuario no está autenticado y no está en `/login`, redirigirlo
        if (!token && router.pathname !== "/login") {
            router.push("/login");
        }
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
