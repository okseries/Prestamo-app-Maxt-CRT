import React, { useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';

const url = 'http://localhost:8080/api/v1/clientes';

const initialFormData = {
  identificacion: '',
  primerNombre: '',
  segundoNombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  telefono: '',
  correo: '',
  ingresos: '',
  dondeLabora: '',
  direccion: '',
  estado: true,
};

const CrearCliente = () => {
  const [validated, setValidated] = useState(false);
  const { formState, onInputChange, onResetForm } = useForm(initialFormData);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  const {
    identificacion,
    primerNombre,
    segundoNombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    correo,
    ingresos,
    dondeLabora,
    direccion,
    estado,
  } = formState;

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
    const requiredFields = [
      'identificacion',
      'primerNombre',
      'apellidoPaterno',
      'telefono',
      'correo',
      'ingresos',
      'dondeLabora',
      'direccion',
    ];

    const areFieldsEmpty = requiredFields.some((field) => !formState[field]?.trim());

    if (areFieldsEmpty) {
      setValidated(true);
      console.log('Uno o más campos están vacíos o son inválidos');
      return;
    }

    try {
      const nuevosDatos = { ...formState };
      const { data, status } = await axios.post(url, nuevosDatos);
      if (status === 201) {
        onResetForm();
        setValidated(false);
        showNotification('¡El cliente ha sido creado!', 'success');
      } else {
        showNotification('¡No se puede crear este cliente, verifique si ya existe!', 'error');
      }
    } catch (error) {
      console.error('Error creando cliente:', error);
      showNotification('¡No se puede crear este cliente, verifique si ya existe!', 'error');
    }
  };

  return (
    <ContainerComp
      style={{
        paddingTop: '10px',
      }}
    >
      <SimpleCard>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              name="identificacion"
              value={identificacion}
              label="Cedula"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.identificacion.trim()}
              helperText={validated && !formState.identificacion.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="primerNombre"
              value={primerNombre}
              label="Primer Nombre"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.primerNombre.trim()}
              helperText={validated && !formState.primerNombre.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="segundoNombre"
              value={segundoNombre}
              label="Segundo Nombre"
              onChange={onInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="apellidoPaterno"
              value={apellidoPaterno}
              label="Apellido Paterno"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.apellidoPaterno.trim()}
              helperText={validated && !formState.apellidoPaterno.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="apellidoMaterno"
              value={apellidoMaterno}
              label="Apellido Materno"
              onChange={onInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="telefono"
              value={telefono}
              label="Telefono"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.telefono.trim()}
              helperText={validated && !formState.telefono.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              type="email"
              name="correo"
              value={correo}
              label="Correo"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !/^\S+@\S+\.\S+$/.test(formState.correo)}
              helperText={
                validated && !/^\S+@\S+\.\S+$/.test(formState.correo) ? 'Correo inválido' : ''
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="number"
              name="ingresos"
              value={ingresos}
              label="Ingresos Neto"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.dondeLabora.trim()}
              helperText={validated && !formState.ingresos.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="text"
              name="dondeLabora"
              value={dondeLabora}
              label="Donde Labora"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.dondeLabora.trim()}
              helperText={validated && !formState.dondeLabora.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              type="text"
              name="direccion"
              value={direccion}
              label="Direccion"
              onChange={onInputChange}
              required
              fullWidth
              error={validated && !formState.direccion.trim()}
              helperText={validated && !formState.direccion.trim() ? 'Campo obligatorio' : ''}
            />
          </Grid>
        </Grid>

        <Box style={{ display: 'flex', justifyContent: 'flex-end' }} mt={2}>
          <Button variant="contained" color="secondary" type="reset" onClick={onResetForm}>
            Reset
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            Button
            color="primary"
            onClick={handleSubmit}
          >
            Crear Cliente
          </Button>
        </Box>
      </SimpleCard>
      {/* Componente de notificación */}
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />
    </ContainerComp>
  );
};

export default CrearCliente;
