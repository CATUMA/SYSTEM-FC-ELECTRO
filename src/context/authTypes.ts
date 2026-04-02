export type User = {
  id: string;
  nombre: string;
  correo: string;
  rol: "admin" | "cliente" | "soporte" | "vendedor";
  foto?: string;
};

export type AuthContextType = {
  user: User | null;
  login: (usuario: User) => void;
  logout: () => void;
};