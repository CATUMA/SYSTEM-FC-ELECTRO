import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";

type Producto = {
  _id: string;
  nombre: string;
  precio: number;
  imagen: string;
};

function Ofertas() {

  const { user } = useAuth();
  const [ofertas, setOfertas] = useState<Producto[]>([]);

  // 🔥 CARGAR OFERTAS SOLO SI ESTÁ LOGUEADO
  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:4000/api/productos/ofertas")
      .then(res => res.json())
      .then(data => setOfertas(data))
      .catch(err => console.error(err));

  }, [user]);

  // 🔒 SI NO ESTÁ LOGUEADO → TU VISTA ACTUAL
  if (!user) {
    return (
      <>
        {/* VIDEOS */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-4">
            Conoce más de nosotros
          </h2>

          <div className="row g-4">

            {[1, 2, 3].map((v) => (
              <div className="col-md-4" key={v}>
                <div className="card shadow-sm">
                  <video controls className="w-100 rounded-top">
                    <source src={`/videos/video${v}.mp4`} type="video/mp4" />
                  </video>
                  <div className="card-body text-center">
                    <h6>Contenido FC ELECTRO</h6>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* NOVEDADES */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-4">
            Novedades
          </h2>

          <div className="row g-4">
            {[1, 2, 3].map((n) => (
              <div className="col-md-4" key={n}>
                <div className="card shadow-sm">
                  <img
                    src={`/imagenes/novedad${n}.jpg`}
                    className="card-img-top"
                  />
                  <div className="card-body text-center">
                    <h6>Promociones FC ELECTRO</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUEO */}
        <div className="container text-center my-5">
          <FaLock size={80} className="text-secondary mb-4" />

          <h2 className="fw-bold">Ofertas exclusivas</h2>

          <p className="text-muted mt-3">
            Inicia sesión para ver nuestras ofertas especiales
          </p>

          <Link to="/login" className="btn btn-primary mt-3">
            Iniciar sesión
          </Link>
        </div>
      </>
    );
  }

  // 🔥 SI ESTÁ LOGUEADO → OFERTAS REALES
  return (
    <div className="container my-5">

      <h2 className="text-center fw-bold mb-4">
        🔥 Ofertas exclusivas
      </h2>

      <div className="row g-4">

        {ofertas.length === 0 ? (
          <p className="text-center">No hay ofertas disponibles</p>
        ) : (
          ofertas.map((p) => (
            <div className="col-md-4" key={p._id}>
              <div className="card shadow">

                <img
                  src={p.imagen}
                  className="card-img-top"
                />

                <div className="card-body text-center">

                  <h5>{p.nombre}</h5>

                  <p className="text-danger fw-bold fs-5">
                    S/ {p.precio}
                  </p>

                  <span className="badge bg-success">
                    OFERTA
                  </span>

                </div>

              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Ofertas;