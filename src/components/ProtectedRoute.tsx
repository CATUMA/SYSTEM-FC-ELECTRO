import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/useAuth";

type Props = {
  children: ReactNode;
  roles?: string[]; // 🔥 CAMBIO
};

function ProtectedRoute({ children, roles }: Props) {

  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to="/login" />;
  }

  // 🔥 NUEVA VALIDACIÓN
  if (roles && !roles.includes(auth.user.rol)) {
    return <Navigate to="/inicio" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;