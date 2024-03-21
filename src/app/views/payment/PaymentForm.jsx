import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Modal } from 'reactstrap';
import { useForm } from 'app/hooks/useForm';
import { AttachMoney } from '@mui/icons-material';
import axios from 'axios';
import { PagarCuotaURL } from 'BaseURL';

const PaymentForm = ({ btnText, selectedRows }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    idCuota: [],
    montoPagado: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setFormState(selectedRows);
    if (Array.isArray(selectedRows)) {
      // Verifica si selectedRows es un array antes de llamar a calculateTotalAmount
      calculateTotalAmount(selectedRows);
    }
  }, [selectedRows]);

  const calculateTotalAmount = (rows) => {
    const total = rows.reduce((acc, cuota) => acc + parseFloat(cuota.montoCuota), 0);
    setTotalAmount(total);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onResetForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const idsCuotas = selectedRows.map((cuota) => cuota.idCuota); // Obtener los IDs de las cuotas
      const pagarCuotaData = { idCuota: idsCuotas, montoPagado: 175 }; // Crear el objeto de datos para enviar
      const { data, status } = await axios.put(PagarCuotaURL, pagarCuotaData); // Enviar los datos mediante Axios
      alert(data);
      alert(status);
      console.log('pagarCuotaData', pagarCuotaData);
    } catch (error) {
      console.error('Error al pagar cuotas:', error);
    }
  };

  return (
    <>
      {/* Botón de acción para abrir el modal */}
      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={<AttachMoney />}
        onClick={() => setIsModalOpen(true)}
      >
        {btnText}
      </Button>

      {/* Modal para pagar cuotas */}
      <Modal isOpen={isModalOpen} toggle={closeModal} backdrop="static" className="modal-lg">
        <Box p={3}>
          <Typography variant="h5" align="center" gutterBottom>
            Detalles del Pago
          </Typography>
          <List>
            {selectedRows &&
              selectedRows.map((cuota) => (
                <ListItem key={cuota.idCuota}>
                  <ListItemText
                    primary={`Cuota #${cuota.numeroCuota}`}
                    secondary={`Fecha de Vencimiento: ${cuota.fechaCuota}`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body1" color="primary">
                      {/*formatCurrency*/ cuota.montoCuota} {/* Formatear el monto de la cuota */}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            <ListItem>
              <ListItemText primary="Total a Pagar" />
              <ListItemSecondaryAction>
                <Typography variant="body1" color="primary">
                  {/*formatCurrency*/ totalAmount} {/* Muestra el monto total */}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <TextField
            name="montoPago"
            label="Monto del Pago"
            fullWidth
            required
            value={formState?.montoPagado}
            onChange={onInputChange}
          />
          <Grid container justifyContent="flex-end" marginTop={5}>
            <Button variant="contained" color="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: 8 }}
              onClick={handleSubmit}
            >
              Pagar
            </Button>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default PaymentForm;
