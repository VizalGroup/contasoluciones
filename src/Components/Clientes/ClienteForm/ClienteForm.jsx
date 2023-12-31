import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PostCliente } from "../../../Redux/actions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Styles from "./ClienteForm.module.css";
import InputLabel from '@mui/material/InputLabel';
import RefreshIcon from '@mui/icons-material/Refresh';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function ClienteForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    cai: '',
    inicio_actividades: '',
    direccion: '',
    numero_ingresos_brutos: '',
    numero_controladora_fiscal: '',
    img_logo: '',
    qr_code: '',
    ult_factura: '',
    default_model: '',
    punto_vta: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {}, [dispatch, formData.inicio_actividades]);

  // SETEO DE INPUTS GENERICO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    return
  };

  // FUNCION PARA SUBIR IMAGENES A CLODINARI
  const SubirImagenesClodinari = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET); 
  
    const response = await fetch(
      process.env.REACT_APP_CLOUDINARY_URL,
      { method: "POST", body: data }
    );
  
    const file = await response.json();
    setFormData({ ...formData, [e.target.id]: file.secure_url });
  };
  

  // FUNCION POSTEO DE CLIENTE
  const handlePostClient = async() => {
      const NuevoCLiente = await dispatch(PostCliente(formData));
      if(NuevoCLiente){
        setFormData({
          nombre: '',
          cuit: '',
          cai: '',
          inicio_actividades: '',
          direccion: '',
          numero_ingresos_brutos: '',
          numero_controladora_fiscal: '',
          img_logo: '',
          qr_code: '',
          ult_factura: '',
          default_model: '',
          punto_vta: ''
        });
        setErrors({});
        alert("Cliente añadido exitosamente");
        //window.location.href = "/clients";
      };
  };

  // FUNCION DE VALIDACION DE FORMULARIO
  const handleValidateErrors = async(e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.cai) {
      newErrors.cai = 'El CAI es requerido';
    }
    if (!formData.cuit) {
      newErrors.cuit = 'El CUIT es requerido';
    }
    if (!formData.direccion) {
      newErrors.direccion = 'La Direcció es requerida';
    }
    if (!formData.inicio_actividades) {
      newErrors.inicio_actividades = 'La Fecha de inicio de actividades es requerida';
    }
    if (!formData.nombre) {
      newErrors.nombre = 'El Nombre o Razon Social es requerido';
    }
    if (!formData.numero_controladora_fiscal) {
      newErrors.numero_controladora_fiscal = 'El Numero de Controladora Fiscal es requerido';
    }
    if (!formData.numero_ingresos_brutos) {
      newErrors.numero_ingresos_brutos = 'El Numero de Ingresos Brutos es requerido';
    }
    if (!formData.ult_factura) {
      newErrors.ult_factura = 'El Numero de Facturación es requerido';
    }
    if (!formData.punto_vta) {
      newErrors.punto_vta = 'El punto de venta es requerido';
    }
    if (Object.keys(newErrors).length === 0) { // No hay errores, crear la factura
      await handlePostClient();
    } else {
      setErrors(newErrors);
      console.log("HAY ERRORES ", newErrors);
    };
  };

  // RECARGAR PAGINA ACTUAL
  const RecargarPagina = () => {
    setFormData({
      nombre: '',
      cuit: '',
      cai: '',
      inicio_actividades: '',
      direccion: '',
      numero_ingresos_brutos: '',
      numero_controladora_fiscal: '',
      img_logo: '',
      qr_code: '',
      ult_factura: '',
      default_model: '',
      punto_vta: ''
    });
  };

  return (<div className={Styles.responsiveContainer}>
      <h3 className={Styles.title}>Agregar Cliente</h3>
    <div className={Styles.formContariner}>
      <div>
        <Link to="/clients">
          <Button component={Link} variant="contained" to="/clients" color="primary"
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
        <Grid container spacing={2}>
          {/* NOMBRE O RAZON SOCIAL */}
          <Grid item xs={6}>
            <TextField
              label="Nombre o razón social"
              type="text"
              fullWidth
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              inputProps={{maxLength: 200}}
              error={!!errors.nombre}
              helperText={errors.nombre}
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

          {/* CAI */}
          <Grid item xs={6}>
            <TextField
              label="CAI"
              type="text"
              fullWidth
              name="cai"
              value={formData.cai}
              onChange={handleChange}
              //inputProps={{ pattern: '^[0-9-]*$', maxLength: 15 }}
              error={!!errors.cai}
              helperText={errors.cai}
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

          {/* NUMERO DE INGRESOS BRUTOS */}
          <Grid item xs={6}>
            <TextField
              label="Nro Ingresos Brutos"
              type="text"
              fullWidth
              name="numero_ingresos_brutos"
              value={formData.numero_ingresos_brutos}
              onChange={handleChange}
              inputProps={{ maxLength: 50}}
              error={!!errors.numero_ingresos_brutos}
              helperText={errors.numero_ingresos_brutos}
            />
          </Grid>

          {/* CONTROLADORA FISCAL */}
          <Grid item xs={6}>
            <TextField
              label="Nro Controladora Fiscal"
              type="text"
              fullWidth
              name="numero_controladora_fiscal"
              value={formData.numero_controladora_fiscal}
              onChange={handleChange}
              error={!!errors.numero_controladora_fiscal}
              helperText={errors.numero_controladora_fiscal}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Numero de Facturación"
              type="text"
              fullWidth
              name="ult_factura"
              value={formData.ult_factura}
              onChange={handleChange}
              inputProps={{ maxLength: 15}}
              error={!!errors.ult_factura}
              helperText={errors.ult_factura}
            />
          </Grid>

          {/* PUNTO DE VENTA */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Punto de Venta"
              type="text"
              name='punto_vta'
              value={formData.punto_vta}
              onChange={handleChange}
              error={!!errors.punto_vta}
              helperText={errors.punto_vta}
            />
          </Grid>

          {/* DEFAULT MODEL */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Modelo de Impresión</InputLabel>
                <Select
                  name="default_model"
                  value={formData.default_model}
                  label="Modelo de Impresión"
                  onChange={handleChange}
                >
                  <MenuItem value={'facturasimple'}>Factura Simple</MenuItem>
                  <MenuItem value={'facturalogo'}>Con Logo</MenuItem>
                  <MenuItem value={'facturaqr'}>Solo QR</MenuItem>
                  <MenuItem value={'facturalogoyqr'}>Logo y QR</MenuItem>
                  <MenuItem value={'facturamoderna'}>Moderno</MenuItem>
                  <MenuItem value={'facturalogobackground'}>Marca de Agua</MenuItem>
                </Select>
            </FormControl>
          </Grid>

          {/* INICIO DE ACTIVIDADES */}
          <Grid item xs={6}>
            <TextField
              type='date'
              name='inicio_actividades'
              value={formData.inicio_actividades}
              onChange={handleChange}
              error={!!errors.inicio_actividades}
              helperText={errors.inicio_actividades}
            />
          </Grid>

        </Grid>

        <Grid container spacing={2} style={{ marginTop: '2%' }}>
          {/* Columna izquierda para img_logo */}
          <Grid item xs={6}>
            <InputLabel>Logo</InputLabel>
            <TextField
              type='file'
              id='img_logo'
              name='file'
              onChange={(e)=> SubirImagenesClodinari(e)}
            />
            <div>
              {formData.img_logo ? (
                <div>
                  <img className={Styles.imageRender} src={formData.img_logo} alt="No se a podido logo del cliente" />
                </div>
              ) : null}
            </div>
          </Grid>

          {/* Columna derecha para qr_code */}
          <Grid item xs={6}>
            <InputLabel>Codigo QR</InputLabel>
            <TextField
              type='file'
              id='qr_code'
              name='file'
              onChange={(e)=> SubirImagenesClodinari(e)}
            />
            <div>
              {formData.qr_code ? (
                <div>
                  <img className={Styles.imageRender} src={formData.qr_code} alt="No se a podido cargar el QR del cliente" />
                </div>
              ) : null}
            </div>
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
          Agregar
        </Button>

      </form>
    </div>
  </div>);
}
