import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "@/src/context/AuthContext";
import Navbar from "@/src/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="es">
        <body>
          <Navbar />
          <main className="container mx-auto p-6">{children}</main>
        </body>
      </html>
    </AuthProvider>
  );
}
