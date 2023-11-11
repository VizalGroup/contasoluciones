import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Material y estilos
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "react-bootstrap/Button";
import Styles from "./FacturasTable.module.css";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';

// Acciones
import {
  GetClientes,
  GetFacturas,
  DeleteFactura,
  GetProductos,
  DeleteProducto
} from "../../../Redux/actions";

const FacturasTable = () => {
  const facturas = useSelector((state) => state.facturas);
  const clientes = useSelector((state) => state.clientes);
  const productos = useSelector((state) => state.productos);
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("facturasimple");

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [clienteFiltrado, setClienteFiltrado] = useState("");

  const [modalConfirm, setModaConfirm] = useState(false);
  const [facturaParaBorrar, setFacturaParaBorrar] = useState({});


  const CalcularSubtotal = (id_factura) => {
    if (productos.length > 0) {
      let productosFactura = productos.filter(
        (p) => p.id_factura === id_factura
      );
      let sumatoria = 0;
      for (let i = 0; i < productosFactura.length; i++) {
        sumatoria += Number(productosFactura[i].subtotal);
      }
      return sumatoria;
    } else {
      return;
    }
  };

  const CalcularImporte = (id_factura) => {
    if (productos.length > 0) {
      let productosFactura = productos.filter(
        (p) => p.id_factura === id_factura
      );
      let sumatoria = 0;
      for (let i = 0; i < productosFactura.length; i++) {
        sumatoria += Number(productosFactura[i].importe);
      }
      return sumatoria;
    } else {
      return;
    }
  };

  const ClienteFactura = (id_cliente) => {
    if (clientes.length > 0) {
      let cliente = clientes.find((c) => c.id === id_cliente);
      let nombreCliente = cliente.nombre;
      return nombreCliente;
    } else {
      return;
    }
  };

  // SETEO DE LA FECHA para buscar
  const facturasFiltradas = facturas.filter((factura) => {
    const clienteNombre = ClienteFactura(factura.id_cliente);

    const fechaFactura = new Date(factura.fecha);
    const fechaDesdeDate = fechaDesde ? new Date(fechaDesde) : null;
    const fechaHastaDate = fechaHasta ? new Date(fechaHasta) : null;

    if (
      (!clienteFiltrado ||
        clienteNombre.toLowerCase().includes(clienteFiltrado.toLowerCase())) && // Filtrar por cliente
      (!fechaDesdeDate ||
        !fechaHastaDate ||
        (fechaFactura >= fechaDesdeDate && fechaFactura <= fechaHastaDate))
    ) {
      return true;
    }
    return false;
  });

  const handleClienteFilterChange = (event) => {
    setClienteFiltrado(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    dispatch(GetFacturas());
    dispatch(GetClientes());
    dispatch(GetProductos());
  }, [dispatch]);

  const openModal = (factura) => {
    setFacturaParaBorrar(factura);
    setModaConfirm(true);
  };

  const closeModal = () => {
    setFacturaParaBorrar();
    setModaConfirm(false);
  };

  const handleDelete = async(facturaId) => {
    try{
      const productosFactura = productos.filter((p) => p.id_factura === facturaId);
      await Promise.all(
        productosFactura.map(async (producto) => {
          await dispatch(DeleteProducto(producto.id));
        })
      );
      await dispatch(DeleteFactura(facturaId));
      await dispatch(GetFacturas());
      await dispatch(GetClientes());
      await dispatch(GetProductos());
      closeModal();
    } catch (error){
      console.error("Error al eliminar la Factura:", error);
    }
  };

  const bodyModal = (<Box className={Styles.modalContent}>
    <div className={Styles.contenidoModal}>
      <h3>Esta seguro que quiere borrar esta Factura ? </h3>
      <div>
        <Button variant="danger" onClick={()=> handleDelete(facturaParaBorrar.id)}>
          BORRAR
        </Button>
        <Button variant="primary" onClick={closeModal}>
          CANCELAR
        </Button>
      </div>
    </div>
  </Box>)

  return (
    <div className={Styles.responsiveContainer}>
      <h1 className={Styles.title}>Facturas por Empresa</h1>
      <div className={Styles.filters}>
        <div>
          <TextField
            label="Desde"
            type="date"
            style={{ marginRight: "5px" }}
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div>
          <TextField
            label="Buscar por Cliente"
            value={clienteFiltrado}
            onChange={handleClienteFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label className={Styles.bold}>Estilo de Impresión: </label>
          <Select value={selectedOption} onChange={handleSelectChange}>
            <MenuItem value="facturasimple">Simple</MenuItem>
            <MenuItem value="facturalogo">Con Logo</MenuItem>
            <MenuItem value="facturaqr">Con QR</MenuItem>
            <MenuItem value="facturalogoyqr">Logo y QR</MenuItem>
            <MenuItem value="facturamoderna">Moderna</MenuItem>
            <MenuItem value="facturalogobackground">Marca de Agua</MenuItem>
          </Select>
        </div>
      </div>

      <div>
        <TableContainer component={Paper} className={Styles.customTable}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Nro Factura</TableCell>
                <TableCell>Razón social</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Importe</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturasFiltradas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell style={{ textAlign: "center" }}>
                    {factura.fecha.split("-").reverse().join("-")}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {factura.nro_factura}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {ClienteFactura(factura.id_cliente)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {CalcularSubtotal(factura.id)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {CalcularImporte(factura.id)}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Link to={`/facturaEditar/${factura.id}`}>
                      <Button variant="primary">
                        Ver
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => openModal(factura)}
                    >
                      Borrar
                    </Button>
                    <Link to={`/${selectedOption}/${factura.id}`}>
                      <Button variant="dark">Imprimir</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal open={modalConfirm} onClose={closeModal}>
        {bodyModal}
      </Modal>

    </div>
  );
};

export default FacturasTable;
