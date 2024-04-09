import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Fab, Grid, Icon, lighten, styled, useTheme } from '@mui/material';
import { SimpleCard } from 'app/components';
import { BASE_URL } from 'api/ConexionAPI';
import { DashboardURL } from 'BaseURL';
import Formatter from 'app/components/Formatter/Formatter';

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
  const [gestorFinancieroData, setGestorFinancieroData] = useState([]);
  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token de autorización del almacenamiento local
        const storedToken = localStorage.getItem('accessToken');

        // Configurar Axios para incluir el token en el encabezado Authorization
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const { data, status } = await axiosInstance.get(DashboardURL);
        if (status === 200) {
          setGestorFinancieroData(data);
        }
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 403) {
          setIsModalOpenSessionFinishModal(true);
        }
      }
    };

    fetchData();
  }, []);

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
            <H1>{<Formatter value={gestorFinancieroData.totalCapital} type={'currency'} />}</H1>
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
            <H1>{<Formatter value={gestorFinancieroData.totalMonto} type={'currency'} />}</H1>
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
            <H1>{<Formatter value={gestorFinancieroData.totalInteres} type={'currency'} />}</H1>
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
            <H1>
              {gestorFinancieroData.informacionCuotas ? (
                <Formatter
                  value={gestorFinancieroData.informacionCuotas.sumaCuotasPagadas}
                  type={'currency'}
                />
              ) : (
                'No disponible'
              )}
            </H1>
          </ContentBox>
        </SimpleCard>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
