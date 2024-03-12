import { Box, Card, Grid, Icon, IconButton, styled, Tooltip } from '@mui/material';
import { Small } from 'app/components/Typography';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from 'api/ConexionAPI';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': { color: theme.palette.text.secondary },
  '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: '500',
  color: theme.palette.primary.main,
}));

const StatCards = () => {
  const [cantidadCliente, setCantidadCliente] = useState(0);
  useEffect(() => {
    clientes();
  }, []);

  const clientes = async () => {
    try {
      const { length, data, status } = await axios.get(`${BASE_URL}/pagos`);
      console.log(data.length);
      if (status === 200) {
        setCantidadCliente(data.length);
      }
    } catch (error) {}
  };

  const cardList = [
    { name: 'Total de clientes', amount: `${cantidadCliente}`, icon: 'group' },
    { name: '', amount: '$80,500', icon: 'attach_money' },
    { name: 'Inventory Status', amount: '8.5% Stock Surplus', icon: 'store' },
    { name: 'Orders to deliver', amount: '305 Orders', icon: 'shopping_cart' },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: '24px' }}>
      {cardList.map((item, index) => (
        <Grid item xs={12} md={6} key={index}>
          <StyledCard elevation={6}>
            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="12px">
                <Small>{item.name}</Small>
                <Heading>{item.amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
