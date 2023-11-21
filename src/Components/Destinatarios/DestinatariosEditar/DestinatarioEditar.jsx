
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router";
import { GetDestinatarioDetaill, UpdateDestinatario, ClearID } from '../../../Redux/actions';

// material y estilos
import { Button, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Styles from './DestinatarioEditar.module.css';
import { Paper, Typography, Modal } from '@mui/material';
import Box from '@mui/material/Box';

const DestinatarioEditar = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const destinatarioDetail = useSelector(state => state.destinatarioDetail)
    const [formData, setFormData] = useState({
        destinatario: '',
        direccion: '',
        cuit: '',
    });
    const [errors, setErrors] = useState({});
    const [modalEdit, setModalEdit] = useState(false);

    useEffect(()=>{
        dispatch(ClearID())
        dispatch(GetDestinatarioDetaill(id));
        console.log("Destinatario: ", destinatarioDetail);
    }, [dispatch, id]);

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

    // FUNCION UPDATE DE DESTINATARIO
    const handleUpdateDestinatario = async() => {
        const UpdatedDestinatarioEdit = await dispatch(UpdateDestinatario(destinatarioDetail.id, formData));
        if(UpdatedDestinatarioEdit){
            setFormData({
                destinatario: '',
                direccion: '',
                cuit: '',
            });
            setErrors({});
            await dispatch(GetDestinatarioDetaill(destinatarioDetail.id));
            closeModal();
        };
        return
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
            await handleUpdateDestinatario();
        } else {
            setErrors(newErrors);
            console.error("HAY ERRORES ", newErrors);
        };
    };

    // CERRAR MODAL
    const closeModal = () => {
        setFormData({
            destinatario: '',
            direccion: '',
            cuit: '',
        });
        setModalEdit(false);
    };

    // ABRIR MODAL
    const openModal = () => {
        setFormData({
            destinatario: destinatarioDetail.destinatario,
            direccion: destinatarioDetail.direccion,
            cuit: destinatarioDetail.cuit,
        });
        setModalEdit(true);
    };

    // CUERPO DEL MODAL
    const bodyModal = (<Box className={Styles.modalContent}>
        <h4 className={Styles.title}>Modificar Destinatario</h4>
        <div className={Styles.formContariner}>
            <Button onClick={closeModal} color="primary"
                style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                Cancelar Editor
            </Button>
            <form onSubmit={handleValidateErrors}>
                <Grid container spacing={1}>
                    {/* DESTINATARIO */}
                    <Grid item xs={6}>
                        <TextField
                        label="Nombre del destinatario"
                        type="text"
                        fullWidth
                        name="destinatario"
                        value={formData.destinatario && formData.destinatario}
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
                        value={formData.cuit && formData.cuit}
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
                        value={formData.direccion && formData.direccion}
                        onChange={handleChange}
                        inputProps={{ maxLength: 100 }}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                        />
                    </Grid>
                </Grid>

                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
                    Guardar Cambios
                </Button>
            </form>
        </div>
    </Box>);

    return(<div className={Styles.responsiveContainer}>
        <h3 className={Styles.title}>Detalle del Destinatario</h3>
        <div className={Styles.formContariner}>
            <div>
                <Link to="/addressee">
                <Button component={Link} variant="contained" to="/addressee" color="primary"
                    style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                    Volver
                </Button>
                </Link>
                <Button onClick={openModal} color="primary"
                    style={{ marginTop: "2px", marginLeft: "3vw", marginBottom: "5vh" }}>
                    Editar Datos
                </Button>
            </div>
        </div>

        <div>
            {destinatarioDetail ? <div>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Paper elevation={3}>
                            <Typography variant="h6">
                                Nombre: {destinatarioDetail.destinatario}
                            </Typography>
                            <Typography variant="subtitle1">
                                CUIT: {destinatarioDetail.cuit}
                            </Typography>
                            <Typography variant="subtitle1">
                                Dirección: {destinatarioDetail.direccion}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div> : <h4>Loading...</h4>}
        </div>

        <Modal open={modalEdit} onClose={closeModal}>
            {bodyModal}
        </Modal>

    </div>);

};

export default DestinatarioEditar;