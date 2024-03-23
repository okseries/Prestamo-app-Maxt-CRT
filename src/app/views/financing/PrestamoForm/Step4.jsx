import React from 'react';
import { Box, Button, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

const Step4 = ({ formState, onResetForm, handleSubmit }) => (
  <>
    <Box p={3} textAlign={'center'}>
      <Typography variant="h6" align="center" gutterBottom>
        Detalles del Cliente
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Nombre del Cliente:" secondary={formState.nombreCliente} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Numero de Identificacion del Cliente:"
            secondary={formState.identificacion}
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
              <ListItemText primary="Monto Prestado:" secondary={formState.capital} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Tasa de Interes:" secondary={formState.tasaPorcentaje} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Porcentaje de mora por Dia:"
                secondary={formState.porcentajeMora}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Duracion del Prestamo:" secondary={formState.tiempo} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <List>
            <ListItem>
              <ListItemText primary="Interés Total:" secondary={formState.interes} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Monto Total:" secondary={formState.monto} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cuota Mensual:" secondary={formState.cuota} />
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
          <ListItemText primary="Frecuencia de pago:" secondary={'Pago mensual'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Fecha del primer Pago:" secondary={formState.fechaInicioPago} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Dia de la Semana:" secondary={formState.nombreDiaSemana} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Intervalo de días entre cada pago:" secondary={'No aplica'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Día de vencimiento:" secondary={formState.fechaInicioPago} />
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Button fullWidth variant="contained" color="warning" onClick={onResetForm}>
            Restablecer
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
            Crear Préstamo
          </Button>
        </Grid>
      </Grid>
    </Box>
  </>
);

export default Step4;
