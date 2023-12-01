
const initialState = {
  nombreApp: "ContaConsulting",
  facturas: [],
  clientes: [],
  productos: [],
  facturaDetail: {},
  clienteDetail: {},
  productosDetail: {},
  destinatarios: [],
  destinatarioDetail: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {

    case "GET_FACTURAS": return {
      ...state,
      facturas: action.payload
    }
    case "GET_ID_FACTURA": return {
      ...state,
      facturaDetail: action.payload
    }
    case "POST_FACTURA": return {
      ...state
    }
    case "UPDATE_FACTURA": return {
      ...state,
      facturas: state.facturas.map((f) => {
        return f.id === action.payload.id ? action.payload : f;
      }),
    }
    case "DELETE_FACTURA": return {
      ...state,
      facturas: state.facturas.filter(f => f.id !== action.payload)
    }


    case "GET_CLIENTES": return {
      ...state,
      clientes: action.payload
    }
    case "GET_ID_CLIENTE": return {
      ...state,
      clienteDetail: action.payload
    }
    case "POST_CLIENTE": return {
      ...state
    }
    case "UPDATE_CLIENTE": return {
      ...state,
      clientes: state.clientes.map((c) => {
        return c.id === action.payload.id ? action.payload : c;
      }),
    }
    case "DELETE_CLIENTE": return {
      ...state,
      clientes: state.clientes.filter(c => c.id !== action.payload)
    }


    case "GET_PRODUCTOS": return {
      ...state,
      productos: action.payload
    }
    case "GET_ID_PRODUCTO": return {
      ...state,
      productosDetail: [...action.payload]
    }
    case "POST_PRODUCTO": return {
      ...state
    }
    case "UPDATE_PRODUCTO": return {
      ...state,
      productos: state.productos.map((p) => {
        return p.id === action.payload.id ? action.payload : p;
      }),
    }
    case "DELETE_PRODUCTO": return {
      ...state,
      productos: state.productos.filter(p => p.id !== action.payload)
    }


    case "CLEARID": return {
      ...state,
      facturaDetail: {},
      clienteDetail: {},
      productosDetail: [],
      destinatarioDetail: {}
    }


    case "GET_DESTINATARIOS": return {
      ...state,
      destinatarios: action.payload
    }
    case "GET_ID_DESTINATARIOS": return {
      ...state,
      destinatarioDetail: action.payload
    }
    case "POST_DESTINATARIOS": return {
      ...state
    }
    case "UPDATE_DESTINATARIOS": return {
      ...state,
      destinatarios: state.destinatarios.map((d) => {
        return d.id === action.payload.id ? action.payload : d;
      }),
    }
    case "DELETE_DESTINATARIOS": return {
      ...state,
      destinatarios: state.destinatarios.filter(d => d.id !== action.payload)
    }

    default: return {...state};
  }
};

export default rootReducer;