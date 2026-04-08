import { useEffect, useState } from "react";

// ✅ Tipo
type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: "Pendiente" | "En proceso" | "Finalizado";
  createdAt: string;
};

function HistorialSoporteAdmin() {
  const [servicios, setServicios] = useState<Soporte[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH (MISMO QUE PANEL)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/soporte");
        const data = await res.json();
        setServicios(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔥 MÉTRICAS (IGUAL QUE PANEL)
  const total = servicios.length;

  const pendientes = servicios.filter(
    (s) => s.estado === "Pendiente"
  ).length;

  const enProceso = servicios.filter(
    (s) => s.estado === "En proceso"
  ).length;

  const finalizados = servicios.filter(
    (s) => s.estado === "Finalizado"
  ).length;

  return (
    <div className="container-fluid mt-4 px-4">

      <h2 className="fw-bold mb-4">📊 Historial Técnico</h2>

      {/* 🔥 DASHBOARD */}
      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Total</h6>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Pendientes</h6>
            <h3>{pendientes}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm p-3">
            <h6>En proceso</h6>
            <h3>{enProceso}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Finalizados</h6>
            <h3>{finalizados}</h3>
          </div>
        </div>

      </div>

      {/* 🔥 TABLA HISTORIAL */}
      <div className="card shadow-sm">
        <div className="card-body">

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {servicios.map((s) => (
                  <tr key={s._id}>
                    <td>{s.nombre}</td>
                    <td>{s.tipoProducto}</td>

                    <td>
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
                    </td>

                    <td>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      </div>

    </div>
  );
}

export default HistorialSoporteAdmin;