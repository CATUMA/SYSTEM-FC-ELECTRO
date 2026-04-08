import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

// ✅ TIPOS CORRECTOS
type Mensaje = {
  estado: string;
  mensaje: string;
  fecha?: string;
};

type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: string;
  historial?: Mensaje[];
};

function HistorialSoporte() {
  const { user } = useAuth();
  const [servicios, setServicios] = useState<Soporte[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/soporte/usuario/${user.id}`
        );

        // ✅ TIPADO AQUÍ (CLAVE)
        const data: Soporte[] = await res.json();

        const filtrados = data.filter(
          (s) =>
            s.tipoProducto &&
            s.tipoProducto.trim() !== "" &&
            s.tipoProducto !== "Otro"
        );

        setServicios(filtrados);

      } catch (error) {
        console.error("Error al cargar historial:", error);
        setServicios([]);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">📦 Mis Soportes</h2>

      {servicios.length === 0 ? (
        <div className="alert alert-info text-center">
          No tienes solicitudes registradas
        </div>
      ) : (
        servicios.map((s) => (
          <div
            key={s._id}
            className="card shadow-sm mb-4 border-0"
            style={{ borderRadius: "12px" }}
          >
            {/* HEADER */}
            <div className="card-header d-flex justify-content-between bg-white">
              <div>
                <strong>Producto: {s.tipoProducto}</strong>
                <br />
                <small className="text-muted">
                  Cliente: {s.nombre}
                </small>
              </div>

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

            {/* 🔥 SOLO MENSAJES DEL SISTEMA (NO CLIENTE) */}
            <div
              className="card-body"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                background: "#f8f9fa"
              }}
            >
              {s.historial && s.historial.length > 0 ? (
                s.historial.map((h, i) => (
                  <div key={i} className="mb-2">
                    <div
                      style={{
                        background: "#e9ecef",
                        padding: "8px 12px",
                        borderRadius: "12px",
                        display: "inline-block"
                      }}
                    >
                      <small>{h.mensaje}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">
                  Sin historial
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HistorialSoporte;