import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_API = process.env.NEXT_PUBLIC_GRAPHQL_PROVIDER_URL || "http://localhost:4003";

// 📡 Configurar cliente GraphQL
const client = new GraphQLClient(GRAPHQL_API, { headers: {} });

// 🔍 Consultar todos los proveedores
export const getProviders = async () => {
    const query = gql`
        query {
            getAllProviders {
                id
                name
                address
                email
            }
        }
    `;
    try {
        const data = await client.request(query);
        console.log("📡 Datos recibidos desde GraphQL:", data.getAllProviders);
        return data.getAllProviders;
    } catch (error) {
        console.error("❌ Error obteniendo proveedores desde GraphQL:", error);
        throw error;
    }
};

