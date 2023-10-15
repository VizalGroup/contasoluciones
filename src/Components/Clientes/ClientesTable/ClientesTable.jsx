import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "react-bootstrap/Button";

import {
  DeleteCliente,
  GetClientes,
  UpdateCliente,
} from "../../../Redux/actions";

const ClientesTable = () => {
  const clientes = useSelector((state) => state.clientes);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar los clientes basados en el término de búsqueda
  const filteredClientes = clientes.filter((cliente) => {
    // clientes
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

  const handleEdit = (clienteId) => {
    dispatch(UpdateCliente(clienteId));
  };

  useEffect(() => {
    dispatch(GetClientes());
  }, [dispatch]);

  return (
    <div>
      <a href="/addclient">
        <Button
          variant="success" 
          style={{ fontSize: "1.5em" }} 
        >
          + Agregar cliente
        </Button>
      </a>
      <div>
        <TextField
          label="Buscar Cliente"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TableContainer component={Paper}>
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
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(cliente.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
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
    </div>
  );
};

export default ClientesTable;
