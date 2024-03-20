import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography } from '@mui/material';
import { Modal } from 'reactstrap';
import { Add } from '@mui/icons-material';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';

const ClientForm = () => {
  const { formState, onInputChange, onResetForm } = useForm([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Botón de acción para abrir el modal */}
      <Button size="small" onClick={() => setIsModalOpen(true)} startIcon={<Add color="success" />}>
        Agregar Cliente
      </Button>

      {/* Modal para crear y actualizar clientes */}
      <Modal isOpen={isModalOpen} toggle={closeModal} backdrop="static" className="modal-lg">
        <SimpleCard title="Actualizar cliente" onClose={closeModal}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField name="identificacion" label="Cédula" fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="primerNombre" label="Primer Nombre" fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="segundoNombre" label="Segundo Nombre" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="apellidoPaterno" label="Apellido Paterno" fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="apellidoMaterno" label="Apellido Materno" fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="telefono" label="Teléfono" fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="correo" label="Correo" fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="ingresos" label="Ingresos Netos" type="number" fullWidth required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField name="dondeLabora" label="Dónde Labora" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="direccion" label="Dirección" fullWidth required />
            </Grid>
          </Grid>

          {/* Botones para resetear y actualizar cliente */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" style={{ marginLeft: 8 }}>
              Actualizar Cliente
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default ClientForm;
