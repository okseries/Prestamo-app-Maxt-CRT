import React, { useState } from 'react';
import { Modal, Table } from 'reactstrap';
import { SimpleCard } from '..';
import {
  Box,
  Button,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Info, Print } from '@mui/icons-material';

const PaymentDetailModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Datos estáticos del detalle de pago
  const pago = {
    idDetallePago: 97,
    estadoAnterior: 'Pendiente',
    idCuotas: [103, 102], // IDs de las cuotas pagadas en este pago
    montoPagado: '2300.00', // Monto total pagado en este pago
    fechaPago: '2024-04-01T14:59:14.000Z', // Fecha del pago
    cliente: {
      idCliente: 1,
      identificacion: '402-0005249-9',
      primerNombre: 'Milaurys',
      apellidoPaterno: 'Contreras',
    },
  };

  // Datos de las cuotas pagadas en este pago
  const cuotasPagadas = [
    {
      idCuota: 103,
      numeroCuota: 3,
      montoCuota: '1150.00',
    },
    {
      idCuota: 102,
      numeroCuota: 2,
      montoCuota: '1150.00',
    },
  ];

  return (
    <>
      <IconButton onClick={openModal}>
        <Info color="info" />
      </IconButton>
      <Modal all backdrop="static" className="modal-lx focus" isOpen={isModalOpen}>
        <SimpleCard title={`Detalle de Pago - Pago ${pago.idDetallePago}`}>
          <Typography variant="subtitle1">
            Cliente: {pago.cliente.primerNombre} {pago.cliente.apellidoPaterno}
          </Typography>
          <Typography variant="subtitle1">Identificación: {pago.cliente.identificacion}</Typography>
          <Typography variant="subtitle1">Fecha del Pago: {pago.fechaPago}</Typography>
          <Typography variant="subtitle1">Monto Pagado: {pago.montoPagado}</Typography>
          <TableContainer component={Paper} style={{ marginTop: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de Cuota</TableCell>
                  <TableCell>Monto de la Cuota</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cuotasPagadas.map((cuota) => (
                  <TableRow key={cuota.idCuota}>
                    <TableCell>{cuota.numeroCuota}</TableCell>
                    <TableCell>{cuota.montoCuota}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button color="primary" startIcon={<Print />}>
              Imprimir
            </Button>
            <Button color="secondary" onClick={closeModal} style={{ marginLeft: '16px' }}>
              Cerrar
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default PaymentDetailModal;
