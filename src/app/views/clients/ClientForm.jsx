import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Box } from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';

const ClientForm = ({ startIcon, TextBtn, selectedRows, setSelectedRows }) => {
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    idCliente: null,
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
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setFormState(selectedRows);
  }, [selectedRows]);

  const closeModal = () => {
    setIsModalOpen(false);
    onResetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    formState.idCliente !== null ? await updateUserData() : await createUserData();
  };

  const createUserData = async () => {
    try {
      alert('createUserData');
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserData = async () => {
    try {
      alert('updateUserData');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Botón de acción para abrir el modal */}
      <Button size="small" onClick={() => setIsModalOpen(true)} startIcon={startIcon}>
        {TextBtn}
      </Button>

      {/* Modal para crear y actualizar clientes */}
      <Modal isOpen={isModalOpen} toggle={closeModal} backdrop="static" className="modal-lg">
        <SimpleCard title={'Actualizar Cliente'} onClose={closeModal}>
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
                  required
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
                {formState.idCliente !== null ? 'Actualizar' : 'Registrar'}
              </Button>
            </Box>
          </div>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default ClientForm;
