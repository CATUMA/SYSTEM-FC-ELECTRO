import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Usuario = {
  _id: string;
  nombre: string;
  correo: string;
  rol: string;
};

function BuscarClientes() {

  const [texto, setTexto] = useState("");
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔍 BUSCAR
  const buscar = async () => {
    if (!texto.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/auth/usuarios/buscar/${texto}`
      );

      const data = await res.json();
      setClientes(data);

    } catch (error) {
      console.error("Error buscando clientes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">

      <h2>Buscar Clientes</h2>

      {/* INPUT */}
      <div className="d-flex gap-2 my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre o correo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <button className="btn btn-primary" onClick={buscar}>
          Buscar
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Buscando...</p>}

      {/* SIN RESULTADOS */}
      {!loading && clientes.length === 0 && texto && (
        <p>No se encontraron clientes</p>
      )}

      {/* RESULTADOS */}
      {clientes.map((c) => (
        <div
          key={c._id}
          className="border p-3 mb-2 rounded shadow-sm"
          style={{ cursor: "pointer", transition: "0.2s" }}
          onClick={() => navigate(`/admin/historial/${c._id}`)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        >
          <strong>{c.nombre}</strong>
          <p className="mb-0">{c.correo}</p>

          <small className="text-muted">
            Click para ver historial
          </small>
        </div>
      ))}

    </div>
  );
}

export default BuscarClientes;