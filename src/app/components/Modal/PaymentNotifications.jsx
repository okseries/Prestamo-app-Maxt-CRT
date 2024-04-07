import React, { useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Badge, Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import axios from 'axios';
import CuotasVencenHoy from './CuotasVencenHoy';
import { GetCuotasQueVencenHoyURL } from 'BaseURL';

const PaymentNotifications = () => {
  const [isModalOpenPaymentNotifications, setIsModalOpenModalPaymentNotifications] =
    useState(false);
  const [overduePayments, setOverduePayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const closeModalPaymentNotifications = () => {
    setIsModalOpenModalPaymentNotifications(false);
  };

  const cuotasVecenHoy = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(GetCuotasQueVencenHoyURL);
      setOverduePayments(data);
    } catch (error) {
      console.error('Error al obtener las cuotas vencidas:', error);
      // Puedes mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cuotasVecenHoy();
  }, []);

  return (
    <>
      <Tooltip title={`Cuotas que vencen hoy: ${overduePayments.length || 0}`}>
        <IconButton onClick={() => setIsModalOpenModalPaymentNotifications(overduePayments.length)}>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Badge badgeContent={overduePayments.length} color="secondary">
              <Notifications />
            </Badge>
          )}
        </IconButton>
      </Tooltip>

      <Modal
        all
        backdrop="static"
        className="modal-lg focus"
        isOpen={isModalOpenPaymentNotifications}
      >
        <SimpleCard
          title={'Cuotas que vencen hoy'}
          onClose={() => closeModalPaymentNotifications()}
        >
          <CuotasVencenHoy overduePayments={overduePayments} />
        </SimpleCard>
      </Modal>
    </>
  );
};

export default PaymentNotifications;
