import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Compra = {
  _id: string;
  total: number;
  fecha: string;
  productos: {
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
};

function HistorialCliente() {

  const { id } = useParams();
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/compras/usuario/${id}`)
      .then(res => res.json())
      .then(data => setCompras(data));
  }, [id]);

  return (
    <div className="container my-5">

      <h2>Historial de compras</h2>

      {compras.map((c) => (
        <div key={c._id} className="border p-3 mb-3 rounded">

          <p><strong>Total:</strong> S/ {c.total}</p>
          <p><strong>Fecha:</strong> {new Date(c.fecha).toLocaleDateString()}</p>

          <ul>
            {c.productos.map((p, i) => (
              <li key={i}>
                {p.nombre} - {p.cantidad} x S/ {p.precio}
              </li>
            ))}
          </ul>

        </div>
      ))}

    </div>
  );
}

export default HistorialCliente;