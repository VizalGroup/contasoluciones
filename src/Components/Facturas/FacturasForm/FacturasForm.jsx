
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
import Styles from './FacturasForm.module.css';

// DatePiker
import dayjs from 'dayjs';

const FacturasForm = () => {
    const date = new Date();
    const fecha = dayjs(date).format('DD-MM-YYYY');
    const dispatch = useDispatch();
    const clientes = useSelector((state) => state.clientes);
    const [facturaData, setFacturaData] = useState({
        fecha: fecha,
        concepto: '',
        cantidad: '',
        precioxu: '',
        iva: '',
        importe: '',
        id_cliente: '',
    });
    const [errors, setErrors] = useState({});
    const isNumeric = (str) => /^\d+$/.test(str);

    useEffect(() => {
        dispatch(GetClientes());
        CalculateImporte();
        //FechaActual();
    }, [dispatch, facturaData.cantidad, facturaData.precioxu, facturaData.iva, facturaData.fecha]);


    const handleChange = async(e) => {
        const { name, value } = e.target;
        // let date = new Date();
        // const fecha = dayjs(date).format('DD-MM-YYYY');
        setFacturaData({
            ...facturaData,
            [name]: value,
            //fecha: fecha,
        });
        console.log("FORM: ", facturaData);
        return
    };

    const FechaActual = async () => {
        let date = new Date();
        const fecha = dayjs(date).format('DD-MM-YYYY');
        setFacturaData({
            ...facturaData,
            fecha: fecha,
        });
        return
    }

    const CalculateImporte = async () => {
        var cantidadXprecio = 0;
        var calculoIVA = 0;
        if (facturaData.cantidad !== '' && facturaData.precioxu !== '' && facturaData.iva !== '') {
            cantidadXprecio = facturaData.cantidad * facturaData.precioxu;
            console.log("Cant X Precio: ", cantidadXprecio);
            if(facturaData.iva === 0){
                calculoIVA = 0
            } else {
                calculoIVA = (facturaData.iva * cantidadXprecio) / 100;
                console.log("Iva Calculado: ", calculoIVA);
            }
            let importeTotal = cantidadXprecio + calculoIVA
            console.log("El Importe total es:: ", importeTotal);
            await setFacturaData({
                ...facturaData,
                importe: importeTotal
            });
            if(facturaData.importe != ''){
                console.log("El importe calculado es: ", facturaData.importe);
            } else {
                console.log("ALGO PASO que le importe NO se calculo ", facturaData.importe);
            }
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
        if (!facturaData.importe) {
            newErrors.importe = 'El Importe es obligatorio';
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
            <h3 className={Styles.title}>Redactar Nueva Factura</h3>
        <div className={Styles.formContariner}>
            <div className={Styles.buttonContainer} style={{ marginTop: 20 }}>
                <Link to='/home'><Button variant="contained" color="primary" style={{ fontSize: "16px" }}>
                    Volver
                </Button></Link>
            </div>

            <form onSubmit={(e)=>handlePostFactura(e)}>
                <Grid container spacing={2} style={{ marginTop: 14 }}>
                    {/* CONCEPTO */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
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
                
                <Grid container spacing={3} style={{ marginTop: 14 }}>
                    {/* CANTIDAD */}
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
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

                    {/* PRECIO X UNIDAD */}
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
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

                    {/* IVA */}
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
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

                <Grid container spacing={2} style={{ marginTop: 16 }}>
                    {/* IMPORTE */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
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

                    {/* FECHA */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha"
                            variant="outlined"
                            name="fecha"
                            disabled
                            value={facturaData.fecha}
                            onChange={handleChange}
                            error={!!errors.fecha}
                            helperText={errors.fecha}
                            placeholder={new Date()}
                        />
                    </Grid>
                </Grid>
                
                {/* CLIENTE */}
                <div>
                <FormControl fullWidth style={{ marginTop: 20 }}>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                        name="id_cliente"
                        value={facturaData.id_cliente}
                        label="Cliente"
                        onChange={handleChange}
                        error={!!errors.id_cliente}
                        helperText={errors.id_cliente}
                    >
                        {clientes.map(c =>(<MenuItem key={c.id} value={c.id} fullWidth>
                            {c.nombre}
                            </MenuItem>))}
                    </Select>
                </FormControl>
                
                    <div className={Styles.buttonContainer} style={{ marginTop: 20 }}>
                        <Link to='/addclient'><Button variant="contained" color="primary" style={{ fontSize: "16px" }}>
                            Agregar Nevo Cliente
                        </Button></Link>
                    </div>
                </div>
                
            
                {/* BOTONES */}
                <div className={Styles.buttonContainer} style={{ marginTop: 20 }}>
                    <Button variant="contained" color="primary" style={{ fontSize: "16px" }} type='submit' fullWidth>
                        Crear Factura
                    </Button>
                </div>
            </form>
        </div>
    </div>);
};

export default FacturasForm;