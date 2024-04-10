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

  const closeModal = () => {
    setIsModalOpenModalOption(false);
  };

  const handleClickOk = () => {
    handleModalOptionOK();
    closeModal();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hoy = new Date();
  // Aquí incluir las funciones de cálculo
  const calcularDiasRestantes = (fechaActual, fechaVencimiento) => {
    const unDiaEnMs = 1000 * 60 * 60 * 24;
    const diferenciaEnMs = fechaVencimiento.getTime() - fechaActual.getTime();
    return Math.ceil(diferenciaEnMs / unDiaEnMs);
  };

  const calcularMoraPorCuota = (cuota, diasDeRetraso) => {
    const porcentajeMoraDiaria = tasaMora / 100; // Tasa de mora por día
    const montoPendiente = cuota.montoCuota - cuota.montoPagado;
    return montoPendiente * porcentajeMoraDiaria * diasDeRetraso;
  };

  const calcularMontoCuotaConMora = (cuota, montoMora) => {
    const montoRestante = cuota.montoCuota - cuota.montoPagado;
    return Math.ceil(montoRestante + montoMora);
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${GetPrestamoByID}/${selectedRows[0].idPrestamo}`);
      setTasaMora(data.tasaPorcentaje);
    } catch (error) {
      console.log(error);
    }
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
        <SimpleCard
          title={titleCard}
          subtitle={`¿Estás seguro de que quieres ${action}?`}
          onClose={() => closeModal()}
        >
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h5" align="center" gutterBottom>
                Aplicar mora
              </Typography>
            </Grid>
            <Grid item>
              <List>
                {selectedRows &&
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
                      mensajeDias = `Vencida hace ${Math.abs(diasRestantes)} día`;
                    } else {
                      mensajeDias = `Faltan ${diasRestantes} días para vencer`;
                    }

                    return (
                      <ListItem key={cuota.idCuota} style={{ color: colorTexto }}>
                        <Typography>
                          Cuota {cuota.numeroCuota}: {mensajeDias},
                          {estaVencida && ` monto de mora generado: ${montoMora}`}
                        </Typography>
                      </ListItem>
                    );
                  })}
              </List>
            </Grid>
          </Grid>
          <Button onClick={fetchData}>Ver detalle</Button>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleClickOk} color="primary" startIcon={<Done />}>
              Ok
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default ModalConfirmarMora;
