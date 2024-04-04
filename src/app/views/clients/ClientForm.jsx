import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Box, MenuItem } from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';
import { ActualizarClienteURL, CrearClienteURL } from 'BaseURL';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';

const ClientForm = ({ startIcon, TextBtn, selectedRows, setSelectedRows, listarClientes }) => {
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    idCliente: '',
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
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  useEffect(() => {
    setFormState(selectedRows);
  }, [selectedRows]);

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

  const closeModal = () => {
    setIsModalOpen(false);
    onResetForm();
  };

  const handleSubmit = async () => {
    if (formState.idCliente === undefined) {
      await createUserData();
    } else {
      await updateUserData();
    }
  };

  const createUserData = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, status } = await axiosInstance.post(CrearClienteURL, formState);
      if (status === 200) {
        showNotification(`$Cliente creado!`, 'success');
        listarClientes();
        closeModal();
      } else {
        showNotification(`${data.message}`, 'error');
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
  };

  const updateUserData = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, status } = await axiosInstance.put(
        `${ActualizarClienteURL}/${formState.idCliente}`,
        formState
      );
      if (status === 200) {
        listarClientes();
        closeModal();
        showNotification(`Cliente actualizado!`, 'success');
      } else {
        showNotification(`${data.message}`, 'error');
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
  };

  return (
    <>
      {/* Botón de acción para abrir el modal */}
      <Button size="large" onClick={() => setIsModalOpen(true)} startIcon={startIcon}>
        {TextBtn}
      </Button>
      {/* Modal para crear y actualizar clientes */}
      <Modal isOpen={isModalOpen} toggle={closeModal} backdrop="static" className="modal-lg">
        <SimpleCard
          title={formState.idCliente ? 'Actualizar Cliente' : 'Crear Cliente'}
          onClose={closeModal}
        >
          <div style={{ maxHeight: '90vh', overflowY: 'auto', paddingTop: '8px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="identificacion"
                  label="Cédula"
                  fullWidth
                  required
                  value={formState.identificacion ? formState.identificacion : ''}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="primerNombre"
                  label="Primer Nombre"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.primerNombre}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="segundoNombre"
                  label="Segundo Nombre"
                  fullWidth
                  onChange={onInputChange}
                  value={formState.segundoNombre}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="apellidoPaterno"
                  label="Apellido Paterno"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.apellidoPaterno}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="apellidoMaterno"
                  label="Apellido Materno"
                  fullWidth
                  onChange={onInputChange}
                  value={formState.apellidoMaterno}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="telefono"
                  label="Teléfono"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.telefono}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="correo"
                  label="Correo"
                  fullWidth
                  onChange={onInputChange}
                  value={formState.correo}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="ingresos"
                  label="Ingresos Netos"
                  type="number"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.ingresos}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="dondeLabora"
                  label="Dónde Labora"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.dondeLabora}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="estado"
                  select
                  label="Estado"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.estado}
                >
                  <MenuItem value={true}>Activo</MenuItem>
                  <MenuItem value={false}>Inactivo</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="direccion"
                  label="Dirección"
                  fullWidth
                  required
                  onChange={onInputChange}
                  value={formState.direccion}
                />
              </Grid>
            </Grid>

            {/* Botones para resetear y actualizar cliente */}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" color="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 8 }}
                onClick={handleSubmit}
              >
                {formState.idCliente ? 'Actualizar' : 'Registrar'}
              </Button>
            </Box>
          </div>
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

export default ClientForm;
