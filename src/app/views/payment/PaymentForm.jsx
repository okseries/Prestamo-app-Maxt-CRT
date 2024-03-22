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
    montoPagado: null,
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
    const totalMontoCuotas = rows.reduce((sum, cuota) => {
      const montoCuota = parseFloat(cuota.montoCuota.toString());
      const montoPagado = parseFloat(cuota.montoPagado?.toString() ?? '0');
      return sum + (montoCuota - montoPagado); // Restar el monto ya pagado del monto total de la cuota
    }, 0);
    setTotalAmount(totalMontoCuotas);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onResetForm();
  };

  const handleSubmit = async () => {
    try {
      const idsCuotas = selectedRows.map((cuota) => cuota.idCuota); // Obtener los IDs de las cuotas
      const pagarCuotaData = {
        idCuota: idsCuotas,
        montoPagado: parseFloat(formState.montoPagado.toString()),
      }; // Crear el objeto de datos para enviar
      const { data, status } = await axios.put(PagarCuotaURL, pagarCuotaData); // Enviar los datos mediante Axios

      if (status === 200) {
        closeModal();
      } else {
        console.log(data);
      }
      console.log('pagarCuotaData', pagarCuotaData);
      console.log('formState', formState);
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
                      {/*formatCurrency*/ cuota.montoCuota - cuota.montoPagado}{' '}
                      {/* Formatear el monto de la cuota */}
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
            name="montoPagado"
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
