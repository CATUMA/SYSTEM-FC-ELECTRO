import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaCog } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [preview, setPreview] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 PREVIEW IMAGEN
  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // 🔹 GUARDAR FOTO
  const handleUpload = async () => {
    if (!preview || !user) return;

    try {
      await fetch(`http://localhost:4000/api/auth/usuarios/${user.id}/foto`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: preview })
      });

      const updatedUser = { ...user, foto: preview };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setPreview(null);
      window.location.reload();

    } catch (error) {
      console.error("Error subiendo foto", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">

        {/* LOGO */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/inicio"
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "32px", height: "32px" }}
          />
          FC ELECTRO
        </Link>

        {/* MENÚ */}
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/inicio">Inicio</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/ofertas">Ofertas</Link>
            </li>

            {/* 🔥 CLIENTE */}
            {user?.rol === "cliente" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/historial">
                    Mis compras
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/soporte">
                    Soporte técnico
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/mis-soportes">
                    Mis soportes
                  </Link>
                </li>
              </>
            )}

            {/* 🔥 SOPORTE */}
            {user?.rol === "soporte" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/soporte">
                  Panel soporte
                </Link>
              </li>
            )}

            {/* 🔥 ADMIN Y VENDEDOR */}
            {(user?.rol === "admin" || user?.rol === "vendedor") && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Administrar productos
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/reporte-mensual">
                    Reporte Ventas
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/reporte-productos">
                    Top Productos
                  </Link>
                </li>
              </>
            )}

            {/* 🔥 SOLO ADMIN */}
            {user?.rol === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/usuarios">
                    Administrar usuarios
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/admin/clientes">
                    Buscar clientes
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>

        {/* ICONOS */}
        <div className="d-flex align-items-center gap-4">

          <FaSearch
            size={18}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/productos")}
          />

          <Link to="/carrito">
            <FaShoppingCart size={18} />
          </Link>

          {/* 🔥 ICONO SOPORTE DINÁMICO */}
          <FaCog
            size={18}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (user?.rol === "cliente") navigate("/soporte");
              else if (user?.rol === "soporte") navigate("/admin/soporte");
            }}
          />

          {/* 👤 USUARIO */}
          {user ? (
            <div className="dropdown">
              <div style={{ cursor: "pointer" }} data-bs-toggle="dropdown">

                {user.foto ? (
                  <img
                    src={user.foto}
                    alt="perfil"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <FaUser size={18} />
                )}

              </div>

              <ul className="dropdown-menu dropdown-menu-end p-3" style={{ width: "260px" }}>

                <li className="text-center mb-2">
                  <img
                    src={preview || user.foto || "https://via.placeholder.com/80"}
                    alt="perfil"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ddd"
                    }}
                  />
                </li>

                <li className="text-center">
                  <strong>{user.nombre}</strong>
                </li>

                <li className="text-center text-muted" style={{ fontSize: "14px" }}>
                  {user.correo}
                </li>

                <li className="text-center text-muted mb-2" style={{ fontSize: "13px" }}>
                  {user.rol}
                </li>

                <li><hr /></li>

                <li className="mb-2">
                  <label className="btn btn-outline-primary w-100 btn-sm">
                    Cambiar foto
                    <input type="file" hidden onChange={handlePreview} />
                  </label>
                </li>

                {preview && (
                  <li className="mb-2">
                    <button
                      className="btn btn-success w-100 btn-sm"
                      onClick={handleUpload}
                    >
                      Guardar foto
                    </button>
                  </li>
                )}

                <li><hr /></li>

                <li>
                  <button
                    className="btn btn-danger w-100 btn-sm"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>

              </ul>
            </div>
          ) : (
            <Link to="/login">
              <FaUser size={18} />
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;