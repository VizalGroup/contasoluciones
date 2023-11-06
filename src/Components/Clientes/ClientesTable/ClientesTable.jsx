import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button"; 
import Styles from "./ClientesTable.module.css";

import {
  DeleteCliente,
  GetClientes,
} from "../../../Redux/actions";

const ClientesTable = () => {
  const clientes = useSelector((state) => state.clientes);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes.filter((cliente) => {
    return Object.values(cliente).some(
      (value) =>
        (typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())) ||
        typeof value === "number"
    );
  });

  const handleDelete = (clienteId) => {
    dispatch(DeleteCliente(clienteId));
    dispatch(GetClientes());
  };

  useEffect(() => {
    dispatch(GetClientes());
  }, [dispatch]);

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
      <div>
        <TextField
          label="Buscar Cliente"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            {filteredClientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.cai}</TableCell>
                <TableCell>{cliente.cuit}</TableCell>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.inicio_actividades}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>
                <TableCell>{cliente.numero_ingresos_brutos}</TableCell>
                <TableCell>{cliente.numero_controladora_fiscal}</TableCell>
                <TableCell>
                  <Link to={`/clienteEditar/${cliente.id}`}>
                    <Button variant="contained" color="primary" style={{marginRight: '5px'}}>
                      Ver
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    Borrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>);
};

export default ClientesTable;
