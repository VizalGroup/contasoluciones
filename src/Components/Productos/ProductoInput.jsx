
import React, { useEffect } from 'react';

import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';


const ProductInput = (props) => {

    useEffect(() => {
        // Realizar cálculos cuando cambian cantidad o precioxu
        const newCantidad = parseFloat(props.product.cantidad);
        const newPrecioxu = parseFloat(props.product.precioxu);
    
        if (!isNaN(newCantidad) && !isNaN(newPrecioxu)) {
          // Realizar cálculos
          const newSubtotal = newCantidad * newPrecioxu;
          const newIva = newSubtotal * 0.21;
          const newImporte = newSubtotal + (newSubtotal * 0.21);
    
          // Actualizar el producto
          props.onIvaChange(newIva);
          props.onSubtotalChange(newSubtotal);
          props.onImporteChange(newImporte);
        }
    }, [props.product.cantidad, props.product.precioxu]);

    return (<div>
        <Grid container spacing={1.5} style={{ marginTop: '1.5%', marginBottom: '1.5%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>

            {/* CONCEPTO */}
            <Grid item xs={12} sm={2}>
                <TextField
                type="text"
                label="Concepto"
                //variant="outlined"
                required
                name="concepto"
                value={props.product.concepto}
                inputProps={{ maxLength: 30 }}
                onChange={(e) => props.onConceptoChange(e.target.value)}
                />
            </Grid>

            {/* CANTIDAD */}
            <Grid item xs={12} sm={2}>
                <TextField
                type="number"
                label="Cantidad"
                //variant="outlined"
                required
                name="cantidad"
                value={props.product.cantidad}
                onChange={(e) => props.onCantidadChange(e.target.value)}
                />
            </Grid>

            {/* PRECIOXU */}
            <Grid item xs={12} sm={2}>
                <TextField
                type="number"
                label="Precio X Unidad"
                //variant="outlined"
                required
                name="precioxu"
                value={props.product.precioxu}
                onChange={(e) => props.onPrecioChange(e.target.value)}
                />
            </Grid>

            {/* IVA */}
            <Grid item xs={12} sm={1.5}>
                <TextField
                type="number"
                label="IVA"
                //variant="outlined"
                name="iva"
                value={props.product.iva}
                disabled
                placeholder={props.product.iva}
                onChange={(e) => props.onIvaChange(e.target.value)}
                />
            </Grid>

            {/* SUBTOTAL */}
            <Grid item xs={12} sm={1.5}>
                <TextField
                type="number"
                label="Subtotal"
                //variant="outlined"
                name="subtotal"
                value={props.product.subtotal}
                disabled
                placeholder={props.product.subtotal}
                onChange={(e) => props.onSubtotalChange(e.target.value)}
                />
            </Grid>

            {/* IMPORTE */}
            <Grid item xs={12} sm={1.5}>
                <TextField
                type="number"
                label="Importe"
                //variant="outlined"
                name="importe"
                value={props.product.importe}
                disabled
                placeholder={props.product.importe}
                onChange={(e) => props.onImporteChange(e.target.value)}
                />
            </Grid>

            {/* BOTON DE ELIMINAR INPUT */}
            <Grid item xs={12} sm={1}>
                <Button style={{ fontSize: "14px", color:'red' }} onClick={props.onDelete}>
                    Eliminar
                </Button>
            </Grid>
        </Grid>
    </div>);
  }
  
  export default ProductInput;