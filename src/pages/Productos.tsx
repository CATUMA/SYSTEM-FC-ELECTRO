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
  oferta?: boolean;
}

function Productos({ agregarAlCarrito }: Props) {

  const { user } = useAuth();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:4000/api/productos");
      const data = await res.json();
      setProductos(data);
    };

    fetchData();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const enviarAOferta = async (id: string) => {
    await fetch(`http://localhost:4000/api/productos/oferta/${id}`, {
      method: "PUT",
    });

    setProductos((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, oferta: true } : p
      )
    );
  };

  return (
    <div className="container my-5">

      <h2 className="mb-4">Nuestros Productos</h2>

      <input
        className="form-control mb-4"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="row g-4">
        {productosFiltrados.map((producto) => (
          <div className="col-md-4" key={producto._id}>
            <div className="card h-100">

              <img
                src={producto.imagen || "https://via.placeholder.com/300"}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">

                <h5>{producto.nombre}</h5>

                <p>{producto.descripcion}</p>

                <h6 className={producto.oferta ? "text-danger fw-bold" : ""}>
                  S/ {producto.precio}
                </h6>

                {/* 🔥 SOLO SI ESTÁ LOGUEADO */}
                {user && producto.oferta && (
                  <span className="badge bg-warning mb-2">
                    🔥 OFERTA
                  </span>
                )}

                {producto.stock > 0 ? (
                  <span className="badge bg-success mb-2">Disponible</span>
                ) : (
                  <span className="badge bg-danger mb-2">Sin stock</span>
                )}

                <button
                  className="btn btn-primary mt-auto"
                  disabled={producto.stock === 0}
                  onClick={() =>
                    agregarAlCarrito({
                      id: producto._id,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      imagen: producto.imagen || "",
                      cantidad: 1,
                    })
                  }
                >
                  Agregar
                </button>

                {/* 🔥 SOLO ADMIN / VENDEDOR */}
                {(user?.rol === "admin" || user?.rol === "vendedor") && !producto.oferta && (
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => enviarAOferta(producto._id)}
                  >
                    Enviar a oferta
                  </button>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Productos;