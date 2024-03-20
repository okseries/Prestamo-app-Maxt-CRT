import React, { useEffect, useState } from 'react';
import { RequestQuoteOutlined } from '@mui/icons-material';
import { Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';

const FinancingCreate = ({ clientData }) => {
  const initialFormData = {
    capital: '',
    tasaPorcentaje: '',
    porcentajeMora: '',
    tiempo: '',
    interes: '',
    monto: '',
    cuota: '',
    montoRestante: null,
    frecuenciaPago: '',
    fechaInicio: '',
    fechaFin: null, // Asegúrate de incluir fechaFin si es necesario
    estado: true, // Asegúrate de incluir estado si es necesario
    cliente: {
      id: clientData.id,
      Identificacion: clientData.identificacion,
      nombre: clientData.primerNombre + ' ' + clientData.apellidoPaterno,
    },
  };

  const { formState, onInputChange, onResetForm, setFormState } = useForm(initialFormData);
  const [modalFinanciarOpen, setModalFinanciarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [validated, setValidated] = useState(false);
  const [print, setPrint] = useState(null);

  const [interes, setInteres] = useState('');
  const [monto, setMonto] = useState('');
  const [cuota, setCuota] = useState('');

  useEffect(() => {
    onResetForm();
  }, []);

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
    setModalFinanciarOpen(!modalFinanciarOpen);
    setInteres('');
    setMonto('');
    setCuota('');
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

      const areFieldsEmpty = requiredFields.some((field) => !formState[field]?.trim());

      if (areFieldsEmpty) {
        setValidated(true);
        //showNotification('Uno o más campos son obligatorios', 'error');
        return;
      }

      const calculatedInteres = Math.ceil(
        Number(formState.capital) *
          (Number(formState.tasaPorcentaje) / 100) *
          Number(formState.tiempo)
      );

      const calculatedMonto = Math.ceil(Number(formState.capital) + Number(calculatedInteres));

      const calculatedCuota = Math.ceil(Number(calculatedMonto) / Number(formState.tiempo));

      setInteres(calculatedInteres);
      setMonto(calculatedMonto);
      setCuota(calculatedCuota);
    } catch (error) {
      console.error(error.message || 'Error al calcular prestamo');
    }
  };

  const onCreateFinancing = async () => {
    try {
      const requiredFields = [
        'capital',
        'tasaPorcentaje',
        'tiempo',
        'frecuenciaPago',
        'fechaInicio',
      ];

      const areFieldsEmpty = requiredFields.some((field) => !formState[field]?.trim());

      if (areFieldsEmpty) {
        setValidated(true);
        showNotification('Uno o más campos son obligatorios', 'error');
        return;
      }

      const { Identificacion, nombre, ...financing } = formState;
      const newFinancing = {
        ...financing,
        monto,
        cuota,
        interes,
      };

      const printFinancing = {
        ...financing,
        monto,
        cuota,
        interes,
        nombre,
        Identificacion,
      };
      const { status, data } = await axios.post(`${'BASE_URL'}/prestamos`, newFinancing);

      if (status === 201) {
        showNotification('Creado exitosamente', 'success');
        setPrint(printFinancing);
        setCuota('');
        setMonto('');
        setInteres('');
        onResetForm();
        setModalFinanciarOpen(false);
      } else {
        showNotification(data, 'error');
      }
    } catch (error) {
      showNotification('Es posible que este cliente ya tenga un prestamo activo', 'error');
      console.error(`Ha ocurrido un error: ${error}`);
    }
  };

  return (
    <>
      <IconButton onClick={() => setModalFinanciarOpen(!modalFinanciarOpen)}>
        <RequestQuoteOutlined color={'success'} />
      </IconButton>

      <Modal
        style={{ borderWidth: 0 }}
        backdrop="static"
        modalClassName="modal-fullscreen focus"
        isOpen={modalFinanciarOpen}
        toggle={onCloseModal}
      >
        <>
          <SimpleCard
            title={'Crear prestamo'}
            onClose={() => setModalFinanciarOpen(!modalFinanciarOpen)}
          >
            <Grid>
              {/* Left Section */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="frecuenciaPago"
                      select
                      label="Frecuencia de pago"
                      onChange={onInputChange}
                      required
                      fullWidth
                      error={validated && !formState.frecuenciaPago.trim()}
                      helperText={
                        validated && !formState.frecuenciaPago.trim() ? 'Campo obligatorio' : ''
                      }
                    >
                      <MenuItem value={'Dias'}>Días</MenuItem>
                      <MenuItem value={'Semanas'}>Semanas</MenuItem>
                      <MenuItem value={'Quincenas'}>Quincenas</MenuItem>
                      <MenuItem value={'Meses'}>Meses</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      name="porcentajeMora"
                      label="% Mora"
                      required
                      fullWidth
                      value={formState.porcentajeMora}
                      onChange={onInputChange}
                      error={validated && !formState.porcentajeMora.trim()}
                      helperText={
                        validated && !formState.porcentajeMora.trim() ? 'Campo obligatorio' : ''
                      }
                    />
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
                      error={validated && !formState.fechaInicio.trim()}
                      helperText={
                        validated && !formState.fechaInicio.trim() ? 'Campo obligatorio' : ''
                      }
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
                      error={validated && !formState.capital.trim()}
                      helperText={validated && !formState.capital.trim() ? 'Campo obligatorio' : ''}
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
                      error={validated && !formState.tasaPorcentaje.trim()}
                      helperText={
                        validated && !formState.tasaPorcentaje.trim() ? 'Campo obligatorio' : ''
                      }
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
                      error={validated && !formState.tiempo.trim()}
                      helperText={validated && !formState.tiempo.trim() ? 'Campo obligatorio' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="interes"
                      value={interes}
                      label="Interés"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="monto"
                      value={monto}
                      label="Monto"
                      onChange={onInputChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="cuota"
                      value={cuota}
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
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={formState.cliente.Identificacion}
                      label="Identificacion"
                      onChange={onInputChange}
                      required
                      fullWidth
                      error={validated && !formState.cliente.Identificacion}
                      helperText={
                        validated && !formState.cliente.Identificacion ? 'Campo obligatorio' : ''
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={formState.cliente.nombre}
                      label="Nombre"
                      required
                      fullWidth
                      error={validated && !formState.cliente.nombre}
                      helperText={validated && !formState.cliente.nombre ? 'Campo obligatorio' : ''}
                    />
                  </Grid>

                  <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} item xs={12}>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        setCuota('');
                        setMonto('');
                        setInteres('');
                        onResetForm();
                      }}
                      className="ml-2"
                    >
                      Resetear
                    </Button>
                    {/*<FinancingPrintComponent row={print} />*/}
                    <Button
                      onClick={onCreateFinancing}
                      className="ml-2"
                      variant="contained"
                      color="primary"
                    >
                      Crear
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

export default FinancingCreate;
