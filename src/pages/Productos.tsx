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
  categoria?: string; // 🔥 NUEVO (opcional, no rompe nada)
}

function Productos({ agregarAlCarrito }: Props) {
  const { user } = useAuth();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

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

  // 🔥 GENERAR CATEGORÍAS DINÁMICAS
  const categorias = Array.from(
    new Set(productos.map((p) => p.categoria).filter(Boolean))
  ) as string[];

  // ✅ FILTRO COMPLETO (BÚSQUEDA + CATEGORÍA)
  const productosFiltrados = productos.filter((p) => {
    const texto = (p.nombre + p.descripcion).toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "" ||
      p.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  // PAGINACIÓN
  const indexInicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(
    indexInicio,
    indexInicio + productosPorPagina
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

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

      {/* 🔥 FILTROS */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row g-3">

          {/* 🔍 BUSCADOR */}
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          {/* 🔽 FILTRO POR CATEGORÍA */}
          <div className="col-md-6">
            <select
              className="form-select"
              value={categoriaSeleccionada}
              onChange={(e) => {
                setCategoriaSeleccionada(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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

                {/* 🔥 BADGES */}
                <div className="d-flex gap-2 mb-2 flex-wrap">

                  {producto.oferta && (
                    <span className="badge bg-warning-subtle text-dark border">
                      🔥 Oferta
                    </span>
                  )}

                  {producto.stock > 0 ? (
                    <span className="badge bg-success-subtle text-success border">
                      Disponible
                    </span>
                  ) : (
                    <span className="badge bg-danger-subtle text-danger border">
                      Sin stock
                    </span>
                  )}

                  {producto.categoria && (
                    <span className="badge bg-info-subtle text-dark border">
                      {producto.categoria}
                    </span>
                  )}

                </div>

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
                    className="btn btn-outline-warning mt-2"
                    onClick={() => enviarAOferta(producto._id)}
                  >
                    Marcar como oferta
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