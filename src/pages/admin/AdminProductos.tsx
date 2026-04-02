import { useEffect, useState, useCallback } from "react";

type Producto = {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number | "";
  stock: number | "";
  imagen?: string;
};

function AdminProductos() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Producto>({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: ""
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // 📷 IMAGEN
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setForm({ ...form, imagen: base64 });
    };

    reader.readAsDataURL(file);
  };

  // 💾 GUARDAR
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataEnviar = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock)
    };

    try {
      if (editId) {
        await fetch(`http://localhost:4000/api/productos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataEnviar)
        });
      } else {
        await fetch("http://localhost:4000/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataEnviar)
        });
      }

      setForm({ nombre: "", descripcion: "", precio: "", stock: "", imagen: "" });
      setPreview(null);
      setEditId(null);

      cargar();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  const eliminar = async (id: string) => {
    await fetch(`http://localhost:4000/api/productos/${id}`, {
      method: "DELETE"
    });
    cargar();
  };

  const editar = (p: Producto) => {
    setForm({
      ...p,
      precio: p.precio || "",
      stock: p.stock || ""
    });
    setPreview(p.imagen || null);
    setEditId(p._id || null);
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando productos...</p>;
  }

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="mb-4 p-4 rounded text-white"
        style={{
          background: "linear-gradient(90deg, #4361ee, #3a0ca3)"
        }}>
        <h2 className="fw-bold">🚀 Panel de Administración</h2>
        <p className="mb-0">Gestiona tus productos de forma profesional</p>
      </div>

      {/* FORMULARIO */}
      <div className="card shadow border-0 p-4 mb-5"
        style={{ borderRadius: "15px" }}>

        <h5 className="mb-3">
          {editId ? "✏ Editar producto" : "➕ Registrar producto"}
        </h5>

        <form onSubmit={guardar}>

          <div className="row">
            <div className="col-md-6">
              <input
                className="form-control mb-3"
                placeholder="Nombre"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <input
                className="form-control mb-3"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Precio"
                value={form.precio}
                onChange={e =>
                  setForm({
                    ...form,
                    precio: e.target.value === "" ? "" : Number(e.target.value)
                  })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Stock"
                value={form.stock}
                onChange={e =>
                  setForm({
                    ...form,
                    stock: e.target.value === "" ? "" : Number(e.target.value)
                  })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                type="file"
                className="form-control mb-3"
                onChange={handleImagen}
              />
            </div>
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="text-center mb-3">
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "200px",
                  height: "160px",
                  objectFit: "contain",
                  background: "#f5f5f5",
                  borderRadius: "10px"
                }}
              />
            </div>
          )}

          <button className="btn btn-primary w-100 fw-bold">
            {editId ? "Actualizar producto" : "Registrar producto"}
          </button>

        </form>
      </div>

      {/* LISTA */}
      <h4 className="mb-3">📦 Productos registrados</h4>

      <div className="row">
        {productos.map(p => {

          const stockNumber = Number(p.stock || 0);
          const bajoStock = stockNumber < 5;

          return (
            <div key={p._id} className="col-md-4 mb-4">

              <div
                className="card h-100 border-0 shadow"
                style={{
                  borderRadius: "15px",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >

                <img
                  src={p.imagen || "https://via.placeholder.com/300"}
                  alt={p.nombre}
                  style={{
                    height: "200px",
                    objectFit: "contain",
                    background: "#f8f9fa"
                  }}
                />

                <div className="card-body">

                  <h6 className="fw-bold">{p.nombre}</h6>
                  <p className="text-muted">{p.descripcion}</p>

                  <h5 className="text-primary fw-bold">
                    S/ {p.precio}
                  </h5>

                  <span className={`badge ${bajoStock ? "bg-danger" : "bg-success"}`}>
                    Stock: {stockNumber}
                  </span>

                </div>

                <div className="card-footer d-flex gap-2 bg-white border-0">

                  <button
                    className="btn btn-warning w-50"
                    onClick={() => editar(p)}
                  >
                    ✏ Editar
                  </button>

                  <button
                    className="btn btn-danger w-50"
                    onClick={() => eliminar(p._id!)}
                  >
                    🗑 Eliminar
                  </button>

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default AdminProductos;