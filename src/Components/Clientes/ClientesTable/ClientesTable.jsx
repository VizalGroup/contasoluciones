import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button"; 
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Styles from "./ClientesTable.module.css";

import {
  DeleteCliente,
  DeleteFactura,
  DeleteProducto,
  GetClientes,
  GetFacturas,
  GetProductos,
} from "../../../Redux/actions";

const ClientesTable = () => {
  const clientes = useSelector((state) => state.clientes);
  const facturas = useSelector((state) => state.facturas);
  const productos = useSelector((state) => state.productos);
  const [modalConfirm, setModaConfirm] = useState(false);
  const [clienteParaBorrar, setClienteParaBorrar] = useState({});
  const dispatch = useDispatch();

  const handleDelete = async (clienteId) => {
    try {
      const facturasCliente = facturas.filter((f) => f.id_cliente === clienteId);
      await Promise.all(
        facturasCliente.map(async (factura) => {
          const productosFactura = productos.filter((p) => p.id_factura === factura.id);
          await Promise.all(
            productosFactura.map(async (producto) => {
              await dispatch(DeleteProducto(producto.id));
            })
          );
          await dispatch(DeleteFactura(factura.id));
        })
      );
      await dispatch(DeleteCliente(clienteId));
      await dispatch(GetClientes());
      closeModal();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const openModal = (cliente) => {
    setClienteParaBorrar(cliente);
    setModaConfirm(true);
  };

  const closeModal = () => {
    setClienteParaBorrar();
    setModaConfirm(false);
  };

  useEffect(() => {
    dispatch(GetClientes());
    dispatch(GetFacturas());
    dispatch(GetProductos());
  }, [dispatch]);
  
  const bodyModal = (<Box className={Styles.modalContent}>
    <div className={Styles.contenidoModal}>
      <h3>Esta seguro que quiere borrar al cliente ? </h3>
      <div>
        <Button variant="contained" color="error" onClick={()=> handleDelete(clienteParaBorrar.id)}>
          BORRAR
        </Button>
        <Button variant="contained" onClick={closeModal}>
          CANCELAR
        </Button>
      </div>
    </div>
  </Box>)

  return (<div className={Styles.responsiveContainer}>
      <h2 className={Styles.title}>Registro Clientes</h2>
      <div className={Styles.buttonContainer}>
        <a href="/home">
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: "16px" }}
          >
            Volver
          </Button>
        </a>
        <a href="/addclient">
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: "16px" }}
          >
            + Agregar cliente
          </Button>
        </a>
      </div>

      <TableContainer component={Paper} className={Styles.customTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nº Cliente</TableCell>
              <TableCell>CAI</TableCell>
              <TableCell>CUIT</TableCell>
              <TableCell>Nombre o Razón Social</TableCell>
              <TableCell>Inicio de Actividades</TableCell>
              <TableCell>Dirección de Local</TableCell>
              <TableCell>Nro Ingresos Brutos</TableCell>
              <TableCell>Nro Controladora Fiscal</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell style={{ textAlign: "center" }}>{cliente.id}</TableCell>
                <TableCell>{cliente.cai}</TableCell>
                <TableCell >{cliente.cuit}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{cliente.nombre}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{cliente.inicio_actividades}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{cliente.direccion}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{cliente.numero_ingresos_brutos}</TableCell>
                <TableCell style={{ textAlign: "center" }}>CF-{cliente.numero_controladora_fiscal}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <Link to={`/clienteEditar/${cliente.id}`}>
                    <Button variant="contained" color="primary" style={{marginRight: '5px'}}>
                      Ver
                    </Button>
                  </Link>
                  <Button variant="contained" color="error" onClick={() => openModal(cliente)}>
                    Borrar
                  </Button>
                  <Link to={`/informe/${cliente.id}`}>
                      <Button variant="dark">Ver Informe</Button>
                    </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalConfirm} onClose={closeModal}>
        {bodyModal}
      </Modal>

    </div>);
};

export default ClientesTable;
