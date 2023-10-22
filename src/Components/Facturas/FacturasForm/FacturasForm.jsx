
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { PostFactura, GetClientes } from '../../../Redux/actions';

// material y estilos
import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Styles from './FacturasForm.module.css';
import ProductInput from '../../Productos/ProductoInput';

// DatePiker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';

const FacturasForm = () => {
    // const date = new Date();
    // const fecha = dayjs(date).format('DD-MM-YYYY');
    const dispatch = useDispatch();
    const clientes = useSelector((state) => state.clientes);
    const [facturaData, setFacturaData] = useState({
        fecha: '',
        id_cliente: '',
        nro_factura: ''
    });
    const [products, setProducts] = useState([
        { concepto: '', 
        cantidad: '', 
        precioxu: '', 
        iva: 21, 
        subtotal: '', 
        importe: '', 
        id_factura: facturaData.id },
    ]);
    const addProduct = () => {
        setProducts([...products, 
            { concepto: '', 
            cantidad: '', 
            precioxu: '', 
            iva: 21, 
            subtotal: '', 
            importe: '', 
            id_factura: facturaData.id }]);
    };
    const [errors, setErrors] = useState({});
    const isNumeric = (str) => /^\d+$/.test(str); // Exprecion regular que verifica que solo se escriban numeros

    useEffect(() => {
        dispatch(GetClientes());
        //CalculateImporte();
        handleNroChange();
    }, [dispatch, facturaData.fecha, facturaData.nro_factura]);


    // SETEO DE INPUTS GENERICO
    const handleChange = async(e) => {
        const { name, value } = e.target;
        setFacturaData({
            ...facturaData,
            [name]: value,
            nro_factura: handleNroChange()
        });
        console.log("FORM: ", facturaData);
        return
    };

    // SETEO DE LA FECHA DE FACTURA
    const handleFechaChange = (date) => {
        if (date) {
            const fecha = dayjs(date).format('DD-MM-YYYY'); // Asegúrate de que la fecha tenga el formato correcto
            setFacturaData({
                ...facturaData,
                fecha: fecha,
            });
        }
        console.log("FORM: ", facturaData);
        return
    };

    // SETEO DEL NRO DE FACTURA
    const handleNroChange = () => {
        if(facturaData.id_cliente !== ''){
            let cliente = clientes.find(c => c.id === facturaData.id_cliente);
            let nroCliente = Number(cliente.ult_factura) + 1;
            setFacturaData({
                ...facturaData,
                nro_factura: nroCliente
            });
        };
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

    const handleSubtotalChange = (value, index) =>{
        const updatedProducts = [...products];
        updatedProducts[index].subtotal = updatedProducts[index].cantidad * updatedProducts[index].precioxu;
        setProducts(updatedProducts);
    };

    const handleImporteChange = (value, index) =>{
        const updatedProducts = [...products];
        updatedProducts[index].importe= updatedProducts[index].subtotal + (updatedProducts[index].subtotal * 0.21);
        setProducts(updatedProducts);
    };

    // const FechaActual = async () => {
    //     let date = new Date();
    //     const fecha = dayjs(date).format('DD-MM-YYYY');
    //     setFacturaData({
    //         ...facturaData,
    //         fecha: fecha,
    //     });
    //     return
    // };

    // const CalculateImporte = async () => {
    //     var cantidadXprecio = 0;
    //     var calculoIVA = 0;
    //     if (facturaData.cantidad !== '' && facturaData.precioxu !== '' && facturaData.iva !== '') {
    //         cantidadXprecio = facturaData.cantidad * facturaData.precioxu;
    //         console.log("Cant X Precio: ", cantidadXprecio);
    //         if(facturaData.iva === 0){
    //             calculoIVA = 0
    //         } else {
    //             calculoIVA = (facturaData.iva * cantidadXprecio) / 100;
    //             console.log("Iva Calculado: ", calculoIVA);
    //         }
    //         let importeTotal = cantidadXprecio + calculoIVA
    //         console.log("El Importe total es:: ", importeTotal);
    //         await setFacturaData({
    //             ...facturaData,
    //             importe: importeTotal
    //         });
    //         if(facturaData.importe != ''){
    //             console.log("El importe calculado es: ", facturaData.importe);
    //         } else {
    //             console.log("ALGO PASO que le importe NO se calculo ", facturaData.importe);
    //         }
    //     } 
    //     return 
    // };


    const handlePostFactura = async(e) => {
        e.preventDefault();
        // Realizar validaciones
        const newErrors = {};
        if (!facturaData.fecha) {
            newErrors.fecha = 'Fecha es obligatoria';
        }
        if (!products.concepto) {
            newErrors.concepto = 'Concepto es obligatorio';
        }
        if (!products.cantidad || !isNumeric(facturaData.cantidad)) {
            newErrors.cantidad = 'Cantidad debe ser un número mayor a 0';
        }
        if (!products.precioxu || !isNumeric(facturaData.precioxu)) {
            newErrors.precioxu = 'Precio Unitario debe ser un número mayor a 0';
        }
        if (!facturaData.id_cliente) {
            newErrors.id_cliente = 'Cliente es obligatorio';
        }
        
        if (Object.keys(newErrors).length === 0) { // No hay errores, crear la factura
            const FacturaCreada = await dispatch(PostFactura(facturaData));
            if(FacturaCreada){
                console.log("SE HICE EL POST CORRECTAMENTE");
                setFacturaData({
                    fecha: '',
                    id_cliente: '',
                    nro_factura: ''
                });
                setErrors({});
                //window.location.href = "/home";
            } else {
                console.log("ALGO SALIO MAL EN EL POST DE FACTURA");
            }
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

                <Grid container spacing={2} style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                    {/* FECHA */}
                    <Grid item xs={12} sm={2.5} style={{marginTop:'-9px'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker 
                                    label="Fecha"
                                    variant="outlined"
                                    name="fecha"
                                    value={facturaData.fecha}
                                    onChange={(date) => handleFechaChange(date)}
                                    format="DD-MM-YYYY"
                                    error={!!errors.fecha}
                                    helperText={errors.fecha}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
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
                            disabled
                            onChange={handleNroChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={2.5}>
                        <Link to='/addclient'><Button variant="contained" color="primary" style={{ fontSize: "14px", marginLeft:'-40px' }}>
                            Agregar Nevo Cliente
                        </Button></Link>
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
                        //onIvaChange={(value) => handleChange(value, index)}
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