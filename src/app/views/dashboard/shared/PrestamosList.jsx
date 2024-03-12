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

const PrestamosList = () => {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    const obtenerPrestamos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/prestamos`);
        setPrestamos(data);
      } catch (error) {
        console.error('Error al obtener prestamos:', error);
        // Puedes manejar el error según tus necesidades, por ejemplo, mostrando un mensaje al usuario.
      }
    };

    obtenerPrestamos();
  }, []);

  const Row = ({ prestamo }) => {
    const [open, setOpen] = useState(false);

    const handleExpandClick = () => {
      setOpen(!open);
    };

    const pagosVencidos = prestamo.pagos.filter((pago) => pago.estado === 'Vencido');

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
          <TableCell>{`${prestamo.cliente.primerNombre} ${prestamo.cliente.apellidoPaterno}`}</TableCell>
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
      <SimpleCard title={'Prestamos con Pagos Vencidos'}>
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
                {prestamos.map((prestamo) => (
                  <Row key={prestamo.idPrestamo} prestamo={prestamo} />
                ))}
              </TableBody>
            </StyledTable>
          </>
        </>
      </SimpleCard>
    </ContainerComp>
  );
};

export default PrestamosList;
