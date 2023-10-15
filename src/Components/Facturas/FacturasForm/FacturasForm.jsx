
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { PostFactura, GetClientes } from '../../../Redux/actions';

import { Form, Button } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


const FacturasForm = () => {
  const dispatch = useDispatch();
  //const history = useHistory();
  const clientes = useSelector((state) => state.clientes);

  const [facturaData, setFacturaData] = useState({
    fecha: '',
    concepto: '',
    cantidad: '',
    precioUnitario: '',
    iva: '',
    importe: '',
    cliente: null,
  });

  const [errors, setErrors] = useState({});
  const [newCliente, setNewCliente] = useState(false)

  useEffect(() => {
    //dispatch(GetClientes());
    console.log("Estado de clientes es: ", clientes);
  }, [dispatch]);

  const handleChange = async(e) => {
    const { name, value } = e.target;
    setFacturaData({
      ...facturaData,
      [name]: value,
    });
    if (name === 'cantidad' || name === 'precioUnitario' || name === 'iva') {
        calculateImporte();
    }
    console.log("FORM: ", facturaData);
  };

  const handleClienteChange = (event, value) => {
    setFacturaData({
      ...facturaData,
      cliente: value.id,
    });
  };

  const handleFechaChange = (date) => {
    // Convertir la fecha seleccionada a un formato de cadena (ddMMyyyy)
    const formattedDate = date
      ? `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`
      : '';
    setFacturaData({
      ...facturaData,
      fecha: formattedDate,
    });
  };

  const calculateImporte = () => {
    const { cantidad, precioUnitario, iva } = facturaData;
    if (cantidad && precioUnitario && iva) {
      const cantidadXprecio = cantidad * precioUnitario;
      const calculoIVA = (iva * cantidadXprecio) / 100;
      setFacturaData({
        ...facturaData,
        importe: cantidadXprecio + calculoIVA,
      });
    } else {
      // Si falta algún valor, el importe debe ser nulo
      setFacturaData({
        ...facturaData,
        importe: null,
      });
    }
  };

  const handlePostFactura = async(e) => {
    e.preventDefault();

    // Realizar validaciones
    const newErrors = {};
    if (!facturaData.fecha) {
      newErrors.fecha = 'Fecha es obligatoria';
    }
    if (!facturaData.concepto) {
      newErrors.concepto = 'Concepto es obligatorio';
    }
    if (!facturaData.cantidad || facturaData.cantidad <= 0) {
      newErrors.cantidad = 'Cantidad debe ser un número mayor a 0';
    }
    if (!facturaData.precioUnitario || facturaData.precioUnitario <= 0) {
      newErrors.precioUnitario = 'Precio Unitario debe ser un número mayor a 0';
    }
    if (!facturaData.iva || facturaData.iva < 0) {
      newErrors.iva = 'IVA debe ser un número mayor o igual a 0';
    }
    if (!facturaData.cliente) {
      newErrors.cliente = 'Cliente es obligatorio';
    }

    if (Object.keys(newErrors).length === 0) {
      // No hay errores, crear la factura
      await dispatch(PostFactura(facturaData));
      // Reiniciar el formulario
      setFacturaData({
        fecha: '',
        concepto: '',
        cantidad: '',
        precioUnitario: '',
        iva: '',
        importe: '',
        cliente: null,
      });
      setErrors({});
      //history.push("/home");
    } else {
      setErrors(newErrors);
    }
  };

  return (<div>
    <h4>Redactar Nueva Factura</h4>
    <Form onSubmit={(e)=>handlePostFactura(e)}>
      <Form.Group className="mb-3">
        {/* <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              label="Fecha"
              inputFormat="dd/MM/yyyy"
              value={facturaData.fecha}
              onChange={handleFechaChange}
              renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
            />
        </LocalizationProvider>
        {errors.fecha && <div style={{ color: 'red' }}>{errors.fecha}</div>} */}
      </Form.Group>

      <Form.Group className="mb-3">
        <TextField
          label="Concepto"
          variant="outlined"
          name="concepto"
          value={facturaData.concepto}
          onChange={handleChange}
          error={!!errors.concepto}
          helperText={errors.concepto}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <TextField
          label="Cantidad"
          variant="outlined"
          type="number"
          name="cantidad"
          value={facturaData.cantidad}
          onChange={handleChange}
          error={!!errors.cantidad}
          helperText={errors.cantidad}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <TextField
          label="Precio Unitario"
          variant="outlined"
          type="number"
          name="precioUnitario"
          value={facturaData.precioUnitario}
          onChange={handleChange}
          error={!!errors.precioUnitario}
          helperText={errors.precioUnitario}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <TextField
          label="IVA"
          variant="outlined"
          type="number"
          name="iva"
          value={facturaData.iva}
          onChange={handleChange}
          error={!!errors.iva}
          helperText={errors.iva}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <TextField
          label="Importe"
          variant="outlined"
          name="importe"
          value={facturaData.importe !== null ? facturaData.importe : ''}
          disabled
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="cliente"
                value={facturaData.cliente}
                label="Cliente"
                onChange={handleClienteChange}
            >
                <MenuItem>Aca Deberia haber un cliente</MenuItem>
                {/* {clientes.map(c =>(<MenuItem key={c.id} value={c.nombreRazonSocial}>
                    {c.nombreRazonSocial}
                    </MenuItem>))} */}
            </Select>
        </FormControl>
        <Button type='button' onClick={()=>setNewCliente(!newCliente)}>Agregar nuevo Cliente</Button>
        <div>{newCliente? <p>Formulario de CLiente</p> : null}</div>
      </Form.Group>

        <div>
            <Link to='/home'><Button variant="primary">Go to Home</Button></Link>
            <Button variant="primary" type='submit'>Crear Factura</Button>
        </div>
    </Form>
</div>);
};

export default FacturasForm;