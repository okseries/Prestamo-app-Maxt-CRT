import { Card, Grid, styled, useTheme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import DoughnutChart from './shared/Doughnut';
import StatCards2 from './shared/StatCards2';
import axios from 'axios';
import BarChart from './shared/BarChart';
import { SimpleCard } from 'app/components';
import PrestamosList from './shared/PrestamosList';
import { BASE_URL } from 'api/ConexionAPI';
//const BASE_URL = 'http://localhost:8080/api/v1';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginRight: '.5rem',
  textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}));

const Analytics = () => {
  const { palette } = useTheme();
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, status } = await axios.get(`${BASE_URL}/pagos/informacionPago`);
        if (status === 200) {
          console.log('Payment Data:', data); // Agrega este registro de consola
          setPaymentData(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards2 />
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <SimpleCard title={'Historial de pago'}>
              <BarChart
                height="300px"
                color={[palette.secondary.dark, palette.secondary.main, palette.secondary.light]}
                data={paymentData}
              />
            </SimpleCard>
          </Grid>
        </Grid>
        <PrestamosList />
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
