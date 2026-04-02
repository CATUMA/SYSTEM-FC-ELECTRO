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

  // FILTROS
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [soloStock, setSoloStock] = useState(false);
  const [soloOferta, setSoloOferta] = useState(false);

  // ORDEN
  const [orden, setOrden] = useState("");

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:4000/api/productos");
      const data = await res.json();
      setProductos(data);
    };

    fetchData();
  }, []);

  // FILTRAR
  const productosFiltrados = productos.filter((p) => {
    const texto = (p.nombre + p.descripcion).toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    const cumplePrecioMin = precioMin === "" || p.precio >= Number(precioMin);
    const cumplePrecioMax = precioMax === "" || p.precio <= Number(precioMax);

    const cumpleStock = !soloStock || p.stock > 0;
    const cumpleOferta = !soloOferta || p.oferta;

    return (
      coincideBusqueda &&
      cumplePrecioMin &&
      cumplePrecioMax &&
      cumpleStock &&
      cumpleOferta
    );
  });

  // ORDENAR (SIN MUTAR)
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
  if (orden === "asc") return a.precio - b.precio;
  if (orden === "desc") return b.precio - a.precio;
  return 0;
});

  // PAGINACIÓN
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosOrdenados.slice(
    indexInicio,
    indexInicio + productosPorPagina
  );
  const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

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

      <h2 className="fw-bold mb-4">🛒 Tienda FC Electro</h2>

      {/* FILTROS */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Precio min"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Precio max"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="">Ordenar</option>
              <option value="asc">Precio ↑</option>
              <option value="desc">Precio ↓</option>
            </select>
          </div>

          <div className="col-md-3 d-flex gap-2">
            <button
              className={`btn ${soloStock ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setSoloStock(!soloStock)}
            >
              Stock
            </button>

            <button
              className={`btn ${soloOferta ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setSoloOferta(!soloOferta)}
            >
              Ofertas
            </button>
          </div>

        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="row g-4">
        {productosPagina.map((producto) => (
          <div className="col-md-4" key={producto._id}>

            <div
              className="card h-100 shadow-sm border-0"
              style={{ borderRadius: "15px", transition: "0.3s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >

              <img
                src={producto.imagen || "https://via.placeholder.com/300"}
                className="card-img-top"
                style={{
                    height: "250px",
                    width: "100%",
                    objectFit: "contain",
                    background: "#f8f9fa"
                  }}
              />

              <div className="card-body d-flex flex-column">

                <h5 className="fw-bold">{producto.nombre}</h5>
                <p className="text-muted">{producto.descripcion}</p>

                <h5 className={producto.oferta ? "text-danger fw-bold" : "text-primary fw-bold"}>
                  S/ {producto.precio}
                </h5>

                {producto.oferta && (
                  <span className="badge bg-warning text-dark mb-2">🔥 Oferta</span>
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
                  🛒 Agregar
                </button>

                {(user?.rol === "admin" || user?.rol === "vendedor") && !producto.oferta && (
                  <button
                    className="btn btn-success mt-2"
                    onClick={() => enviarAOferta(producto._id)}
                  >
                    🔥 Oferta
                  </button>
                )}

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div className="d-flex justify-content-center mt-4 gap-2">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            className={`btn ${paginaActual === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setPaginaActual(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}

export default Productos;