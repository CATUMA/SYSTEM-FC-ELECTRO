import { useEffect, useState } from "react";

// ✅ TIPAR ESTADOS CORRECTAMENTE
type Estado = "Pendiente" | "En proceso" | "Finalizado";

// ✅ Tipo Soporte
type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: Estado;
  descripcion?: string;
};

// ✅ Estados tipados
const estados: Estado[] = ["Pendiente", "En proceso", "Finalizado"];

// ✅ Colores tipados correctamente
const colores: Record<Estado, { bg: string; border: string }> = {
  Pendiente: { bg: "#fff5f5", border: "#dc3545" },
  "En proceso": { bg: "#fff9e6", border: "#ffc107" },
  Finalizado: { bg: "#f0fff4", border: "#198754" },
};

function AdminSoporte() {
  const [servicios, setServicios] = useState<Soporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // 🔥 Cargar datos
  const cargar = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/soporte");
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : []);
    } catch {
      setServicios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // 🔥 Actualizar estado
  const actualizar = async (id: string, estado: Estado) => {
    setServicios((prev) =>
      prev.map((s) => (s._id === id ? { ...s, estado } : s))
    );

    try {
      await fetch(`http://localhost:4000/api/soporte/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      setMensaje("Estado actualizado ✔");
      setTimeout(() => setMensaje(""), 2000);
    } catch {
      console.error("Error actualizando");
    }
  };

  // 🔥 Conteo
  const count = {
    Pendiente: servicios.filter((s) => s.estado === "Pendiente").length,
    "En proceso": servicios.filter((s) => s.estado === "En proceso").length,
    Finalizado: servicios.filter((s) => s.estado === "Finalizado").length,
  };

  return (
    <div className="container-fluid mt-4 px-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛠 Panel de Soporte</h2>
        <span className="text-muted">
          {loading ? "Cargando..." : `${servicios.length} solicitudes`}
        </span>
      </div>

      {/* DASHBOARD */}
      <div className="row mb-4">
        {Object.entries(count).map(([key, value]) => (
          <div key={key} className="col-md-4">
            <div className="card shadow-sm border-0 p-3 text-center">
              <h6 className="text-muted">{key}</h6>
              <h3 className="fw-bold">{value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* MENSAJE */}
      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (

        <div className="row">

          {estados.map((estado) => (
            <div key={estado} className="col-lg-4 mb-4">

              <div
                className="rounded-4 p-3 h-100"
                style={{ backgroundColor: colores[estado].bg }}
              >

                <h5 className="fw-bold text-center mb-3">{estado}</h5>

                {servicios
                  .filter((s) => s.estado === estado)
                  .map((s) => (

                    <div
                      key={s._id}
                      className="card mb-3 border-0 shadow-sm"
                      style={{
                        borderLeft: `6px solid ${colores[estado].border}`,
                        transition: "0.2s"
                      }}
                    >

                      <div className="card-body">

                        <h6 className="fw-bold mb-1">{s.nombre}</h6>

                        <small className="text-muted d-block mb-2">
                          {s.tipoProducto}
                        </small>

                        {/* 🔥 PROBLEMA */}
                        {s.descripcion && (
                          <div className="bg-light p-2 rounded small mb-2">
                            <strong>Problema:</strong>
                            <br />
                            {s.descripcion}
                          </div>
                        )}

                        {/* BOTONES */}
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {estados.map((e) => (
                            <button
                              key={e}
                              className={`btn btn-sm ${
                                s.estado === e
                                  ? "btn-dark"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() => actualizar(s._id, e)}
                            >
                              {e}
                            </button>
                          ))}
                        </div>

                      </div>
                    </div>

                  ))}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminSoporte;