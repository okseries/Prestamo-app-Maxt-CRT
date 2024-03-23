import React, { useState } from 'react';
import {
  TextField,
  Grid,
  Box,
  Typography,
  MenuItem,
  IconButton,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import { Search } from '@mui/icons-material';
import { useForm } from 'app/hooks/useForm';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PrestamoForm = ({ startIcon, TextBtn, color }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0); // Cambiado a 0 para que el primer paso sea el índice 0
  const [clienteInfo, setClienteInfo] = useState(null);
  const [frecuenciaPago, setFrecuenciaPago] = useState('');
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    capital: null,
    tasaPorcentaje: null,
    porcentajeMora: null,
    tiempo: null,
    interes: null,
    monto: null,
    cuota: null,
    montoRestante: null,
    fechaInicioPago: null,
    fechaFin: null,
    estado: null,
    idCliente: null,
    idFrecuencia: null,
    cadaCuantosDias: null,
    diaDelMesEnNumero: null,
    nombreDiaSemana: null,
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setStep(0); // Cambiado a 0 para reiniciar el paso al cerrar el modal
    setClienteInfo(null);
    setFrecuenciaPago('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Lógica para enviar datos al backend
  };

  const steps = ['Datos del Cliente', 'Detalles del Préstamo', 'Configuración del Préstamo'];

  return (
    <>
      <Button color={color} size="small" onClick={() => setIsModalOpen(true)} startIcon={startIcon}>
        {TextBtn}
      </Button>
      <Modal
        isOpen={isModalOpen}
        toggle={closeModal}
        backdrop="static"
        id="ModalPrestamo"
        className={`modal-lg`}
      >
        <SimpleCard title={'Nuevo Prestamo'} onClose={closeModal}>
          <Box>
            <>
              <Step1
                onInputChange={onInputChange}
                setClienteInfo={setClienteInfo}
                formState={formState}
                activeStep={step === 0}
              />
              <Step2
                onInputChange={onInputChange}
                setFrecuenciaPago={setFrecuenciaPago}
                formState={formState}
                activeStep={step === 1}
              />
              <Step3
                onInputChange={onInputChange}
                onSubmit={handleSubmit}
                clienteInfo={clienteInfo}
                frecuenciaPago={frecuenciaPago}
                formState={formState}
                activeStep={step === 2}
              />
            </>
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} onClick={() => setStep(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

const Step1 = ({ onInputChange, setClienteInfo, formState, activeStep }) => (
  <>
    <Grid container spacing={2} paddingTop={2} style={{ display: activeStep ? 'block' : 'none' }}>
      <Grid item xs={12} md={12}>
        <TextField
          type="search"
          name="search"
          variant="outlined"
          fullWidth
          value={null}
          onChange={onInputChange}
          InputProps={{
            startAdornment: (
              <IconButton className="mr-2">
                <Search />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="idCliente"
          label="ID del Cliente"
          fullWidth
          value={formState.idCliente}
          onChange={onInputChange}
          disabled
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="infoCliente"
          label="Nombre del Cliente"
          fullWidth
          value={null}
          onChange={null}
          disabled
        />
      </Grid>
    </Grid>
  </>
);

const Step2 = ({ onInputChange, setFrecuenciaPago, formState, activeStep }) => (
  <>
    <Grid container spacing={2} paddingTop={2} style={{ display: activeStep ? 'block' : 'none' }}>
      <Grid item xs={12} md={4}>
        <TextField
          name="capital"
          label="Capital"
          fullWidth
          type="number"
          required
          value={formState.capital}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="tasaPorcentaje"
          label="Tasa de Interes (%)"
          fullWidth
          type="number"
          required
          value={formState.tasaPorcentaje}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="interes"
          label="Tiempo"
          fullWidth
          type="number"
          required
          value={formState.interes}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="interes"
          label="Interes"
          fullWidth
          type="number"
          required
          value={formState.frecuenciaPago}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="monto"
          label="Monto del Prestamo"
          fullWidth
          type="number"
          required
          value={formState.monto}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="cuota"
          label="Cuota"
          fullWidth
          type="number"
          required
          value={formState.cuota}
          onChange={onInputChange}
        />
      </Grid>
    </Grid>
  </>
);

const Step3 = ({ onInputChange, onSubmit, clienteInfo, frecuenciaPago, formState, activeStep }) => (
  <>
    <Grid container spacing={2} style={{ display: activeStep ? 'block' : 'none' }}>
      <Grid item xs={12} md={6}>
        <TextField
          name="idFrecuencia"
          select
          label="Frecuencia de Pago"
          fullWidth
          required
          onChange={onInputChange}
        >
          <MenuItem value={1}>Diario</MenuItem>
          <MenuItem value={2}>Semanal</MenuItem>
          <MenuItem value={3}>Quincenal</MenuItem>
          <MenuItem value={4}>Mensual</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          name="fechaInicioPago"
          label="Fecha de la Primera Cuota"
          fullWidth
          required
          value={formState.fechaInicioPago}
          onChange={onInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="cadaCuantosDias"
          select
          label="Intervalo de día"
          fullWidth
          required
          value={formState.cadaCuantosDias}
          onChange={onInputChange}
        >
          {Array.from({ length: 28 }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              Cada ({index + 1}) Día
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="nombreDiaSemana"
          select
          label="Día de la semana"
          fullWidth
          required
          value={formState.nombreDiaSemana}
          onChange={onInputChange}
        >
          {diasSemana.map((dia, index) => (
            <MenuItem key={index} value={index + 1}>
              {dia}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="diaDelMesEnNumero"
          select
          label="Día del mes"
          fullWidth
          required
          value={formState.diaDelMesEnNumero}
          onChange={onInputChange}
        >
          {Array.from({ length: 28 }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              El día ({index + 1}) de cada mes
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={12}>
        <Button fullWidth variant="contained" onClick={null}>
          Atrás
        </Button>
      </Grid>
    </Grid>
    <Box mt={4} mb={4}></Box>
  </>
);

export default PrestamoForm;
