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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
} from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import { Search } from '@mui/icons-material';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';
import { CrearPrestamoURL, GetClientePorIdURL } from 'BaseURL';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const PrestamoForm = ({ startIcon, TextBtn, color }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [nombreCliente, setNombreCliente] = useState(null);
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
    nombreCliente: null,
    cedulaCliente: null,
  });

  const steps = [
    'Datos del Cliente',
    'Detalles del Préstamo',
    'Configuración del Préstamo',
    'Resumen',
  ];

  const closeModal = () => {
    setIsModalOpen(false);
    setStep(0);
    setClienteInfo(null);
    setFrecuenciaPago('');
  };

  const handleSubmit = async () => {
    try {
      const { status, data } = await axios.post(CrearPrestamoURL, formState);
      console.log(formState);
      console.log(status);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getClienteById = async () => {
    try {
      const { status, data } = await axios.get(`${GetClientePorIdURL}/${formState.idCliente}`);
      if (status === 200) {
        const nombreCliente = data ? `${data.primerNombre} ${data.apellidoPaterno}` : '';
        setFormState((prevState) => ({
          ...prevState,
          nombreCliente: nombreCliente,
        }));
      }
      alert(data);
    } catch (error) {
      console.error(error);
    }
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
              {step === 0 && (
                <Step1
                  onInputChange={onInputChange}
                  onNextStep={handleNextStep}
                  setClienteInfo={setClienteInfo}
                  getClienteById={getClienteById}
                  formState={formState}
                />
              )}
              {step === 1 && (
                <Step2
                  onInputChange={onInputChange}
                  onPrevStep={handlePrevStep}
                  onNextStep={handleNextStep}
                  setFrecuenciaPago={setFrecuenciaPago}
                  formState={formState}
                />
              )}
              {step === 2 && (
                <Step3
                  onInputChange={onInputChange}
                  onPrevStep={handlePrevStep}
                  onSubmit={handleSubmit}
                  clienteInfo={clienteInfo}
                  frecuenciaPago={frecuenciaPago}
                  formState={formState}
                />
              )}
              {step === 3 && (
                <Step4
                  onInputChange={onInputChange}
                  onPrevStep={handlePrevStep}
                  onSubmit={handleSubmit}
                  clienteInfo={clienteInfo}
                  frecuenciaPago={frecuenciaPago}
                  formState={formState}
                  handleSubmit={handleSubmit}
                  onResetForm={onResetForm}
                />
              )}
            </>
            <Stepper className="mt-8" activeStep={step} alternativeLabel>
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

const Step1 = ({ onNextStep, setClienteInfo, formState, onInputChange, getClienteById }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12} md={12}>
        <TextField
          type="search"
          name="idCliente"
          variant="outlined"
          fullWidth
          value={formState.idCliente}
          onChange={onInputChange}
          InputProps={{
            startAdornment: (
              <IconButton className="mr-2" onClick={getClienteById}>
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
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="nombreCliente"
          label="Nombre del Cliente"
          fullWidth
          value={formState.nombreCliente}
          onChange={onInputChange}
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  </>
);

const Step2 = ({ onInputChange, onPrevStep, onNextStep, setFrecuenciaPago, formState }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12} md={3}>
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
      <Grid item xs={12} md={3}>
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
      <Grid item xs={12} md={3}>
        <TextField
          name="porcentajeMora"
          label="Mora Diaria (%)"
          fullWidth
          type="number"
          required
          value={formState.porcentajeMora}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          name="tiempo"
          label="Tiempo"
          fullWidth
          type="number"
          required
          value={formState.tiempo}
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
          value={formState.interes}
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
  </>
);

const Step4 = ({ formState, onResetForm, handleSubmit }) => (
  <>
    <Box p={3} textAlign={'center'}>
      <Typography variant="h6" align="center" gutterBottom>
        Detalles del Cliente
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Nombre del Cliente:" secondary={'Malfry Perez'} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Numero de Identificacion del Cliente:"
            secondary={'074-00052-49-9'}
          />
        </ListItem>
      </List>
      <hr />
      <Typography variant="h6" align="center" gutterBottom>
        Detalles del Préstamo
      </Typography>
      <Grid container justify="center" spacing={3}>
        <Grid item xs={12} md={6}>
          <List>
            <ListItem>
              <ListItemText primary="Monto Prestado:" secondary={formState.capital} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Tasa de Interes:" secondary={formState.tasaPorcentaje} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Porcentaje de mora por Dia:"
                secondary={formState.porcentajeMora}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Duracion del Prestamo:" secondary={formState.tiempo} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <List>
            <ListItem>
              <ListItemText primary="Interés Total:" secondary={formState.interes} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Monto Total:" secondary={formState.monto} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cuota Mensual:" secondary={formState.cuota} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <hr />
      <Typography variant="h6" align="center" gutterBottom>
        Configuración del Préstamo
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Frecuencia de pago:" secondary={'Pago mensual'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Fecha del primer Pago:" secondary={formState.fechaInicioPago} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Dia de la Semana:" secondary={formState.nombreDiaSemana} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Intervalo de días entre cada pago:" secondary={'No aplica'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Día de vencimiento:" secondary={formState.fechaInicioPago} />
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Button fullWidth variant="contained" color="warning" onClick={onResetForm}>
            Restablecer
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button fullWidth variant="contained" color="success" onClick={handleSubmit}>
            Crear Préstamo
          </Button>
        </Grid>
      </Grid>
    </Box>
  </>
);

export default PrestamoForm;
