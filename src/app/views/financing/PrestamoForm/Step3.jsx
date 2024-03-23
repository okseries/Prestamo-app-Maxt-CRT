import React from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const Step3 = ({ onInputChange, frecuenciaPago, formState }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12} md={6}>
        <TextField
          name="idFrecuencia"
          select
          label="Frecuencia de Pago"
          fullWidth
          required
          onChange={onInputChange}
          value={formState.idFrecuencia}
        >
          {frecuenciaPago.map((frecuencia) => (
            <MenuItem key={frecuencia.idFrecuencia} value={frecuencia.idFrecuencia}>
              {frecuencia.descripcion}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          type="date"
          name="fechaInicioPago"
          label="Fecha de la Primera Cuota"
          fullWidth
          required
          value={formState.fechaInicioPago}
          onChange={onInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="cadaCuantosDias"
          select
          label="Intervalo de día"
          fullWidth
          required
          value={formState.cadaCuantosDias}
          onChange={onInputChange}
        >
          {Array.from({ length: 28 }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              Cada ({index + 1}) Día
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="nombreDiaSemana"
          select
          label="Día de la semana"
          fullWidth
          required
          value={formState.nombreDiaSemana}
          onChange={onInputChange}
        >
          {diasSemana.map((dia, index) => (
            <MenuItem key={index} value={index + 1}>
              {dia}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="diaDelMesEnNumero"
          select
          label="Día del mes"
          fullWidth
          required
          value={formState.diaDelMesEnNumero}
          onChange={onInputChange}
        >
          {Array.from({ length: 28 }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              El día ({index + 1}) de cada mes
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  </>
);

export default Step3;
