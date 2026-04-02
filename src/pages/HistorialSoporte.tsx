import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

// ✅ Tipo de datos
type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: string;
};

function HistorialSoporte() {

  const { user } = useAuth();
  const [servicios, setServicios] = useState<Soporte[]>([]);

  // ✅ useEffect limpio (SIN errores ESLint)
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:4000/api/soporte/usuario/${user.id}`
        );
        const data = await res.json();
        setServicios(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Mis Soportes</h2>

      {servicios.length === 0 ? (
        <p>No tienes solicitudes registradas</p>
      ) : (
        servicios.map((s) => (
          <div key={s._id} className="card p-3 mb-3">
            <p><strong>Producto:</strong> {s.tipoProducto}</p>
            <p><strong>Cliente:</strong> {s.nombre}</p>

            {/* 🔥 Estado con colores */}
            <span
              className={
                s.estado === "Pendiente"
                  ? "badge bg-warning"
                  : s.estado === "En proceso"
                  ? "badge bg-primary"
                  : "badge bg-success"
              }
            >
              {s.estado}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default HistorialSoporte;