import React from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FacturasTable from '../Facturas/FacturasTable/FacturasTable';
import ClientesTable from '../Clientes/ClientesTable/ClientesTable';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Styles from './Home.module.css';

export default function Home() {
  const dispatch = useDispatch();
  const nombreApp = useSelector((state) => state.nombreApp);

  useEffect(()=>{
    console.log("el nombre de la app es: ", nombreApp)
  },[dispatch]);

  return (<div className={Styles.responsiveContainer}>
    <h1 className={Styles.title}>Bienvenido a {nombreApp}</h1>
    <br />
    <div className={Styles.buttonContainer}>
      <Link to="/clients"><Button variant="contained" color="primary" style={{ fontSize: "16px" }}>
        Clientes</Button></Link>
      <Link to="/newFactura"><Button variant="contained" color="primary" style={{ fontSize: "16px" }}>
        Nueva Factura</Button></Link>
    </div>
    <FacturasTable></FacturasTable>
    <p></p>
    
    
  </div>)
}
