
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { GetClientes, UpdateCliente, ClearID,  
    GetFacturaDetaill, UpdateFactura, GetProductos } from '../../../Redux/actions';

// material y estilos
import Styles from './FacturasEditar.module.css';
import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Paper, Typography, Modal } from '@mui/material';
import Box from '@mui/material/Box';

const FacturasEditar = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const clientes = useSelector((state) => state.clientes);
    const productos = useSelector((state) => state.productos);
    const facturaDetail = useSelector((state) => state.facturaDetail);
    const [selectedOption, setSelectedOption] = useState("facturasimple");
    const productosFactura = productos.filter((p) => p.id_factura === facturaDetail.id);

    const [modalEdit, setModalEdit] = useState(false);
    const [facturaData, setFacturaData] = useState({
        fecha: '',
        id_cliente: '',
        nro_factura: '',
        destinatario: '',
        direccion: '',
        cuit: '',
        cond_vta: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(GetClientes());
        dispatch(GetProductos());
        dispatch(ClearID());
        if(id){
            dispatch(GetFacturaDetaill(id));
        };
    }, [dispatch, id]);


    const ClienteFactura = (id_cliente) => {
        if (clientes.length > 0) {
          let cliente = clientes.find((c) => c.id === id_cliente);
          if (cliente) {
            let nombreCliente = cliente.nombre;
            return nombreCliente;
          } else {
            return '';
          }
        } else {
          return '';
        }
    };

    // SETEO DE INPUTS GENERICO
    const handleChange = async(e) => {
        const { name, value } = e.target;
        setFacturaData({
            ...facturaData,
            [name]: value
        });
        return
    };

    // SETEO DEL NRO DE FACTURA
    const SetearUltimoNroFctura = async() => {
        let nroFactura = Number(facturaData.nro_factura).toString();
        let cliente = clientes.find(c => c.id === facturaData.id_cliente);
        cliente.ult_factura = nroFactura
        const ClienteActualizado = await dispatch(UpdateCliente(cliente.id, cliente));
        return ClienteActualizado;
    };

    // FUNCION UPDATE DE FACTURA
    const handleUpdateFactura = async() => {
        const ActualizarNroFactura = await SetearUltimoNroFctura();
        if(ActualizarNroFactura){
            const FacturaCreada = await dispatch(UpdateFactura(facturaDetail.id ,facturaData));
            if(FacturaCreada){
                setFacturaData({
                    fecha: '',
                    id_cliente: '',
                    nro_factura: '',
                    destinatario: '',
                    direccion: '',
                    cuit: '',
                    cond_vta: ''
                });
                setErrors({});
                await dispatch(GetFacturaDetaill(facturaDetail.id));
                closeModal();
            } else {
                console.error("ALGO SALIO MAL EN EL POST DE FACTURA");
            }
        };
    };

    // FUNCION DE VALIDACION DE FORMULARIO
    const handleValidateErrors = async(e) => {
        e.preventDefault();
        const newErrors = {};
        if (!facturaData.fecha) {
            newErrors.fecha = 'Fecha es obligatoria';
        }
        if (!facturaData.id_cliente) {
            newErrors.id_cliente = 'Cliente es obligatorio';
        }
        if (Object.keys(newErrors).length === 0) { // No hay errores, crear la factura
            await handleUpdateFactura();
        } else {
            setErrors(newErrors);
            console.error("HAY ERRORES ", newErrors);
        };
    };

    // CERRAR MODAL
    const closeModal = () => {
        setFacturaData({
            fecha: '',
            id_cliente: '',
            nro_factura: '',
            destinatario: '',
            direccion: '',
            cuit: '',
            cond_vta: ''
        });
        setModalEdit(false);
    };

    // ABRIR MODAL
    const openModal = () => {
        setFacturaData({
            fecha: facturaDetail.fecha,
            id_cliente: facturaDetail.id_cliente,
            nro_factura: facturaDetail.nro_factura,
            destinatario: facturaDetail.destinatario,
            direccion: facturaDetail.direccion,
            cuit: facturaDetail.cuit,
            cond_vta: facturaDetail.cond_vta
        });
        setModalEdit(true);
    };

    const bodyModal = (<Box className={Styles.modalContent}>
        <h4 className={Styles.title}>Modificar datos de Factura</h4>
        <div className={Styles.formContariner}>
            <Button onClick={closeModal} color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                Cancelar Editor
            </Button>
            <form onSubmit={(e)=>handleValidateErrors(e)}>
                <Grid container spacing={2} 
                style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                    {/* FECHA */}
                    <Grid item xs={12} sm={2}>
                        <TextField
                            name='fecha'
                            value={facturaData.fecha}
                            onChange={handleChange}
                            error={!!errors.fecha}
                            helperText={errors.fecha}
                            type='date'
                        />
                    </Grid>

                    {/* CLIENTE */}
                    <Grid item xs={12} sm={2.5}>
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
                    </Grid>

                    {/* NRO FACTURA */}
                    <Grid item xs={12} sm={2.5}>
                        <TextField
                            type="text"
                            label="Nro Factura"
                            variant="outlined"
                            name="nro_factura"
                            value={facturaData.nro_factura}
                            inputProps={{ inputMode:'numeric', pattern: '[0-9]*', maxLength: 12 }}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                    {/* DESTINATARIO */}
                    <Grid item xs={12} sm={2.5}>
                        <TextField
                            type="text"
                            label="Destinatario"
                            variant="outlined"
                            name="destinatario"
                            value={facturaData.destinatario}
                            inputProps={{ maxLength: 200 }}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* DIRECCION */}
                    <Grid item xs={12} sm={2.5}>
                        <TextField
                            type="text"
                            label="Direccion"
                            variant="outlined"
                            name="direccion"
                            value={facturaData.direccion}
                            inputProps={{ maxLength: 200 }}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* CUIT */}
                    <Grid item xs={12} sm={2.5}>
                        <TextField
                            type="text"
                            label="CUIT"
                            variant="outlined"
                            name="cuit"
                            value={facturaData.cuit}
                            inputProps={{ pattern: '^[0-9-]*$', maxLength: 15 }}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* COND_VTA */}
                    <Grid item xs={12} sm={2.5}>
                        <FormControl fullWidth>
                            <InputLabel>Condicion de Venta</InputLabel>
                            <Select
                                name="cond_vta"
                                value={facturaData.cond_vta}
                                label="Condicion de Venta"
                                onChange={handleChange}
                            >
                                <MenuItem value={'Efectivo'}>Efectivo</MenuItem>
                                <MenuItem value={'Cuenta Corriente'}>Cuenta Corriente</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {/* BOTONES */}
                <div className={Styles.buttonContainer} style={{ marginTop: 20 }}>
                    <Button variant="contained" color="primary" style={{ fontSize: "16px" }} type='submit' fullWidth>
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </div>
    </Box>);

    // SELECTOR DE IMPRIMIR
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (<div className={Styles.responsiveContainer}>
        <h3 className={Styles.title}>Detalle de Factura</h3>
        <div className={Styles.formContariner}>
        <div className={Styles.divBotones}>
            <Link to='/home'>
            <Button variant="contained" color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                Volver
            </Button>
            </Link>
            <Button onClick={openModal} color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                Editar Datos
            </Button>
            <div style={{ marginTop: "2px", marginLeft: "30vw", marginBottom: "5vh" }}>
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
            <Link to={`/${selectedOption}/${facturaDetail.id}`} 
              style={{ marginTop: "2px", marginLeft: "1vw", marginBottom: "5vh" }}>
                <Button variant="dark">Imprimir</Button>
            </Link>
        </div>

        <div className={Styles.facturaDetalle}>
            {facturaDetail ? <div>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Paper elevation={3}>
                            <Typography variant="subtitle1">
                                Nombre o Razón social: {ClienteFactura(facturaDetail.id_cliente)}
                            </Typography>
                            <Typography variant="subtitle1">
                                Destinatario: {facturaDetail.destinatario}
                            </Typography>
                            <Typography variant="subtitle1">
                                CUIT: {facturaDetail.cuit}
                            </Typography>
                            <Typography variant="subtitle1">
                                Dirección: {facturaDetail.direccion}
                            </Typography>
                            <Typography variant="subtitle1">
                                Condicion de venta: {facturaDetail.cond_vta}
                            </Typography>
                            <Typography variant="subtitle1">
                                Fecha de vencimiento: {facturaDetail.fecha}
                            </Typography>
                            <Typography variant="subtitle1">
                                Número de factura: {facturaDetail.nro_factura}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper elevation={3}>
                        {productosFactura.map((producto, index) => (<div>
                            <span>Producto asociado N°{index+1} </span>
                            <p key={index}>
                                <span> -Concepto: {producto.concepto}</span>
                                <span> -Cantidad: {producto.cantidad} - Precio x unidad: {producto.precioxu}</span>
                                <span> -IVA: {producto.iva} - Subtotal: {producto.subtotal} - Importe: {producto.importe}</span>
                            </p>
                        </div>))}
                        </Paper>
                    </Grid>
                </Grid>
            </div> : <h4>Loading...</h4>}
        </div>
        </div>

        <Modal open={modalEdit} onClose={closeModal}>
            {bodyModal}
        </Modal>
        
    </div>);
};

export default FacturasEditar;