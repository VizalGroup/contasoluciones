import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaLogoQR.module.css";
import {
  GetFacturaDetaill,
  ClearID,
  GetProductos,
  GetClientes,
} from "../../../Redux/actions";
import afipImg from "../../Img/Afip.png";
import { Style } from "@mui/icons-material";

// Esta Factura Posee tanto LOGO y QR el cliente con id 1 tiene uno de cada uno, hay un ejemplo en lo que nos paso el cliente

export default function FacturaLogoQR() {
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
            <div>
              <img
                src={clienteDeFactura.img_logo}
                className={Styles.fixImgSize}
              />
              <div className={Styles.noSpace}>
                <p>{clienteDeFactura.nombre}</p>
                <p>{clienteDeFactura.direccion}</p>
              </div>
              <br />

              <p>IVA RESPONSABLE INSCRIPTO</p>
            </div>
            <p className={Styles.tipoFactura}>A</p>
            <div>
              <p className={Styles.onlyFactura}>Factura</p>
              <div>
                <p
                  className={Styles.facturaData}
                  style={{ textAlign: "right" }}
                >
                  Nro A{facturaDetail.nro_factura}
                </p>
                <br />
                <div>
                  <span>
                    Fecha:
                    <p
                      className={Styles.facturaData}
                      style={{ textAlign: "right" }}
                    >
                      {facturaDetail.fecha.split("-").reverse().join("/")}
                    </p>
                  </span>
                </div>
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
          </div>
          <div className={Styles.secondData}>
            <p className={Styles.facturaData}>
              <span className={Styles.bold}>Sr./es: </span>{" "}
              {facturaDetail.destinatario}
            </p>
            <p className={Styles.facturaData}>
              <span className={Styles.bold}>Dirección: </span>
              {facturaDetail.direccion}
            </p>
            <div className={Styles.justifyData}>
              <span className={Styles.bold}> Condición I.V.A: </span>
              <p className={Styles.facturaData}>Responsable Inscripto</p>
              <span className={Styles.bold}> C.U.I.T. :</span>
              <p className={Styles.facturaData}>{facturaDetail.cuit}</p>
            </div>

            {/* <p className={Styles.facturaData}>
              <span className={Styles.bold}>Condición de venta: </span>{" "}
              {facturaDetail.cond_vta}
            </p> */}
          </div>

          <div className={Styles.headTable}>
            <p>Cantidad</p>
            <p>Detalle</p>
            <p>P.Unitario</p>
            <p>Importe</p>
          </div>
          <div className={Styles.Detail}>
            <div className={Styles.flexContainerDetail}>
              <div>
                <p>
                  {productosFactura.map((producto, index) => (
                    <p key={index}>{producto.cantidad}</p>
                  ))}
                </p>
              </div>
              <div className={Styles.LimitedWidthDiv}>
                <p>
                  {productosFactura.map((producto, index) => (
                    <p className={Styles.Concepto} key={index}>
                      {producto.concepto}
                    </p>
                  ))}
                </p>
              </div>
              <div>
                <p>
                  {" "}
                  {productosFactura.map((producto, index) => (
                    <p key={index}>${producto.precioxu}</p>
                  ))}
                </p>
              </div>
              <div>
                <p>
                  {" "}
                  {productosFactura.map((producto, index) => (
                    <p key={index}>${producto.subtotal}</p>
                  ))}
                </p>
              </div>
            </div>
            <div className={Styles.anuncios}>
              <div className={Styles.leftContainer}>
                <h5 className={Styles.tittleImport}>Importante Sr. Cliente</h5>

                <p className={Styles.textAnuncio}>
                  1) Vencido el plazo de pago, el importe de esta factura
                  devengará un interés igual al bancario para operaciones a 30
                  dias.
                </p>
              </div>
              <div className={Styles.rightContainer}>
                <div
                  className={Styles.justifyResume}
                  style={{ borderBottom: "2px solid #000" }}
                >
                  <p className={Styles.bold}>Subtotal:</p>
                  <p className={Styles.bold}>$</p>
                  <p className={Styles.facturaData}>{subTotalFinal}</p>
                </div>
                <div
                  className={Styles.justifyResume}
                  style={{ borderBottom: "2px solid #000" }}
                >
                  <p className={Styles.bold}>I.V.A. 21%</p>
                  <p className={Styles.bold}>$</p>
                  <p className={Styles.facturaData}>{ivaFinal}</p>
                </div>
                <div className={Styles.justifyResume}>
                  <p className={Styles.bold}>TOTAL</p>
                  <p className={Styles.bold}>$</p>
                  {importeFinal}
                </div>
              </div>
            </div>
            <div>
              <p className={Styles.emitir}>
                EMITIR CHEQUES A LA ORDEN DE {clienteDeFactura.nombre}
              </p>
              <div className={Styles.contact}>
                <div>
                  <p
                    className={Styles.facturaData}
                    style={{
                      textTransform: "uppercase",
                      padding: "10px",
                      border: "1px solid black",
                      borderRadius: "15px",
                    }}
                  >
                    {" "}
                    CONDICION DE PAGO: {facturaDetail.cond_vta}
                  </p>
                  <div>
                    {clienteDeFactura.direccion
                      .toLowerCase()
                      .includes("caba") && (
                      <div>
                        <p className={Styles.caba}>
                          "Teléfono Gratuito CABA, área de Defensa y Protección
                          al Consumidor #147"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
                  <p style={{textAlign: 'right', fontFamily: 'arial', fontWeight: 'bold'}}>Original</p>
                </div>
              </div>
            </div>

            <div className={Styles.EndContainer}>
              <div>
               
                <p>C.A.I Nº: {clienteDeFactura.cai}</p>
                <p>
                  Fecha de vencimiento:{" "}
                  {facturaDetail.fecha.split("-").reverse().join("-")}
                </p>
                <p>CF-{clienteDeFactura.numero_controladora_fiscal}</p>
              </div>
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
