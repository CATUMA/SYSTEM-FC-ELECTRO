import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/useAuth";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔥 VALIDACIÓN
  const validar = () => {
    if (!correo.includes("@")) return "Correo inválido";
    if (password.length < 6) return "La contraseña debe tener mínimo 6 caracteres";
    return "";
  };

  const handleLogin = async () => {
    setError("");

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "Error en login");
        return;
      }

      login(data.usuario);

      // 🔥 REDIRECCIÓN SEGURA
      switch (data.usuario.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "soporte":
          navigate("/soporte-panel");
          break;
        default:
          navigate("/inicio");
      }

    } catch (error) {
      console.error(error);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3a86ff, #00b4d8)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "400px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-4">

          {/* HEADER */}
          <div className="text-center mb-4">
            <img src={logo} alt="logo" width="100" />
            <h5 className="fw-bold mt-3">Bienvenido</h5>
            <p className="text-muted">Inicia sesión en tu cuenta</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger text-center py-2">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@gmail.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>
            <small className="text-muted">
              La contraseña debe tener al menos 6 caracteres
            </small>
          </div>

          {/* BUTTON */}
          <button
            className="btn btn-primary w-100 mt-2"
            onClick={handleLogin}
            disabled={loading}
            style={{
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          {/* FOOTER */}
          <div className="text-center mt-3">
            <small>
              ¿No tienes cuenta?{" "}
              <Link to="/registro">Regístrate</Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;