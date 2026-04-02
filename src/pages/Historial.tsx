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
  numeroComprobante: string; // 🔥 NUEVO
  clienteNombre: string;     // 🔥 NUEVO
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
    <div className="container mt-4">

      <h2 className="mb-4">🧾 Historial de compras</h2>

      {compras.length === 0 ? (
        <p>No tienes compras</p>
      ) : (
        compras.map((c) => (
          <div key={c._id} className="card shadow p-3 mb-4">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">
                  N°: {c.numeroComprobante}
                </h5>
                <small className="text-muted">
                  {new Date(c.fecha).toLocaleString()}
                </small>
              </div>

              <div className="text-end">
                <h5 className="text-success">
                  S/ {c.total}
                </h5>
              </div>
            </div>

            <hr />

            {/* PRODUCTOS */}
            <ul className="list-group mb-3">
              {c.productos.map((p, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between">
                  <span>{p.nombre}</span>
                  <span>
                    {p.cantidad} x S/ {p.precio}
                  </span>
                </li>
              ))}
            </ul>

            {/* BOTÓN */}
            <div className="text-end">
              <button
                className="btn btn-dark"
                onClick={() =>
                  navigate("/comprobante", { state: { compra: c } })
                }
              >
                Ver comprobante
              </button>
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default Historial;