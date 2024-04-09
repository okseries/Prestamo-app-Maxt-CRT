import { Card, Grid, styled, useTheme } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import DoughnutChart from './shared/Doughnut';
import StatCards2 from './shared/StatCards2';
import axios from 'axios';
import BarChart from './shared/BarChart';
import { SimpleCard } from 'app/components';
import PrestamosList from './shared/PrestamosList';
import { BASE_URL } from 'api/ConexionAPI';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';
import { DashboardURL } from 'BaseURL';
//const BASE_URL = 'http://localhost:8080/api/v1';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Analytics = () => {
  const { palette } = useTheme();
  const [gestorFinancieroData, setGestorFinancieroData] = useState([]);
  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

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
                data={gestorFinancieroData}
              />
            </SimpleCard>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <SimpleCard title={'Prestamos con cuotas vencidas'}>
              <PrestamosList />
            </SimpleCard>
          </Grid>
        </Grid>
      </ContentBox>
      <SessionFinishModal
        isOpen={isModalOpenSessionFinishModal}
        closeModalSesion={closeModalSesion}
        title={'Sesión Terminada'}
      />
    </Fragment>
  );
};

export default Analytics;
