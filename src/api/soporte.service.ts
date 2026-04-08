const API_URL = "http://localhost:4000/api";

// 🔹 Tipo de datos
export type SoporteInput = {
  usuarioId: string;
  nombre: string;
  correo: string;
  tipoProducto: string;
  descripcion: string;
};

// 🔹 Crear solicitud
export const crearSoporte = async (data: SoporteInput) => {
  const res = await fetch(`${API_URL}/soporte`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear soporte");

  return res.json();
};

// 🔹 Obtener todos
export const getSoportes = async () => {
  const res = await fetch(`${API_URL}/soporte`);
  if (!res.ok) throw new Error("Error al obtener soportes");
  return res.json();
};

// 🔹 Obtener por usuario
export const getSoportesUsuario = async (id: string) => {
  const res = await fetch(`${API_URL}/soporte/usuario/${id}`);
  if (!res.ok) throw new Error("Error al obtener historial");
  return res.json();
};

// 🔹 Actualizar estado
export const actualizarEstado = async (id: string, estado: string) => {
  const res = await fetch(`${API_URL}/soporte/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado }),
  });

  if (!res.ok) throw new Error("Error al actualizar");

  return res.json();
};