// PaymentNotifications.jsx

import React, { useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Badge, Box, Button, IconButton, Tooltip } from '@mui/material';
import { Done, Notifications, Task } from '@mui/icons-material';
import axios from 'axios';
import RowCards from 'app/views/dashboard/shared/RowCards';
import CuotasVencenHoy from './CuotasVencenHoy';

const PaymentNotifications = () => {
  const [isModalOpenPaymentNotifications, setIsModalOpenModalPaymentNotifications] =
    useState(false);
  const [overduePayments, setOverduePayments] = useState([]);

  const closeModalPaymentNotifications = () => {
    setIsModalOpenModalPaymentNotifications(false);
  };

  useEffect(() => {
    cuotasVecenHoy();
  }, []);

  const cuotasVecenHoy = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/api/v1/cuotas/vencenHoy/sucursal/1');
      setOverduePayments(data);

      console.log('**************************************', data);
    } catch (error) {}
  };

  return (
    <>
      <Tooltip title={`Cuotas que vencen hoy: ${overduePayments.length || 0}`}>
        <IconButton onClick={() => setIsModalOpenModalPaymentNotifications(overduePayments.length)}>
          <Badge badgeContent={overduePayments.length} color="secondary">
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      <Modal
        all
        backdrop="static"
        className="modal-lg focus"
        isOpen={isModalOpenPaymentNotifications}
      >
        <div
          style={{
            maxHeight: 'calc(100vh - 100px)',
            overflow: 'auto',
          }}
        >
          <SimpleCard
            title={'Cuotas que vencen hoy'}
            onClose={() => closeModalPaymentNotifications()}
          >
            <CuotasVencenHoy overduePayments={overduePayments} />
          </SimpleCard>
        </div>
      </Modal>
    </>
  );
};

export default PaymentNotifications;
