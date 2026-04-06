import { useState } from "react";
import ReporteMensual from "./ReporteMensual";
import ReporteProductos from "./ReporteProductos";
import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

function Informes() {
  const { user } = useAuth();
  const [tab, setTab] = useState("mensual");

  // 🔒 PROTECCIÓN DE RUTA
  if (!user || (user.rol !== "admin" && user.rol !== "vendedor")) {
    return <Navigate to="/inicio" />;
  }

  

  return (
    <div className="container mt-4">

      <h2 className="mb-4">📊 Panel de Informes</h2>

      {/* 🔥 BOTONES */}
      <div className="d-flex gap-3 mb-4">
        <button
          className={`btn ${tab === "mensual" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("mensual")}
        >
          Reporte mensual
        </button>

        <button
          className={`btn ${tab === "productos" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setTab("productos")}
        >
          Top productos
        </button>
      </div>

      {/* 🔥 CONTENIDO */}
      <div className="card shadow-sm p-4">
        {tab === "mensual" && <ReporteMensual />}
        {tab === "productos" && <ReporteProductos />}
      </div>

    </div>
  );
}

export default Informes;