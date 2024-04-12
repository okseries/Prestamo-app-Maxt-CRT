import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';
import { ContainerComp } from 'app/components/ContainerComp';

const CalculadoraMora = ({ clientData }) => {
  const initialFormData = {
    montoCuota: '',
    fechaCuota: '',
    fechaActual: '',
    diasAtraso: '',
    tasaMoraPorcentaje: '',
  };

  const { formState, onInputChange, onResetForm, setFormState } = useForm(initialFormData);
  const [validated, setValidated] = useState(false);
  const [montoMora, setMontoMora] = useState('');

  useEffect(() => {
    calcularMora();
    console.log(formState);
  }, [
    formState.montoCuota,
    formState.diasAtraso,
    formState.tasaMoraPorcentaje,
    formState.fechaCuota,
    formState.fechaActual,
  ]);

  const calcularMora = () => {
    try {
      const montoCuota = parseFloat(formState.montoCuota);
      const diasAtraso = calcularDiasDeRetraso();
      const tasaMoraPorcentaje = parseFloat(formState.tasaMoraPorcentaje) / 100;

      const montoMora = montoCuota * tasaMoraPorcentaje * diasAtraso;

      setMontoMora(montoMora.toFixed(2));
    } catch (error) {
      console.error(error.message || 'Error al calcular la mora');
    }
  };

  const calcularDiasDeRetraso = () => {
    const fechaCuota = new Date(formState.fechaCuota);
    const fechaActual = new Date(formState.fechaActual);

    if (fechaCuota && fechaActual) {
      const unDiaEnMs = 1000 * 60 * 60 * 24;
      const diferenciaEnMs = fechaActual.getTime() - fechaCuota.getTime();
      const cantidadDias = Math.max(0, Math.floor(diferenciaEnMs / unDiaEnMs));
      setFormState((prevState) => ({ ...prevState, diasAtraso: cantidadDias.toString() }));
      return cantidadDias;
    } else {
      return '';
    }
  };

  return (
    <>
      <SimpleCard title={'Calcular Mora'}>
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                name="montoCuota"
                value={formState.montoCuota}
                label="Monto de la cuota"
                onChange={onInputChange}
                required
                fullWidth
                error={validated && !formState.montoCuota.trim()}
                helperText={validated && !formState.montoCuota.trim() ? 'Campo obligatorio' : ''}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="tasaMoraPorcentaje"
                value={formState.tasaMoraPorcentaje}
                label="Tasa de Mora (%)"
                onChange={onInputChange}
                required
                fullWidth
                error={validated && !formState.tasaMoraPorcentaje.trim()}
                helperText={
                  validated && !formState.tasaMoraPorcentaje.trim() ? 'Campo obligatorio' : ''
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                name="fechaCuota"
                value={formState.fechaCuota}
                label="Fecha de Vencimiento"
                onChange={onInputChange}
                required
                fullWidth
                error={validated && !formState.fechaCuota.trim()}
                helperText={validated && !formState.fechaCuota.trim() ? 'Campo obligatorio' : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                name="fechaActual"
                value={formState.fechaActual}
                label="Fecha Actual / de Comparacion"
                onChange={onInputChange}
                required
                fullWidth
                error={validated && !formState.fechaActual.trim()}
                helperText={validated && !formState.fechaActual.trim() ? 'Campo obligatorio' : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="diasAtraso"
                value={formState.diasAtraso}
                label="Cantidad de días en atraso"
                onChange={onInputChange}
                required
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="montoMora"
                value={montoMora}
                label="Monto de la mora"
                onChange={onInputChange}
                required
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <hr />
          <Button
            style={{ alignSelf: 'flex-end' }}
            onClick={() => {
              setMontoMora('');
              onResetForm();
            }}
            className="ml-2"
          >
            Resetear
          </Button>
        </>
      </SimpleCard>
    </>
  );
};

export default CalculadoraMora;
