import { useLocation } from "react-router-dom";
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

  if (!compra) return <h3>No hay comprobante</h3>;

  const generarPDF = async () => {
    const doc = new jsPDF();

    // 🔹 LOGO
    doc.addImage(logo, "PNG", 80, 10, 50, 20);

    // 🔹 EMPRESA
    doc.setFontSize(12);
    doc.text("FC ELECTRO S.A.C.", 70, 35);
    doc.text("RUC: 20100952981", 70, 40);
    doc.text("BOLETA DE VENTA", 70, 45);

    // 🔹 DATOS
    doc.setFontSize(10);
    doc.text(`N°: ${compra.numeroComprobante}`, 20, 60);
    doc.text(`Cliente: ${compra.clienteNombre}`, 20, 65);
    doc.text(`Fecha: ${new Date(compra.fecha).toLocaleString()}`, 20, 70);

    let y = 80;

    // 🔹 PRODUCTOS
    compra.productos.forEach((p) => {
      doc.text(
        `${p.nombre} | ${p.cantidad} x S/ ${p.precio} = S/ ${p.precio * p.cantidad}`,
        20,
        y
      );
      y += 8;
    });

    // 🔹 TOTAL
    doc.setFontSize(12);
    doc.text(`TOTAL: S/ ${compra.total}`, 20, y + 10);

    // 🔹 QR
    const qrData = `
      FC ELECTRO
      RUC: 20100952981
      N°: ${compra.numeroComprobante}
      TOTAL: S/ ${compra.total}
    `;

    const qrImage = await QRCode.toDataURL(qrData);

    doc.addImage(qrImage, "PNG", 140, y, 40, 40);

    doc.save(`boleta_${compra.numeroComprobante}.pdf`);
  };

  return (
    <div className="container my-5">

      <div className="card shadow p-4 text-center">

        {/* LOGO */}
        <img src={logo} width="120" className="mx-auto" />

        <h4 className="mt-2">FC ELECTRO S.A.C.</h4>
        <p>RUC: 20100952981</p>
        <h5>BOLETA DE VENTA</h5>

        <hr />

        {/* DATOS */}
        <p><strong>N°:</strong> {compra.numeroComprobante}</p>
        <p><strong>Cliente:</strong> {compra.clienteNombre}</p>
        <p><strong>Fecha:</strong> {new Date(compra.fecha).toLocaleString()}</p>

        {/* TABLA */}
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Cant</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {compra.productos.map((p, i) => (
              <tr key={i}>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>S/ {p.precio}</td>
                <td>S/ {p.precio * p.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 className="text-end">TOTAL: S/ {compra.total}</h4>

        <button className="btn btn-dark mt-3" onClick={generarPDF}>
          Descargar PDF
        </button>

      </div>

    </div>
  );
}

export default Comprobante;