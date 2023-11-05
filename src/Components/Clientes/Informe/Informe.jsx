import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./Informe.module.css";
import {
  ClearID,
  GetClienteDetail,
  GetFacturas,
  GetProductos,
} from "../../../Redux/actions";

export default function Informe() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { clienteDetail, facturas, productos } = useSelector((state) => state);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

 

  useEffect(() => {
    dispatch(ClearID());
    dispatch(GetClienteDetail(id))
      .then(() => {
        dispatch(GetFacturas()).catch((error) => {
          console.error("Error al obtener todas las facturas:", error);
        });

        // Llama a la acción GetProductos para obtener los productos
        dispatch(GetProductos()).catch((error) => {
          console.error("Error al obtener los productos:", error);
        });
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del cliente:", error);
      });
  }, [dispatch, id]);

  // Filtrar las facturas por id_cliente igual a clienteDetail.id
  const facturasDelCliente = facturas
    .filter((factura) => factura.id_cliente === clienteDetail.id)
    .filter((factura) => {
      if (fechaDesde && fechaHasta) {
        const fechaFactura = new Date(factura.fecha);
        const fechaDesdeDate = new Date(fechaDesde);
        const fechaHastaDate = new Date(fechaHasta);
        return fechaFactura >= fechaDesdeDate && fechaFactura <= fechaHastaDate;
      }
      return true; // Si no se han seleccionado fechas, mostrar todas las facturas
    });

  // Variables para acumular los totales
  let totalImporteAcumulado = 0;
  let totalNetoAcumulado = 0;
  let totalIvaAcumulado = 0;

  const printPage = () => {
    window.print();
  };

  return (
    <div className={Styles.responsiveContainer}>
      {clienteDetail ? (
        <div>
          <hr className={Styles.hr} />
          <h1 className={Styles.title}>IVA ventas discriminado</h1>

          <p>
            <span className={Styles.bold}>Empresa:</span> {clienteDetail.nombre}
          </p>
          <p>
            <span className={Styles.bold}>Cuit:</span> {clienteDetail.cuit}
          </p>
          <p>
            <span className={Styles.bold}>Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </p>
          <p>
            <span className={Styles.bold}>Hasta:</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </p>
          <button className={Styles.printButton} onClick={printPage}>
            Imprimir
          </button>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className={Styles.headTable}>
                  <th>Fecha</th>
                  <th>Número de Factura</th>
                  <th>Cuit/Docs</th>
                  <th>Cliente</th>
                  <th>Subtotal</th>
                  <th>IVA (21%)</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                {facturasDelCliente.map((factura) => {
                  const productosDeFactura = productos.filter(
                    (producto) => producto.id_factura === factura.id
                  );

                  const subtotal = productosDeFactura.reduce(
                    (acc, producto) => acc + parseFloat(producto.subtotal),
                    0
                  );

                  const iva = productosDeFactura.reduce(
                    (acc, producto) => acc + parseFloat(producto.iva),
                    0
                  );

                  const importe = productosDeFactura.reduce(
                    (acc, producto) => acc + parseFloat(producto.importe),
                    0
                  );

                  // Acumula los totales
                  totalNetoAcumulado += subtotal;
                  totalIvaAcumulado += iva;
                  totalImporteAcumulado += importe;

                  return (
                    <tr key={factura.id}>
                      <td>{factura.fecha.split("-").reverse().join("-")}</td>
                      <td>{factura.nro_factura}</td>
                      <td>{factura.cuit}</td>
                      <td>{factura.destinatario}</td>
                      <td>${subtotal.toLocaleString("es-ES")}</td>
                      <td>${iva.toLocaleString("es-ES")}</td>
                      <td>${importe.toLocaleString("es-ES")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <hr className={Styles.hr} />
          <h2 style={{ marginBottom: "15px" }}>Resumen:</h2>
          <div className={Styles.resume}>
            <p>
              <span className={Styles.bold}>Total Neto:</span> $
              {totalNetoAcumulado.toLocaleString("es-ES")}
            </p>
            <p>
              <span className={Styles.bold}>Total IVA:</span> $
              {totalIvaAcumulado.toLocaleString("es-ES")}
            </p>
            <p>
              <span className={Styles.bold}>Total Importe:</span> $
              {totalImporteAcumulado.toLocaleString("es-ES")}
            </p>
          </div>
          <hr className={Styles.hr} />
          
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
}
