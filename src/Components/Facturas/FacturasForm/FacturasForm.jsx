
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { PostFactura, GetClientes, PostProducto, UpdateCliente, GetDestinatarios } from '../../../Redux/actions';

// material y estilos
import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Styles from './FacturasForm.module.css';
import ProductInput from '../../Productos/ProductoInput';
import RefreshIcon from '@mui/icons-material/Refresh';


const FacturasForm = () => {
    const dispatch = useDispatch();
    const clientes = useSelector((state) => state.clientes);
    const destinatarios = useSelector((state) => state.destinatarios);
    const [facturaData, setFacturaData] = useState({
        fecha: '',
        id_cliente: '',
        nro_factura: '',
        destinatario: '',
        direccion: '',
        cuit: '',
        cond_vta: '',
        cai: ''
    });
    const [products, setProducts] = useState([
        { concepto: '', 
        cantidad: '', 
        precioxu: '', 
        iva: '', 
        subtotal: '', 
        importe: '', 
        id_factura: '' },
    ]);
    const addProduct = () => {
        setProducts([...products, 
            { concepto: '', 
            cantidad: '', 
            precioxu: '', 
            iva: '', 
            subtotal: '', 
            importe: '', 
            id_factura: '' }
        ]);
    };
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(GetClientes());
        dispatch(GetDestinatarios());
        if(facturaData.id_cliente !== '' && facturaData.nro_factura === '' && facturaData.cai === ''){   
            handleNroChange();
        }; 
    }, [dispatch, facturaData.fecha, facturaData.id_cliente, facturaData.nro_factura, facturaData.cai]);


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

    // SETEAR PROPIEDADES DE DESTINATARIO
    const handleDestinatario = (e) => {
        let findDestinatario = destinatarios.find(d => d.id === e.target.value);
        setFacturaData({
            ...facturaData,
            destinatario: findDestinatario.destinatario,
            direccion: findDestinatario.direccion,
            cuit: findDestinatario.cuit
        });
        console.log("FORM: ", facturaData);
        return
    };

    // SETEO DEL NRO DE FACTURA
    const handleNroChange = () => {
        let cliente = clientes.find(c => c.id === facturaData.id_cliente);
        let nroCliente = Number(cliente.ult_factura) + 1;
        let nroClienteStr = nroCliente.toString().padStart(8, '0');
        let caiCliente = Number(cliente.cai) + 1;
        let caiClienteStr = caiCliente.toString();
        setFacturaData({
            ...facturaData,
            nro_factura: nroClienteStr,
            cai: caiClienteStr
        });
        return
    };

    // SETEO DEL ULTIMO NRO DE FACTURA PARA ACTIALIZARLO EN EL CLIENTE
    const SetearUltimoNroFctura = async() => {
        let nroFactura = Number(facturaData.nro_factura).toString();
        let caiFactura = Number(facturaData.cai).toString();
        let cliente = clientes.find(c => c.id === facturaData.id_cliente);
        cliente.ult_factura = nroFactura;
        cliente.cai = caiFactura;
        const ClienteActualizado = await dispatch(UpdateCliente(cliente.id, cliente));
        return ClienteActualizado;
    };

    // BORRAR UN INPUT DE PRODUCTO 
    const deleteProduct = (index) => {
        if (products.length > 1) {
          const updatedProducts = [...products];
          updatedProducts.splice(index, 1);
          setProducts(updatedProducts);
        }
    };

    // SETEO DE CONCEPTO DE PRODUCTO
    const handleConceptoChange = (value, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].concepto = value;
        setProducts(updatedProducts);
    };
    
    // SETEO DE PRECIO DE PRODUCTO
    const handlePrecioChange = (value, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].precioxu = value;
        setProducts(updatedProducts);
    };
    
    // SETEO DE CANTIDAD DE PRODUCTO
    const handleCantidadChange = (value, index) => {
        const updatedProducts = [...products];
        updatedProducts[index].cantidad = value;
        setProducts(updatedProducts);
    };

    // SETEO DE IVA DE PRODUCTO
    const handleIvaChange = (value, index) =>{
        const updatedProducts = [...products];
        updatedProducts[index].iva = ((updatedProducts[index].cantidad * updatedProducts[index].precioxu) * 21) / 100;
        setProducts(updatedProducts);
    };

    // SETEO DE SUBTOTAL DE PRODUCTO
    const handleSubtotalChange = (value, index) =>{
        const updatedProducts = [...products];
        updatedProducts[index].subtotal = updatedProducts[index].cantidad * updatedProducts[index].precioxu;
        setProducts(updatedProducts);
    };

    // SETEO DE IMPORTE DE PRODUCTO
    const handleImporteChange = (value, index) =>{
        const updatedProducts = [...products];
        updatedProducts[index].importe= updatedProducts[index].subtotal + (updatedProducts[index].subtotal * 0.21);
        setProducts(updatedProducts);
    };

    // FUNCION POSTEO DE PRODUCTOS
    const PostearProductos = async(factura_id) => {
        const Productos = products.map((product) => ({
            ...product,
            id_factura: factura_id, // Establece el id_factura de cada producto
        }));
        setProducts(Productos);
        for(let producto of Productos){
            await dispatch(PostProducto(producto))
        };
        setProducts([
            { concepto: '', 
            cantidad: '', 
            precioxu: '', 
            iva: '', 
            subtotal: '', 
            importe: '', 
            id_factura: '' }
        ]);
    };

    // FUNCION POSTEO DE FACTURA
    const handlePostFactura = async() => {
        const ActualizarNroFactura = await SetearUltimoNroFctura();
        if(ActualizarNroFactura){
            const FacturaCreada = await dispatch(PostFactura(facturaData));
            if(FacturaCreada){
                await PostearProductos(FacturaCreada.payload.id);
                setFacturaData({
                    fecha: '',
                    id_cliente: '',
                    nro_factura: '',
                    destinatario: '',
                    direccion: '',
                    cuit: '',
                    cond_vta: '',
                    cai: ''
                });
                setErrors({});
                alert("Factura creada exitosamente");
                //window.location.href = "/home";
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
            await handlePostFactura();
        } else {
            setErrors(newErrors);
            console.error("HAY ERRORES ", newErrors);
        };
    };

    // RECARGAR PAGINA ACTUAL
    const RecargarPagina = () => {
        setFacturaData({
            fecha: '',
            id_cliente: '',
            nro_factura: '',
            destinatario: '',
            direccion: '',
            cuit: '',
            cond_vta: '',
            cai: ''
        });
        setProducts([
            { concepto: '', 
            cantidad: '', 
            precioxu: '', 
            iva: '', 
            subtotal: '', 
            importe: '', 
            id_factura: '' }
        ]);
    };

    return (<div className={Styles.responsiveContainer}>
        <h3 className={Styles.title}>Redactar Nueva Factura</h3>
        <div className={Styles.formContariner}>
            <div className={Styles.buttonContainer} style={{ marginTop: 20 }}>
                <Link to='/home'><Button variant="contained" color="primary" 
                    style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "1vh" }}>
                        Volver
                </Button></Link>
                <Button onClick={RecargarPagina} color="primary"
                    style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "1vh" }}>
                    <RefreshIcon />
                        Recargar Página
                </Button>
            </div>
            
            <form onSubmit={(e)=>handleValidateErrors(e)}>

                <Grid container spacing={2} style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
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
                    <Grid item xs={12} sm={2}>
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
                    <Grid item xs={12} sm={2}>
                        <TextField
                            type="text"
                            label="Nro Factura"
                            variant="outlined"
                            name="nro_factura"
                            value={facturaData.nro_factura}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* CAI */}
                    <Grid item xs={12} sm={2}>
                        <TextField
                            type="text"
                            label="CAI"
                            variant="outlined"
                            name="cai"
                            value={facturaData.cai}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={2.5}>
                        <Link to='/addclient'><Button variant="contained" color="primary" style={{ fontSize: "13px" }}>
                            Agregar Nuevo Cliente
                        </Button></Link>
                    </Grid>
                </Grid>

                <Grid container spacing={2} style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                    
                    {/* ELEGIR DESTINATARIO */}
                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth>
                            <InputLabel>Lista de Destinatarios</InputLabel>
                            <Select
                                label="Lista de Destinatarios"
                                onChange={handleDestinatario}
                            >
                                {destinatarios.map(d =>(<MenuItem key={d.id} value={d.id}>
                                    {d.destinatario}
                                    </MenuItem>))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* DESTINATARIO */}
                    <Grid item xs={12} sm={2}>
                        <TextField
                            type="text"
                            label="Destinatario de factura"
                            variant="outlined"
                            name="destinatario"
                            value={facturaData.destinatario}
                            inputProps={{ maxLength: 200 }}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* DIRECCION */}
                    <Grid item xs={12} sm={2}>
                        <TextField
                            type="text"
                            label="Dirección"
                            variant="outlined"
                            name="direccion"
                            value={facturaData.direccion}
                            inputProps={{ maxLength: 200 }}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* CUIT */}
                    <Grid item xs={12} sm={2}>
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
                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth>
                            <InputLabel>Condicion de Venta</InputLabel>
                            <Select
                                name="cond_vta"
                                value={facturaData.cond_vta}
                                label="Condición de Venta"
                                onChange={handleChange}
                            >
                                <MenuItem value={'Efectivo'}>Efectivo</MenuItem>
                                <MenuItem value={'Cuenta Corriente'}>Cuenta Corriente</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                
                {/* PRODUCTOS */}
                <div>
                    {products.map((product, index) => (
                        <ProductInput
                        key={index}
                        product={product}
                        onConceptoChange={(value) => handleConceptoChange(value, index)}
                        onCantidadChange={(value) => handleCantidadChange(value, index)}
                        onPrecioChange={(value) => handlePrecioChange(value, index)}
                        onIvaChange={(value) => handleIvaChange(value, index)}
                        onSubtotalChange={(value) => handleSubtotalChange(value, index)}
                        onImporteChange={(value) => handleImporteChange(value, index)}
                        onDelete={() => deleteProduct(index)}
                        />
                    ))}
                    <Button variant="contained" color="primary" style={{ fontSize: "13px" }} onClick={addProduct}>
                        Agregar otro producto
                    </Button>
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