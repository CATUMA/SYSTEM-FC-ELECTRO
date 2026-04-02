import { useEffect, useState } from "react";

type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: string;
};

function SoportePanel() {

  const [servicios, setServicios] = useState<Soporte[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:4000/api/soporte");
      const data = await res.json();
      setServicios(data);
    };

    fetchData();
  }, []);

  const actualizar = async (id: string, estado: string) => {
    await fetch(`http://localhost:4000/api/soporte/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });

    // recargar
    const res = await fetch("http://localhost:4000/api/soporte");
    const data = await res.json();
    setServicios(data);
  };

  return (
    <div className="container mt-4">
      <h2>Panel Soporte Técnico</h2>

      {servicios.map((s) => (
        <div key={s._id} className="card p-3 mb-3">
          <p><strong>Cliente:</strong> {s.nombre}</p>
          <p><strong>Producto:</strong> {s.tipoProducto}</p>

          <select
            value={s.estado}
            onChange={(e) => actualizar(s._id, e.target.value)}
          >
            <option>Pendiente</option>
            <option>En proceso</option>
            <option>Finalizado</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default SoportePanel;