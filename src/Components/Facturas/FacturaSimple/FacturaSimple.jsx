import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaSimple.module.css";
import {
  GetFacturaDetaill,
  ClearID,
  GetProductos,
  GetClientes,
} from "../../../Redux/actions";

export default function FacturaSimple() {
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
      <title>
        {facturaDetail.nro_factura}_{facturaDetail.destinatario}
      </title>
      {facturaDetail && clienteDeFactura && productosFactura ? (
        <div className={Styles.Columna}>
          <div className={Styles.firstContainer}>
            <div style={{ maxWidth: "80mm" }}>
              <p>{clienteDeFactura.nombre}</p>
              <p>{clienteDeFactura.direccion}</p>
              <p className={Styles.smallText}>IVA RESPONSABLE INSCRIPTO</p>
            </div>
            <p
              className={Styles.tipoFactura}
              style={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              A
            </p>
            <div style={{ lineHeight: "1" }}>
              <p>Factura</p>
              <p className={Styles.smallText} style={{ marginBottom: "0" }}>
                Nro de Factura: {clienteDeFactura.punto_vta}-
                {facturaDetail.nro_factura}
              </p>
              <p className={Styles.smallText} style={{ marginTop: "5px" }}>
                Codigo 01
              </p>
              <p>Fecha: {facturaDetail.fecha.split("-").reverse().join("-")}</p>
              <p className={Styles.smallText} style={{ marginBottom: "5px" }}>
                C.U.I.T Nº: {clienteDeFactura.cuit}
              </p>
              <p className={Styles.smallText} style={{ marginBottom: "5px" }}>
                ING. BRUTOS: {clienteDeFactura.numero_ingresos_brutos}
              </p>
              <p className={Styles.smallText}>
                INICIO DE ACTIVIDADES:{" "}
                {clienteDeFactura.inicio_actividades
                  .split("-")
                  .reverse()
                  .join("/")}
              </p>
            </div>
          </div>
          <hr />
          <br />
          <hr />
          <div className={Styles.secondData}>
            <div style={{ justifyContent: "space-between", display: "flex" }}>
              <p>{facturaDetail.destinatario} </p>
              <p> CUIT: {facturaDetail.cuit} </p>
              <p> Responsable Inscripto </p>
            </div>
            <br />
            <p>{facturaDetail.direccion}</p>
            <br />
            <p>condición de venta: {facturaDetail.cond_vta}</p>
            <hr />
            
          </div>
          <div className={Styles.detailContainer}>
            <div className={Styles.LimitedWidthDiv}>
              <p>Cantidad</p>
              <p>
                {productosFactura.map((producto, index) => (
                  <p key={index}>{producto.cantidad}</p>
                ))}
              </p>
            </div>
            <div className={Styles.LimitedWidthDiv}>
              <p style={{ marginLeft: "5px" }}>Descripcion</p>
              <p>
                {productosFactura.map((producto, index) => (
                  <p className={Styles.Concepto} key={index}>
                    {producto.concepto}
                  </p>
                ))}
              </p>
            </div>
            <div>
              <p>p.UNIT.</p>
              <p>
                {" "}
                {productosFactura.map((producto, index) => (
                  <p key={index}>{producto.precioxu}</p>
                ))}
              </p>
            </div>
            <div>
              <p>alicuota iva</p>
              <p>21%</p>
            </div>
            <div>
              <p>precio neto</p>
              <p>
                {" "}
                {productosFactura.map((producto, index) => (
                  <p key={index}>${producto.importe}</p>
                ))}
              </p>
            </div>
          </div>
          <br />
          <div className={Styles.flexContainer}>
            <div>
              <p>Subtotal</p>
              <p>${subTotalFinal}</p>
            </div>
            <div>
              <p>iva %</p>
              <p>(21%)</p>
            </div>
            <div>
              <p>iva</p>
              <p>${ivaFinal}</p>
            </div>
            <div>Percep.Reten</div>
            <div>Otros</div>
            <div>No gravados</div>
            <div>
              <p>Total</p>
              <p>{importeFinal}</p>
            </div>
          </div>
          <p className={Styles.secondData}>
            Recibimos su pago: ${importeFinal}
          </p>
          {clienteDeFactura.direccion.toLowerCase().includes("caba") && (
            <p className={Styles.secondData} style={{ fontSize: "12px" }}>
              TELEFONO GRATUITO C.A.B.A., Area de defensa y proteccion al
              consumidor nro.147
            </p>
          )}
          <br />
          <hr />
          <br />
          <hr />
          <div className={Styles.EndContainer}>
            <div>
              <br />
              <p>C.A.I Nº: {facturaDetail.cai}</p>
              <p>
                Fecha de vto:{" "}
                {facturaDetail.fecha.split("-").reverse().join("-")}
              </p>
              <p>CF-{clienteDeFactura.numero_controladora_fiscal}</p>
            </div>
            <div>Original blanco duplicado color</div>
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
