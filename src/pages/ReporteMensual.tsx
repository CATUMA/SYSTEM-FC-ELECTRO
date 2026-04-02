import { useEffect, useState } from "react";

type Reporte = {
  _id: { year: number; month: number };
  totalVentas: number;
  cantidadCompras: number;
};

function ReporteMensual() {
  const [data, setData] = useState<Reporte[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/compras/reporte/mensual")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="container mt-4">
      <h2>📊 Reporte mensual de ventas</h2>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Año</th>
            <th>Mes</th>
            <th>Total Ventas</th>
            <th>Compras</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              <td>{r._id.year}</td>
              <td>{r._id.month}</td>
              <td>S/ {r.totalVentas}</td>
              <td>{r.cantidadCompras}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReporteMensual;