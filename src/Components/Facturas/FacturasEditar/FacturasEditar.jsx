
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

    const BuscarDetallesProductos = async() => {
        //await EncontrarProductos();
        for(let i = 0; i < productos.length; i++) {
            if(productos[i].id_factura === facturaDetail.id){
                await dispatch(GetProductoDetaill(productos[i].id));
            };
        };
    };

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