import React, { useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { Done } from '@mui/icons-material';
import axios from 'axios';
import { GenerarMoraURL, GetPrestamoByID } from 'BaseURL';
import Formatter from '../Formatter/Formatter';

const ModalConfirmarMora = ({
  action,
  Icono,
  titleCard,
  Title,
  color,
  listarPrestamos,
  closeModalOption,
  disabled,
  size,
  selectedRows,
  clearSelectedRows,
}) => {
  const [isModalOpenModalOption, setIsModalOpenModalOption] = useState(false);
  const [tasaMora, setTasaMora] = useState(null);
  const [error, setError] = useState(null);
  const [umbralDiasPago, setUmbralDiasPago] = useState(null);
  const [estadox, setEstadox] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${GetPrestamoByID}/${selectedRows[0].idPrestamo}`);
      setTasaMora(data.tasaPorcentaje);
      setUmbralDiasPago(data.umbralDiasPago);
    } catch (error) {
      setError('Error al obtener la información del préstamo. Inténtelo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (selectedRows && selectedRows.length > 0) {
      fetchData();
      setEstadox(false);
    }
  }, [selectedRows]);

  const hoy = new Date();

  const calcularDiasDeRetraso = (fechaActual, fechaVencimiento) => {
    const unDiaEnMs = 1000 * 60 * 60 * 24;
    const diferenciaEnMs = fechaActual.getTime() - fechaVencimiento.getTime();
    return Math.max(0, Math.floor(diferenciaEnMs / unDiaEnMs));
  };

  const calcularMoraPorCuota = (cuota, diasDeRetraso) => {
    const porcentajeMoraDiaria = tasaMora / 100;
    const montoPendiente = cuota.montoCuota - cuota.montoPagado;

    console.log('*****************datos***********************');
    console.log(porcentajeMoraDiaria);
    console.log(montoPendiente);
    console.log(montoPendiente * porcentajeMoraDiaria * diasDeRetraso);
    return montoPendiente * porcentajeMoraDiaria * diasDeRetraso;
  };

  return (
    <>
      <Tooltip title={Title}>
        <IconButton
          size={size}
          disabled={disabled}
          color={color}
          onClick={() => setIsModalOpenModalOption(true)}
        >
          {Icono}
        </IconButton>
      </Tooltip>

      <Modal all backdrop="static" className="modal-lx focus" isOpen={isModalOpenModalOption}>
        <SimpleCard title={titleCard} onClose={false}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <List>
                {error ? (
                  <ListItem>
                    <Typography variant="body1" color="error">
                      {error}
                    </Typography>
                  </ListItem>
                ) : (
                  selectedRows &&
                  selectedRows.map((cuota) => {
                    const fechaVencimiento = new Date(cuota.fechaCuota);
                    const diasDeRetraso = calcularDiasDeRetraso(hoy, fechaVencimiento);
                    const estaVencida = diasDeRetraso > 0;
                    const dentroDelUmbral = diasDeRetraso <= umbralDiasPago;
                    const moraGenerada = cuota.mora && cuota.mora.length > 0;

                    if (moraGenerada) {
                      return (
                        <ListItem key={cuota.idCuota}>
                          <ListItemText primary={`Cuota #${cuota.numeroCuota}: Mora ya generada`} />
                        </ListItem>
                      );
                    }

                    if (cuota.estado === 'Pagado') {
                      return (
                        <ListItem key={cuota.idCuota}>
                          <ListItemText primary={`Cuota #${cuota.numeroCuota}: Estado - Pagado`} />
                        </ListItem>
                      );
                    }

                    if (dentroDelUmbral) {
                      return (
                        <ListItem key={cuota.idCuota}>
                          <ListItemText
                            primary={`Cuota #${cuota.numeroCuota}: Vencida pero dentro del umbral`}
                          />
                        </ListItem>
                      );
                    }

                    if (!estaVencida) {
                      const diasParaVencer = Math.abs(diasDeRetraso); // Considerar días para adelante
                      return (
                        <ListItem key={cuota.idCuota}>
                          <ListItemText
                            primary={`Cuota #${cuota.numeroCuota}: Vence en ${diasParaVencer} día(s)`}
                          />
                        </ListItem>
                      );
                    }

                    const montoMora = calcularMoraPorCuota(cuota, diasDeRetraso);

                    return (
                      <ListItem key={cuota.idCuota}>
                        <ListItemText
                          primary={`Cuota #${cuota.numeroCuota}: Vencida hace ${diasDeRetraso} día(s)`}
                          secondary={
                            <Typography variant="body1">
                              <Formatter value={montoMora} type="currency" />
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })
                )}
              </List>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button disabled={estadox} onClick={null} color="warning">
              Sí, aplicar Mora
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => {
                setIsModalOpenModalOption(false);
              }}
            >
              Cancelar
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default ModalConfirmarMora;
