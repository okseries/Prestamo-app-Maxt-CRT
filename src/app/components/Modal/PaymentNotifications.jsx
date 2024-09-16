import {
  Badge,
  Button,
  Card,
  Drawer,
  Icon,
  IconButton,
  ThemeProvider,
  Tooltip,
} from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import useNotification from 'app/hooks/useNotification';
import useSettings from 'app/hooks/useSettings';
import { sideNavWidth, topBarHeight } from 'app/utils/constant';
import { getTimeDifference } from 'app/utils/utils.js';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { themeShadows } from '../MatxTheme/themeColors';
import { Paragraph, Small } from '../Typography';
import { GetCuotasQueVencenHoyURL } from 'BaseURL';
import { Modal } from 'reactstrap';
import { SimpleCard } from '..';
import { Notifications } from '@mui/icons-material';
import axios from 'axios';
import CuotasVencenHoy from './CuotasVencenHoy';
import Formatter from '../Formatter/Formatter';

const Notification = styled('div')(() => ({
  padding: '16px',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  height: topBarHeight,
  boxShadow: themeShadows[6],
  '& h5': {
    marginLeft: '8px',
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '500',
  },
}));

const NotificationCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover': {
    '& .messageTime': {
      display: 'none',
    },
    '& .deleteButton': {
      opacity: '1',
    },
  },
  '& .messageTime': {
    color: theme.palette.text.secondary,
  },
  '& .icon': { fontSize: '1.25rem' },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  opacity: '0',
  position: 'absolute',
  right: 5,
  marginTop: 9,
  marginRight: '24px',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const CardLeftContent = styled('div')(({ theme }) => ({
  padding: '12px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'rgba(0, 0, 0, 0.01)',
  '& small': {
    fontWeight: '500',
    marginLeft: '16px',
    color: theme.palette.text.secondary,
  },
}));

const Heading = styled('span')(({ theme }) => ({
  fontWeight: '500',
  marginLeft: '16px',
  color: theme.palette.text.secondary,
}));

const NotificationBar = ({ container }) => {
  const { settings } = useSettings();
  const theme = useTheme();
  const secondary = theme.palette.text.secondary;
  const [panelOpen, setPanelOpen] = React.useState(false);
  const { deleteNotification, clearNotifications, notifications } = useNotification();
  const [overduePayments, setOverduePayments] = useState([]);

  const handleDrawerToggle = () => {
    setPanelOpen(!panelOpen);
  };

  useEffect(() => {
    cuotasVecenHoy();
  }, []);

  const { palette } = useTheme();
  const textColor = palette.text.primary;

  const cuotasVecenHoy = async () => {
    // setLoading(true);
    try {
      const { data } = await axios.get(GetCuotasQueVencenHoyURL);
      setOverduePayments(data);
      console.log(data);
    } catch (error) {
      console.error('Error al obtener las cuotas vencidas:', error);
      // Puedes mostrar un mensaje de error al usuario
    } finally {
      //setLoading(false);
    }
  };

  return (
    <Fragment>
      <Tooltip title={`Cuotas que vencen hoy: ${overduePayments.length || 0}`}>
        <IconButton onClick={handleDrawerToggle}>
          <Badge color="secondary" badgeContent={overduePayments?.length}>
            <Icon sx={{ color: textColor }}>notifications</Icon>
          </Badge>
        </IconButton>
      </Tooltip>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          width={'100px'}
          container={container}
          variant="temporary"
          anchor={'right'}
          open={panelOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Box sx={{ width: sideNavWidth }}>
            <Notification>
              <Icon color="primary">notifications</Icon>
              <h5>Notifications</h5>
            </Notification>

            {overduePayments?.map((cuota) => (
              <NotificationCard key={cuota.idCuota}>
                {/*<DeleteButton
                  size="small"
                  className="deleteButton"
                  onClick={() => deleteNotification(cuota.idCuota)}
                >
                  <Icon className="icon">clear</Icon>
                </DeleteButton>*/}
                <Link
                  to={`/prestamo-list`} // Reemplaza con la ruta correcta para ver los detalles de la cuota
                  onClick={handleDrawerToggle}
                  style={{ textDecoration: 'none' }}
                >
                  <Card sx={{ mx: 2, mb: 3 }} elevation={3}>
                    <CardLeftContent>
                      <Box display="flex">
                        <Icon className="icon" color={theme.palette.primary.main}>
                          notifications
                        </Icon>
                        <Heading>{`Cuota #${cuota.numeroCuota}`}</Heading>
                      </Box>
                      {/*
                      <Small className="messageTime">
                        {getTimeDifference(new Date(cuota.fechaCuota))}
                        ago
                      </Small>*/}
                    </CardLeftContent>
                    <Box sx={{ px: 2, pt: 1, pb: 2 }}>
                      <Paragraph sx={{ m: 0 }}>
                        <span>
                          Monto: <Formatter value={cuota.montoCuota} type="currency" />
                        </span>
                      </Paragraph>
                      <Small sx={{ color: secondary }}>
                        CLiente: {cuota.prestamo.cliente.primerNombre}{' '}
                        {cuota.prestamo.cliente.apellidoPaterno}
                      </Small>
                      <br />

                      <Small sx={{ color: secondary }}>Préstamo ID: {cuota.idPrestamo}</Small>
                      <br />
                      <Small sx={{ color: secondary }}>
                        <span>
                          Vence: <Formatter value={cuota.fechaCuota} type="dateUTC" />
                        </span>
                      </Small>
                      {/* Aquí podrías mostrar más detalles de la cuota si es necesario */}
                    </Box>
                  </Card>
                </Link>
              </NotificationCard>
            ))}
          </Box>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
};

export default NotificationBar;
