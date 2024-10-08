import React, { useEffect, useState } from 'react';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';
import { ContainerComp } from 'app/components/ContainerComp';

const Calculadora = ({ clientData }) => {
  const initialFormData = {
    capital: '',
    tasaPorcentaje: '',
    tiempo: '',
    interes: '',
    monto: '',
    frecuenciaPago: '',
    fechaInicio: '',
    cuota: '',
  };

  const { formState, onInputChange, onResetForm } = useForm(initialFormData);
  const [validated, setValidated] = useState(false);

  const [interes, setInteres] = useState('');
  const [monto, setMonto] = useState('');
  const [cuota, setCuota] = useState('');

  useEffect(() => {
    calcularPrestamo();
  }, [formState.capital, formState.tasaPorcentaje, formState.tiempo]);

  const calcularPrestamo = () => {
    try {
      const requiredFields = [
        'capital',
        'tasaPorcentaje',
        'tiempo',
        'frecuenciaPago',
        'fechaInicio',
      ];

      const areFieldsEmpty = requiredFields.some((field) => !formState[field]?.trim());

      if (areFieldsEmpty) {
        setValidated(true);
        //showNotification('Uno o más campos son obligatorios', 'error');
        return;
      }

      const calculatedInteres = (
        Number(formState.capital) *
        (Number(formState.tasaPorcentaje) / 100) *
        Number(formState.tiempo)
      ).toFixed(2);

      const calculatedMonto = (Number(formState.capital) + Number(calculatedInteres)).toFixed(2);

      const calculatedCuota = (Number(calculatedMonto) / Number(formState.tiempo)).toFixed(2);

      setInteres(calculatedInteres);
      setMonto(calculatedMonto);
      setCuota(calculatedCuota);
    } catch (error) {
      console.error(error.message || 'Error al calcular prestamo');
    }
  };

  return (
    <ContainerComp>
      <SimpleCard title={'Crear prestamo'}>
        <>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="frecuenciaPago"
                  select
                  label="Frecuencia de pago"
                  onChange={onInputChange}
                  required
                  fullWidth
                  error={validated && !formState.frecuenciaPago.trim()}
                  helperText={
                    validated && !formState.frecuenciaPago.trim() ? 'Campo obligatorio' : ''
                  }
                >
                  <MenuItem value={'Días'}>Días</MenuItem>
                  <MenuItem value={'Semanas'}>Semanas</MenuItem>
                  <MenuItem value={'Quincenas'}>Quincenas</MenuItem>
                  <MenuItem value={'Meses'}>Meses</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="fechaInicio"
                  type="date"
                  label="Fecha inicio"
                  required
                  fullWidth
                  value={formState.fechaInicio}
                  onChange={onInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={validated && !formState.fechaInicio.trim()}
                  helperText={validated && !formState.fechaInicio.trim() ? 'Campo obligatorio' : ''}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="capital"
                  value={formState.capital}
                  label="Capital"
                  onChange={onInputChange}
                  required
                  fullWidth
                  error={validated && !formState.capital.trim()}
                  helperText={validated && !formState.capital.trim() ? 'Campo obligatorio' : ''}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="tasaPorcentaje"
                  value={formState.tasaPorcentaje}
                  label="Tasa en %"
                  onChange={onInputChange}
                  required
                  fullWidth
                  error={validated && !formState.tasaPorcentaje.trim()}
                  helperText={
                    validated && !formState.tasaPorcentaje.trim() ? 'Campo obligatorio' : ''
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="tiempo"
                  value={formState.tiempo}
                  label="Tiempo"
                  onChange={onInputChange}
                  required
                  fullWidth
                  error={validated && !formState.tiempo.trim()}
                  helperText={validated && !formState.tiempo.trim() ? 'Campo obligatorio' : ''}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="interes"
                  value={interes}
                  label="Interés"
                  onChange={onInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="monto"
                  value={monto}
                  label="Monto"
                  onChange={onInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  name="cuota"
                  value={cuota}
                  label="Cuota"
                  onChange={onInputChange}
                  required
                  fullWidth
                />
              </Grid>
            </Grid>
            <hr />
            <Button
              style={{ alignSelf: 'flex-end' }}
              onClick={() => {
                setCuota('');
                setMonto('');
                setInteres('');
                onResetForm();
              }}
              className="ml-2"
            >
              Resetear
            </Button>
          </Grid>
        </>
      </SimpleCard>
    </ContainerComp>
  );
};

export default Calculadora;
