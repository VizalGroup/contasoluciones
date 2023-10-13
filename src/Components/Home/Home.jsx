import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FacturasTable from '../Facturas/FacturasTable/FacturasTable';

export default function Home() {
  const dispatch = useDispatch();
  const saludo = useSelector((state) => state.hola);

  useEffect(()=>{
    console.log("el saludo es: ", saludo)
  },[dispatch]);


  return (
    <><h1>
      El saludo es: {saludo}
    </h1>
    <FacturasTable></FacturasTable></>
  )
}
