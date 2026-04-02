import { useEffect, useState } from "react";
import type { ProductoCarrito } from "../App";
import { useAuth } from "../context/useAuth";

interface Props {
  agregarAlCarrito: (producto: ProductoCarrito) => void;
}

interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen?: string;
  oferta?: boolean; // 🔥 NUEVO
}

function Productos({ agregarAlCarrito }: Props) {

  const { user } = useAuth();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // 🔥 CARGAR PRODUCTOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos", error);
      }
    };

    fetchData();
  }, []);

  // 🔥 FILTRO
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔥 ENVIAR A OFERTA
  const enviarAOferta = async (id: string) => {
    try {

      const res = await fetch(
        `http://localhost:4000/api/productos/oferta/${id}`,
        { method: "PUT" }
      );

      const data = await res.json();

      alert(data.mensaje);

      // 🔄 ACTUALIZAR UI SIN RECARGAR
      setProductos((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, oferta: true } : p
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-5">

      <h2 className="mb-4">Nuestros Productos</h2>

      {/* 🔍 BUSCADOR */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* 🛒 PRODUCTOS */}
      <div className="row g-4">
        {productosFiltrados.map((producto) => (
          <div className="col-md-4" key={producto._id}>
            <div className="card shadow-sm h-100">

              <img
                src={producto.imagen || "https://via.placeholder.com/300"}
                className="card-img-top"
                alt={producto.nombre}
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">

                <h5>{producto.nombre}</h5>

                <p className="text-muted">
                  {producto.descripcion}
                </p>

                {/* 💰 PRECIO */}
                <h6 className={producto.oferta ? "fw-bold text-danger" : "fw-bold"}>
                  S/ {producto.precio}
                </h6>

                {/* 🔥 BADGE OFERTA */}
                {producto.oferta && (
                  <span className="badge bg-warning text-dark mb-2">
                    🔥 OFERTA
                  </span>
                )}

                {/* 📦 STOCK */}
                {producto.stock > 0 ? (
                  <span className="badge bg-success mb-2">
                    Disponible
                  </span>
                ) : (
                  <span className="badge bg-danger mb-2">
                    Sin stock
                  </span>
                )}

                {/* 🛒 AGREGAR */}
                <button
                  className="btn btn-primary mt-auto"
                  disabled={producto.stock === 0}
                  onClick={() =>
                    agregarAlCarrito({
                      id: producto._id,
                      nombre: producto.nombre,
                      precio: Number(producto.precio),
                      imagen: producto.imagen || "",
                      cantidad: 1,
                    })
                  }
                >
                  Agregar
                </button>

                {/* 🔥 BOTÓN OFERTA (SOLO ADMIN/VENDEDOR) */}
                {(user?.rol === "admin" || user?.rol === "vendedor") && !producto.oferta && (
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => enviarAOferta(producto._id)}
                  >
                    Enviar a ofertas
                  </button>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ❌ SIN PRODUCTOS */}
      {productosFiltrados.length === 0 && (
        <p className="mt-4">No hay productos registrados.</p>
      )}

    </div>
  );
}

export default Productos;