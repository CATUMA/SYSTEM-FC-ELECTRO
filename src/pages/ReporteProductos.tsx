import { useEffect, useState } from "react";

type Producto = {
  _id: string;
  totalVendido: number;
  totalGanado: number;
};

function ReporteProductos() {
  const [data, setData] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/compras/reporte/top-productos")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
  <>
    <h4 className="mb-3">🔥 Productos más vendidos</h4>

    <table className="table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad vendida</th>
          <th>Total ganado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p, i) => (
          <tr key={i}>
            <td>{p._id}</td>
            <td>{p.totalVendido}</td>
            <td>S/ {p.totalGanado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
}

export default ReporteProductos;