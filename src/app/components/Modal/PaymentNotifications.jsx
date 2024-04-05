import React, { useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Badge, Box, Button, IconButton } from '@mui/material';
import { Done, Notifications } from '@mui/icons-material';

const PaymentNotifications = ({
  action,
  startIcon,
  TextBtn,
  title,
  disabled,
  handleModalOptionOK,
}) => {
  const [isModalOpenModalOption, setIsModalOpenModalOption] = useState(false);
  const [overduePayments, setOverduePayments] = useState([
    { id: 1, client: 'Cliente 1', amount: 100, dueDate: '2024-04-05' },
    { id: 2, client: 'Cliente 2', amount: 150, dueDate: '2024-04-05' },
    // Otros pagos vencidos para hoy...
  ]);

  const closeModal = () => {
    setIsModalOpenModalOption(false);
  };
  return (
    <>
      <IconButton onClick={() => setIsModalOpenModalOption(true)}>
        <Badge badgeContent={overduePayments.length} color="secondary">
          <Notifications />
        </Badge>
      </IconButton>

      <Modal all backdrop="static" className="modal-lx focus" isOpen={isModalOpenModalOption}>
        <SimpleCard
          title={title}
          subtitle={`¿Estás seguro de que quieres ${action}?`}
          onClose={() => closeModal()}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleModalOptionOK} color="primary" startIcon={<Done />}>
              Ok
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );

  function handleNotificationClick() {
    // Aquí puedes mostrar una lista de pagos vencidos al hacer clic en el botón
    console.log('Pagos vencidos hoy:', overduePayments);
    // Aquí podrías abrir un modal o una página separada para mostrar la lista
  }
};

export default PaymentNotifications;
