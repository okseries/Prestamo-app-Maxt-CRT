import React from 'react';
import { Search } from '@mui/icons-material';
import { Grid, IconButton, TextField } from '@mui/material';

const Step1 = ({ formState, onInputChange, getClienteByIdentificacion }) => (
  <>
    <Grid container spacing={2} paddingTop={2}>
      <Grid item xs={12} md={12}>
        <TextField
          type="search"
          name="search"
          variant="outlined"
          fullWidth
          value={formState.search}
          onChange={onInputChange}
          InputProps={{
            startAdornment: (
              <IconButton className="mr-2 bg-primary" onClick={getClienteByIdentificacion}>
                <Search />
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="idCliente"
          label="ID del Cliente"
          fullWidth
          value={formState.idCliente}
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="nombreCliente"
          label="Nombre del Cliente"
          fullWidth
          value={formState.nombreCliente}
          onChange={onInputChange}
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  </>
);

export default Step1;
