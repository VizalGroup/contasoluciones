import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FacturasTable from "../Facturas/FacturasTable/FacturasTable";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Styles from "./Home.module.css";
import Logout from "../Logout/Logout";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Home() {
  const dispatch = useDispatch();
  const nombreApp = useSelector((state) => state.nombreApp);

  useEffect(() => {}, [dispatch]);

  return (
    <div className={Styles.responsiveContainer}>
      <h1 className={Styles.title}>Bienvenido a {nombreApp}</h1>
      <br />
      <div className={Styles.buttonContainer}>
        <Link to="/clients">
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: "16px" }}
            startIcon={<GroupIcon />}
          >
            Clientes
          </Button>
        </Link>
        <Link to="/addressee">
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: "16px" }}
            startIcon={<PersonIcon />}
          >
            Destinatarios
          </Button>
        </Link>
        <Link to="/newFactura">
          <Button
            variant="contained"
            color="primary"
            style={{ fontSize: "16px" }}
            startIcon={<DescriptionIcon />}
          >
           + Nueva Factura
          </Button>
        </Link>

        <Logout />
      </div>
      <FacturasTable></FacturasTable>
    </div>
  );
}
