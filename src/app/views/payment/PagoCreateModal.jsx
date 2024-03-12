import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Button, CardBody, Modal } from 'reactstrap';
import PropTypes from 'prop-types';
import { SimpleCard } from 'app/components';
import { IconButton, TextField, Grid, Box } from '@mui/material';
import axios from 'axios';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import { ArrowRightAlt, AttachMoney, Close, Refresh, Replay } from '@mui/icons-material';
import { BASE_URL } from 'api/ConexionAPI';
import { useNavigate } from 'react-router-dom';

const PagoCreateModal = (props) => {
  const navigate = useNavigate();
  const [modalActualizarEstado, setModalActualizarEstado] = useState(false);
  const { onClick, datosAEnviar, onUpdate, disabled } = props;
  const [modalPago, setModalPago] = useState(false);
  const [fecha, setFecha] = useState('');
  const [montoPago, setMontoPago] = useState('');
  const [identificacion, setIdentificacion] = useState('');
  const [nombre, setNombre] = useState('');
  const [idFinanciamiento, setIdFinanciamiento] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [numeroPago, setNumeroPago] = useState('');
  const [id, setId] = useState('');
  const [pago, setPago] = useState([]);
  const [pagos, setPagos] = useState({
    pendientes: [],
    aplicados: [],
    vencidos: [],
  });

  useEffect(() => {
    resetForm();
    if (datosAEnviar) {
      const pagosPendientes = datosAEnviar.pagos.filter((pago) => pago.estado === 'Pendiente');
      const pagosAplicados = datosAEnviar.pagos.filter((pago) => pago.estado === 'Aplicado');
      const pagosVencidos = datosAEnviar.pagos.filter((pago) => pago.estado === 'Vencido');

      setPagos({
        pendientes: pagosPendientes,
        aplicados: pagosAplicados,
        vencidos: pagosVencidos,
      });
      setNombre(
        `${datosAEnviar.cliente.primerNombre} ${datosAEnviar.cliente.segundoNombre} ${datosAEnviar.cliente.apellidoPaterno} ${datosAEnviar.cliente.apellidoMaterno}`
      );
      setIdentificacion(`${datosAEnviar.cliente.identificacion}`);
      setIdFinanciamiento(datosAEnviar.idFinanciamiento);
    }
  }, [datosAEnviar]);

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const resetForm = () => {
    setFecha('');
    setMontoPago('');
    setIdentificacion('');
    setNombre('');
  };

  const handleOpenmodalActualizarEstado = (pagoRecibido) => {
    setPago(pagoRecibido);
    setModalActualizarEstado(true);
  };

  const handleChangeEstado = async () => {
    try {
      const { status, data } = await axios.put(`${BASE_URL}/pagos/estado/${pago.id}`, pago);
      console.log(pago);
      console.log(status);
      console.log(data);

      if (status === 201 || status === 200) {
        showNotification('Realizado!', 'success');
        setModalActualizarEstado(false);
        if (typeof onUpdate === 'function') {
          onUpdate();
        }
        //fetchData();
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const closeNotification = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
  };

  const seleccionarPago = (pagoSeleccionado) => {
    setFecha(pagoSeleccionado.fechaPago);
    setMontoPago(pagoSeleccionado.montoPago);
    setNumeroPago(pagoSeleccionado.numeroPago);
  };

  const handleSubmit = async () => {
    const nuevoPago = {
      id,
      financiamiento: { idFinanciamiento },
      numeroPago,
      fechaPago: fecha,
      montoPago,
      estado: 'Pendiente',
    };
    console.log(nuevoPago);

    try {
      const { status, data } = await axios.post(`${BASE_URL}/pagos`, nuevoPago);
      console.log(data);
      console.log(status);

      if (status === 201) {
        showNotification('Pago registrado!', 'success');
        resetForm();
        if (typeof onUpdate === 'function') {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };

  const VerHistorialPagoSeleccionado = (pago) => {
    navigate('/historial-pagos', { state: { pago } });
  };

  return (
    <>
      <IconButton
        onClick={() => {
          onClick();
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
            <>
              <Grid container spacing={2}>
                {/* Listas de Pagos Pendientes, Aplicados y Vencidos */}

                <Grid item xs={12} md={4}>
                  <List>
                    <Typography variant="h8">Pagos Vencidos</Typography>
                    {pagos.vencidos.map((pago) => (
                      <ListItem
                        key={pago.id}
                        button
                        onClick={() => {
                          seleccionarPago(pago);
                          setId(pago.id);
                        }}
                      >
                        <ListItemText className="text-danger" primary={pago.numeroPago} />
                        <ListItemText primary={pago.fechaPago} />
                        <ListItemText primary={pago.montoPago} />
                        <ListItemText primary="Vencido" className="text-danger" />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={4}>
                  <List>
                    <Typography variant="h8">Pagos Pendientes</Typography>
                    {pagos.pendientes.map((pago) => (
                      <ListItem
                        key={pago.id}
                        button
                        onClick={() => {
                          seleccionarPago(pago);
                          setId(pago.id);
                        }}
                      >
                        <ListItemText className="text-primary" primary={pago.numeroPago} />
                        <ListItemText primary={pago.fechaPago} />
                        <ListItemText primary={pago.montoPago} />
                        <ListItemText primary="Pendiente" className="text-primary" />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={4}>
                  <List>
                    <Typography variant="h8">Pagos Aplicados</Typography>
                    {pagos.aplicados.map((pago) => (
                      <ListItem key={pago.id}>
                        <ListItemText className="text-success" primary={pago.numeroPago} />
                        <ListItemText primary={pago.fechaPago} />
                        <ListItemText className="text-success" primary={pago.montoPago} />
                        <IconButton
                          variant="contained"
                          onClick={() => handleOpenmodalActualizarEstado(pago)}
                          size="small"
                        >
                          <Replay color="secondary" />
                        </IconButton>
                        <IconButton
                          variant="contained"
                          onClick={() => VerHistorialPagoSeleccionado(pago)}
                          size="small"
                        >
                          <ArrowRightAlt color="primary" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>

              {/* Formulario para ingresar los datos del pago */}
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
                    label="Numero de pago"
                    required
                    value={numeroPago}
                    onChange={(e) => setNumeroPago(e.target.value)}
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
              <hr />
              <Box display={'flex'} justifyContent={'end'}>
                <Button color="primary" variant="contained" onClick={handleSubmit}>
                  Aplicar pago
                </Button>
              </Box>
            </>
          </SimpleCard>
        </>
      </Modal>

      <Modal backdrop="static" className="modal-lx focus" isOpen={modalActualizarEstado}>
        <SimpleCard
          title={'Cancelar pago'}
          subtitle={'¿Estás seguro de que quieres cambiar el estado del pago?'}
          onClose={() => setModalActualizarEstado(false)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" variant="contained" onClick={handleChangeEstado}>
              ok
            </Button>
          </Box>
        </SimpleCard>
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
