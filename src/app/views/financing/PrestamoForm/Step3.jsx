import React from 'react';
import { Grid, MenuItem, TextField } from '@mui/material';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Step3 = ({ onInputChange, frecuenciaPago, formState, setFormState }) => {
  const handleFrecuenciaChange = (event) => {
    const { name, value } = event.target;
    const selectedFrecuencia = frecuenciaPago.find(
      (frecuencia) => frecuencia.idFrecuencia === value
    );
    onInputChange(event); // Actualiza otros campos si es necesario
    setFormState((prevState) => ({
      ...prevState,
      [name]: value, // Actualiza el ID de la frecuencia
      frecuencia: selectedFrecuencia.descripcion, // Actualiza el nombre de la frecuencia
    }));
  };

  return (
    <>
      <Grid container spacing={2} paddingTop={2}>
        <Grid item xs={12} md={6}>
          <TextField
            name="idFrecuencia"
            select
            label="Frecuencia de Pago"
            fullWidth
            required
            onChange={handleFrecuenciaChange}
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
            label="Intervalo de día entre cada cuota"
            fullWidth
            value={formState.cadaCuantosDias}
            onChange={onInputChange}
          >
            <MenuItem value="">Ninguno</MenuItem>
            {Array.from({ length: 28 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="nombreDiaSemana"
            select
            label="El dia de cada semana"
            fullWidth
            value={formState.nombreDiaSemana}
            onChange={onInputChange}
          >
            <MenuItem value="">Ninguno</MenuItem>
            {diasSemana.map((dia, index) => (
              <MenuItem key={index} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="diaDelMesEnNumero"
            select
            label="El dia de cada mes"
            fullWidth
            value={formState.diaDelMesEnNumero}
            onChange={onInputChange}
          >
            <MenuItem value="">Ninguno</MenuItem>
            {Array.from({ length: 31 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default Step3;
