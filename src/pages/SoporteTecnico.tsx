import { useState } from "react";
import { FaCog, FaWhatsapp } from "react-icons/fa";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/soporte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuarioId: user.id,
          nombre: formData.nombre,
          correo: formData.correo,
          tipoProducto: formData.tipoProducto,
          descripcion: formData.descripcion
        })
      });

      const data = await response.json();
      console.log(data);

      alert("Solicitud enviada correctamente");

      // 🔄 Reset (mantiene nombre y correo)
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        tipoProducto: "Laptop",
        descripcion: ""
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar la solicitud");
    }
  };

  return (
    <div className="container my-5">

      <div className="text-center mb-4">
        <FaCog size={50} className="text-primary mb-3" />
        <h2>Soporte Técnico</h2>
        <p className="text-muted">
          ¿Tienes algún problema con tu producto? Escríbenos.
        </p>
      </div>

      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo de producto</label>
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

          <div className="mb-3">
            <label className="form-label">Descripción del problema</label>
            <textarea
              className="form-control"
              rows={4}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Enviar solicitud
          </button>

        </form>

        <div className="text-center mt-4">
          <p className="mb-2">¿Tienes alguna otra duda?</p>

          <a
            href="https://wa.me/51947792061"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            <FaWhatsapp className="me-2" />
            Contáctanos por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

export default SoporteTecnico;