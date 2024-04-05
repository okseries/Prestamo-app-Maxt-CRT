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
import Formatter from 'app/components/Formatter/Formatter';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';

const PaymentForm = ({ btnText, selectedRows, refrescarFinanciamientos, clearSelectedRows }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    idCuota: [],
    montoPagado: null,
  });
  const [isModalOpenPaymentForm, setIsModalOpenPaymentForm] = useState(false);
  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

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

  const openeModal = () => {
    setIsModalOpenPaymentForm(true);
  };

  const closeModalPaymentForm = () => {
    setIsModalOpenPaymentForm(false);
    onResetForm();
    clearSelectedRows();
  };

  const handleSubmit = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const idsCuotas = selectedRows.map((cuota) => cuota.idCuota); // Obtener los IDs de las cuotas
      const pagarCuotaData = {
        idCuota: idsCuotas,
        montoPagado: parseFloat(formState.montoPagado.toString()),
      }; // Crear el objeto de datos para enviar
      const { data, status } = await axiosInstance.put(PagarCuotaURL, pagarCuotaData); // Enviar los datos mediante Axios

      if (status === 200) {
        refrescarFinanciamientos();
        closeModalPaymentForm();
      } else {
        console.log(data);
      }
      console.log('pagarCuotaData', pagarCuotaData);
      console.log('formState', formState);
    } catch (error) {
      console.error('Error al pagar cuotas:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenPaymentForm(true);
      }
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
        onClick={openeModal}
      >
        {btnText}
      </Button>

      {/* Modal para pagar cuotas */}
      <Modal
        isOpen={isModalOpenPaymentForm}
        toggle={closeModalPaymentForm}
        backdrop="static"
        className="modal-lg"
      >
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
                    secondary={
                      <span>
                        Fecha de Vencimiento: <Formatter value={cuota.fechaCuota} type="dateUTC" />
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="body1" color="primary">
                      {<Formatter value={cuota.montoCuota - cuota.montoPagado} type="currency" />}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            <ListItem>
              <ListItemText primary="Total a Pagar" />
              <ListItemSecondaryAction>
                <Typography variant="body1" color="primary">
                  {<Formatter value={totalAmount} type={'currency'} />}
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
            <Button variant="contained" color="secondary" onClick={closeModalPaymentForm}>
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
      <SessionFinishModal
        isOpen={isModalOpenSessionFinishModal}
        closeModalSesion={closeModalSesion}
        title={'Sesión Terminada'}
      />
    </>
  );
};

export default PaymentForm;
