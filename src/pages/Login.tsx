import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/useAuth";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje);
        return;
      }

      // Guardar usuario
      login(data.usuario);

      // Redirigir
      if (data.usuario.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/inicio");
      }

    } catch (error) {
      console.error(error);
      alert("Error en login");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        
        <div className="text-center mb-4">
          <img src={logo} alt="FSelectro" width="120" />
          <p className="text-muted mt-2">Accede a tu cuenta</p>
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
        </div>

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Ingresar
        </button>

        <div className="text-center mt-3">
          <small>
            ¿No tienes tu cuenta?{" "}
            <Link to="/registro">Regístrate</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;