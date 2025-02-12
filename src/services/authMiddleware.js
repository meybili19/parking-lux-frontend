import { useEffect } from "react";
import { useRouter } from "next/router";

export const useAuth = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Redirigir al login si no hay token
        }
    }, []);
};
