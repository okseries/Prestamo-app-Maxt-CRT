import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  MenuItem,
  IconButton,
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
  const [step, setStep] = useState(1);
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

  const steps = ['Datos del Cliente', 'Detalles del Préstamo', 'Configuración del Préstamo'];

  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
    setClienteInfo(null);
    setFrecuenciaPago('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Lógica para enviar datos al backend
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

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
              {step === 1 && (
                <Step1
                  onInputChange={onInputChange}
                  onNextStep={handleNextStep}
                  setClienteInfo={setClienteInfo}
                  formState={formState}
                />
              )}
              {step === 2 && (
                <Step2
                  onInputChange={onInputChange}
                  onPrevStep={handlePrevStep}
                  onNextStep={handleNextStep}
                  setFrecuenciaPago={setFrecuenciaPago}
                  formState={formState}
                />
              )}
              {step === 3 && (
                <Step3
                  onInputChange={onInputChange}
                  onPrevStep={handlePrevStep}
                  onSubmit={handleSubmit}
                  clienteInfo={clienteInfo}
                  frecuenciaPago={frecuenciaPago}
                  formState={formState}
                />
              )}
            </>
            <Stepper
              activeStep={step - 1}
              alternativeLabel
              style={{ transition: 'margin-left 0.3s ease-in-out' }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel completed={step > index + 1}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

const Step1 = ({ onNextStep, setClienteInfo, formState, onInputChange }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
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
    <Box mt={2}>
      <Button variant="contained" color="primary" onClick={onNextStep}>
        Siguiente
      </Button>
    </Box>
  </>
);

const Step2 = ({ onInputChange, onPrevStep, onNextStep, setFrecuenciaPago, formState }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
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
    <Box mt={2}>
      <Button variant="contained" color="primary" onClick={onNextStep}>
        Siguiente
      </Button>
      <Button variant="contained" onClick={onPrevStep}>
        Atrás
      </Button>
    </Box>
  </>
);

const Step3 = ({ onInputChange, onPrevStep, onSubmit, clienteInfo, frecuenciaPago, formState }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
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
    </Grid>
    <Box mt={2}>
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Crear Préstamo
      </Button>
      <Button variant="contained" onClick={onPrevStep}>
        Atrás
      </Button>
    </Box>
  </>
);

export default PrestamoForm;
