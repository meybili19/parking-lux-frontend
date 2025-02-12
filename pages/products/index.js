import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { GraphQLClient, gql } from "graphql-request";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]); // 📌 Estado para los proveedores
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const [newProduct, setNewProduct] = useState({
        nombreProducto: "",
        descripcion: "",
        marca: "",
        precio: "",
        proveedor_id: "",
    });

    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchProviders(); // 📌 Cargar proveedores cuando el componente se monta
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8002/products");
            setProducts(response.data);
        } catch (error) {
            console.error("❌ Error obteniendo productos:", error);
        }
    };

    const GRAPHQL_API = "http://localhost:4003";
    const fetchProviders = async () => {
        const client = new GraphQLClient(GRAPHQL_API);
        const query = gql`
            query {
                getAllProviders {
                    id
                    name
                }
            }
        `;
    
        try {
            const data = await client.request(query);
            console.log("📡 Proveedores recibidos:", data.getAllProviders);
            setProviders(data.getAllProviders);
        } catch (error) {
            console.error("❌ Error obteniendo proveedores:", error);
        }
    };

    const handleCreateProduct = async () => {
        try {
            await axios.post("http://localhost:8000/products", newProduct);
            fetchProducts();
            setShowModal(false);
            setNewProduct({ nombreProducto: "", descripcion: "", marca: "", precio: "", proveedor_id: "" });
        } catch (error) {
            console.error("❌ Error creando producto:", error);
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct) return;
        try {
            await axios.put(`http://localhost:8003/products/${editingProduct.id}`, editingProduct);
            fetchProducts();
            setShowEditModal(false);
            setEditingProduct(null);
        } catch (error) {
            console.error("❌ Error actualizando producto:", error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`http://localhost:8004/products/${deletingProduct.id}`);
            fetchProducts();
            setShowDeleteModal(false);
            setDeletingProduct(null);
        } catch (error) {
            console.error("❌ Error eliminando producto:", error);
        }
    };

    return (
       
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white text-center">
                    <h2 className="fw-bold">📋 Gestión de Productos</h2>
                </div>

                <div className="card-body">
                    <div className="d-flex justify-content-between mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="🔍 Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-success" onClick={() => setShowModal(true)}>➕ Agregar Producto</button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Marca</th>
                                    <th>Precio</th>
                                    <th>Proveedor</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.filter(product => product.nombreProducto.toLowerCase().includes(search.toLowerCase()))
                                    .map((product, index) => (
                                        <tr key={product.id} className={index % 2 === 0 ? "table-warning" : "table-info"}>
                                            <td>{product.id}</td>
                                            <td>{product.nombreProducto}</td>
                                            <td>{product.descripcion}</td>
                                            <td>{product.marca}</td>
                                            <td>${product.precio}</td>
                                            <td>{product.proveedor_nombre}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm mx-1" onClick={() => { setEditingProduct(product); setShowEditModal(true); }}>✏️ Editar</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => { setDeletingProduct(product); setShowDeleteModal(true); }}>🗑️ Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal para Agregar Producto */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">➕ Agregar Producto</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" placeholder="Nombre" value={newProduct.nombreProducto} onChange={(e) => setNewProduct({ ...newProduct, nombreProducto: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Descripción" value={newProduct.descripcion} onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })} />
                                <input type="text" className="form-control mb-2" placeholder="Marca" value={newProduct.marca} onChange={(e) => setNewProduct({ ...newProduct, marca: e.target.value })} />
                                <input type="number" className="form-control mb-2" placeholder="Precio" value={newProduct.precio} onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })} />

                                {/* 📌 ComboBox para Proveedores */}
                                <select className="form-control mb-2" value={newProduct.proveedor_id} onChange={(e) => setNewProduct({ ...newProduct, proveedor_id: e.target.value })}>
                                    <option value="">Seleccione un proveedor</option>
                                    {providers.map(provider => (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn-success" onClick={handleCreateProduct}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

             {/* Modal para Editar Producto */}
             {showEditModal && editingProduct && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title">✏️ Editar Producto</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {Object.keys(editingProduct).map((key) => (
                                    <input key={key} type="text" className="form-control mb-2" placeholder={key} value={editingProduct[key]} onChange={(e) => setEditingProduct({ ...editingProduct, [key]: e.target.value })} />
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                <button className="btn btn-warning" onClick={handleUpdateProduct}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Confirmar Eliminación */}
            {showDeleteModal && deletingProduct && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🗑️ Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Eliminar el producto <strong>{deletingProduct.nombreProducto}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={handleDeleteProduct}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
