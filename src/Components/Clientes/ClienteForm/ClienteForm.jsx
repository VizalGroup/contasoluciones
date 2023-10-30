import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PostCliente } from "../../../Redux/actions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Styles from "./ClienteForm.module.css";

// DatePiker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';


export default function ClienteForm() {
  const dispatch = useDispatch();

  // Estado local para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    cai: "",
    inicio_actividades: '',
    direccion: "",
    numero_ingresos_brutos: "",
    numero_controladora_fiscal: "",
  });

  useEffect(() => {}, [dispatch, formData.inicio_actividades]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("FORM: ", formData);
    return
  };

  const handleCUITKeyPress = (e) => {
    const pattern = /[0-9-]/;
    const inputChar = String.fromCharCode(e.charCode);
    if (!pattern.test(inputChar)) {
      e.preventDefault();
    }
    return
  };

  const handleFechaChange = (date) => {
    if (date) {
        const fecha = dayjs(date).format('DD-MM-YYYY'); // Asegúrate de que la fecha tenga el formato correcto
        setFormData({
          ...formData,
          inicio_actividades: fecha,
        });
    }
    console.log("FORM: ", formData);
    return
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(PostCliente(formData));
    console.log("SE HICE EL POST CORRECTAMENTE");
    setFormData({
      nombre: "",
      cuit: "",
      cai: "",
      inicio_actividades: "",
      direccion: "",
      numero_ingresos_brutos: "",
      numero_controladora_fiscal: "",
    });
  };

  return (<div className={Styles.responsiveContainer}>
      <h3 className={Styles.title}>Agregar Cliente</h3>
    <div className={Styles.formContariner}>
      <Link to="/clients">
        <Button component={Link} variant="contained" to="/clients" color="primary"
          style={{ marginTop: "3vh", marginLeft: "3vw", marginBottom: "3vh" }}>
          Volver
        </Button>
      </Link>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          {/* NOMBRE O RAZON SOCIAL */}
          <Grid item xs={6}>
            <TextField
              label="Nombre o razón social"
              fullWidth
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              inputProps={{maxLength: 200}}
            />
          </Grid>

          {/* CUIT */}
          <Grid item xs={6}>
            <TextField
              label="CUIT"
              fullWidth
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              onKeyPress={handleCUITKeyPress}
              required
              inputProps={{maxLength: 20}}
            />
          </Grid>

          {/* CAI */}
          <Grid item xs={6}>
            <TextField
              label="CAI"
              fullWidth
              name="cai"
              value={formData.cai}
              onChange={handleInputChange}
              onKeyPress={handleCUITKeyPress}
              required
              inputProps={{maxLength: 15}}
            />
          </Grid>
          
          {/* DIRECCION */}
          <Grid item xs={6}>
            <TextField
              label="Dirección"
              fullWidth
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              inputProps={{
                maxLength: 100,
              }}
            />
          </Grid>

          {/* NUMERO DE INGRESOS BRUTOS */}
          <Grid item xs={6}>
            <TextField
              label="Nro Ingresos Brutos"
              fullWidth
              name="numero_ingresos_brutos"
              value={formData.numero_ingresos_brutos}
              onChange={handleInputChange}
              required
              inputProps={{maxLength: 50}}
            />
          </Grid>

          {/* INICIO DE ACTIVIDADES */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker 
                      fullWidth
                      label="Inicio de Actividades" 
                      name='inicio_actividades'
                      value={formData.inicio_actividades}
                      onChange={(date) => handleFechaChange(date)}
                      required
                      format="DD-MM-YYYY"
                    />
                </DemoContainer>
              </LocalizationProvider>
          </Grid>

          {/* CONTROLADORA FISCAL */}
          <Grid item xs={6}>
            <TextField
              label="Nro Controladora Fiscal"
              fullWidth
              name="numero_controladora_fiscal"
              value={formData.numero_controladora_fiscal}
              onChange={handleInputChange}
              required
              inputProps={{maxLength: 50}}
            />
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
          Agregar
        </Button>

      </form>
    </div>
  </div>);
}
