import "./App.css";
import React from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './Components/Login/Login'
import Home from "./Components/Home/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import FacturasForm from "./Components/Facturas/FacturasForm/FacturasForm";
import ClientesTable from "./Components/Clientes/ClientesTable/ClientesTable";
import ClienteForm from "./Components/Clientes/ClienteForm/ClienteForm";
import FacturaSimple from "./Components/Facturas/FacturaSimple/FacturaSimple";
import FacturaLogo from "./Components/Facturas/FacturaLogo/FacturaLogo";
import FacturaQR from "./Components/Facturas/FacturaQR/FacturaQR";
import FacturaModerna from "./Components/Facturas/FacturaModerna/FacturaModerna";
import FacturaLogoQR from "./Components/Facturas/FacturaLogoQR/FacturaLogoQR";
import ClientesEditar from "./Components/Clientes/ClientesEditar/ClientesEditar";
import FacturasEditar from "./Components/Facturas/FacturasEditar/FacturasEditar";
import Informe from "./Components/Clientes/Informe/Informe";


const PrivateRoute = ({ element }) => {
  // Función para verificar si el usuario ha iniciado sesión o no (puedes implementar tu lógica aquí).
  const checkLoggedIn = () => {
    // Para este ejemplo, asumiremos que el usuario ha iniciado sesión si hay un nombre de usuario en el almacenamiento local.
    return !!localStorage.getItem('username');
  };
  // Comprueba si el usuario ha iniciado sesión o no.
  const loggedIn = checkLoggedIn();

  return loggedIn ? element : <Navigate to="/" />;
};


function App() {
  return ( <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/newFactura" element={<PrivateRoute element={<FacturasForm />} />} />
        <Route path="/clients" element={<PrivateRoute element={<ClientesTable />} />} />
        <Route path="/addclient" element={<PrivateRoute element={<ClienteForm />} />} />
        <Route path="/facturasimple/:id" element={<PrivateRoute element={<FacturaSimple />} />} />
        <Route path="/facturalogo/:id" element={<PrivateRoute element={<FacturaLogo />} />} />
        <Route path="/facturaqr/:id" element={<PrivateRoute element={<FacturaQR />} />} />
        <Route path="/facturalogoyqr/:id" element={<PrivateRoute element={<FacturaLogoQR />} />} />
        <Route path="/facturamoderna/:id" element={<PrivateRoute element={<FacturaModerna />} />} />
        <Route path="/facturaEditar/:id" element={<PrivateRoute element={<FacturasEditar />} />} />
        <Route path="/clienteEditar/:id" element={<PrivateRoute element={<ClientesEditar />} />} />
        <Route path="/informe/:id" element={<PrivateRoute element={<Informe />} />} />
      </Routes>
    </div>
  </BrowserRouter> );
}

export default App;
