import { useState } from "react";
import {
  FaCog,
  FaWhatsapp,
  FaUser,
  FaEnvelope,
  FaLaptop,
  FaAlignLeft
} from "react-icons/fa";
import { useAuth } from "../context/useAuth";

type FormData = {
  nombre: string;
  correo: string;
  tipoProducto: string;
  descripcion: string;
};

function SoporteTecnico() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nombre: user?.nombre || "",
    correo: user?.correo || "",
    tipoProducto: "Laptop",
    descripcion: ""
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validar = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio";
    if (!formData.correo.includes("@")) return "Correo inválido";
    if (!formData.descripcion.trim()) return "La descripción es obligatoria";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!user) {
      setError("Debes iniciar sesión");
      return;
    }

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/soporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuarioId: user.id,
          ...formData
        })
      });

      if (!response.ok) throw new Error();

      await response.json();

      setMensaje("Solicitud enviada correctamente ✅");

      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        tipoProducto: "Laptop",
        descripcion: ""
      });

    } catch {
      setError("Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">

      {/* HEADER */}
      <div className="text-center mb-5">
        <FaCog size={55} className="text-primary mb-3" />
        <h2 className="fw-bold">Soporte Técnico</h2>
        <p className="text-muted">
          Registra tu problema y nuestro equipo lo resolverá rápidamente
        </p>
      </div>

      <div className="row">

        {/* FORMULARIO */}
        <div className="col-lg-7">
          <div className="card shadow p-4" style={{ borderRadius: "15px" }}>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

              {/* NOMBRE */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* CORREO */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* PRODUCTO */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Producto</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaLaptop />
                  </span>
                  <select
                    className="form-select"
                    name="tipoProducto"
                    value={formData.tipoProducto}
                    onChange={handleChange}
                  >
                    <option>Laptop</option>
                    <option>Televisor</option>
                    <option>Celular</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Problema</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaAlignLeft />
                  </span>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>

            </form>
          </div>
        </div>

        {/* PANEL LATERAL */}
        <div className="col-lg-5 mt-4 mt-lg-0">

          <div className="card shadow p-4 text-center" style={{ borderRadius: "15px" }}>
            <h5 className="fw-bold mb-3">¿Atención inmediata?</h5>

            <p className="text-muted">
              O escríbenos directamente por WhatsApp
            </p>

            <a
              href="https://wa.me/51947792061"
              target="_blank"
              className="btn btn-success"
            >
              <FaWhatsapp className="me-2" />
              WhatsApp
            </a>
          </div>

          <div className="card shadow p-4 mt-4" style={{ borderRadius: "15px" }}>
            <h6 className="fw-bold">⏱ Tiempo de respuesta</h6>
            <p className="text-muted mb-0">
              Respondemos en menos de 24 horas
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SoporteTecnico;