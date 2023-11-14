import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaModerna.module.css";
import {
  GetFacturaDetaill,
  ClearID,
  GetProductos,
  GetClientes,
} from "../../../Redux/actions";
import afipImg from "../../Img/Afip.png";

// Esta Factura debera ser un poco mas flexible con un diseño mas moderno, debe  poder ser usada tenga o no Logo y QR en caos d eno tenerlas que no reenderize ese elemento, el cliente no proporciono muchos detalles de como quiere que sea.

export default function FacturaModerna() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const productos = useSelector((state) => state.productos);
  const clientes = useSelector((state) => state.clientes);
  const { facturaDetail } = useSelector((state) => state);

  useEffect(() => {
    dispatch(ClearID());
    dispatch(GetFacturaDetaill(id))
      .then(() => {
        dispatch(GetClientes()).catch((error) => {
          console.error("Error al obtener todos los clientes:", error);
        });
        // Llama a la acción GetProductos para obtener los productos
        dispatch(GetProductos()).catch((error) => {
          console.error("Error al obtener los productos:", error);
        });
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la factura:", error);
      });
  }, [dispatch, id]);

  const productosFactura = productos.filter(
    (producto) => producto.id_factura === facturaDetail.id
  );

  const clienteDeFactura = clientes.find(
    (cliente) => cliente.id === facturaDetail.id_cliente
  );

  let importeFinal = 0;

  if (productosFactura && productosFactura.length > 0) {
    importeFinal = productosFactura.reduce((total, producto) => {
      const importeNumerico = parseFloat(producto.importe);
      return total + (isNaN(importeNumerico) ? 0 : importeNumerico);
    }, 0);
  }

  let subTotalFinal = 0;

  if (productosFactura && productosFactura.length > 0) {
    subTotalFinal = productosFactura.reduce((total, producto) => {
      const subTotalNumerico = parseFloat(producto.subtotal);
      return total + (isNaN(subTotalNumerico) ? 0 : subTotalNumerico);
    }, 0);
  }

  let ivaFinal = 0;

  if (productosFactura && productosFactura.length > 0) {
    ivaFinal = productosFactura.reduce((total, producto) => {
      const ivaFinalNumerico = parseFloat(producto.iva);
      return total + (isNaN(ivaFinalNumerico) ? 0 : ivaFinalNumerico);
    }, 0);
  }

  const printPage = () => {
    window.print();
  };

  return (
    <div className={Styles.pageContainer}>
      {facturaDetail && clienteDeFactura && productosFactura ? (
        <div className={Styles.Columna}>
          <div className={Styles.firstContainer}>
            <div style={{maxWidth: '90mm'}}>
              <img
                src={clienteDeFactura.img_logo}
                className={Styles.fixImgSize}
              />
              <p className={Styles.clientName}>{clienteDeFactura.nombre}</p>
              <p>{clienteDeFactura.direccion}</p>
              <p style={{ marginBottom: "0px" }}>IVA Responsable Inscripto</p>
            </div>
            <p className={Styles.tipoFactura}>A</p>
            <div>
              <br />
              <p className={Styles.facturaA}>Factura A</p>
              <p className={Styles.original}>Original</p>
              <p className={Styles.number}>Nº: {facturaDetail.nro_factura}</p>
              <br />
              <p className={Styles.enterpriseData}>
                Fecha: {facturaDetail.fecha.split("-").reverse().join("/")}
              </p>
              <p className={Styles.enterpriseData}>
                C.U.I.T : {clienteDeFactura.cuit}
              </p>
              <p className={Styles.enterpriseData}>
                I.I.B.B. : {clienteDeFactura.numero_ingresos_brutos}
              </p>
              <p className={Styles.enterpriseData} style={{ fontSize: "12px" }}>
                Fecha de Inicio de Actividades:{" "}
                {clienteDeFactura.inicio_actividades
                  .split("-")
                  .reverse()
                  .join("/")}
              </p>
            </div>
          </div>
          <div className={Styles.brownContainer}>
            <p style={{ textTransform: "uppercase" }}>
              <span style={{ textTransform: "capitalize" }}>Sr.(s): </span>{" "}
              {facturaDetail.destinatario}
            </p>
            <p>
              <span>Dirección: </span>
              {facturaDetail.direccion}
            </p>
            <div
              className={Styles.justifyData}
              style={{ textTransform: "capitalize" }}
            >
              <p>I.V.A: Responsable Inscripto</p>
              <p>C.U.I.T. : {facturaDetail.cuit}</p>
            </div>
          </div>
          <h6 className={Styles.detalle}>Detalle</h6>
          <table className={Styles.fixTableSize}>
            <thead className={Styles.mainTable}>
              <tr>
                <th>Cant.</th>
                <th>Descripción</th>
                <th>Precio U.</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody style={{ height: "90mm" }}>
              {productosFactura.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.cantidad.toFixed(2)}</td>
                  <td>{producto.concepto}</td>
                  <td style={{ textAlign: "right" }}>{producto.precioxu}</td>
                  <td style={{ textAlign: "right" }}>{producto.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={Styles.subTable}>
            <p>SubTotal</p>
            <p>Iva inscripto:</p>
            <p>Percepcion I.V.A:</p>
            <p>Total</p>
          </div>
          <div className={Styles.results}>
            <p>{subTotalFinal.toFixed(2)}</p>
            <p>{ivaFinal.toFixed(2)}</p>
            <p> 21% </p>
            <p style={{ fontWeight: "bold" }}>{importeFinal.toFixed(2)}</p>
          </div>
          <hr style={{ height: "5px" }} />
          {clienteDeFactura.direccion.toLowerCase().includes("caba") && (
            <div className={Styles.caba}>
              {" "}
              Gobierno de la ciudad de Buenos Aires Nº 147 Gratuito. Área de
              defensa al Consumidor
            </div>
          )}
          <br />
          <div className={Styles.flexContainer}>
            <div>
              <img
                src={clienteDeFactura.qr_code}
                alt="Codigo QR del cliente"
                style={{ width: "100px", marginRight: '5px' }}
              />
              <img
                src={afipImg}
                alt="Sigla de Afip con detalle"
                style={{ width: "70px" }}
              />
            </div>
            <div className={Styles.lastData}>
              <p >
                C.A.I: {clienteDeFactura.cai}
              </p>
              <p>
                Fecha de vencimiento:{" "}
                {facturaDetail.fecha.split("-").reverse().join("-")}
              </p>
              <p>CF-{clienteDeFactura.numero_controladora_fiscal}</p>
            </div>
          </div>
          <hr />
          <button className={Styles.printButton} onClick={printPage}>
            Imprimir
          </button>
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
}
