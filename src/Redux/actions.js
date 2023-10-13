
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
const deployURL = ""; 

export const GetFacturas = () => {
    return async function (dispatch) {
        try {
            var response = await axios.get(``);
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
            var response = await axios.get(`${deployURL}/products?id=${id}`);
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
            var response = await axios.post(`${deployURL}`, atributos);
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
            var response = await axios.put(`${deployURL}/products?id=${id}`, atributos);
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
            await axios.delete(`${deployURL}/products?id=${id}`);
            return dispatch({
                type: DELETE_FACTURA,
                payload: id
            })
        }catch(err){
            console.log(err)
        }
    };
};



export const GetClientes = () => {
    return async function (dispatch) {
        try {
            var response = await axios.get(`${deployURL}/`);
            return dispatch({
                type: GET_CLIENTES,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const GetClienteDetail = (id) => {
    return async function (dispatch) {
        try {
            var response = await axios.get(`${deployURL}/products?id=${id}`);
            return dispatch({
                type: GET_ID_CLIENTE,
                payload: response.data
            })
        }catch(err){
            console.log(err)
        }
    };
};

export const PostCliente = (atributos) => {
    return async function (dispatch) {
        try {
            var response = await axios.post(`${deployURL}/pro`, atributos);
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
            var response = await axios.put(`${deployURL}/products?id=${id}`, atributos);
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
            var response = await axios.delete(`${deployURL}/products?id=${id}`);
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