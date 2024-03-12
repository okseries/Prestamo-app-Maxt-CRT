import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import { SimpleCard } from 'app/components';
import { StyledTable } from 'app/components/StyledTable';
import { ContainerComp } from 'app/components/ContainerComp';
//import { BASE_URL } from 'api/ConexionAPI';
const BASE_URL = 'http://localhost:8080/api/v1';

const FinanciamientosList = () => {
  const [financiamientos, setFinanciamientos] = useState([]);

  useEffect(() => {
    const obtenerFinanciamientos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/financiamientos`);
        setFinanciamientos(data);
      } catch (error) {
        console.error('Error al obtener financiamientos:', error);
        // Puedes manejar el error según tus necesidades, por ejemplo, mostrando un mensaje al usuario.
      }
    };

    obtenerFinanciamientos();
  }, []);

  const Row = ({ financiamiento }) => {
    const [open, setOpen] = useState(false);

    const handleExpandClick = () => {
      setOpen(!open);
    };

    const pagosVencidos = financiamiento.pagos.filter((pago) => pago.estado === 'Vencido');

    if (pagosVencidos.length === 0) {
      return null; // O puedes mostrar una fila sin datos si no hay pagos vencidos
    }

    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={handleExpandClick}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{`${financiamiento.cliente.primerNombre} ${financiamiento.cliente.apellidoPaterno}`}</TableCell>
          <TableCell style={{ color: 'red' }}>{pagosVencidos.length}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ margin: '10px 0', color: 'red' }}
              >
                Detalles de Pagos Vencidos
              </Typography>
              <Table size="small" aria-label="pagos-vencidos">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Pago</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha en la que debió pagar</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagosVencidos.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell>{pago.id}</TableCell>
                      <TableCell>{pago.montoPago}</TableCell>
                      <TableCell>{pago.fechaPago}</TableCell>
                      <TableCell style={{ color: 'red' }}>{pago.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <ContainerComp>
      <SimpleCard title={'Financiamientos con Pagos Vencidos'}>
        <>
          <>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Cliente</TableCell>
                  <TableCell>Cantidad de Pagos Vencidos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="text-danger">
                {financiamientos.map((financiamiento) => (
                  <Row key={financiamiento.idFinanciamiento} financiamiento={financiamiento} />
                ))}
              </TableBody>
            </StyledTable>
          </>
        </>
      </SimpleCard>
    </ContainerComp>
  );
};

export default FinanciamientosList;
