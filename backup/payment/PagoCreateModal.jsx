import React, { useEffect, useState } from 'react';
import { Button, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { SimpleCard } from 'app/components';
import { IconButton, Icon, TextField, Grid, Box } from '@mui/material';
import { PagoService } from 'api/Services_api';
import axios from 'axios';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import { AttachMoney } from '@mui/icons-material';

const url = 'http://localhost:8080/api/v1/pagos';

const PagoCreateModal = (props) => {
  const { onClick, datosAEnviar, onUpdate, disabled } = props;
  const [modalPago, setModalPago] = useState(false);
  const [fecha, setFecha] = useState('');
  const [montoPago, setMontoPago] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [nombre, setNombre] = useState('');
  const [cuota, setCuota] = useState('');
  const [idFinanciamiento, setIdFinanciamiento] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  useEffect(() => {
    if (datosAEnviar) {
      setCuota(`${datosAEnviar.cuota}`);
      setNombre(
        `${datosAEnviar.cliente.primerNombre} ${datosAEnviar.cliente.segundoNombre} ${datosAEnviar.cliente.apellidoPaterno} ${datosAEnviar.cliente.apellidoMaterno}`
      );
      setIdentificacion(`${datosAEnviar.cliente.identificacion}`);
      setIdFinanciamiento(datosAEnviar.idFinanciamiento);
      setMontoPago(`${datosAEnviar.cuota}`);
    }
  }, [datosAEnviar]);

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const closeNotification = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  const handleSubmit = async () => {
    if (Number(montoPago) === 0 || Number(montoPago) > datosAEnviar.montoRestante) {
      return;
    }

    try {
      const nuevoPago = {
        financiamiento: { idFinanciamiento },
        fechaPago: fecha,
        montoPago,
        estado: 'Aplicado',
      };

      const { status, data } = await axios.post(url, nuevoPago);

      if (status === 201) {
        showNotification('Pago registrado!', 'success');

        if (typeof onUpdate === 'function') {
          onUpdate();
          setModalPago(false);
        }
      } else if (status === 400) {
        showNotification(data, 'error');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => {
          onClick(); // Call the function passed from the parent component
          setModalPago(true);
        }}
        disabled={disabled}
        color="success"
        variant="contained"
      >
        <AttachMoney />
      </IconButton>

      <Modal
        backdrop="static"
        className="modal-lg focus"
        isOpen={modalPago}
        toggle={() => setModalPago(!modalPago)}
      >
        <>
          <SimpleCard title={'Registrar pago'} onClose={() => setModalPago(!modalPago)}>
            <CardBody>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="bg-white"
                    type="text"
                    label="Identificación"
                    required
                    value={identificacion}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    className="bg-white"
                    type="text"
                    label="Nombre del cliente"
                    required
                    value={nombre}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    className="bg-white"
                    type="text"
                    label="Cuota pendiente"
                    required
                    value={cuota}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    type="date"
                    label="Fecha"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    type="number"
                    label="Monto a pagar"
                    required
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button color="success" variant="contained" onClick={handleSubmit}>
                  Aplicar pago
                </Button>
              </Box>
            </CardBody>
          </SimpleCard>
        </>
      </Modal>
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />
    </>
  );
};

PagoCreateModal.propTypes = {
  onClick: PropTypes.func.isRequired,
  datosAEnviar: PropTypes.any,
  className: PropTypes.string,
  onUpdate: PropTypes.func,
};

export default PagoCreateModal;
