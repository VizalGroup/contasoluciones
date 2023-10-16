import React, { useState } from 'react'
import {PostCliente} from "../../../Redux/actions";
import { useSelector, useDispatch } from "react-redux";

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
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        
        // Envía los datos del cliente al servidor utilizando la acción PostCliente
        dispatch(PostCliente(formData));
        
        // Puedes reiniciar el estado del formulario si lo deseas
        setFormData({
          nombre: '',
          cuit: '',
          cai: '',
          inicio_actividades: '',
          direccion: '',
          numero_ingresos_brutos: '',
          numero_controladora_fiscal: '',
        });
      };



      return (
        <div>
          <h2>Agregar Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cuit">CUIT:</label>
              <input
                type="text"
                id="cuit"
                name="cuit"
                value={formData.cuit}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cai">CAI:</label>
              <input
                type="text"
                id="cai"
                name="cai"
                value={formData.cai}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="inicio_actividades">Inicio de Actividades:</label>
              <input
                type="text"
                id="inicio_actividades"
                name="inicio_actividades"
                value={formData.inicio_actividades}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="numero_ingresos_brutos">Nro Ingresos Brutos:</label>
              <input
                type="text"
                id="numero_ingresos_brutos"
                name="numero_ingresos_brutos"
                value={formData.numero_ingresos_brutos}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="numero_controladora_fiscal">Nro Controladora Fiscal:</label>
              <input
                type="text"
                id="numero_controladora_fiscal"
                name="numero_controladora_fiscal"
                value={formData.numero_controladora_fiscal}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Agregar</button>
          </form>
        </div>
      );
    }
