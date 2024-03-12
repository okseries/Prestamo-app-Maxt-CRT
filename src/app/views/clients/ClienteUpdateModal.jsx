import React, { useState } from 'react';
import { Button, TextField, Grid, Box, IconButton, Icon } from '@mui/material';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { useForm } from 'app/hooks/useForm';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import axios from 'axios';
import { SimpleCard } from 'app/components';

// Constants
const url = 'http://localhost:8080/api/v1/clientes';

// Component
const ClienteUpdateModal = ({ clientData, onUpdate }) => {
  // State and Form Initialization
  const initialFormData = {
    id: clientData.id,
    identificacion: clientData.identificacion,
    primerNombre: clientData.primerNombre,
    segundoNombre: clientData.segundoNombre,
    apellidoPaterno: clientData.apellidoPaterno,
    apellidoMaterno: clientData.apellidoMaterno,
    telefono: clientData.telefono,
    correo: clientData.correo,
    ingresos: clientData.ingresos,
    dondeLabora: clientData.dondeLabora,
    direccion: clientData.direccion,
    estado: true,
  };
  const { formState, onInputChange, onResetForm } = useForm(initialFormData);

  // State for Modal and Notification
  const [validated, setValidated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  // Destructure formState
  const {
    id,
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

  // Notification functions
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

  // Form Submission
  const handleSubmit = async () => {
    setValidated(true);

    if (!formState.identificacion.trim()) {
      return;
    }

    try {
      const response = await axios.put(`${url}/${formState.id}`, formState);

      console.log(response.status);
      console.log(response.data);

      if (response.status === 201) {
        showNotification('¡El cliente ha sido actualizado!', 'success');

        if (typeof onUpdate === 'function') {
          onUpdate();
          setIsModalOpen(false);
        }
      } else {
        console.log('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <>
      <IconButton onClick={() => setIsModalOpen(true)}>
        <Icon color="primary" variant="contained">
          mode_edit
        </Icon>
      </IconButton>

      <Modal
        backdrop="static"
        className="modal-lg focus"
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
      >
        <SimpleCard title={'Actualizar cliente'} onClose={() => setIsModalOpen(!isModalOpen)}>
          <>
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
                  helperText={
                    validated && !formState.identificacion.trim() ? 'Campo obligatorio' : ''
                  }
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
                  helperText={
                    validated && !formState.primerNombre.trim() ? 'Campo obligatorio' : ''
                  }
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
                  helperText={
                    validated && !formState.apellidoPaterno.trim() ? 'Campo obligatorio' : ''
                  }
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
                  error={validated && !formState.ingresos}
                  helperText={validated && !formState.ingresos ? 'Campo obligatorio' : ''}
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
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  onResetForm();
                  setValidated(false);
                }}
              >
                Reset
              </Button>
              <Button className="ml-2" variant="contained" color="primary" onClick={handleSubmit}>
                Actualizar Cliente
              </Button>
            </Box>
          </>
        </SimpleCard>
        {/* Componente de notificación */}
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

ClienteUpdateModal.propTypes = {
  clientData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
  putData: PropTypes.func.isRequired,
};

export default ClienteUpdateModal;
