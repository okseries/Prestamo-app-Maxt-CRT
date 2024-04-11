import React, { useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Box, Button, Grid, IconButton, List, ListItem, Tooltip, Typography } from '@mui/material';
import { Done } from '@mui/icons-material';
import axios from 'axios';
import { GetPrestamoByID } from 'BaseURL';

const ModalConfirmarMora = ({
  action,
  Icono,
  titleCard,
  Title,
  color,
  handleModalOptionOK,
  closeModalOption,
  disabled,
  size,
  selectedRows,
}) => {
  const [isModalOpenModalOption, setIsModalOpenModalOption] = useState(false);
  const [tasaMora, setTasaMora] = useState(null);
  const [error, setError] = useState(null);
  const [estadox, setEstadox] = useState(true);

  const GenerarMora = () => {
    handleModalOptionOK();
    closeModal();
  };

  const fetchData = async () => {
    try {
      console.log('selectedRows dentro del fechtdata', selectedRows);
      console.log('selectedRows[0].idPrestamo', selectedRows[0].idPrestamo);
      const { data } = await axios.get(`${GetPrestamoByID}/${selectedRows[0].idPrestamo}`);
      setTasaMora(data.tasaPorcentaje);
    } catch (error) {
      setError('Error al obtener la tasa de mora. Inténtelo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    console.log('selectedRows dentro del useefect', selectedRows);
    if (selectedRows && selectedRows.length > 0) {
      fetchData();
      setEstadox(false);
    }
  }, [selectedRows]);

  const closeModal = () => {
    setIsModalOpenModalOption(false);
  };

  const hoy = new Date();

  const calcularDiasRestantes = (fechaActual, fechaVencimiento) => {
    const unDiaEnMs = 1000 * 60 * 60 * 24;
    const diferenciaEnMs = fechaVencimiento.getTime() - fechaActual.getTime();
    return Math.ceil(diferenciaEnMs / unDiaEnMs);
  };

  const calcularMoraPorCuota = (cuota, diasDeRetraso) => {
    const porcentajeMoraDiaria = tasaMora / 100;
    const montoPendiente = cuota.montoCuota - cuota.montoPagado;
    return montoPendiente * porcentajeMoraDiaria * diasDeRetraso;
  };

  const calcularMontoCuotaConMora = (cuota, montoMora) => {
    const montoRestante = cuota.montoCuota - cuota.montoPagado;
    return Math.ceil(montoRestante + montoMora);
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
        <SimpleCard title={titleCard} onClose={closeModal}>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h5" align="center" gutterBottom>
                Aplicar mora
              </Typography>
            </Grid>
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
                    const diasRestantes = calcularDiasRestantes(hoy, fechaVencimiento);
                    const estaVencida = diasRestantes < 0;
                    const colorTexto = estaVencida ? 'red' : 'green';
                    const montoMora = estaVencida
                      ? calcularMoraPorCuota(cuota, Math.abs(diasRestantes))
                      : 0;
                    const nuevoMontoCuota = estaVencida
                      ? calcularMontoCuotaConMora(cuota, montoMora)
                      : cuota.montoCuota;

                    let mensajeDias = '';
                    if (diasRestantes === 0) {
                      mensajeDias = 'Vence hoy';
                    } else if (estaVencida) {
                      mensajeDias = `Vencida hace ${Math.abs(diasRestantes)} día(s)`;
                    } else {
                      mensajeDias = `Faltan ${diasRestantes} día(s) para vencer`;
                    }

                    return (
                      <ListItem key={cuota.idCuota} style={{ color: colorTexto }}>
                        <Typography>
                          Cuota {cuota.numeroCuota}: {mensajeDias},
                          {estaVencida && ` monto de mora generado: ${montoMora}`}
                        </Typography>
                      </ListItem>
                    );
                  })
                )}
              </List>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button disabled={estadox} onClick={GenerarMora} color="primary">
              Aplicar Mora
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default ModalConfirmarMora;
