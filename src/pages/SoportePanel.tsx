import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth"; // ✅ RUTA CORRECTA

type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: string;
};

function SoportePanel() {
  const [servicios, setServicios] = useState<Soporte[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/soporte");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Formato incorrecto:", data);
          setServicios([]);
          return;
        }

        setServicios(data);
      } catch (error) {
        console.error("Error cargando soporte", error);
        setServicios([]);
      }
    };

    cargar(); // ✅ ahora ya no marca warning
  }, []);

  const actualizar = async (id: string, estado: string) => {
    try {
      await fetch(`http://localhost:4000/api/soporte/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      // 🔄 recargar
      const res = await fetch("http://localhost:4000/api/soporte");
      const data = await res.json();
      setServicios(data);

    } catch (error) {
      console.error("Error actualizando", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛠 Panel de Soporte Técnico</h2>

      {servicios.length === 0 && (
        <p className="text-muted">No hay solicitudes de soporte</p>
      )}

      {servicios.map((s) => (
        <div key={s._id} className="card p-3 mb-3 shadow-sm">

          <p><strong>Cliente:</strong> {s.nombre}</p>
          <p><strong>Producto:</strong> {s.tipoProducto}</p>

          {(user?.rol === "soporte" || user?.rol === "admin") ? (
            <select
              className="form-select"
              value={s.estado}
              onChange={(e) => actualizar(s._id, e.target.value)}
            >
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Finalizado</option>
            </select>
          ) : (
            <span className="badge bg-secondary">{s.estado}</span>
          )}

        </div>
      ))}
    </div>
  );
}

export default SoportePanel;