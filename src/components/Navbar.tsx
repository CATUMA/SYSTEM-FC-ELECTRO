import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaCog } from "react-icons/fa";
import logo from "../assets/logo.png";
import { useAuth } from "../context/useAuth";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ ESTADO INICIAL DESDE LOCALSTORAGE (SIN useEffect)
  const [preview, setPreview] = useState<string | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.foto || null;
    }
    return null;
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ SUBIR FOTO (PERSISTENTE)
  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;

      setPreview(base64);

      // 🔥 GUARDAR EN LOCALSTORAGE
      const updatedUser = { ...user, foto: base64 };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    reader.readAsDataURL(file);
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "linear-gradient(90deg, #3a86ff, #00b4d8)",
        padding: "12px 0",
      }}
    >
      <div className="container">

        {/* 🔥 LOGO */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold"
          to="/inicio"
        >
          <img src={logo} style={{ width: 35 }} />
          FC ELECTRO
        </Link>

        {/* 🔥 MENÚ */}
        <ul className="navbar-nav mx-auto d-flex gap-4">

          {["Inicio", "Productos", "Ofertas"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item.toLowerCase()}`}
                className="nav-link text-white fw-semibold"
              >
                {item}
              </Link>
            </li>
          ))}

          {/* 🔥 CLIENTE */}
          {user?.rol === "cliente" && (
            <>
              <li>
                <Link className="nav-link text-white" to="/historial">
                  Mis compras
                </Link>
              </li>
              <li>
                <Link className="nav-link text-white" to="/soporte">
                  Soporte
                </Link>
              </li>
            </>
          )}

          {/* 🔥 ADMIN / VENDEDOR */}
          {(user?.rol === "admin" || user?.rol === "vendedor") && (
            <>
              <li>
                <Link className="nav-link text-white" to="/admin">
                  Admin
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white" to="/informes">
                  Informes
                </Link>
              </li>
            </>
          )}

        </ul>

        {/* 🔥 ICONOS */}
        <div className="d-flex align-items-center gap-4">

          <FaSearch
            size={18}
            color="white"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/productos")}
          />

          <Link to="/carrito">
            <FaShoppingCart size={18} color="white" />
          </Link>

          {/* 🔥 SOLO SI HAY USUARIO */}
          {user && (
            <FaCog
              size={18}
              color="white"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (user.rol === "cliente") navigate("/soporte");
                if (user.rol === "soporte") navigate("/admin/soporte");
              }}
            />
          )}

          {/* 🔥 PERFIL */}
          {user ? (
            <div className="dropdown">
              <div data-bs-toggle="dropdown" style={{ cursor: "pointer" }}>

                {preview || user?.foto ? (
                  <img
                    src={preview || user?.foto}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid white"
                    }}
                  />
                ) : (
                  <FaUser size={20} color="white" />
                )}

              </div>

              {/* 🔥 DROPDOWN */}
              <ul
                className="dropdown-menu dropdown-menu-end p-3 shadow"
                style={{
                  width: "260px",
                  borderRadius: "15px"
                }}
              >
                <div className="text-center">

                  <img
                    src={preview || user?.foto || "https://via.placeholder.com/80"}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      marginBottom: "10px",
                    }}
                  />

                  <h6>{user.nombre}</h6>
                  <small className="text-muted">{user.correo}</small>

                  {/* 🔥 ROL */}
                  <div className="mt-1">
                    <span className="badge bg-primary">
                      {user.rol}
                    </span>
                  </div>
                </div>

                <hr />

                {/* 🔥 SUBIR FOTO */}
                <label className="btn btn-outline-primary w-100 mb-2 btn-sm">
                  Cambiar foto
                  <input type="file" hidden onChange={handlePreview} />
                </label>

                <button
                  className="btn btn-danger w-100 btn-sm"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </ul>
            </div>
          ) : (
            <Link to="/login">
              <FaUser size={18} color="white" />
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;