import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetDestinatarios } from "../../Redux/actions";

// Estilos
import Styles from "./DestinatariosTable.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Button from "react-bootstrap/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DestinatariosTable() {
  const destinatarios = useSelector((state) => state.destinatarios);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(GetDestinatarios());
  }, [dispatch]);

  const filteredDestinatarios = destinatarios.filter((item) =>
    item.destinatario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className={Styles.title}>Destinatarios</h2>
      <p className={Styles.description}>
        Esta tabla contiene todos los destinatarios disponibles para la
        confección de las distintas Facturas
      </p>
      <div className={Styles.buttonsContainer}>
        <a href="/home">
          <Button variant="primary">Volver</Button>
        </a>
        <a href="/addrecipient">
          <Button variant="primary">
            {" "}
            <i className="bi bi-person">+</i> Agregar{" "}
          </Button>
        </a>
      </div>
      <div style={{ textAlign: "center" }}>
        <TextField
          label="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        {/* <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        <TableContainer component={Paper} className={Styles.customTable}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Destinatario</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Cuit</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDestinatarios.map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ textAlign: "center" }}>
                    {item.destinatario}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {item.direccion}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {item.cuit}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <Button color="primary" style={{ marginRight: "5px" }}>
                      Ver
                    </Button>

                    <Button variant="danger">Borrar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
