import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

// ✅ Tipo de datos
type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  estado: string;
  mensajes: {
    emisor: string;
    mensaje: string;
    fecha: string;
  }[];
};

function HistorialSoporte() {

  const { user } = useAuth();
  const [servicios, setServicios] = useState<Soporte[]>([]);
  const [mensajesInput, setMensajesInput] = useState<{ [key: string]: string }>({});

  // ✅ FETCH DIRECTO (SOLUCIÓN LIMPIA)
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
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

  // 📩 ENVIAR MENSAJE
  const enviarMensaje = async (id: string) => {
    const mensaje = mensajesInput[id];

    if (!mensaje || !mensaje.trim()) return;

    try {
      await fetch(`http://localhost:4000/api/soporte/${id}/mensaje`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje,
          emisor: "cliente",
        }),
      });

      // limpiar input
      setMensajesInput((prev) => ({ ...prev, [id]: "" }));

      // 🔥 recargar manual (NO dentro del effect)
      const res = await fetch(
        `http://localhost:4000/api/soporte/usuario/${user?.id}`
      );
      const data = await res.json();
      setServicios(data);

    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

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
                <strong>{s.tipoProducto}</strong>
                <br />
                <small className="text-muted">{s.nombre}</small>
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

            {/* CHAT */}
            <div
              className="card-body"
              style={{ maxHeight: "300px", overflowY: "auto", background: "#f8f9fa" }}
            >
              {s.mensajes?.length > 0 ? (
                s.mensajes.map((m, i) => (
                  <div
                    key={i}
                    className={`d-flex mb-2 ${
                      m.emisor === "cliente"
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      style={{
                        background:
                          m.emisor === "cliente" ? "#0d6efd" : "#e9ecef",
                        color: m.emisor === "cliente" ? "white" : "black",
                        padding: "8px 12px",
                        borderRadius: "12px",
                        maxWidth: "70%",
                      }}
                    >
                      <small>{m.mensaje}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Sin mensajes</p>
              )}
            </div>

            {/* INPUT */}
            <div className="card-footer bg-white d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe un mensaje..."
                value={mensajesInput[s._id] || ""}
                onChange={(e) =>
                  setMensajesInput((prev) => ({
                    ...prev,
                    [s._id]: e.target.value,
                  }))
                }
              />

              <button
                className="btn btn-primary"
                onClick={() => enviarMensaje(s._id)}
              >
                Enviar
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default HistorialSoporte;