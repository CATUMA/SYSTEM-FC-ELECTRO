import { useEffect, useState, useCallback } from "react";

type Producto = {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen?: string;
};

function AdminProductos() {

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Producto>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagen: ""
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  // 🔥 CARGAR PRODUCTOS (OPTIMIZADO)
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

  // 📷 MANEJO DE IMAGEN
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

  // 💾 GUARDAR / ACTUALIZAR
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await fetch(`http://localhost:4000/api/productos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch("http://localhost:4000/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }

      // 🔄 Reset
      setForm({ nombre: "", descripcion: "", precio: 0, stock: 0, imagen: "" });
      setPreview(null);
      setEditId(null);

      cargar();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  // 🗑 ELIMINAR
  const eliminar = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: "DELETE"
      });
      cargar();
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  // ✏ EDITAR
  const editar = (p: Producto) => {
    setForm(p);
    setPreview(p.imagen || null);
    setEditId(p._id || null);
  };

  // ⏳ LOADING
  if (loading) {
    return <p className="text-center mt-5">Cargando productos...</p>;
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-4 fw-bold">Panel de Administración</h2>

      {/* 🔹 FORMULARIO */}
      <div className="card shadow-sm p-4 mb-5">
        <h5 className="mb-3">
          {editId ? "Editar producto" : "Registrar producto"}
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
                onChange={e => setForm({ ...form, precio: Number(e.target.value) })}
              />
            </div>

            <div className="col-md-4">
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Stock"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
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
                  width: "180px",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}
              />
            </div>
          )}

          <button className="btn btn-primary w-100">
            {editId ? "Actualizar producto" : "Registrar producto"}
          </button>

        </form>
      </div>

      {/* 🔹 LISTA */}
      <h4 className="mb-3">Productos registrados</h4>

      <div className="row">
        {productos.map(p => (
          <div key={p._id} className="col-md-4 mb-4">

            <div className="card shadow-sm h-100">

              <img
                src={p.imagen || "https://via.placeholder.com/300"}
                alt={p.nombre}
                style={{
                  height: "180px",
                  objectFit: "cover"
                }}
              />

              <div className="card-body">
                <h6 className="fw-bold">{p.nombre}</h6>
                <p className="text-muted" style={{ fontSize: "14px" }}>
                  {p.descripcion}
                </p>

                <h5 className="text-primary">S/ {p.precio}</h5>

                <span className={`badge ${p.stock < 5 ? "bg-danger" : "bg-success"}`}>
                  Stock: {p.stock}
                </span>
              </div>

              <div className="card-footer d-flex gap-2">
                <button
                  className="btn btn-warning w-50"
                  onClick={() => editar(p)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger w-50"
                  onClick={() => eliminar(p._id!)}
                >
                  Eliminar
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminProductos;