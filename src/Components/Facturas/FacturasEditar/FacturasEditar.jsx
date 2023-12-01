
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { GetClientes, UpdateCliente, ClearID,  
    GetFacturaDetaill, UpdateFactura, GetProductos, GetDestinatarios, PostProducto, DeleteProducto, UpdateProducto, } from '../../../Redux/actions';
import ProductInput from '../../Productos/ProductoInput';

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

    const [modalProductos, setModalProductos] = useState(false);
    const [productData, setProductData] = useState({});
    const [modalConfirm, setModaConfirm] = useState(false);
    const [itemBorrar, setItemBorrar] = useState({});

    const [modalEdit, setModalEdit] = useState(false);
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

    const [agregaProductos, setAgregarProductos] = useState(false);
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
        dispatch(GetProductos());
        dispatch(GetDestinatarios());
        dispatch(ClearID());
        if(id){
            dispatch(GetFacturaDetaill(id));
        };
        if(productData.cantidad !== '' && productData.precioxu !== '' && productData.cantidad !== 0 && productData.precioxu !== 0){
            AutocalcularValores();
        };
    }, [dispatch, id, productData.cantidad, productData.precioxu]);


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
        let caiFactura = Number(facturaData.cai).toString();
        let cliente = clientes.find(c => c.id === facturaData.id_cliente);
        cliente.ult_factura = nroFactura;
        cliente.cai = caiFactura;
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
                    cond_vta: '',
                    cai: ''
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


/* SECCION DE BORRAR UN PRODUCTO */
  const openModalDelete = (item) => {
    setItemBorrar(item);
    setModaConfirm(true);
  };

  const closeModalDelete = () => {
    setItemBorrar();
    setModaConfirm(false);
  };

  const handleDelete = async (itemId) => {
    try{
      await dispatch(DeleteProducto(itemId));
      await  dispatch(GetProductos());
      closeModalDelete();
    } catch (error) {
      console.error("Error al eliminar el Producto:", error);
    }
  };

  const bodyModalDelete = (<Box className={Styles.modalContent}>
    <div className={Styles.contenidoModal}>
      <h3>Esta seguro que quiere eliminar el producto ? </h3>
      <div>
        <Button variant="contained" color="error" onClick={()=> handleDelete(itemBorrar.id)}>
          BORRAR
        </Button>
        <Button variant="contained" onClick={closeModalDelete}>
          CANCELAR
        </Button>
      </div>
    </div>
  </Box>)

/* SECCION DE AÑADIR PRODUCTOS */
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
    const PostearProductos = async() => {
        const Productos = products.map((product) => ({
            ...product,
            id_factura: facturaDetail.id, // Establece el id_factura de cada producto
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
        await dispatch(GetProductos());
    };
    
    // BODY DE AGREGAR NEVOS PRODUCTOS
    const bodyAgregarProductos = (<div>
        {/* PRODUCTOS */}
        <form onSubmit={()=>PostearProductos()}>
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
                <Button variant="contained" color="primary" style={{ fontSize: "10px" }} onClick={addProduct}>
                    Agregar otro producto
                </Button>
            </div>
            <div>
                {/* <Button variant="contained" color="error" style={{ fontSize: "10px", margin: "12px", marginLeft:"-2px" }} onClick={(()=>setAgregarProductos(false))}>
                    Canselar Añadir
                </Button> */}
                <Button variant="contained" color="primary" style={{ fontSize: "12px", margin: "12px" }} type='submit'>
                    Añadir Productos
                </Button>
            </div>
        </form>
    </div>);

/* SECCION DE EDITAR PRODUCTO */
    const closeModalProducto = () => {
        setProductData({});
        setModalProductos(false);
    };

    const openModalProducto = (item) => {
        setProductData({
            id: item.id,
            concepto: item.concepto, 
            cantidad: item.cantidad, 
            precioxu: item.precioxu, 
            iva: item.iva, 
            subtotal: item.subtotal, 
            importe: item.importe, 
            id_factura: facturaDetail.id 
        });
        setModalProductos(true);
    };

    const handleChangeProducto = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
        console.log("FORM: ", productData);
        return
    };

    const AutocalcularValores = () => {
        setProductData({
            ...productData,
            iva: (((productData.cantidad * productData.precioxu) * 21) / 100),
            subtotal: (productData.cantidad * productData.precioxu),
            importe: ((productData.cantidad * productData.precioxu) * 21)
        });
        console.log("FORM: ", productData);
        return
    };

    const handleUpdateProducto = async(e) => {
        e.preventDefault();
        const ProductoEditado = await dispatch(UpdateProducto(productData.id ,productData));
            if(ProductoEditado){
                setProductData({
                    fecha: '',
                    id_cliente: '',
                    nro_factura: '',
                    destinatario: '',
                    direccion: '',
                    cuit: '',
                    cond_vta: '',
                    cai: ''
                });
                //await dispatch(GetFacturaDetaill(facturaDetail.id));
                await dispatch(GetProductos());
                closeModalProducto();
            } else {
                console.error("ALGO SALIO MAL EN EL POST DE FACTURA");
            }
    };

    const bodyModalProducto = (<Box className={Styles.modalContent}>
        <h4 className={Styles.title}>Modificar datos de Producto</h4>
        <div className={Styles.formContariner}>
            <Button onClick={closeModalProducto} color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                Cancelar Editor
            </Button>
            <form onSubmit={(e)=>handleUpdateProducto(e)}>
            <Grid container spacing={1.5} style={{ marginTop: '1.5%', marginBottom: '1.5%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                {/* CONCEPTO */}
                <Grid item xs={12} sm={2}>
                    <TextField
                    type="text"
                    label="Concepto"
                    variant="outlined"
                    required
                    name="concepto"
                    value={productData.concepto}
                    inputProps={{ maxLength: 30 }}
                    onChange={handleChangeProducto}
                    />
                </Grid>

                {/* CANTIDAD */}
                <Grid item xs={12} sm={2}>
                    <TextField
                    type="number"
                    label="Cantidad"
                    variant="outlined"
                    required
                    name="cantidad"
                    value={productData.cantidad}
                    onChange={handleChangeProducto}
                    />
                </Grid>

                {/* PRECIOXU */}
                <Grid item xs={12} sm={2}>
                    <TextField
                    type="number"
                    label="Precio X Unidad"
                    variant="outlined"
                    required
                    name="precioxu"
                    value={productData.precioxu}
                    onChange={handleChangeProducto}
                    />
                </Grid>

                {/* IVA */}
                <Grid item xs={12} sm={1.5}>
                    <TextField
                    type="number"
                    label="IVA"
                    variant="outlined"
                    name="iva"
                    value={productData.iva}
                    disabled
                    placeholder={productData.iva}
                    onChange={handleChangeProducto}
                    />
                </Grid>

                {/* SUBTOTAL */}
                <Grid item xs={12} sm={2}>
                    <TextField
                    type="number"
                    label="Subtotal"
                    variant="outlined"
                    name="subtotal"
                    value={productData.subtotal}
                    disabled
                    placeholder={productData.subtotal}
                    onChange={handleChangeProducto}
                    />
                </Grid>

                {/* IMPORTE */}
                <Grid item xs={12} sm={2}>
                    <TextField
                    type="number"
                    label="Importe"
                    variant="outlined"
                    name="importe"
                    value={productData.importe}
                    disabled
                    placeholder={productData.importe}
                    onChange={handleChangeProducto}
                    />
                </Grid>
            </Grid>
            <div className={Styles.buttonContainer}>
                <Button variant="contained" color="primary" style={{ fontSize: "10px", margin:"10px" }} type='submit' fullWidth>
                    Guardar cambios
                </Button>
            </div>
            </form>
        </div>
    </Box>);
    
/* SECCION DE EDITAR FACTURA */
    // CERRAR MODAL
    const closeModal = () => {
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
            cond_vta: facturaDetail.cond_vta,
            cai: facturaDetail.cai
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
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* CAI */}
                    <Grid item xs={12} sm={2.5}>
                        <TextField
                            type="text"
                            label="CAI"
                            variant="outlined"
                            name="cai"
                            value={facturaData.cai}
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
                            <Typography variant="subtitle1">
                                CAI: {facturaDetail.cai}
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
                                <p>
                                    <Button variant="outlined" color="info" style={{ fontSize: "10px", margin: "12px" }} 
                                        onClick={() => openModalProducto(producto)}>
                                        ver
                                    </Button>
                                    <Button variant="outlined" color="error" style={{ fontSize: "10px", margin: "12px" }} 
                                        onClick={() => openModalDelete(producto)}>
                                        Eliminar
                                    </Button>
                                </p>
                            </p>
                        </div>))}
                        </Paper>
                    </Grid>
                </Grid>

                <div>
                    <Button variant="contained" color="secondary" style={{ fontSize: "10px", margin: "12px", marginLeft:"-2px" }} onClick={(()=>setAgregarProductos(!agregaProductos))}>
                        Añadir + Productos
                    </Button>
                    {agregaProductos ? <div>{bodyAgregarProductos}</div> : null}
                </div>
                

            </div> : <h4>Loading...</h4>}
        </div>
        </div>

        <Modal open={modalEdit} onClose={closeModal}>
            {bodyModal}
        </Modal>

        <Modal open={modalConfirm} onClose={closeModalDelete}>
          {bodyModalDelete}
        </Modal>

        <Modal open={modalProductos} onClose={closeModalProducto}>
          {bodyModalProducto}
        </Modal>
        
    </div>);
};

export default FacturasEditar;