import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

function Registro() {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre,
          correo: correo,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje);
        return;
      }

      alert("Usuario registrado correctamente");

      // 🔁 ir a login
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Error al registrar");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        
        <div className="text-center mb-4">
          <img src={logo} alt="FSelectro" width="120" />
          <p className="text-muted mt-2">Crea tu cuenta</p>
        </div>

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
        </div>

        <button className="btn btn-success w-100" onClick={handleRegister}>
          Crear cuenta
        </button>

        <div className="text-center mt-3">
          <small>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login">Inicia sesión</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Registro;