import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import bg from "../assets/bg-tech.jpg.jpg"; // 👈 fondo

function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(""); // ✅ SE USA
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 VALIDACIONES PRO
  const validarFormulario = () => {
    if (!nombre.trim()) return "El nombre es obligatorio";

    if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";

    if (!correo.trim()) return "El correo es obligatorio";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) return "Correo inválido";

    if (!password) return "La contraseña es obligatoria";

    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";

    if (!/[A-Z]/.test(password))
      return "Debe contener al menos una mayúscula";

    if (!/[0-9]/.test(password))
      return "Debe contener al menos un número";

    return "";
  };

  const handleRegister = async () => {
    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "Error al registrar");
        return;
      }

      navigate("/login");

    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      {/* overlay oscuro */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
        }}
      />

      {/* CARD */}
      <div
        className="card p-4 shadow-lg position-relative"
        style={{
          width: "420px",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="logo" width="100" />
          <h5 className="mt-3 fw-bold">Crea tu cuenta</h5>
        </div>

        {/* 🔴 ERROR (SOLUCIÓN DEL ESLINT) */}
        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <small className="text-muted">
            Mínimo 6 caracteres, 1 mayúscula y 1 número
          </small>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>

        <div className="text-center mt-3">
          <small>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Registro;