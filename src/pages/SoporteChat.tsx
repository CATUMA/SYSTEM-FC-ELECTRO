import { useEffect, useState } from "react";

type Soporte = {
  _id: string;
  nombre: string;
  tipoProducto: string;
  mensajes: {
    emisor: string;
    mensaje: string;
    fecha?: string;
    leido?: boolean;
  }[];
};

function SoporteChat() {
  const [soportes, setSoportes] = useState<Soporte[]>([]);
  const [activo, setActivo] = useState<Soporte | null>(null);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchSoportes = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/soporte");
        const data = await res.json();

        if (!isMounted) return;

        setSoportes(data);

        // 🔥 mantener chat activo actualizado
        if (activo) {
          const actualizado = data.find((s: Soporte) => s._id === activo._id);
          if (actualizado) setActivo(actualizado);
        }

      } catch (error) {
        console.error("Error cargando soportes", error);
      }
    };

    fetchSoportes();
    const interval = setInterval(fetchSoportes, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activo]);

  // 📩 ENVIAR MENSAJE
  const enviarMensaje = async () => {
    if (!texto || !activo) return;

    try {
      await fetch(
        `http://localhost:4000/api/soporte/${activo._id}/mensaje`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mensaje: texto,
            emisor: "soporte",
          }),
        }
      );

      setTexto("");

      // 🔥 actualizar inmediatamente
      const res = await fetch("http://localhost:4000/api/soporte");
      const data = await res.json();
      setSoportes(data);

      const actualizado = data.find((s: Soporte) => s._id === activo._id);
      if (actualizado) setActivo(actualizado);

    } catch (error) {
      console.error("Error enviando mensaje", error);
    }
  };

  // ✔ MARCAR COMO LEÍDO
  const marcarLeido = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/soporte/${id}/leido`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Error marcando leído", error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row" style={{ height: "80vh" }}>

        {/* 🧾 LISTA */}
        <div className="col-md-4 border-end overflow-auto">
          <h5 className="mb-3">Soportes</h5>

          {soportes.map((s) => {
            const noLeidos = s.mensajes.filter(
              (m) => !m.leido && m.emisor === "cliente"
            ).length;

            return (
              <div
                key={s._id}
                className={`p-2 mb-2 rounded ${
                  activo?._id === s._id ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setActivo(s);
                  marcarLeido(s._id); // 🔥 importante
                }}
              >
                <strong>{s.nombre}</strong>
                <br />
                <small>{s.tipoProducto}</small>

                {noLeidos > 0 && (
                  <span className="badge bg-danger float-end">
                    {noLeidos}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 💬 CHAT */}
        <div className="col-md-8 d-flex flex-column">
          {activo ? (
            <>
              <h5>Chat con {activo.nombre}</h5>

              <div className="flex-grow-1 border p-3 mb-2 overflow-auto">
                {activo.mensajes?.map((m, i) => (
                  <div
                    key={i}
                    className={`mb-2 ${
                      m.emisor === "soporte"
                        ? "text-end"
                        : "text-start"
                    }`}
                  >
                    <span
                      className={`p-2 rounded ${
                        m.emisor === "soporte"
                          ? "bg-primary text-white"
                          : "bg-light"
                      }`}
                    >
                      {m.mensaje}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escribe un mensaje..."
                />
                <button
                  className="btn btn-primary"
                  onClick={enviarMensaje}
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <p className="text-muted">Selecciona un soporte</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default SoporteChat;