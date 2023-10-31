import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Styles from "./FacturaLogo.module.css";
import { GetFacturaDetaill, ClearID } from "../../../Redux/actions";

// Esta Factura tiene el logo arriba a la izquierda y marca de agua en el cuerpo del medio Donde van los productos, hay un ejemplo en la carpeta con los archivos del cliente

export default function FacturaLogo() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const facturas = useSelector((state) => state.facturas);
  const clientes = useSelector((state) => state.clientes);
  const productos = useSelector((state) => state.productos);

  const { facturaDetail } = useSelector((state) => state);
  const [clienteFactura, setClienteFactura] = useState();
  const [productosFactura, setProductosFactura] = useState();

  const EncontrarClienteProductos = () => {
    let cliente = clientes.find((c) => c.id === facturaDetail.id_cliente);
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

  return (
    <div className={Styles.pageContainer}>
      {facturaDetail && clienteFactura && productosFactura ? (
        <div className={Styles.Columna}>
          <div className={Styles.flexContainer}>
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
              <p>Fecha: {facturaDetail.fecha}</p>
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
          <p>Productos:</p>
          {productosFactura.map((producto, index) => (
          <p key={index}>{producto.concepto}</p>
          ))}
        </div>
      ) : (
        <h4>Loading...</h4>
      )}
    </div>
  );
}
{
}