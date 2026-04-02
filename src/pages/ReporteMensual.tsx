import { useEffect, useState } from "react";

type Reporte = {
  _id: { year: number; month: number };
  totalVentas: number;
  cantidadCompras: number;
};

function ReporteMensual() {
  const [data, setData] = useState<Reporte[]>([]);

  const meses = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

  useEffect(() => {
    fetch("http://localhost:4000/api/compras/reporte/mensual")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
  <>
    <h4 className="mb-3">📅 Reporte mensual</h4>

    <table className="table">
      <thead>
        <tr>
          <th>Año</th>
          <th>Mes</th>
          <th>Ventas totales</th>
          <th>Compras</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i}>
            <td>{r._id.year}</td>
            <td>{meses[r._id.month - 1]}</td>
            <td>S/ {r.totalVentas}</td>
            <td>{r.cantidadCompras}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
}

export default ReporteMensual;