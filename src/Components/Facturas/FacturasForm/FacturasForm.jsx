
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { PostFactura, GetClientes } from '../../../Redux/actions';

import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//import DateTimePicker from 'react-datetime-picker';

// DatePiker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';

const FacturasForm = () => {
    const dispatch = useDispatch();
    const clientes = useSelector((state) => state.clientes);
    const [facturaData, setFacturaData] = useState({
        fecha: '',
        concepto: '',
        cantidad: '',
        precioxu: '',
        iva: '',
        importe: '',
        id_cliente: '',
    });
    const [errors, setErrors] = useState({});
    const [newCliente, setNewCliente] = useState(false);
    const isNumeric = (str) => /^\d+$/.test(str);

    useEffect(() => {
        dispatch(GetClientes());
        CalculateImporte();
    }, [dispatch, facturaData.cantidad, facturaData.precioxu, facturaData.iva]);


    const handleChange = async(e) => {
        const { name, value } = e.target;
        setFacturaData({
            ...facturaData,
            [name]: value,
        });
        console.log("FORM: ", facturaData);
        return
    };


    const handleFechaChange = (date) => {
        if (date) {
            const fecha = dayjs(date).format('YYYY-MM-DD'); // Asegúrate de que la fecha tenga el formato correcto
            setFacturaData({
                ...facturaData,
                fecha: fecha,
            });
        }
    };


    const CalculateImporte = async () => {
        var cantidadXprecio = 0;
        var calculoIVA = 0;
        if (facturaData.cantidad !== '' && facturaData.precioxu !== '' && facturaData.iva !== '') {
            cantidadXprecio = facturaData.cantidad * facturaData.precioxu;
          if(facturaData.iva === 0){
            calculoIVA = 0
          } else {
            calculoIVA = (facturaData.iva * cantidadXprecio) / 100;
          }
            let importeTotal = cantidadXprecio + calculoIVA
            setFacturaData({
                ...facturaData,
                importe: importeTotal
            });
          console.log("El importe calculado es: ", facturaData.importe);
        } 
        return 
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
        if (!facturaData.cantidad || !isNumeric(facturaData.cantidad)) {
            newErrors.cantidad = 'Cantidad debe ser un número mayor a 0';
        }
        if (!facturaData.precioxu || !isNumeric(facturaData.precioxu)) {
            newErrors.precioxu = 'Precio Unitario debe ser un número mayor a 0';
        }
        if (!facturaData.iva || !isNumeric(facturaData.iva)) {
            newErrors.iva = 'IVA debe ser un número mayor o igual a 0';
        }
        if (!facturaData.id_cliente) {
            newErrors.id_cliente = 'Cliente es obligatorio';
        }
        
        if (Object.keys(newErrors).length === 0) { // No hay errores, crear la factura
            await dispatch(PostFactura(facturaData));
            console.log("SE HICE EL POST CORRECTAMENTE");
            setFacturaData({
                fecha: '',
                concepto: '',
                cantidad: '',
                precioxu: '',
                iva: '',
                importe: '',
                id_cliente: '',
            });
            setErrors({});
            //window.location.href = "/home";
        } else {
            setErrors(newErrors);
            console.log("HA ERRORES ", newErrors);
        }
    };


    return (<div>
        <div>
            <h4>Redactar Nueva Factura</h4>
            <form onSubmit={(e)=>handlePostFactura(e)}>

                {/* FECHA */}
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker 
                                label="Fecha" 
                                name='fecha'
                                value={facturaData.fecha}
                                onChange={(date) => handleFechaChange(date)}
                                error={!!errors.fecha}
                                helperText={errors.fecha}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>

                {/* CONCEPTO */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Concepto"
                            variant="outlined"
                            name="concepto"
                            value={facturaData.concepto}
                            onChange={handleChange}
                            error={!!errors.concepto}
                            helperText={errors.concepto}
                        />
                    </Grid>
                </Grid>

                {/* CANTIDAD */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Cantidad"
                            variant="outlined"
                            name="cantidad"
                            type='number'
                            value={facturaData.cantidad}
                            onChange={handleChange}
                            error={!!errors.cantidad}
                            helperText={errors.cantidad}
                        />
                    </Grid>
                </Grid>

                {/* PRECIO X UNIDAD */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Precio x Unidad"
                            variant="outlined"
                            name="precioxu"
                            type='number'
                            value={facturaData.precioxu}
                            onChange={handleChange}
                            error={!!errors.precioxu}
                            helperText={errors.precioxu}
                        />
                    </Grid>
                </Grid>

                {/* IVA */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="IVA"
                            variant="outlined"
                            name="iva"
                            type='number'
                            value={facturaData.iva}
                            onChange={handleChange}
                            error={!!errors.iva}
                            helperText={errors.iva}
                        />
                    </Grid>
                </Grid>

                {/* IMPORTE */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Importe"
                            variant="outlined"
                            name="importe"
                            disabled
                            value={facturaData.importe}
                            onChange={handleChange}
                            error={!!errors.importe}
                            helperText={errors.importe}
                        />
                    </Grid>
                </Grid>

                {/* CLIENTE */}
                <div>
                <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                        name="id_cliente"
                        value={facturaData.id_cliente}
                        label="Cliente"
                        onChange={handleChange}
                        error={!!errors.id_cliente}
                        helperText={errors.id_cliente}
                    >
                        {clientes.map(c =>(<MenuItem key={c.id} value={c.id}>
                            {c.nombre}
                            </MenuItem>))}
                    </Select>
                </FormControl>
                </div>
            
                {/* BOTONES */}
                <div>
                    <Link to='/home'><Button variant="primary">Go to Home</Button></Link>
                    <Button variant="primary" type='submit'>Crear Factura</Button>
                </div>
            </form>
        </div>
    </div>);
};

export default FacturasForm;