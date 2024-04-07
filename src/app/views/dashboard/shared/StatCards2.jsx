import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Fab, Grid, Icon, lighten, styled, useTheme } from '@mui/material';
import { SimpleCard } from 'app/components';
import { BASE_URL } from 'api/ConexionAPI';
// Utility function for formatting currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
  }).format(amount);
};

const ContentBox = styled('div')(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
}));

const FabIcon = styled(Fab)(({ theme, background }) => ({
  width: '44px !important',
  height: '44px !important',
  boxShadow: 'none !important',
  background,
  overflow: 'hidden',
  zIndex: 0,
}));

const H3 = styled('h3')(({ textcolor }) => ({
  margin: 0,
  color: textcolor,
  fontWeight: '500',
  marginLeft: '12px',
}));

const H1 = styled('h1')(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary,
}));

const StatCards2 = () => {
  const [cantidadCliente, setCantidadCliente] = useState(0);
  const [capitalTotal, setCapitalTotal] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);
  const [gananciaTotal, setGananciaTotal] = useState(0);
  const [montoRecuperado, setMontoRecuperado] = useState(0);

  useEffect(() => {
    clientesTotal();
    CalculosFinancimaiento();
    calculosPago();
  }, []);

  const handleApiRequest = async (url, callback) => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, status } = await axiosInstance.get(url);
      if (status === 200) {
        callback(data);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
  };

  const clientesTotal = () => {
    handleApiRequest(`${BASE_URL}/clientes`, (data) => {
      setCantidadCliente(data.length);
    });
  };

  const CalculosFinancimaiento = () => {
    handleApiRequest(`${BASE_URL}/prestamos`, (data) => {
      const sumaCapitales = data.reduce((total, prestamo) => total + prestamo.capital, 0);
      const sumaMontos = data.reduce((total, prestamo) => total + prestamo.monto, 0);
      const calculoGanancia = sumaMontos - sumaCapitales;

      setCapitalTotal(formatCurrency(sumaCapitales));
      setMontoTotal(formatCurrency(sumaMontos));
      setGananciaTotal(formatCurrency(calculoGanancia));
    });
  };

  const calculosPago = () => {
    handleApiRequest(`${BASE_URL}/pagos/informacionPago`, (data) => {
      const pagosAplicados = data.filter((pago) => pago.estado === 'Pagado');
      const sumaPagos = pagosAplicados.reduce((total, pago) => total + pago.monto, 0);
      setMontoRecuperado(formatCurrency(sumaPagos));
    });
  };

  const { palette } = useTheme();
  const textError = palette.error.main;
  const bgError = lighten(palette.error.main, 0.85);

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <SimpleCard>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: bgError, overflow: 'hidden' }}>
              <Icon sx={{ color: textError }}>trending_up</Icon>
            </FabIcon>
            <H3 textcolor={textError}>Capital total</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{capitalTotal}</H1>
          </ContentBox>
        </SimpleCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <SimpleCard>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: bgError, overflow: 'hidden' }}>
              <Icon sx={{ color: textError }}>trending_up</Icon>
            </FabIcon>
            <H3 textcolor={textError}>Monto total</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{montoTotal}</H1>
          </ContentBox>
        </SimpleCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <SimpleCard>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: 'rgba(9, 182, 109, 0.15)' }}>
              <Icon sx={{ color: '#08ad6c' }}>trending_up</Icon>
            </FabIcon>
            <H3 textcolor={'#08ad6c'}>Ganancia total</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{gananciaTotal}</H1>
          </ContentBox>
        </SimpleCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <SimpleCard>
          <ContentBox>
            <FabIcon size="medium" sx={{ background: 'rgba(9, 182, 109, 0.15)' }}>
              <Icon sx={{ color: '#08ad6c' }}>trending_up</Icon>
            </FabIcon>
            <H3 textcolor={'#08ad6c'}>Pago total</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{montoRecuperado}</H1>
          </ContentBox>
        </SimpleCard>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
