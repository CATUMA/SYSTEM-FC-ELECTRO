import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./context/useAuth";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Ofertas from "./pages/Ofertas";
import SoporteTecnico from "./pages/SoporteTecnico";
import HistorialSoporte from "./pages/HistorialSoporte";
import AdminSoporte from "./pages/admin/AdminSoporte";

import BuscarClientes from "./pages/admin/BuscarClientes";
import HistorialCliente from "./pages/admin/HistorialCliente";

import Historial from "./pages/Historial";
import Comprobante from "./pages/Comprobante";
import ReporteMensual from "./pages/ReporteMensual";
import ReporteProductos from "./pages/ReporteProductos";
import AdminLayout from "./pages/admin/AdminLayout";
import HistorialSoporteAdmin from "./pages/admin/HistorialSoporteAdmin";

import Informes from "./pages/Informes";

export interface ProductoCarrito {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

// 🔥 WRAPPER PARA HISTORIAL
function HistorialWrapper() {
  const { id } = useParams();
  if (!id) return <div>ID inválido</div>;

  return <HistorialCliente clienteId={id} />;
}

function App() {
  const { user } = useAuth();

  const keyCarrito = user ? `carrito_${user.id}` : "carrito_invitado";

  const [carrito, setCarrito] = useState<ProductoCarrito[]>(() => {
    const data = localStorage.getItem(keyCarrito);
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem(keyCarrito, JSON.stringify(carrito));
  }, [carrito, keyCarrito]);

  const agregarAlCarrito = (producto: ProductoCarrito) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);

      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.id === id
            ? { ...p, cantidad: p.cantidad - 1 }
            : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/productos" element={<Productos agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/ofertas" element={<Ofertas agregarAlCarrito={agregarAlCarrito} />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/informes" element={<Informes />} />

        <Route
          path="/carrito"
          element={
            <Carrito
              key={keyCarrito}
              carrito={carrito}
              eliminarDelCarrito={eliminarDelCarrito}
            />
          }
        />

        <Route path="/historial" element={<Historial />} />
        <Route path="/comprobante" element={<Comprobante />} />

        {/* 🔥 CLIENTE */}
        <Route
          path="/soporte"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <SoporteTecnico />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-soportes"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <HistorialSoporte />
            </ProtectedRoute>
          }
        />

        {/* 🔥 PANEL SOPORTE */}
        <Route
          path="/soporte-panel"
          element={
            <ProtectedRoute roles={["soporte", "admin"]}>
              <AdminSoporte />
            </ProtectedRoute>
          }
        />

        <Route path="/reporte-mensual" element={<ReporteMensual />} />
        <Route path="/reporte-productos" element={<ReporteProductos />} />

        {/* 🔥 ADMIN (AQUÍ ESTÁ LA CLAVE) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "vendedor"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* 🔹 HIJOS DEL PANEL */}
          <Route path="clientes" element={<BuscarClientes onVerHistorial={() => {}} />} />
          <Route path="historial/:id" element={<HistorialWrapper />} />

          {/* 🔥 SOLUCIÓN REAL */}
          <Route path="historial-soporte" element={<HistorialSoporteAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/inicio" />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;