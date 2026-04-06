import { useEffect, useState } from "react";

type Compra = {
  _id: string;
  total: number;
  fecha: string;
  productos: {
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
};

type Props = {
  clienteId: string;
};

function HistorialCliente({ clienteId }: Props) {

  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const obtenerHistorial = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/compras/usuario/${clienteId}`
        );

        if (!res.ok) {
          throw new Error("No se pudo obtener el historial");
        }

        const data: unknown = await res.json();

        console.log("Historial recibido:", data);

        if (!Array.isArray(data)) {
          throw new Error("Formato inválido del backend");
        }

        setCompras(data);

      } catch (err: unknown) {

        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar historial");
        }

      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();

  }, [clienteId]);

  return (
    <div className="container my-5">

      <h2 className="mb-4">📄 Historial de compras</h2>

      {/* LOADING */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border"></div>
          <p className="mt-2">Cargando historial...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {/* SIN COMPRAS */}
      {!loading && compras.length === 0 && !error && (
        <div className="alert alert-warning text-center">
          Este cliente no tiene compras registradas
        </div>
      )}

      {/* LISTA */}
      {!loading && compras.length > 0 && (
        <div className="row">
          {compras.map((c) => (
            <div key={c._id} className="col-md-6 mb-3">
              <div className="card shadow-sm border-0 p-3 h-100">

                <div className="mb-2">
                  <strong>Total:</strong> S/ {c.total}
                </div>

                <div className="mb-3 text-muted">
                  📅 {new Date(c.fecha).toLocaleDateString()}
                </div>

                <h6>Productos:</h6>
                <ul className="mb-0">
                  {c.productos.map((p, i) => (
                    <li key={i}>
                      {p.nombre} — {p.cantidad} x S/ {p.precio}
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default HistorialCliente;