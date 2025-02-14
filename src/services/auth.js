const API_URL = "http://100.27.169.141:5004"; // URL del microservicio de autenticación

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Login failed" };
        }

        return { success: true, token: data.token };
    } catch (error) {
        return { success: false, message: "Network error" };
    }
}
