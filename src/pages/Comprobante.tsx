import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import logo from "../assets/logo.png";

type Producto = {
  nombre: string;
  precio: number;
  cantidad: number;
};

type Compra = {
  numeroComprobante: string;
  clienteNombre: string;
  total: number;
  fecha: string;
  productos: Producto[];
};

function Comprobante() {

  const { state } = useLocation() as { state: { compra: Compra } };
  const compra = state?.compra;

  const [qr, setQr] = useState<string>("");

  // 🔥 GENERAR QR (CORRECTO)
  useEffect(() => {
    const generarQR = async () => {
      if (!compra) return;

      const data = `
        FC ELECTRO
        N°: ${compra.numeroComprobante}
        TOTAL: S/ ${compra.total}
      `;

      const qrImg = await QRCode.toDataURL(data);
      setQr(qrImg);
    };

    generarQR();
  }, [compra]);

  if (!compra) {
    return <h3 className="text-center mt-5">No hay comprobante</h3>;
  }

  // 🔥 PDF
  const generarPDF = async () => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 80, 10, 50, 20);

    doc.setFontSize(12);
    doc.text("FC ELECTRO S.A.C.", 70, 35);
    doc.text("RUC: 20100952981", 70, 40);
    doc.text("BOLETA DE VENTA", 70, 45);

    doc.setFontSize(10);
    doc.text(`N°: ${compra.numeroComprobante}`, 20, 60);
    doc.text(`Cliente: ${compra.clienteNombre}`, 20, 65);
    doc.text(`Fecha: ${new Date(compra.fecha).toLocaleString()}`, 20, 70);

    let y = 80;

    compra.productos.forEach((p) => {
      doc.text(
        `${p.nombre} | ${p.cantidad} x S/ ${p.precio} = S/ ${p.precio * p.cantidad}`,
        20,
        y
      );
      y += 8;
    });

    doc.setFontSize(12);
    doc.text(`TOTAL: S/ ${compra.total}`, 20, y + 10);

    // 🔥 USAR QR YA GENERADO
    if (qr) {
      doc.addImage(qr, "PNG", 140, y, 40, 40);
    }

    doc.save(`boleta_${compra.numeroComprobante}.pdf`);
  };

  return (
    <div className="container my-5 d-flex justify-content-center">

      <div
        className="card border-0"
        style={{
          maxWidth: "700px",
          width: "100%",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
        }}
      >

        {/* HEADER */}
        <div
          className="text-center text-white p-4"
          style={{
            background: "linear-gradient(90deg, #0d6efd, #2563eb)",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px"
          }}
        >
          <img src={logo} width="100" className="mb-2" />
          <h4 className="fw-bold mb-0">FC ELECTRO S.A.C.</h4>
          <small>RUC: 20100952981</small>
          <h5 className="mt-2">🧾 BOLETA DE VENTA</h5>
        </div>

        {/* DATOS */}
        <div className="p-4">

          <div className="row mb-3">
            <div className="col">
              <strong>N°:</strong> {compra.numeroComprobante}
            </div>
            <div className="col text-end">
              <strong>Fecha:</strong>{" "}
              {new Date(compra.fecha).toLocaleString()}
            </div>
          </div>

          <div className="mb-3">
            <strong>Cliente:</strong> {compra.clienteNombre}
          </div>

          {/* TABLA */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">

              <thead style={{ background: "#111827", color: "white" }}>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cant</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {compra.productos.map((p, i) => (
                  <tr key={i}>
                    <td>{p.nombre}</td>
                    <td className="text-center">{p.cantidad}</td>
                    <td className="text-end">S/ {p.precio}</td>
                    <td className="text-end fw-bold">
                      S/ {p.precio * p.cantidad}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* TOTAL + QR */}
          <div className="d-flex justify-content-between align-items-center mt-4">

            <h4 className="fw-bold text-success">
              TOTAL: S/ {compra.total}
            </h4>

            {qr && (
              <img src={qr} width="80" />
            )}

          </div>

          {/* BOTÓN */}
          <div className="text-end mt-4">
            <button
              className="btn"
              style={{
                background: "linear-gradient(45deg, #111827, #374151)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                transition: "0.3s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              onClick={generarPDF}
            >
              📄 Descargar PDF
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Comprobante;