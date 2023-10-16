import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { PostCliente } from "../../../Redux/actions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import styles from "./ClienteForm.module.css";
import DatePicker  from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.module.css'


export default function ClienteForm() {
  const dispatch = useDispatch();

  // Estado local para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cuit: "",
    cai: "",
    inicio_actividades: "",
    direccion: "",
    numero_ingresos_brutos: "",
    numero_controladora_fiscal: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCUITKeyPress = (e) => {
    const pattern = /[0-9-]/;
    const inputChar = String.fromCharCode(e.charCode);
    if (!pattern.test(inputChar)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envía los datos del cliente al servidor utilizando la acción PostCliente
    dispatch(PostCliente(formData));

    // Puedes reiniciar el estado del formulario si lo deseas
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

  return (
    <div>
      <h2 className={styles.title}>Agregar Cliente</h2>
      <Link to="/clients">
        <Button
          component={Link}
          variant="contained"
          to="/clients"
          color="primary"
          style={{ marginTop: "3vh", marginLeft: "3vw", marginBottom: "3vh" }}
        >
          Volver
        </Button>
      </Link>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Nombre o razón social"
              fullWidth
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              inputProps={{
                maxLength: 200,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CUIT"
              fullWidth
              name="cuit"
              value={formData.cuit}
              onChange={handleInputChange}
              onKeyPress={handleCUITKeyPress}
              required
              inputProps={{
                maxLength: 20,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="CAI"
              fullWidth
              name="cai"
              value={formData.cai}
              onChange={handleInputChange}
              onKeyPress={handleCUITKeyPress}
              required
              inputProps={{
                maxLength: 15,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Inicio de Actividades"
              fullWidth
              name="inicio_actividades"
              value={formData.inicio_actividades}
              onChange={handleInputChange}
            />
          </Grid>
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
          <Grid item xs={6}>
            <TextField
              label="Nro Ingresos Brutos"
              fullWidth
              name="numero_ingresos_brutos"
              value={formData.numero_ingresos_brutos}
              onChange={handleInputChange}
              required
              inputProps={{
                maxLength: 50,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Nro Controladora Fiscal"
              fullWidth
              name="numero_controladora_fiscal"
              value={formData.numero_controladora_fiscal}
              onChange={handleInputChange}
              required
              inputProps={{
                maxLength: 50,
              }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 16 }}
        >
          Agregar
        </Button>
      </form>
    </div>
  );
}
