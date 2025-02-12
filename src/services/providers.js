import { GraphQLClient, gql } from "graphql-request";

// 📌 Servidores correctos según tu arquitectura
const READ_GRAPHQL_API = "http://localhost:4003"; // ReadProvider
const CREATE_GRAPHQL_API = "http://localhost:4000"; // CreateProvider
const UPDATE_GRAPHQL_API = "http://localhost:4002"; // ✅ UpdateProvider en 4002
const DELETE_GRAPHQL_API = "http://localhost:4001"; // 📌 Servidor de DeleteProvider


// Crear clientes GraphQL
const readClient = new GraphQLClient(READ_GRAPHQL_API);
const createClient = new GraphQLClient(CREATE_GRAPHQL_API);
const updateClient = new GraphQLClient(UPDATE_GRAPHQL_API); // ✅ Usamos el correcto
const deleteClient = new GraphQLClient(DELETE_GRAPHQL_API);


// 🔹 Obtener proveedores (QUERY)
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
        const data = await readClient.request(query);
        console.log("📡 Proveedores recibidos:", data.getAllProviders);
        return data.getAllProviders;
    } catch (error) {
        console.error("❌ Error obteniendo proveedores:", error);
        throw error;
    }
};

// 🔹 Crear proveedor (MUTATION) en `localhost:4000`
export const createProvider = async (providerData) => {
    const mutation = gql`
        mutation ($name: String!, $address: String!, $email: String!) {
            createProvider(input: { name: $name, address: $address, email: $email }) {
                id
                name
                address
                email
            }
        }
    `;

    try {
        const variables = {
            name: providerData.name,
            address: providerData.address,
            email: providerData.email,
        };

        // ✅ Ahora sí usamos `createClient` para la mutación
        const data = await createClient.request(mutation, variables);
        console.log("✅ Proveedor agregado:", data.createProvider);
        return data.createProvider;
    } catch (error) {
        console.error("❌ Error al agregar proveedor:", error.response || error);
        throw error;
    }
};




// 🔹 Mutación para actualizar proveedor en `localhost:4002`
export const updateProvider = async (providerData) => {
    const mutation = gql`
        mutation UpdateProvider($id: ID!, $input: ProviderInput!) {
            updateProvider(id: $id, input: $input) {
                id
                name
                address
                email
            }
        }
    `;

    try {
        const variables = {
            id: parseInt(providerData.id), // ✅ Convertir a número
            input: {
                name: providerData.name,
                address: providerData.address,
                email: providerData.email,
            },
        };

        console.log("📡 Enviando mutación a GraphQL en 4002 con variables:", variables);

        const data = await updateClient.request(mutation, variables); // ✅ Se envía al `updateClient` (4002)
        console.log("✅ Proveedor actualizado:", data.updateProvider);
        return data.updateProvider;
    } catch (error) {
        console.error("❌ Error al actualizar proveedor:", error.response || error);
        throw error;
    }
};


// Eliminar proveedor (MUTATION)
export const deleteProvider = async (id) => {
    const mutation = gql`
        mutation DeleteProvider($id: ID!) {
            deleteProvider(id: $id)
        }
    `;

    try {
        const variables = { id };
        const data = await deleteClient.request(mutation, variables);
        console.log("🗑️ Proveedor eliminado:", data);
        return id; // Solo retornamos el ID eliminado, ya que GraphQL no devuelve más datos
    } catch (error) {
        console.error("❌ Error al eliminar proveedor:", error.response || error);
        throw error;
    }
};