import React, { useEffect, useState } from 'react';
import { Edit } from '@mui/icons-material';
import { Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';
import PropTypes from 'prop-types';
import { BASE_URL } from 'api/ConexionAPI';

const FinancingUpdateModal = ({ financingData, onUpdate, disabled }) => {
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    idPrestamo: financingData.idPrestamo,
    capital: financingData.capital,
    tasaPorcentaje: financingData.tasaPorcentaje,
    tiempo: financingData.tiempo,
    interes: financingData.interes,
    monto: financingData.monto,
    montoRestante: financingData.montoRestante,
    cliente: { id: financingData.cliente.id },
    frecuenciaPago: financingData.frecuenciaPago,
    fechaInicio: financingData.fechaInicio,
    identificacion: financingData.cliente.identificacion,
    nombre: financingData.cliente.primerNombre + ' ' + financingData.cliente.apellidoPaterno,
    cuota: financingData.cuota,
    estado: true,
  });

  const [financingUpdateOpen, setFinancingUpdateOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  useEffect(() => {
    onResetForm();
    calcularPrestamo();
  }, [financingData]);

  useEffect(() => {
    calcularPrestamo();
  }, [formState.capital, formState.tasaPorcentaje, formState.tiempo]);

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

  const onCloseModal = () => {
    setFinancingUpdateOpen(!financingUpdateOpen);
    onResetForm();
  };

  const calcularPrestamo = () => {
    try {
      const requiredFields = [
        'capital',
        'tasaPorcentaje',
        'tiempo',
        'frecuenciaPago',
        'fechaInicio',
      ];

      //const areFieldsEmpty = requiredFields.some((field) => !formState[field]?.trim());

      /*if (areFieldsEmpty) {
        showNotification('Uno o más campos son obligatorios', 'error');
        return;
      }*/

      const calculatedInteres = Math.ceil(
        Number(formState.capital) *
          (Number(formState.tasaPorcentaje) / 100) *
          Number(formState.tiempo)
      );

      const calculatedMonto = Math.ceil(Number(formState.capital) + Number(calculatedInteres));

      const calculatedCuota = Math.ceil(Number(calculatedMonto) / Number(formState.tiempo));

      setFormState((prevFormState) => ({
        ...prevFormState,
        interes: calculatedInteres,
        monto: calculatedMonto,
        cuota: calculatedCuota,
      }));
    } catch (error) {
      console.error(error.message || 'Error al calcular prestamo');
    }
  };

  const financingUpdate = async () => {
    try {
      const { status, data } = await axios.put(
        `${BASE_URL}/prestamos/${formState.idPrestamo}`,
        formState
      );

      if (status === 201) {
        showNotification('¡Actualizado!', 'success');
        setFinancingUpdateOpen(false);

        if (typeof onUpdate === 'function') {
          await onUpdate();
        }
      }
    } catch (error) {
      console.error('Ha ocurrido un error: ', error);
    }
  };

  return (
    <>
      <IconButton
        disabled={disabled}
        color="primary"
        onClick={() => setFinancingUpdateOpen(!financingUpdateOpen)}
      >
        <Edit />
      </IconButton>

      <Modal
        style={{ borderWidth: 0 }}
        backdrop="static"
        modalClassName="modal-fullscreen focus"
        isOpen={financingUpdateOpen}
        toggle={onCloseModal}
      >
        <>
          <SimpleCard
            title={'Actualizar prestamo'}
            onClose={() => setFinancingUpdateOpen(!financingUpdateOpen)}
          >
            <Grid>
              {/* Left Section */}
              <Grid item xs={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="frecuenciaPago"
                      select
                      label="Frecuencia de pago"
                      value={formState.frecuenciaPago}
                      onChange={onInputChange}
                      required
                      fullWidth
                    >
                      <MenuItem value={'Días'}>Días</MenuItem>
                      <MenuItem value={'Semanas'}>Semanas</MenuItem>
                      <MenuItem value={'Quincenas'}>Quincenas</MenuItem>
                      <MenuItem value={'Meses'}>Meses</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="fechaInicio"
                      type="date"
                      label="Fecha inicio"
                      required
                      fullWidth
                      value={formState.fechaInicio}
                      onChange={onInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="capital"
                      value={formState.capital}
                      label="Capital"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="tasaPorcentaje"
                      value={formState.tasaPorcentaje}
                      label="Tasa en %"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="tiempo"
                      value={formState.tiempo}
                      label="Tiempo"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="interes"
                      value={formState.interes}
                      label="Interés"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="monto"
                      value={formState.monto}
                      label="Monto"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="cuota"
                      value={formState.cuota}
                      label="Cuota"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              <hr />

              {/* Right Section */}
              <Grid item xs={12} md={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      value={formState.identificacion}
                      label="Identificacion"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField value={formState.nombre} label="Nombre" required fullWidth />
                  </Grid>

                  <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item xs={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        onResetForm();
                      }}
                      className="ml-2"
                    >
                      Resetear
                    </Button>
                    <Button
                      onClick={financingUpdate}
                      className="ml-2"
                      variant="contained"
                      color="primary"
                    >
                      Actualizar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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

FinancingUpdateModal.propTypes = {
  financingData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
  putData: PropTypes.func.isRequired,
};

export default FinancingUpdateModal;
