import React, { useEffect, useState } from 'react';
import { List, Modal } from 'reactstrap';
import { SimpleCard } from '..';
import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import axios from 'axios';
import { GetDetallePagos } from 'BaseURL';
import Formatter from '../Formatter/Formatter';
import PrintReceipt from '../TemplatePrinting/PrintReceipt';
import SessionFinishModal from './SessionFinishModal';

const PaymentDetailModal = ({ rowData }) => {
  const [detallePago, setDetallePago] = useState(null);
  const [detallePagoCuota, setDetallePagoCuota] = useState([]);
  const [isModalOpenPaymentDetailModal, setIsModalOpenPaymentDetailModal] = useState(false);
  const [isModalOpenModalSesion, setIsModalOpenModalSesion] = useState(false);

  const closeModalSesion = () => {
    setIsModalOpenModalSesion(false);
  };

  const openModalPaymentDetailModal = () => {
    setIsModalOpenPaymentDetailModal(true);
  };

  const closeModalPaymentDetailModal = () => {
    setIsModalOpenPaymentDetailModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token de autorización del almacenamiento local
        const storedToken = localStorage.getItem('accessToken');

        // Configurar Axios para incluir el token en el encabezado Authorization
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const { data } = await axiosInstance.get(`${GetDetallePagos}/${rowData.idHistorialPago}`);

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

        const cuotasPagadas = data.map(({ idCuota, montoPagado, cuota }) => ({
          idCuota,
          numeroCuota: cuota.numeroCuota,
          montoCuota: cuota.montoCuota,
          montoPagado,
          estado: cuota.estado,
        }));

        setDetallePago(pago);
        setDetallePagoCuota(cuotasPagadas);
        console.log('*******************************');
        console.log(pago);
        console.log(cuotasPagadas);
      } catch (error) {
        console.error('Error al obtener los datos:', error);

        if (error.response && error.response.status === 403) {
          setIsModalOpenModalSesion(true);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Tooltip title="Ver Detalle">
        <IconButton onClick={openModalPaymentDetailModal}>
          <Info color="info" />
        </IconButton>
      </Tooltip>
      <Modal
        all
        backdrop="static"
        className="modal-lx focus"
        isOpen={isModalOpenPaymentDetailModal}
      >
        <SimpleCard onClose={closeModalPaymentDetailModal}>
          <Typography variant="subtitle1" gutterBottom>
            {`Detalles del Pago - Pago #${detallePago?.idDetallePago}`}
          </Typography>
          <List>
            <Grid marginTop={2} container spacing={2}>
              <ListItem>
                <Grid item xs={12} md={6}>
                  <ListItemText
                    primary="Cliente:"
                    secondary={`${detallePago?.cliente?.primerNombre} ${detallePago?.cliente?.apellidoPaterno}`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemText
                    primary="Identificación:"
                    secondary={detallePago?.cliente?.identificacion}
                  />
                </Grid>
              </ListItem>

              <ListItem>
                <Grid item xs={12} md={6}>
                  <ListItemText
                    primary="Fecha del Pago:"
                    secondary={<Formatter value={detallePago?.fechaPago} type={'date'} />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ListItemText
                    primary="Monto Pagado:"
                    secondary={<Formatter value={detallePago?.montoPagado} type={'currency'} />}
                  />
                </Grid>
              </ListItem>
            </Grid>
          </List>
          <Typography variant="subtitle1" gutterBottom>
            {`Cuotas Pagadas`}
          </Typography>

          <List>
            <Grid marginTop={2} container spacing={2}>
              <ListItem>
                {detallePagoCuota.map((detallePago) => (
                  <Grid item xs={12} md={6} key={detallePago.idCuota}>
                    <ListItemText
                      primary={`Cuota #${detallePago.numeroCuota}`}
                      secondary={`${detallePago.montoPagado}`}
                    />
                    <ListItemText secondary={`${detallePago.estado}`} />
                  </Grid>
                ))}
              </ListItem>
            </Grid>
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <PrintReceipt detallePago={detallePago} detallePagoCuota={detallePagoCuota} />
          </Box>
        </SimpleCard>
      </Modal>
      <SessionFinishModal
        isOpen={isModalOpenModalSesion}
        closeModalSesion={closeModalSesion}
        title={'Sesión Terminada'}
      />
    </>
  );
};

export default PaymentDetailModal;
