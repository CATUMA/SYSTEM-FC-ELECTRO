import { Link, useNavigate } from "react-router-dom";
import type { ProductoCarrito } from "../App";
import { useAuth } from "../context/useAuth";

interface Props {
  carrito: ProductoCarrito[];
  eliminarDelCarrito: (id: string) => void;
}

function Carrito({ carrito, eliminarDelCarrito }: Props) {

  const { user } = useAuth();
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );

  // 🔥 FINALIZAR COMPRA COMPLETO
  const finalizarCompra = async () => {

    // 🔹 VALIDAR LOGIN
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    // 🔹 CONFIRMAR COMPRA (HU-14)
    const confirmar = window.confirm("¿Deseas confirmar la compra?");
    if (!confirmar) return;

    // 🔹 SIMULAR PAGO (HU-15)
    const pago = window.confirm("Simular pago exitoso?");
    if (!pago) {
      alert("❌ Pago cancelado");
      return;
    }

    try {

      const res = await fetch("http://localhost:4000/api/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuarioId: user.id,
          clienteNombre: user.nombre, // 🔥 NUEVO
          carrito: carrito.map(p => ({
            id: p.id,
            cantidad: p.cantidad
          }))
        })
      });

      const data = await res.json();

      // 🚨 ERROR (ej: stock)
      if (!res.ok) {
        alert(data.mensaje);
        return;
      }

      // ✅ ÉXITO
      alert("✅ Compra realizada correctamente");

      // 🔥 LIMPIAR CARRITO
      localStorage.removeItem(`carrito_${user.id}`);

      // 🔥 REDIRIGIR A COMPROBANTE (HU-16)
      navigate("/comprobante", {
        state: { compra: data.compra }
      });

    } catch (error) {
      console.error("Error en compra", error);
      alert("Error al procesar la compra");
    }
  };

  // 🛒 CARRITO VACÍO
  if (carrito.length === 0) {
    return (
      <div className="container text-center my-5">
        <div style={{ fontSize: "80px" }}>🛒</div>
        <h3 className="mt-3">Tu carrito está vacío</h3>
        <p>Agrega productos para comenzar</p>

        <Link to="/productos" className="btn btn-primary mt-3">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Tu Carrito</h2>

      {carrito.map((producto) => (
        <div
          key={producto.id + "-" + producto.cantidad}
          className="d-flex align-items-center justify-content-between border rounded p-3 mb-3 shadow-sm"
        >
          <div className="d-flex align-items-center">

            <img
              src={producto.imagen || "https://via.placeholder.com/80"}
              alt={producto.nombre}
              width="80"
              className="me-3 rounded"
            />

            <div>
              <h5 className="mb-1">{producto.nombre}</h5>

              <p className="mb-0">
                S/ {producto.precio}
              </p>

              <small className="text-muted">
                Cantidad: {producto.cantidad}
              </small>
            </div>
          </div>

          <button
            className="btn btn-outline-danger"
            onClick={() => eliminarDelCarrito(producto.id)}
          >
            Eliminar
          </button>
        </div>
      ))}

      <div className="text-end mt-4">
        <h4>Total: S/ {total}</h4>

        <button
          className="btn btn-success mt-2"
          onClick={finalizarCompra}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}

export default Carrito;