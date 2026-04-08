import { useState } from "react";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";
import BuscarClientes from "./BuscarClientes";
import HistorialCliente from "./HistorialCliente";
import HistorialSoporteAdmin from "./HistorialSoporteAdmin"; // ✅ NUEVO
import { useAuth } from "../../context/useAuth";

function AdminLayout() {

  const [tab, setTab] = useState("productos");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <div className="container my-5">

      {/* HEADER */}
      <div
        className="mb-4 p-4 rounded text-white"
        style={{ background: "linear-gradient(90deg, #3a0ca3, #4361ee)" }}
      >
        <h2 className="fw-bold">🛠 Panel de Administración</h2>
        <p className="mb-0">Gestiona todo el sistema</p>
      </div>

      {/* BOTONES */}
      <div className="mb-4 d-flex gap-2 flex-wrap">

        <button
          className={`btn ${tab === "productos" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("productos")}
        >
          Productos
        </button>

        {user?.rol === "admin" && (
          <>
            <button
              className={`btn ${tab === "usuarios" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setTab("usuarios")}
            >
              Usuarios
            </button>

            <button
              className={`btn ${tab === "clientes" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setTab("clientes")}
            >
              Clientes
            </button>

            {/* 🔥 NUEVO BOTÓN */}
            <button
              className={`btn ${tab === "soporte" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setTab("soporte")}
            >
              Historial Técnico
            </button>
          </>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="card shadow border-0 p-4">

        {tab === "productos" && <AdminProductos />}

        {tab === "usuarios" && user?.rol === "admin" && (
          <AdminUsuarios />
        )}

        {tab === "clientes" && user?.rol === "admin" && (
          <BuscarClientes
            onVerHistorial={(id: string) => {
              setClienteId(id);
              setTab("historial");
            }}
          />
        )}

        {tab === "historial" && clienteId && (
          <HistorialCliente clienteId={clienteId} />
        )}

        {/* 🔥 NUEVO CONTENIDO */}
        {tab === "soporte" && user?.rol === "admin" && (
          <HistorialSoporteAdmin />
        )}

      </div>

    </div>
  );
}

export default AdminLayout;