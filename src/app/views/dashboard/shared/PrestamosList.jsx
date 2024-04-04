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
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';
//import { BASE_URL } from 'api/ConexionAPI';
const BASE_URL = 'http://localhost:8080/api/v1/prestamos/vencidos/sucursal/1';

const PrestamosList = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const obtenerPrestamos = async () => {
      try {
        // Obtener el token de autorización del almacenamiento local
        const storedToken = localStorage.getItem('accessToken');

        // Configurar Axios para incluir el token en el encabezado Authorization
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const { data } = await axiosInstance.get(BASE_URL); // Asegúrate de tener definida la constante BASE_URL
        setPrestamos(data);
      } catch (error) {
        console.error('Error al obtener prestamos:', error);

        if (error.response && error.response.status === 403) {
          setIsModalOpen(true);
        }
      }
    };

    obtenerPrestamos();
  }, []);

  const Row = ({ prestamo }) => {
    const [open, setOpen] = useState(false);

    const handleExpandClick = () => {
      setOpen(!open);
    };

    return (
      <>
        <TableRow>
          <TableCell align="center">
            <IconButton aria-label="expand row" size="small" onClick={handleExpandClick}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="center">{prestamo.idPrestamo}</TableCell>
          <TableCell align="center">
            {prestamo.cliente.primerNombre} {prestamo.cliente.apellidoPaterno}
          </TableCell>
          <TableCell align="center">{prestamo.cliente.identificacion}</TableCell>
          <TableCell align="center">{prestamo.cuotas.length}</TableCell>
        </TableRow>
        {open && (
          <TableRow>
            <TableCell align="center" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  component="div"
                  style={{ margin: '10px 0' }}
                >
                  Cuotas
                </Typography>
                <Table size="small" aria-label="detalle-cuotas">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Número de Cuota</TableCell>
                      <TableCell align="center">Fecha de Cuota</TableCell>
                      <TableCell align="center">Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prestamo.cuotas.map((cuota) => (
                      <TableRow key={cuota.idCuota}>
                        <TableCell align="center">{cuota.numeroCuota}</TableCell>
                        <TableCell align="center">{cuota.fechaCuota}</TableCell>
                        <TableCell align="center">{cuota.estado}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        Préstamos
      </Typography>
      <Table size="small" aria-label="detalle-prestamos">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">ID Préstamo</TableCell>
            <TableCell align="center">Nombre del Cliente</TableCell>
            <TableCell align="center">Identificación</TableCell>
            <TableCell align="center">Cantidad de Cuotas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prestamos.map((prestamo) => (
            <Row key={prestamo.idPrestamo} prestamo={prestamo} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PrestamosList;
