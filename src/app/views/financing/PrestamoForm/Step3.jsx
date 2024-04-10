import React, { useEffect } from 'react';
import { Grid, MenuItem, TextField, Tooltip } from '@mui/material';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const Step3 = ({ onInputChange, frecuenciaPago, formState, setFormState }) => {
  // Efecto para actualizar los campos adicionales según la frecuencia y la fecha de inicio de pago
  useEffect(() => {
    const fechaInicioPago = new Date(formState.fechaInicioPago);
    switch (formState.frecuencia) {
      case 'Mensual':
        setFormState((prevState) => ({
          ...prevState,
          diaDelMesEnNumero: fechaInicioPago.getDate().toString(), // Actualiza el día del mes
          nombreDiaSemana: '', // Reinicia el campo del día de la semana
        }));
        break;
      case 'Semanal':
        setFormState((prevState) => ({
          ...prevState,
          cadaCuantosDias: '',
          nombreDiaSemana: diasSemana[fechaInicioPago.getDay()], // Actualiza el día de la semana
          diaDelMesEnNumero: '', // Reinicia el campo del día del mes
        }));
        break;
      case 'Quincenal':
        setFormState((prevState) => ({
          ...prevState,
          cadaCuantosDias: '',
          nombreDiaSemana: '', // Reinicia el campo del día de la semana
          diaDelMesEnNumero: '', // Reinicia el campo del día del mes
        }));
        break;
      case 'Diario':
        setFormState((prevState) => ({
          ...prevState,
          nombreDiaSemana: '', // Reinicia el campo del día de la semana
          diaDelMesEnNumero: '', // Reinicia el campo del día del mes
        }));
        break;
      default:
        break;
    }
  }, [formState.frecuencia, formState.fechaInicioPago]);

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
          <Tooltip title={'Esta sera la fecha de vencimiento de la primera cuota'}>
            <TextField
              type="date"
              name="fechaInicioPago"
              label="La primera cuota vence"
              fullWidth
              required
              value={formState.fechaInicioPago}
              onChange={onInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={4}>
          <Tooltip title={'Solo se llena si la frecuencia esta en Dia'}>
            <TextField
              name="cadaCuantosDias"
              select
              label="Intervalo de día entre cada cuota"
              fullWidth
              value={formState.cadaCuantosDias}
              onChange={onInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem value="">Ninguno</MenuItem>
              {Array.from({ length: 28 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={4}>
          <Tooltip title={'Solo se llena si la frecuencia esta en semana'}>
            <TextField
              name="nombreDiaSemana"
              select
              label="El dia de cada semana"
              fullWidth
              value={formState.nombreDiaSemana}
              onChange={onInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem value="">Ninguno</MenuItem>
              {diasSemana.map((dia, index) => (
                <MenuItem key={index} value={dia}>
                  {dia}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={4}>
          <Tooltip title={'Solo se llena si la frecuencia esta en mese'}>
            <TextField
              name="diaDelMesEnNumero"
              select
              label="El dia de cada mes"
              fullWidth
              value={formState.diaDelMesEnNumero}
              onChange={onInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem value="">Ninguno</MenuItem>
              {Array.from({ length: 31 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default Step3;
