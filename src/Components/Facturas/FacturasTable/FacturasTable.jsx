
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Material y estilos
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import Button from 'react-bootstrap/Button';
import Styles from './FacturasTable.module.css';

// Date Pikers
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Acciones
import { GetClientes, GetFacturas, UpdateFactura, DeleteFactura, GetProductos } from '../../../Redux/actions';

const FacturasTable = () => {
  const facturas = useSelector((state) => state.facturas);
  const clientes = useSelector((state) => state.clientes);
  const productos = useSelector((state) => state.productos);
  const [fecha, setFecha] = useState('');
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar las facturas basadas en el término de búsqueda
  const filteredFacturas = facturas.filter((factura) => { // Filtra por todas las propiedades excepto 'fecha'
    return Object.values(factura).some(
      (value) =>
        (typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase()) )
        || typeof value === 'number'
    );
  });

  const handleDelete = (facturaId) => {
    dispatch(DeleteFactura(facturaId));
    dispatch(GetFacturas());
    dispatch(GetClientes());
    dispatch(GetProductos());
  };

  const handleEdit = (facturaId) => {
    dispatch(UpdateFactura(facturaId));
  };

  const CalcularSubtotal = (id_factura) => {
    if(productos.length > 0){
      let productosFactura = productos.filter(p => p.id_factura === id_factura);
      let sumatoria = 0;
      for(let i=0; i < productosFactura.length; i++){
        sumatoria += Number(productosFactura[i].subtotal);
      }
      return sumatoria;
    } else {
      return
    }
  };

  const CalcularImporte = (id_factura) => {
    if(productos.length > 0){
      let productosFactura = productos.filter(p => p.id_factura === id_factura);
      let sumatoria = 0;
      for(let i=0; i < productosFactura.length; i++){
        sumatoria += Number(productosFactura[i].importe);
      }
      return sumatoria;
    } else {
      return
    }
  };

  const ClienteFactura = (id_cliente) => {
    if(clientes.length > 0){
      let cliente = clientes.find(c => c.id === id_cliente);
      let nombreCliente = cliente.nombre;
      return nombreCliente
    } else {
      return
    }
  };

  // SETEO DE LA FECHA para buscar
  const handleFechaChange = (date) => {
    if (date) {
      const fechaSeleccionada = dayjs(date).format('DD-MM-YYYY'); // Asegúrate de que la fecha tenga el formato correcto
      setFecha(fechaSeleccionada)
    }
    return
};

  useEffect(()=>{
    dispatch(GetFacturas());
    dispatch(GetClientes());
    dispatch(GetProductos());
  },[dispatch]);

  return (<div className={Styles.responsiveContainer}>
    <h4 className={Styles.title}>Tabla de Facturas</h4>
      {/* FECHA */}
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker 
                label="Fecha"
                variant="outlined"
                value={fecha}
                onChange={(date) => handleFechaChange(date)}
                format="DD-MM-YYYY"
              />
            </DemoContainer>
        </LocalizationProvider>
      </Grid>

      <div>
      <TableContainer component={Paper} className={Styles.customTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Nro Factura</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Importe</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.id}</TableCell>
                <TableCell>{factura.fecha.split('-').reverse().join('-')}</TableCell>
                <TableCell>{factura.nro_factura}</TableCell>
                <TableCell>{ClienteFactura(factura.id_cliente)}</TableCell>
                <TableCell>{CalcularSubtotal(factura.id)}</TableCell>
                <TableCell>{CalcularImporte(factura.id)}</TableCell> 
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
  </div>);
};

export default FacturasTable;