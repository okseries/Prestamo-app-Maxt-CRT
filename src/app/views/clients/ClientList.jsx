import React, { useEffect, useState } from 'react';
import {
  Add,
  Delete,
  Label,
  Paid,
  PlusOne,
  Refresh,
  Remove,
  Search,
  SettingsBackupRestore,
  Update,
} from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { GenerarCuotaURL, ListaPrestamoURL, ListarClientesURL } from '../../../BaseURL';
import ClientForm from './ClientForm';

const ClientList = () => {
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1['global'].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <Grid
        container
        spacing={2}
        marginBottom={2}
        alignItems={'center'}
        justifyContent="space-between"
      >
        <Grid item xs={12} md={9} container justifyContent="flex-start">
          <ClientForm />
          <Button size="small">
            <Update color="warning" />
          </Button>
          <Button size="small">
            <Delete color="error" />
          </Button>
        </Grid>

        <Grid item xs={12} md={3} justifyContent="flex-end">
          <TextField
            type="search"
            name="firstName"
            onChange={onGlobalFilterChange1}
            value={globalFilterValue1}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </Grid>
      </Grid>
    );
  };

  useEffect(() => {
    setLoading2(true);
    listarClientes();
    initFilters1();
  }, []);

  const listarClientes = async () => {
    try {
      const { data, status } = await axios.get(ListarClientesURL);
      setClientes(data);
      console.log(data);
      console.log(status);
    } catch (error) {
      console.error('error al obtener los clientes');
    } finally {
      setLoading1(false); // Asegúrate de cambiar el estado a false.
    }
  };

  // Función para formatear la fecha
  const formatDate = (rowData) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(
      new Date(rowData.fechaCuota)
    );
    return formattedDate;
  };

  // Función para formatear el monto
  const formatCurrency = (rowData) => {
    const formattedCurrency = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'DOP',
    }).format(rowData.montoCuota);
    return formattedCurrency;
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      'country.name': {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue1('');
  };

  const header1 = renderHeader1();

  return (
    <ContainerComp>
      <SimpleCard title={'Lista de clientes'}>
        <Grid>
          <Grid xs={12} md={12}>
            <DataTable
              className="table bg-white"
              value={clientes}
              responsiveLayout="scroll"
              dataKey="idPrestamo"
              header={header1}
              scrollable
              scrollHeight="800px"
              paginator
              showGridlines
              rows={10}
              filters={filters1}
              filterDisplay="menu"
              loading={loading1}
              columnResizeMode="fit"
              emptyMessage="No se encontraron datos."
              rowClassName={(rowData, rowIndex) =>
                rowIndex % 2 === 0 ? 'p-datatable-row-even' : 'p-datatable-row-odd'
              } // Aplicar estilos a filas alternas
            >
              <Column selectionMode="multiple" style={{ width: '3em' }} />
              <Column field="identificacion" header="Cédula" />
              <Column field="primerNombre" header="Nombre" sortable />
              <Column field="apellidoPaterno" header="Apellido" sortable />
              <Column field="telefono" header="Teléfono" />
              <Column field="correo" header="Correo" />
              <Column field="ingresos" header="Ingresos" sortable />
              <Column field="dondeLabora" header="Trabajo" sortable />
              <Column field="direccion" header="Direccion" sortable />
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
    </ContainerComp>
  );
};

export default ClientList;
