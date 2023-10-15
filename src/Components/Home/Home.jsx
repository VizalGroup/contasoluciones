import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FacturasTable from '../Facturas/FacturasTable/FacturasTable';
import ClientesTable from '../Clientes/ClientesTable/ClientesTable';

export default function Home() {
  const dispatch = useDispatch();
  const nombreApp = useSelector((state) => state.nombreApp);

  useEffect(()=>{
    console.log("el nombre de la app es: ", nombreApp)
  },[dispatch]);


  return (<div>
    <h1>Bienvenido a {nombreApp}</h1>
    <br />
    <a href="/clients">

    <button >Clientes</button>
    </a>
    <h4>Tabla de Facturas</h4>
    <FacturasTable></FacturasTable>
    <p></p>
    
    
  </div>)
}
