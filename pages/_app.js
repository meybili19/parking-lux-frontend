import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../src/styles/dashboard.css";  // ✅ Usa esta ruta

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
