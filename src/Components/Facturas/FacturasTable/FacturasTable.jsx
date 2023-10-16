
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
import Styles from './FacturasTable.module.css';

import { GetClientes, GetFacturas, UpdateFactura, DeleteFactura } from '../../../Redux/actions';

const FacturasTable = () => {
  const facturas = useSelector((state) => state.facturas);
  const clientes = useSelector((state) => state.clientes);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar las facturas basadas en el término de búsqueda
  const filteredFacturas = facturas.filter((factura) => { 
    // Filtra por todas las propiedades excepto 'fecha'
    return Object.values(factura).some(
      (value) =>
        (typeof value === 'string'&&
        value.toLowerCase().includes(searchTerm.toLowerCase()) )
        || typeof value === 'number'
    );
  });

  const handleDelete = (facturaId) => {
    dispatch(DeleteFactura(facturaId));
    dispatch(GetFacturas());
    dispatch(GetClientes());
  };

  const handleEdit = (facturaId) => {
    dispatch(UpdateFactura(facturaId));
  };

  useEffect(()=>{
    dispatch(GetFacturas());
    dispatch(GetClientes());
  },[dispatch]);

  return (
    <div>
      <TextField
        label="Buscar Factura"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
      <TableContainer component={Paper} className={Styles.customTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Concepto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio Unitario</TableCell>
              <TableCell>Iva</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFacturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.id}</TableCell>
                <TableCell>{factura.fecha}</TableCell>
                <TableCell>{factura.concepto}</TableCell>
                <TableCell>{factura.cantidad}</TableCell>
                <TableCell>{factura.precioxu}</TableCell>
                <TableCell>{factura.iva}</TableCell>
                <TableCell>{factura.importe}</TableCell>
                <TableCell>{factura.id_cliente}</TableCell>
                <TableCell>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(factura.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(factura.id)}
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
    </div>
  );
};

export default FacturasTable;