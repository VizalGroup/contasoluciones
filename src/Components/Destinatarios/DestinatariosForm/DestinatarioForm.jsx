
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { PostDestinatario } from '../../../Redux/actions';

// material y estilos
import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Styles from './DestinatarioForm.module.css';
import RefreshIcon from '@mui/icons-material/Refresh';

const DestinatarioForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        destinatario: '',
        direccion: '',
        cuit: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(()=>{}, [dispatch]);

    // SETEO DE INPUTS GENERICO
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
        console.log(formData);
        return
    };

    // FUNCION POSTEO DE CLIENTE
    const handlePostItem = async() => {
        const NuevoItem = await dispatch(PostDestinatario(formData));
        if(NuevoItem ){
            setFormData({
                destinatario: '',
                direccion: '',
                cuit: '',
            });
            setErrors({});
            alert("Destinatario añadido exitosamente");
            //window.location.href = "/clients";
        };
    };

    // FUNCION DE VALIDACION DE FORMULARIO
    const handleValidateErrors = async(e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.destinatario) {
            newErrors.cai = 'El nombre del destinatario es requerido';
        }
        if (!formData.cuit) {
            newErrors.cuit = 'El CUIT es requerido';
        }
        if (!formData.direccion) {
            newErrors.direccion = 'La dirección es requerida';
        }
        if (Object.keys(newErrors).length === 0) { // No hay errores, crear la factura
            await handlePostItem();
        } else {
            setErrors(newErrors);
            console.error("HAY ERRORES ", newErrors);
        };
    };

      // RECARGAR PAGINA ACTUAL
    const RecargarPagina = () => {
        setFormData({
            destinatario: '',
            direccion: '',
            cuit: '',
        });
    };

    return(<div className={Styles.responsiveContainer}>
      <h3 className={Styles.title}>Nuevo Destinatario</h3>
      <div className={Styles.formContariner}>
        <div>
            <Link to="/addressee">
            <Button component={Link} variant="contained" to="/addressee" color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                Volver
            </Button>
            </Link>
            <Button onClick={RecargarPagina} color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
            <RefreshIcon />
                Recargar Página
            </Button>
        </div>

        <form onSubmit={handleValidateErrors}>
            <Grid container spacing={1}>
                {/* DESTINATARIO */}
                <Grid item xs={6}>
                    <TextField
                        label="Nombre del destinatario"
                        type="text"
                        fullWidth
                        name="destinatario"
                        value={formData.destinatario}
                        onChange={handleChange}
                        error={!!errors.destinatario}
                        helperText={errors.destinatario}
                    />
                </Grid>

                {/* CUIT */}
                <Grid item xs={6}>
                    <TextField
                        label="CUIT"
                        type="text"
                        fullWidth
                        name="cuit"
                        value={formData.cuit}
                        onChange={handleChange}
                        inputProps={{ pattern: '^[0-9-]*$', maxLength: 15 }}
                        error={!!errors.cuit}
                        helperText={errors.cuit}
                    />
                </Grid>
                    
                {/* DIRECCION */}
                <Grid item xs={6}>
                    <TextField
                        label="Dirección"
                        type="text"
                        fullWidth
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        inputProps={{ maxLength: 100 }}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                    />
                </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
                Agregar
            </Button>
        </form>
      </div>
    </div>);
};

export default DestinatarioForm;