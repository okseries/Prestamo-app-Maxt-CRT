import React, { useEffect, useState } from 'react';
import { Button, List, Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Box, IconButton, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';
import Formatter from '../Formatter/Formatter';
import PrintReceipt from '../TemplatePrinting/PrintReceipt';
import SessionFinishModal from './SessionFinishModal';
import PrintReceiptMora from '../TemplatePrinting/PrintReceiptMora';

const PaymentMoraDetailModal = ({ rowData }) => {
  const [isModalOpenPaymentDetailModal, setIsModalOpenPaymentDetailModal] = useState(false);

  const openModalPaymentDetailModal = () => {
    setIsModalOpenPaymentDetailModal(true);
  };

  const closeModalPaymentDetailModal = () => {
    setIsModalOpenPaymentDetailModal(false);
  };

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
            {`Detalles del Pago - Préstamo #${rowData.idPrestamo}`}
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Cliente:"
                secondary={`${rowData.cliente.primerNombre} ${rowData.cliente.apellidoPaterno}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Identificación:" secondary={rowData.cliente.identificacion} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Fecha del Pago:"
                secondary={<Formatter value={rowData.createdAt} type={'date'} />}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Monto Pagado:"
                secondary={<Formatter value={rowData.montoPagado} type={'currency'} />}
              />
            </ListItem>
          </List>
          <Typography variant="subtitle1" gutterBottom>
            {`Moras Pagadas`}
          </Typography>
          <List>
            {rowData.detallePagoMora.map((detalle, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Mora ID: ${detalle.idMora}`}
                  secondary={`Monto Pagado: ${detalle.montoPagado}`}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <PrintReceiptMora rowData={rowData} />
          </Box>
        </SimpleCard>
      </Modal>
      <SessionFinishModal
        isOpen={false} // No estoy seguro de cómo manejas este estado, así que lo he dejado en falso por ahora
        closeModalSesion={() => {}} // No estoy seguro de cómo manejas esta función, así que la he dejado vacía por ahora
        title={'Sesión Terminada'}
      />
    </>
  );
};

export default PaymentMoraDetailModal;
