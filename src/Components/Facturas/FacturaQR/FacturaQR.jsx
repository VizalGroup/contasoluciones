import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaQR.module.css";
import { GetFacturaDetaill, ClearID, GetProductos, GetClientes } from "../../../Redux/actions";
import afipImg from "../../Img/Afip.png";

// Esta Factura es para los  clientes que Xargue el QR pero no el Logo (Revisa si tenes forma de unificarlos no reenderizando o haciendo ternarios, sino hacelos aparte como vos quieras)

export default function FacturaQR() {
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



  return (
    <div className={Styles.pageContainer}>
      {facturaDetail && clienteFactura && productosFactura ? (
        <div>
        <div className={Styles.head}>
        
          <div className={Styles.divCliente}>
            <p className={Styles.textoTop}>
              <p className={Styles.negrita}>{clienteFactura.nombre}</p>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>{clienteFactura.direccion}</span>
              </p>
              <p className={Styles.mediumText}>
                <span className={Styles.negrita}>IVA RESPONSABLE INSCRIPTO</span>
              </p>
            </p>
            <br />
            <p className={Styles.textoTop}>
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
            </p>
          </div>

          <p className={Styles.tipoFactura}>A</p>

          <div className={Styles.divDatosFactura}>
            <p className={Styles.textoTop}>
              <p className={Styles.negrita}>Factura</p>
              <p className={Styles.smallText}>
                <span className={Styles.negrita}>Nro de Factura: </span>
                <span>{facturaDetail.nro_factura}</span>
              </p>
              <p>
                <span className={Styles.negrita}>Fecha: </span>
                <span>{facturaDetail.fecha}</span>
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
                <spa>{clienteFactura.inicio_actividades}</spa>
              </p>
            </p>
          </div>
        </div>

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
        
        <div className={Styles.BottomContainer}>
          <div>
            <img
                className={Styles.fixImgSize}
                src={clienteFactura.qr_code}
                alt="QR no encontrado"
            />
            <img
              src={afipImg}
              alt="Sigla de Afip con detalle"
              style={{ width: "90px", height:"auto", marginRight:"10px", marginLeft: '10px' }}
            />
          </div>
          <div>
            <p className={Styles.negrita}>Observaciones:</p>
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
