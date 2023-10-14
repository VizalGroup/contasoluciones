
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';

import { DeleteCliente, GetClientes, GetFacturas, UpdateCliente } from '../../../Redux/actions';

const ClientesTable = () => {
  const clientes = useSelector((state) => state.clientes);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');

  const clientesPRUEBA = [
    {
      id: 1,
      cai: "123456789",
      cuit: "12-34567890-1",
      nombreRazonSocial: "Cliente A",
      inicioActividades: "2023-01-10",
      direccionLocal: "Calle 123, Ciudad",
      nroIngresosBrutos: "IB123456",
      nroControladoraFiscal: "CF-7890",
    },
    {
      id: 2,
      cai: "987654321",
      cuit: "98-76543210-2",
      nombreRazonSocial: "Cliente B",
      inicioActividades: "2022-05-15",
      direccionLocal: "Avenida 456, Ciudad",
      nroIngresosBrutos: "IB987654",
      nroControladoraFiscal: "CF-4321",
    },
    {
      id: 3,
      cai: "555555555",
      cuit: "55-55555555-3",
      nombreRazonSocial: "Cliente C",
      inicioActividades: "2021-11-20",
      direccionLocal: "Calle Principal, Pueblo",
      nroIngresosBrutos: "IB555555",
      nroControladoraFiscal: "CF-5555",
    },
  ];

  // Filtrar los clientes basados en el término de búsqueda
  const filteredClientes = clientesPRUEBA.filter((cliente) => { // clientes
    return Object.values(cliente).some(
      (value) =>
        (typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase()))
        || typeof value === 'number'
    );
  });

  const handleDelete = (clienteId) => {
    dispatch(DeleteCliente(clienteId));
  };

  const handleEdit = (clienteId) => {
    dispatch(UpdateCliente(clienteId))
  }

  useEffect(()=>{
    dispatch(GetFacturas());
    dispatch(GetClientes());
  },[dispatch]);

  return (
    <div>
      <TextField
        label="Buscar Cliente"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
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
                <TableCell>{cliente.nombreRazonSocial}</TableCell>
                <TableCell>{cliente.inicioActividades}</TableCell>
                <TableCell>{cliente.direccionLocal}</TableCell>
                <TableCell>{cliente.nroIngresosBrutos}</TableCell>
                <TableCell>{cliente.nroControladoraFiscal}</TableCell>
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