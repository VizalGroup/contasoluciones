import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaLogo.module.css";
import { GetFacturaDetaill, ClearID, GetProductos, GetClientes } from "../../../Redux/actions";
import afipImg from "../../Img/Afip.png";
// Esta Factura tiene el logo arriba a la izquierda y marca de agua en el cuerpo del medio Donde van los productos, hay un ejemplo en la carpeta con los archivos del cliente

export default function FacturaLogo() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const clientes = useSelector((state) => state.clientes);
  const productos = useSelector((state) => state.productos);
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

  useEffect(() => {
    if (facturaDetail && clientes.length > 0) {
      const clienteDeFactura = clientes.find(
        (cliente) => cliente.id === facturaDetail.id_cliente
      );

      if (clienteDeFactura && facturaDetail) {
        document.title = `${clienteDeFactura.punto_vta}-${facturaDetail.nro_factura}_${facturaDetail.destinatario}`;
      }
    }
  }, [facturaDetail, clientes]);

  const productosFactura = productos.filter(
    (producto) => producto.id_factura === facturaDetail.id
  );

  const clienteFactura = clientes.find(
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

  const imagenFondo = clienteFactura && clienteFactura.img_logo;
  const backgroundImageStyle = {
    backgroundImage: `url(${imagenFondo})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    opacity: 0.2,
    position: "fixed",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Centra la imagen tanto en el eje X como en el eje Y
    width: '500px',
    height: '500px',
    zIndex: -1,
  };
  

  return (
    <div className={Styles.pageContainer}>
      <div style={backgroundImageStyle}></div>
      {facturaDetail && clienteFactura && productosFactura ? (
        <div>
          <div className={Styles.head}>

            <div >
              <img
                src={clienteFactura.img_logo}
                className={Styles.fixImgSize}
                alt=""
                />
            </div>
            <p className={Styles.tipoFactura}>A</p>
                </div>

          <div className={Styles.TopContainer}>
            <div className={Styles.divCliente}>
                <p className={Styles.negrita}>{clienteFactura.nombre}</p>
                <p className={Styles.mediumText}>
                  <span className={Styles.negrita}>{clienteFactura.direccion}</span>
                </p>
                <p className={Styles.mediumText}>
                  <span className={Styles.negrita}>IVA RESPONSABLE INSCRIPTO</span>
                </p>
            </div>

            <div className={Styles.divDestinatario}>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>Destinatario: </span>
                <span>{facturaDetail.destinatario}</span>
              </p>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>Dirección: </span>
                <span>{facturaDetail.direccion}</span>
              </p>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>Condición de venta: </span>
                <span>{facturaDetail.cond_vta}</span>
              </p>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>CUIT: </span>
                <span>{facturaDetail.cuit}</span>
              </p>
            </div>

            <div className={Styles.divDatosFactura}>
              <p className={Styles.negrita}>Factura</p>
              <p className={Styles.smallText}>
                <span className={Styles.negrita}>Nro de Factura: </span>
                <span>{clienteFactura.punto_vta}-{facturaDetail.nro_factura}</span>
                <br />
                <span>Codigo 01</span>

              </p>
              <p>
                <span className={Styles.negrita}>Fecha: </span>
                <span>{facturaDetail.fecha.split("-").reverse().join("/")}</span>
              </p>
              <p className={Styles.smallText}>
                <span className={Styles.negrita}>C.U.I.T Nº: </span>
                <span>{clienteFactura.cuit}</span>
              </p>
              <p className={Styles.smallText}>
                <span className={Styles.negrita}>ING. BRUTOS: </span>
                <span>{clienteFactura.numero_ingresos_brutos}</span> 
              </p>
              <p className={Styles.smallText}>
                <span className={Styles.negrita}>INICIO DE ACTIVIDADES: </span>
                <spa>{clienteFactura.inicio_actividades.split("-").reverse().join("/")}</spa>
              </p>
            </div>
          </div>

          <br />
          {/* <hr /> */}
          <div className={Styles.MidContainer}>
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
              <p className={Styles.mainTable}>P.UNIT.</p>
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
          {/* <hr /> */}
          

          <br />
          <div className={Styles.BottomContainer}>
            <p>Subtotal: ${subTotalFinal} </p>
            <p>
              IVA RESP. INSCRIPTO: ${ivaFinal}
            </p>
            <p className={Styles.negrita} style={{ textAlign: "right" }}>
                  TOTAL ${importeFinal}
            </p>
          </div>
          {/* <hr /> */}
          <br />
          <div className={Styles.BottomContainer}>
            <p className={Styles.negrita}>Observaciones:</p>
            <div>
              <img
                src={afipImg}
                alt="Sigla de Afip con detalle"
                style={{ width: "100px" }}
              />
            </div>
            <div>
            {clienteFactura.direccion.toLowerCase().includes("caba") && (
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
          {/* <hr /> */}

          <br />
          <div className={Styles.BottomContainer}>
              <p className={Styles.mediumText}>
                  <span className={Styles.negrita}>C.A.I Nº:: </span>
                  <span>{clienteFactura.cai}</span>
              </p>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>Fecha de vencimiento:{" "}</span>
                <span>{facturaDetail.fecha.split("-").reverse().join("-")}</span>
              </p>
              <p className={Styles.mediumText}>
                <span>CF-</span>
                <span>{clienteFactura.numero_controladora_fiscal}</span>
              </p>
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

