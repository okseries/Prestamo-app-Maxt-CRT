import { Grid, styled, useTheme } from '@mui/material';
import { Fragment, useState } from 'react';
import StatCards2 from './shared/StatCards2';
import BarChart from './shared/BarChart';
import { SimpleCard } from 'app/components';
import PrestamosList from './shared/PrestamosList';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';

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
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <StatCards2 />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <SimpleCard title={'Prestamos con cuotas vencidas'}>
              <PrestamosList />
            </SimpleCard>
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <SimpleCard title={'Historial de pago'}>
              <BarChart
                height="300px"
                color={[palette.secondary.dark, palette.secondary.main, palette.secondary.light]}
                data={gestorFinancieroData}
              />
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
