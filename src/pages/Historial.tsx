import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

type ProductoCompra = {
  nombre: string;
  precio: number;
  cantidad: number;
};

type Compra = {
  _id: string;
  numeroComprobante: string;
  clienteNombre: string;
  productos: ProductoCompra[];
  total: number;
  fecha: string;
};

function Historial() {

  const { user } = useAuth();
  const [compras, setCompras] = useState<Compra[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:4000/api/compras/usuario/${user.id}`)
      .then(res => res.json())
      .then(data => setCompras(data))
      .catch(err => console.error("Error:", err));
  }, [user]);

  return (
    <div className="container my-5">

      {/* HEADER */}
      <div className="mb-4 p-4 text-white rounded"
        style={{
          background: "linear-gradient(90deg, #0d6efd, #2563eb)"
        }}>
        <h2 className="fw-bold mb-1">🧾 Historial de compras</h2>
        <p className="mb-0">Consulta todas tus órdenes realizadas</p>
      </div>

      {compras.length === 0 ? (
        <div className="text-center mt-5">
          <h5>No tienes compras aún</h5>
          <p className="text-muted">Cuando compres aparecerán aquí</p>
        </div>
      ) : (
        compras.map((c) => (

          <div
            key={c._id}
            className="card mb-4 border-0"
            style={{
              borderRadius: "15px",
              overflow: "hidden",
              transition: "0.3s",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
            }}
          >

            {/* HEADER COMPRA */}
            <div className="p-3 d-flex justify-content-between align-items-center"
              style={{ background: "#f8f9fa" }}>

              <div>
                <h6 className="fw-bold mb-1">
                  🧾 {c.numeroComprobante}
                </h6>
                <small className="text-muted">
                  {new Date(c.fecha).toLocaleString()}
                </small>
              </div>

              <div className="text-end">
                <h5 className="fw-bold text-success mb-1">
                  S/ {c.total}
                </h5>
                <span className="badge bg-success">
                  ✔ Completado
                </span>
              </div>

            </div>

            {/* PRODUCTOS */}
            <div className="p-3">

              {c.productos.map((p, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                  style={{ background: "#f8f9fa" }}
                >
                  <div>
                    <strong>{p.nombre}</strong>
                  </div>

                  <div className="text-muted">
                    {p.cantidad} x S/ {p.precio}
                  </div>
                </div>
              ))}

            </div>

            {/* FOOTER */}
            <div className="p-3 text-end">

              <button
                className="btn"
                style={{
                  background: "linear-gradient(45deg, #111827, #374151)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                onClick={() =>
                  navigate("/comprobante", { state: { compra: c } })
                }
              >
                📄 Ver comprobante
              </button>

            </div>

          </div>

        ))
      )}

    </div>
  );
}

export default Historial;