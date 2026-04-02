import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";

type Usuario = {
  _id: string;
  nombre: string;
  correo: string;
  rol: string;
};

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mensaje, setMensaje] = useState("");

  const { user } = useAuth(); // 🔥 usuario logueado

  // 🔹 Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuarios();
  }, []);

  // 🔹 Cambiar rol
  const cambiarRol = async (id: string, nuevoRol: string) => {
    try {
      await fetch(`http://localhost:4000/api/auth/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol })
      });

      // actualizar estado sin recargar
      setUsuarios(prev =>
        prev.map(u =>
          u._id === id ? { ...u, rol: nuevoRol } : u
        )
      );

      setMensaje("Rol actualizado correctamente");
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Eliminar usuario
  const eliminarUsuario = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await fetch(`http://localhost:4000/api/auth/usuarios/${id}`, {
        method: "DELETE",
      });

      setUsuarios(prev => prev.filter(u => u._id !== id));

      setMensaje("Usuario eliminado correctamente");
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Usuarios</h2>

      {/* 🔔 Notificación */}
      {mensaje && (
        <div className="alert alert-success mt-2">
          {mensaje}
        </div>
      )}

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Cambiar Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id}>
              <td>
                {u.nombre} {u.correo === user?.correo && "(Tú)"}
              </td>

              <td>{u.correo}</td>

              <td>{u.rol}</td>

              <td>
                <select
                  value={u.rol}
                  disabled={u.correo === user?.correo} // 🔒 bloqueo
                  onChange={(e) => cambiarRol(u._id, e.target.value)}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                  <option value="soporte">Soporte</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={u.correo === user?.correo} // 🔒 no eliminarse
                  onClick={() => eliminarUsuario(u._id)}
                >
                  Eliminar
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsuarios;