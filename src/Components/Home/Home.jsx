import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FacturasTable from '../Facturas/FacturasTable/FacturasTable';
import ClientesTable from '../Clientes/ClientesTable/ClientesTable';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  const nombreApp = useSelector((state) => state.nombreApp);

  useEffect(()=>{
    console.log("el nombre de la app es: ", nombreApp)
  },[dispatch]);

  return (<div>
    <h1>Bienvenido a {nombreApp}</h1>
    <Link to='/newFactura'><Button variant="primary">Nueva Factura</Button></Link>
    <p></p>
    <h4>Tabla de Facturas</h4>
    <FacturasTable></FacturasTable>
    <p></p>
    <Link to='/newCliente'><Button variant="primary">Nuevo Cliente</Button></Link>
    <h4>Tabla de Clientes</h4>
    <ClientesTable></ClientesTable>
    
  </div>)
}
