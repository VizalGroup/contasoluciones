
import axios from "axios";

export const GET_FACTURAS = "GET_FACTURAS";
export const GET_ID_FACTURA = "GET_ID_FACTURA";
export const POST_FACTURA = "POST_FACTURA";
export const UPDATE_FACTURA = "UPDATE_FACTURA";
export const DELETE_FACTURA = "DELETE_FACTURA";

export const GET_CLIENTES = "GET_CLIENTES";
export const GET_ID_CLIENTE = "GET_ID_CLIENTE";
export const POST_CLIENTE = "POST_CLIENTE";
export const UPDATE_CLIENTE = "UPDATE_CLIENTE";
export const DELETE_CLIENTE = "DELETE_CLIENTE";

export const CLEARID = "CLEARID";

//const localHostURL = "http://localhost:3001/products";
const clienteURL = "http://localhost/cc_clientescrud/"; 
const facturaURL = "http://localhost/cc_facturascrud/";

export const GetFacturas = () => {
    return async function (dispatch) {
        try {
            var response = await axios.get(facturaURL);
            return dispatch({
                type: GET_FACTURAS,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const GetFacturaDetaill = (id) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "DELETE");
            var response = await axios.post(clienteURL, f, {params: {id: id}})
            return dispatch({
                type: GET_ID_FACTURA,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const PostFactura = (atributos) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "POST");
            f.append("fecha", atributos.fecha)
            f.append("concepto", atributos.concepto)
            f.append("cantidad", atributos.cantidad)
            f.append("precioxu", atributos.precioxu)
            f.append("iva", atributos.iva)
            f.append("importe", atributos.importe)
            f.append("id_cliente", atributos.id_cliente)
            var response = await axios.post(facturaURL, f)
            return dispatch({
                type: POST_FACTURA,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const UpdateFactura = (id, atributos) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "PUT");
            f.append("fecha", atributos.fecha)
            f.append("concepto", atributos.concepto)
            f.append("cantidad", atributos.cantidad)
            f.append("precioxu", atributos.precioxu)
            f.append("iva", atributos.iva)
            f.append("importe", atributos.importe)
            f.append("id_cliente", atributos.id_cliente)
            var response = await axios.post(facturaURL, f, {params: {id: id}})
            return dispatch({
                type: UPDATE_FACTURA,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const DeleteFactura = (id) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "DELETE");
            var response = await axios.post(facturaURL, f, {params: {id: id}})
            return dispatch({
                type: DELETE_FACTURA,
                payload: response.id
            })
        }catch(err){
            console.log(err)
        }
    };
};



export const GetClientes = () => {
    return async function (dispatch) {
        try {
            var response = await axios.get(clienteURL);
            return dispatch({
                type: GET_CLIENTES,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

// export const GetClienteDetail = (id) => {
//     return async function (dispatch) {
//         try {
//             var f = new FormData();
//             f.append("METHOD", "GET");
//             var response = await axios.get(clienteURL, f, {params: {id: id}})
//             return dispatch({
//                 type: GET_ID_CLIENTE,
//                 payload: response.data
//             })
//         }catch(err){
//             console.log(err)
//         }
//     };
// };

export const PostCliente = (atributos) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "POST");
            f.append("nombre", atributos.nombre)
            f.append("cuit", atributos.cuit)
            f.append("cai", atributos.cai)
            f.append("inicio_actividades", atributos.inicio_actividades)
            f.append("direccion", atributos.direccion)
            f.append("numero_ingresos_brutos", atributos.numero_ingresos_brutos)
            f.append("numero_controladora_fiscal", atributos.numero_controladora_fiscal)
            var response = await axios.post(clienteURL, f)
            return dispatch({
                type: POST_CLIENTE,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const UpdateCliente = (id, atributos) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "PUT");
            f.append("nombre", atributos.nombre)
            f.append("cuit", atributos.cuit)
            f.append("cai", atributos.cai)
            f.append("inicio_actividades", atributos.inicio_actividades)
            f.append("direccion", atributos.direccion)
            f.append("numero_ingresos_brutos", atributos.numero_ingresos_brutos)
            f.append("numero_controladora_fiscal", atributos.numero_controladora_fiscal)
            var response = await axios.post(clienteURL, f, {params: {id: id}})
            return dispatch({
                type: UPDATE_CLIENTE,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const DeleteCliente = (id) => {
    return async function (dispatch) {
        try {
            var f = new FormData();
            f.append("METHOD", "DELETE");
            var response = await axios.post(clienteURL, f, {params: {id: id}})
            return dispatch({
                type: DELETE_CLIENTE,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const ClearID  =()=>{
    return {
        type: CLEARID
    };
};