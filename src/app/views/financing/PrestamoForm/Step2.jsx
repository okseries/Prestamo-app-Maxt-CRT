import React from 'react';
import { Grid, TextField } from '@mui/material';

const Step2 = ({ onInputChange, onPrevStep, onNextStep, formState }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12} md={3}>
        <TextField
          name="capital"
          label="Capital"
          fullWidth
          type="number"
          required
          value={formState.capital}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          name="tasaPorcentaje"
          label="Tasa de Interes (%)"
          fullWidth
          type="number"
          required
          value={formState.tasaPorcentaje}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          name="porcentajeMora"
          label="Mora Diaria (%)"
          fullWidth
          type="number"
          required
          value={formState.porcentajeMora}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          name="tiempo"
          label="Tiempo"
          fullWidth
          type="number"
          required
          value={formState.tiempo}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="interes"
          label="Interes"
          fullWidth
          type="number"
          required
          value={formState.interes}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="monto"
          label="Monto del Prestamo"
          fullWidth
          type="number"
          required
          value={formState.monto}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="cuota"
          label="Cuota"
          fullWidth
          type="number"
          required
          value={formState.cuota}
          onChange={onInputChange}
        />
      </Grid>
    </Grid>
  </>
);

export default Step2;
