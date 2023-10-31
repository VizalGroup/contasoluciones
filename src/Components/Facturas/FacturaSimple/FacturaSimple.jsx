import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import Styles from "./FacturaSimple.module.css";
import { GetFacturaDetaill, ClearID, GetClienteDetail } from "../../../Redux/actions";

export default function FacturaSimple() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const clientes = useSelector((state) => state.clientes);
  const productos = useSelector((state) => state.productos);

  const { facturaDetail } = useSelector((state) => state);
  const { clienteDetail } = useSelector((state) => state); //parte de lucas
  const [clienteFactura, setClienteFactura] = useState();
  const [productosFactura, setProductosFactura] = useState();

  const EncontrarClienteProductos = () => {
    let cliente = clientes.find((c) => c.id === facturaDetail.id_cliente);
    // if(cliente){
    //   dispatch(GetClienteDetail(cliente.id));
    // }
    let listaProductos = productos.filter(
      (p) => p.id_factura === facturaDetail.id
    );
    setClienteFactura(cliente);
    setProductosFactura(listaProductos);
  };

  useEffect(() => {
    dispatch(ClearID());
    dispatch(GetFacturaDetaill(id)) 
      .then((response) => {
        EncontrarClienteProductos();
        console.log("Detalles de la factura:", response.payload);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles de la factura:", error);
      });
  }, [dispatch, id]);

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

  return (
    <div className={Styles.pageContainer}>
      {facturaDetail && clienteFactura && productosFactura ? (
        <div className={Styles.Columna}>
          <div className={Styles.firstContainer}>
            <div>
              <p>{clienteFactura.nombre}</p>
              <p>{clienteFactura.direccion}</p>
              <p className={Styles.smallText}>IVA RESPONSABLE INSCRIPTO</p>
            </div>
            <p className={Styles.tipoFactura}>A</p>
            <div>
              <p>Factura</p>
              <p className={Styles.smallText}>
                Nro de Factura: {facturaDetail.nro_factura}
              </p>
              <p>Fecha: {facturaDetail.fecha.split("-").reverse().join("-")}</p>
              <p className={Styles.smallText}>
                C.U.I.T Nº: {clienteFactura.cuit}
              </p>
              <p className={Styles.smallText}>
                ING. BRUTOS: {clienteFactura.numero_ingresos_brutos}
              </p>
              <p className={Styles.smallText}>
                INICIO DE ACTIVIDADES: {clienteFactura.inicio_actividades}
              </p>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <hr />
          <div className={Styles.secondData}>
            <p>{facturaDetail.destinatario}</p>
            <p>{facturaDetail.direccion}</p>
            <p>Responsable Inscripto</p>
            <p>{facturaDetail.cuit}</p>
            <br />
            <p>condición de venta: {facturaDetail.cond_vta}</p>

            <br />
          </div>
          <div className={Styles.flexContainer}>
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
          {clienteFactura.direccion.toLowerCase().includes("caba") && (
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
              <p>C.A.I Nº: {clienteFactura.cai}</p>
              <p>
                Fecha de vencimiento:{" "}
                {facturaDetail.fecha.split("-").reverse().join("-")}
              </p>
              <p>CF-{clienteFactura.numero_controladora_fiscal}</p>
            </div>
            <div>Original blanco duplicado color</div>
          </div>
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
}
