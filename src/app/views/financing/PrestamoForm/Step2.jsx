import React, { useEffect } from 'react';
import { Grid, TextField } from '@mui/material';

const Step2 = ({ onInputChange, formState, setFormState }) => {
  useEffect(() => {
    calculateLoanDetails();
  }, [formState.capital, formState.tasaPorcentaje, formState.tiempo]);

  const calculateLoanDetails = () => {
    const capital = parseFloat(formState.capital);
    const tasaPorcentaje = parseFloat(formState.tasaPorcentaje);
    const tiempo = parseFloat(formState.tiempo);

    if (!isNaN(capital) && !isNaN(tasaPorcentaje) && !isNaN(tiempo)) {
      const interes = (capital * tasaPorcentaje * tiempo) / 100;
      const monto = capital + interes;
      const cuota = Math.ceil(monto / tiempo);

      setFormState((prevState) => ({
        ...prevState,
        interes: interes.toFixed(2),
        monto: monto.toFixed(2),
        cuota: cuota.toFixed(2),
      }));
    }
  };

  return (
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
            disabled
            value={formState.interes}
            onChange={onInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="monto"
            label="Monto del Prestamo"
            fullWidth
            type="number"
            required
            disabled
            value={formState.monto}
            onChange={onInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="cuota"
            label="Cuota"
            fullWidth
            type="number"
            required
            disabled
            value={formState.cuota}
            onChange={onInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Step2;
