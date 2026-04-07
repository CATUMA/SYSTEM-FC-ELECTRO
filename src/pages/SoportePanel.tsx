import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: string;
};

const estados = ["Pendiente", "En proceso", "Finalizado"];

function SoportePanel() {
  const [servicios, setServicios] = useState<Soporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [seleccionado, setSeleccionado] = useState<Soporte | null>(null);
  const [mensaje, setMensaje] = useState("");

  const { user } = useAuth();

  useEffect(() => {
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

    cargar();
  }, []);

  const actualizar = async (id: string, estado: string) => {
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
      console.error("Error");
    }
  };

  const serviciosFiltrados = servicios.filter((s) => {
    return (
      s.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
      (estadoFiltro === "Todos" || s.estado === estadoFiltro)
    );
  });

  const count = {
    Pendiente: servicios.filter(s => s.estado === "Pendiente").length,
    "En proceso": servicios.filter(s => s.estado === "En proceso").length,
    Finalizado: servicios.filter(s => s.estado === "Finalizado").length,
  };

  return (
    <div className="container-fluid mt-4 px-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛠 Panel de Soporte</h2>
        <span className="text-muted">{servicios.length} solicitudes</span>
      </div>

      {/* DASHBOARD CARDS */}
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

      {/* FILTROS */}
      <div className="card shadow-sm p-3 mb-4 border-0">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Buscar cliente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
            >
              <option value="Todos">Todos</option>
              {estados.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
      </div>

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

              <div className="bg-light rounded-4 p-3 h-100">

                <h5 className="fw-bold text-center mb-3">{estado}</h5>

                {serviciosFiltrados
                  .filter((s) => s.estado === estado)
                  .map((s) => (

                    <div
                      key={s._id}
                      className="card mb-3 border-0 shadow-sm"
                      style={{
                        borderLeft: `5px solid ${
                          estado === "Pendiente"
                            ? "#dc3545"
                            : estado === "En proceso"
                            ? "#ffc107"
                            : "#198754"
                        }`,
                        cursor: "pointer",
                        transition: "0.2s"
                      }}
                      onClick={() => setSeleccionado(s)}
                    >

                      <div className="card-body">

                        <h6 className="fw-bold mb-1">{s.nombre}</h6>
                        <small className="text-muted">
                          {s.tipoProducto}
                        </small>

                        {(user?.rol === "soporte" || user?.rol === "admin") && (
                          <div className="mt-3 d-flex flex-wrap gap-2">
                            {estados.map((e) => (
                              <button
                                key={e}
                                className={`btn btn-sm ${
                                  s.estado === e
                                    ? "btn-dark"
                                    : "btn-outline-secondary"
                                }`}
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  actualizar(s._id, e);
                                }}
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>

                  ))}

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL PROFESIONAL */}
      {seleccionado && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999
          }}
        >
          <div className="bg-white p-4 rounded-4 shadow" style={{ width: "400px" }}>
            <h5 className="fw-bold">{seleccionado.nombre}</h5>
            <p className="text-muted">{seleccionado.tipoProducto}</p>
            <p><strong>Estado:</strong> {seleccionado.estado}</p>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => setSeleccionado(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default SoportePanel;