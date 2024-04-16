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
  IconButton,
  Tooltip,
} from '@mui/material';
import { Modal } from 'reactstrap';
import { useForm } from 'app/hooks/useForm';
import { MonetizationOn } from '@mui/icons-material';
import axios from 'axios';
import { PagarCuotaURL } from 'BaseURL';
import Formatter from 'app/components/Formatter/Formatter';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';

const PaymentForm = ({
  notificacionPagoRealizado,
  selectedRows,
  refrescarFinanciamientos,
  clearSelectedRows,
  disabled,
}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    idCuota: [],
    idMora: [],
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
      calculateTotalAmount(selectedRows);
    }
  }, [selectedRows]);

  const calculateTotalAmount = (rows) => {
    let totalMontoCuotas = 0;

    rows.forEach((cuota) => {
      const montoCuota = parseFloat(cuota.montoCuota);
      const montoPagado = parseFloat(cuota.montoPagado ?? '0');
      const montoMora =
        cuota.mora.length > 0 && !cuota.mora[0].pagada ? parseFloat(cuota.mora[0].montoMora) : 0;

      totalMontoCuotas += montoCuota - montoPagado + montoMora;
    });

    setTotalAmount(Math.ceil(totalMontoCuotas.toFixed(2)));
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
      const storedToken = localStorage.getItem('accessToken');
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const idsCuotas = selectedRows.map((cuota) => cuota.idCuota);
      const idsMoras = selectedRows.map((mora) =>
        mora.mora.length > 0 ? mora.mora[0].idMora : null
      );
      const pagarCuotaData = {
        idCuota: idsCuotas,
        idMora: idsMoras,
        montoPagado: parseFloat(formState.montoPagado.toString()),
      };

      const { data, status } = await axiosInstance.put(PagarCuotaURL, pagarCuotaData);
      if (status === 200) {
        refrescarFinanciamientos();
        closeModalPaymentForm();
        notificacionPagoRealizado();
      } else {
      }
    } catch (error) {
      console.error('Error al pagar cuotas:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenPaymentForm(true);
      }
    }
  };

  return (
    <>
      <Tooltip title={'Pagar cuotas'}>
        <IconButton disabled={disabled} color="success" onClick={openeModal}>
          <MonetizationOn />
        </IconButton>
      </Tooltip>

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
                <React.Fragment key={cuota.idCuota}>
                  <ListItem>
                    <ListItemText
                      primary={`Cuota #${cuota.numeroCuota}`}
                      secondary={
                        <span>
                          Fecha de Vencimiento:{' '}
                          <Formatter value={cuota.fechaCuota} type="dateUTC" />
                        </span>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body1" color="primary">
                        {<Formatter value={cuota.montoCuota - cuota.montoPagado} type="currency" />}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {cuota.mora.length > 0 && (
                    <ListItem>
                      <ListItemText
                        primary="Detalles de Mora"
                        secondary={
                          <span>Día(s) de retraso: {`${cuota.mora[0].diasDeRetraso}`}</span>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="body1" color="error">
                          {<Formatter value={cuota.mora[0].montoMora} type="currency" />}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </React.Fragment>
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
