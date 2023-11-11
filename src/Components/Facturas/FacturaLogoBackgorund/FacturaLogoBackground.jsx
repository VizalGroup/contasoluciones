import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaLogoBackground.module.css";
import {
  GetFacturaDetaill,
  ClearID,
  GetProductos,
  GetClientes,
} from "../../../Redux/actions";
import afipImg from "../../Img/Afip.png";

export default function FacturaLogoBackground() {
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

  const imagenFondo = clienteDeFactura && clienteDeFactura.img_logo; // Supongamos que esta es la URL de la imagen de fondo

  const backgroundImageStyle = {
    backgroundImage: `url(${imagenFondo})`,
    backgroundRepeat: "repeat",
    backgroundSize: "200px auto",
    opacity: 0.08,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    width: "210mm",
    height: "297mm",
  };

  return (
    <div className={Styles.pageContainer}>
      <div style={backgroundImageStyle}></div>
      {facturaDetail && clienteDeFactura && productosFactura ? (
        <div className={Styles.Columna}>
          <div className={Styles.firstContainer}>
            <div>
              <img
                src={clienteDeFactura.img_logo}
                className={Styles.fixImgSize}
              />
              <p className={Styles.clientName}>{clienteDeFactura.nombre}</p>
              <p>{clienteDeFactura.direccion}</p>
              <p>IVA RESPONSABLE INSCRIPTO</p>
            </div>
            <p className={Styles.tipoFactura}>A</p>
            <div>
              <p className={Styles.facturaData}>Factura</p>
              <p className={Styles.facturaData}>
                Nro de Factura: {facturaDetail.nro_factura}
              </p>
              <br />
              <p className={Styles.enterpriseData}>
                Fecha: {facturaDetail.fecha.split("-").reverse().join("-")}
              </p>
              <p className={Styles.enterpriseData}>
                C.U.I.T : {clienteDeFactura.cuit}
              </p>
              <p className={Styles.enterpriseData}>
                Ing. Brutos: {clienteDeFactura.numero_ingresos_brutos}
              </p>
              <p className={Styles.enterpriseData}>
                Inicio de Actividades: {clienteDeFactura.inicio_actividades}
              </p>
            </div>
          </div>
          <hr />
          <div className={Styles.secondData}>
            <p className={Styles.facturaData}>
              <span className={Styles.bold}>Señores: </span>{" "}
              {facturaDetail.destinatario}
            </p>
            <p className={Styles.facturaData}>
              <span className={Styles.bold}>Dirección: </span>
              {facturaDetail.direccion}
            </p>
            <div className={Styles.justifyData}>
              <span className={Styles.bold}>I.V.A: </span>
              <p className={Styles.facturaData}>IVA Responsable Inscripto</p>
              <p className={Styles.facturaData}>
                C.U.I.T. : {facturaDetail.cuit}
              </p>
            </div>
            <br />
            <p className={Styles.facturaData}>
              <span className={Styles.bold}>Condición de venta: </span>{" "}
              {facturaDetail.cond_vta}
            </p>
          </div>

          <hr />
          <div className={Styles.flexContainer}>
            <div className={Styles.LimitedWidthDiv}>
              <p className={Styles.mainTable}>CANTIDAD</p>
              <p>
                {productosFactura.map((producto, index) => (
                  <p key={index}>{producto.cantidad}</p>
                ))}
              </p>
            </div>
            <div className={Styles.LimitedWidthDiv}>
              <p className={Styles.mainTable} style={{ marginLeft: "5px" }}>
                DESCRIPCIÓN
              </p>
              <p>
                {productosFactura.map((producto, index) => (
                  <p className={Styles.Concepto} key={index}>
                    {producto.concepto}
                  </p>
                ))}
              </p>
            </div>
            <div>
              <p className={Styles.mainTable}>I.UNIT.</p>
              <p>
                {" "}
                {productosFactura.map((producto, index) => (
                  <p key={index}>{producto.precioxu}</p>
                ))}
              </p>
            </div>
            <div>
              <p className={Styles.mainTable}>IMPORTE</p>
              <p>
                {" "}
                {productosFactura.map((producto, index) => (
                  <p key={index}>${producto.subtotal}</p>
                ))}
              </p>
            </div>
          </div>
          <br />
          <div className={Styles.rightContainer}>
            <p className={Styles.facturaData}>Subtotal: ${subTotalFinal} </p>
            <p className={Styles.facturaData}>
              IVA RESP. INSCRIPTO: ${ivaFinal}
            </p>
          </div>
          <hr />
          <div className={Styles.flexContainer}>
            <p className={Styles.bold}>Observaciones:</p>
            <div>
              <img
                src={clienteDeFactura.qr_code}
                alt="Codigo QR del cliente"
                style={{ width: "70px" }}
              />
              <img
                src={afipImg}
                alt="Sigla de Afip con detalle"
                style={{ width: "70px" }}
              />
            </div>
            <div>
                <p className={Styles.bold} style={{ textAlign: "right" }}>
                  TOTAL ${importeFinal}
                </p>
            {clienteDeFactura.direccion.toLowerCase().includes("caba") && (
              <div>
                <p className={Styles.caba} >
                  Orientación al Consumidor Prov. de Bs. As. 0800 222 9042
                </p>
                <p className={Styles.caba} >
                  Area defensa y protección al consumidor Tel. gratuito CABA 147
                </p>
              </div>
            )}
            </div>
          </div>
          <hr />

          <div className={Styles.EndContainer}>
            <div>
              <br />
              <p>C.A.I Nº: {clienteDeFactura.cai}</p>
              <p>
                Fecha de vencimiento:{" "}
                {facturaDetail.fecha.split("-").reverse().join("-")}
              </p>
              <p>CF-{clienteDeFactura.numero_controladora_fiscal}</p>
            </div>
          </div>
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
