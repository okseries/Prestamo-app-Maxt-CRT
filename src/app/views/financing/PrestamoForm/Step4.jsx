import React, { useMemo } from 'react';
import { Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';
import Formatter from 'app/components/Formatter/Formatter';

const Step4 = ({ formState, onResetForm, handleSubmit }) => {
  // Función para verificar si todos los campos tienen información
  const isAnyFieldNull = useMemo(() => {
    return (
      formState.nombreCliente === null ||
      formState.identificacion === null ||
      formState.capital === null ||
      formState.tasaPorcentaje === null ||
      formState.porcentajeMora === null ||
      formState.tiempo === null ||
      formState.interes === null ||
      formState.monto === null ||
      formState.cuota === null ||
      formState.frecuencia === null ||
      formState.fechaInicioPago === null
    );
  }, [formState]);

  return (
    <>
      <Box p={3} textAlign={'center'}>
        <Typography variant="h6" align="center" gutterBottom>
          Detalles del Cliente
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Nombre del Cliente:"
              secondary={formState.nombreCliente ?? <span className="text-danger">*</span>}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Numero de Identificacion del Cliente:"
              secondary={formState.identificacion ?? <span className="text-danger">*</span>}
            />
          </ListItem>
        </List>
        <hr />
        <Typography variant="h6" align="center" gutterBottom>
          Detalles del Préstamo
        </Typography>
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Monto Prestado:"
                  secondary={`$ ${formState.capital}` ?? <span className="text-danger">*</span>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tasa de Interes:"
                  secondary={
                    `${formState.tasaPorcentaje}%` ?? <span className="text-danger">*</span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Porcentaje de mora por Dia:"
                  secondary={
                    `${formState.porcentajeMora}%` ?? <span className="text-danger">*</span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Duracion del Prestamo:"
                  secondary={formState.tiempo ?? <span className="text-danger">*</span>}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Interés Total:"
                  secondary={`$ ${formState.interes}` ?? <span className="text-danger">*</span>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Monto Total:"
                  secondary={`$ ${formState.monto}` ?? <span className="text-danger">*</span>}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Cuota Mensual:"
                  secondary={`$ ${formState.cuota}` ?? <span className="text-danger">*</span>}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        <hr />
        <Typography variant="h6" align="center" gutterBottom>
          Configuración del Préstamo
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Frecuencia de pago:"
              secondary={formState.frecuencia ?? <span className="text-danger">*</span>}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Fecha del primer Pago:"
              secondary={<Formatter value={formState.fechaInicioPago} type={'dateUTC'} />}
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Dia de la Semana:"
              secondary={formState.nombreDiaSemana ?? <span>No Aplica</span>}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Intervalo de días entre cada pago:"
              secondary={formState.cadaCuantosDias ?? <span>No Aplica</span>}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="El dia de cada mes:"
              secondary={formState.diaDelMesEnNumero ?? <span>No Aplica</span>}
            />
          </ListItem>
        </List>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button fullWidth variant="contained" color="warning" onClick={onResetForm}>
              Restablecer
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isAnyFieldNull} // Deshabilitar el botón si no todos los campos tienen información
            >
              Crear Préstamo
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Step4;
