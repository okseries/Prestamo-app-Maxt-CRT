// RowCards.jsx

import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, ListItem, ListItemText } from '@mui/material';
import { Fragment } from 'react';
import axios from 'axios';
import Formatter from '../Formatter/Formatter';

const CuotasVencenHoy = ({ overduePayments }) => {
  // Acepta overduePayments como prop
  return overduePayments.map((item) => {
    const {
      idCuota,
      numeroCuota,
      fechaCuota,
      montoCuota,
      prestamo: { cliente, idPrestamo },
    } = item;

    return (
      <Fragment key={idCuota}>
        <Card sx={{ py: 1, px: 2 }} className="project-card">
          <Grid container alignItems="center">
            <ListItem>
              <Grid item xs={12} md={6}>
                <ListItemText
                  primary="Cliente:"
                  secondary={`${cliente.primerNombre} ${cliente.apellidoPaterno}`}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ListItemText primary="Prestamo ID:" secondary={idPrestamo} />
              </Grid>

              <Grid item xs={12} md={6}>
                <ListItemText primary="Cuota ID:" secondary={idCuota} />
              </Grid>
            </ListItem>

            <ListItem>
              <Grid item xs={12} md={6}>
                <ListItemText primary="Cuota #:" secondary={numeroCuota} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ListItemText
                  primary="Monto:"
                  secondary={<Formatter value={montoCuota} type={'currency'} />}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <ListItemText
                  primary="Vence:"
                  secondary={<Formatter value={fechaCuota} type={'dateUTC'} />}
                />
              </Grid>
            </ListItem>
          </Grid>
        </Card>
        <Box py={1} />
      </Fragment>
    );
  });
};

export default CuotasVencenHoy;
