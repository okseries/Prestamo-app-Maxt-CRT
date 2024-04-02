import React, { useEffect, useState } from 'react';
import { List, Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Box, Button, Grid, ListItem, ListItemText, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import axios from 'axios';
import { GetDetallePagos } from 'BaseURL';
import Formatter from '../Formatter/Formatter';
import PrintReceipt from '../TemplatePrinting/PrintReceipt';

const PaymentDetailModal = ({ rowData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detallePago, setDetallePago] = useState(null);
  const [detallePagoCuota, setDetallePagoCuota] = useState([]);
  console.log('estoy aqui');
  console.log(detallePago);
  console.log(detallePagoCuota);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${GetDetallePagos}/${rowData.idHistorialPago}`);

        const { idDetallePago, estadoAnterior, historialPago, createdAt } = data[0];
        const { monto, cliente } = historialPago;

        const pago = {
          idDetallePago,
          estadoAnterior,
          idCuotas: data.map(({ idCuota }) => idCuota),
          montoPagado: monto,
          fechaPago: createdAt,
          cliente: {
            idCliente: cliente.idCliente,
            identificacion: cliente.identificacion,
            primerNombre: cliente.primerNombre,
            apellidoPaterno: cliente.apellidoPaterno,
          },
        };

        const cuotasPagadas = data.map(({ idCuota, cuota }) => ({
          idCuota,
          numeroCuota: cuota.numeroCuota,
          montoCuota: cuota.montoCuota,
        }));

        setDetallePago(pago);
        setDetallePagoCuota(cuotasPagadas);

        console.log(detallePago);
        console.log(detallePagoCuota);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Button onClick={openModal} startIcon={<Info color="info" />}>
        Ver Detalle
      </Button>
      <Modal all backdrop="static" className="modal-lx focus" isOpen={isModalOpen}>
        <SimpleCard
          title={`Detalles del Pago - Pago #${detallePago?.idDetallePago}`}
          onClose={closeModal}
        >
          <Typography variant="h6" gutterBottom></Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Cliente:"
                secondary={`${detallePago?.cliente?.primerNombre} ${detallePago?.cliente?.apellidoPaterno}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Identificación:"
                secondary={detallePago?.cliente?.identificacion}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Fecha del Pago:"
                secondary={<Formatter value={detallePago?.fechaPago} type={'date'} />}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Monto Pagado:"
                secondary={<Formatter value={detallePago?.montoPagado} type={'currency'} />}
              />
            </ListItem>
          </List>
          <Typography variant="subtitle1" gutterBottom>
            Cuotas Pagadas
          </Typography>
          <Grid container spacing={2}>
            {detallePagoCuota.map((cuota) => (
              <Grid item xs={12} sm={6} key={cuota.idCuota}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`Cuota ${cuota.numeroCuota}`}
                      secondary={<Formatter value={cuota.montoCuota} type={'currency'} />}
                    />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <PrintReceipt detallePago={detallePago} detallePagoCuota={detallePagoCuota} />
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default PaymentDetailModal;
