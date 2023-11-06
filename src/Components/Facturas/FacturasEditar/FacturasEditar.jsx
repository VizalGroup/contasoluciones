
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { GetClientes, UpdateCliente, ClearID, PostProducto, 
    GetFacturaDetaill, UpdateFactura, UpdateProducto, GetProductoDetaill, GetProductos } from '../../../Redux/actions';

// material y estilos
import Styles from './FacturasEditar.module.css';
import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ProductInput from '../../Productos/ProductoInput';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Paper, Typography, Modal } from '@mui/material';
import Box from '@mui/material/Box';

const FacturasEditar = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const clientes = useSelector((state) => state.clientes);
    const productos = useSelector((state) => state.productos);
    const facturaDetail = useSelector((state) => state.facturaDetail);
    const productosDetail = useSelector((state) => state.productosDetail);
    //const [productosFactura, setProductosFactura] = useState([]);
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
    const [products, setProducts] = useState([
        { id:'',
        concepto: '', 
        cantidad: '', 
        precioxu: '', 
        iva: '', 
        subtotal: '', 
        importe: '', 
        id_factura: '' },
    ]);
    const addProduct = () => {
        setProducts([...products, 
            { id:'',
            concepto: '', 
            cantidad: '', 
            precioxu: '', 
            iva: '', 
            subtotal: '', 
            importe: '', 
            id_factura: '' }
        ]);
    };
    const [errors, setErrors] = useState({});

    // const EncontrarProductos = () => {
    //     let listaProductos = productos.filter((p) => p.id_factura === facturaDetail.id);
    //     setProductosFactura(listaProductos);
    // };

    useEffect(() => {
        console.log("el ID es: ", id);
        dispatch(GetClientes());
        dispatch(GetProductos());
        dispatch(ClearID());
        if(id){
            dispatch(GetFacturaDetaill(id));
            //BuscarDetallesProductos();
            //EncontrarProductos();
        };
        console.log("Detalle de factura: ", facturaDetail);
        console.log("Detalle de procutsos: ", productosFactura);
    }, [dispatch, id]);

    // const BuscarDetallesProductos = async() => {
    //     //await EncontrarProductos();
    //     for(let i = 0; i < productos.length; i++) {
    //         if(productos[i].id_factura === facturaDetail.id){
    //             await dispatch(GetProductoDetaill(productos[i].id));
    //         };
    //     };
    // };

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
        console.log("FORM: ", facturaData);
        return
    };

    // SETEO DEL NRO DE FACTURA
    const handleNroChange = () => {
        let cliente = clientes.find(c => c.id === facturaData.id_cliente);
        let nroCliente = Number(cliente.ult_factura) + 1;
        let nroClienteStr = nroCliente.toString().padStart(12, '0');
        setFacturaData({
            ...facturaData,
            nro_factura: nroClienteStr
        });
        return
    };
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
            console.log("Cliente ACtualizado: ", ActualizarNroFactura.payload);
            const FacturaCreada = await dispatch(UpdateFactura(facturaDetail.id ,facturaData));
            if(FacturaCreada){
                console.log("SE hiso el POST de la factura su ID es: ", FacturaCreada.payload.id);
                //await PostearProductos(FacturaCreada.payload.id);
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
                //window.location.href = "/home";
                await dispatch(GetFacturaDetaill(facturaDetail.id));
                closeModal();
            } else {
                console.log("ALGO SALIO MAL EN EL POST DE FACTURA");
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
            console.log("HAY ERRORES ", newErrors);
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

                    {/* <Grid item xs={12} sm={2.5}>
                        <Link to='/addclient'><Button variant="contained" color="primary" style={{ fontSize: "13px" }}>
                            Agregar Nevo Cliente
                        </Button></Link>
                    </Grid> */}
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


    return (<div className={Styles.responsiveContainer}>
        <h3 className={Styles.title}>Detalle de Factura</h3>
        <div className={Styles.formContariner}>
        <div>
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
                                <tr> -Concepto: {producto.concepto}</tr>
                                <tr> -Cantidad: {producto.cantidad} - Precio x unidad: {producto.precioxu}</tr>
                                <tr> -IVA: {producto.iva} - Subtotal: {producto.subtotal} - Importe: {producto.importe}</tr>
                            </p>
                        </div>))}
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {/* <Grid item xs={6}>
                        {productosFactura.map((producto, index) => (<div>
                            <p>Producto asociado N°{index+1} </p>
                            <p key={index}>
                                Concepto: {producto.concepto} - Cantidad: {producto.cantidad} - Precio x unidad: {producto.precioxu}
                                - IVA: {producto.iva} - Subtotal: {producto.subtotal} - Importe: {producto.importe}
                            </p>
                        </div>))}
                    </Grid> */}
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