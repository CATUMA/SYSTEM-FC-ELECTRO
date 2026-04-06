import { useState } from "react";

type Usuario = {
  _id: string;
  nombre: string;
  correo: string;
  rol: string;
};

type Props = {
  onVerHistorial: (id: string) => void;
};

function BuscarClientes({ onVerHistorial }: Props) {

  const [texto, setTexto] = useState("");
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const buscar = async () => {

    if (!texto.trim()) {
      setMensaje("⚠️ Ingresa un nombre o correo para buscar");
      setClientes([]);
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch(
        `http://localhost:4000/api/auth/usuarios/buscar/${texto}`
      );

      const data: Usuario[] = await res.json();

      if (!data || data.length === 0) {
        setClientes([]);
        setMensaje("❌ Usuario no registrado");
      } else {
        setClientes(data);
      }

    } catch (error) {
      console.error("Error buscando clientes", error);
      setMensaje("🚨 Error al buscar clientes");
    } finally {
      setLoading(false);
    }
  };

  const irHistorial = (id: string) => {
    if (!id) {
      setMensaje("⚠️ Cliente inválido");
      return;
    }
    onVerHistorial(id);
  };

  return (
    <div className="container my-5">

      <div className="mb-4 p-4 rounded text-white"
        style={{ background: "linear-gradient(90deg, #11998e, #38ef7d)" }}>
        <h3 className="fw-bold mb-1">👥 Gestión de Clientes</h3>
        <p className="mb-0">Busca y consulta clientes registrados</p>
      </div>

      <div className="input-group my-4 shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o correo..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
        />

        <button className="btn btn-success px-4" onClick={buscar}>
          Buscar
        </button>
      </div>

      {mensaje && (
        <div className="alert alert-warning text-center">
          {mensaje}
        </div>
      )}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-success"></div>
        </div>
      )}

      <div className="row">
        {clientes.map((c) => (
          <div key={c._id} className="col-md-6 mb-3">

            <div
              className="card shadow-sm p-3"
              style={{ cursor: "pointer" }}
              onClick={() => irHistorial(c._id)}
            >
              <strong>{c.nombre}</strong>
              <small>{c.correo}</small>

              <span className="badge bg-secondary mt-2">
                {c.rol}
              </span>

              <button
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  irHistorial(c._id);
                }}
              >
                Historial
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default BuscarClientes;