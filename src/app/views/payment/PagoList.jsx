import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { HistorialPagosURL } from 'BaseURL';
import Formatter from 'app/components/Formatter/Formatter';
import PaymentDetailModal from '../../components/Modal/PaymentDetailModal';
import { Search } from '@mui/icons-material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

const PagoList = () => {
  const [historialPago, setHistorialPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters1, setFilters1] = useState();
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');

  useEffect(() => {
    initFilters1();
  }, []);

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1['global'].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
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

  useEffect(() => {
    const fetchHistorialPago = async () => {
      try {
        const { data } = await axios.get(HistorialPagosURL);
        setHistorialPago(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los pagos:', error);
        setLoading(false);
      }
    };

    fetchHistorialPago();
  }, []);

  const renderHeader = () => {
    return (
      <Grid
        container
        spacing={2}
        marginBottom={2}
        alignItems={'center'}
        justifyContent="space-between"
      >
        <Grid item xs={12} md={9} container justifyContent="flex-start"></Grid>

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

  return (
    <ContainerComp>
      <SimpleCard title={'Historial de Pagos'}>
        <Grid>
          <Grid xs={12} md={12}>
            <DataTable
              className="table bg-white p-datatable custom-table"
              value={historialPago}
              header={renderHeader()}
              filters={filters1}
              filterDisplay="menu"
              scrollable
              scrollHeight="800px"
              paginator
              rows={10}
              loading={loading}
              emptyMessage="No se encontraron datos."
            >
              <Column
                field="monto"
                header="Monto"
                body={(rowData) => <Formatter value={rowData.monto} type="currency" />}
                sortable
              />
              <Column
                field="createdAt"
                header="Fecha"
                body={(rowData) => <Formatter value={rowData.createdAt} type="date" />}
                sortable
              />
              <Column field="cliente.identificacion" header="Cliente Identificación" sortable />
              <Column field="cliente.primerNombre" header="Nombre del Cliente" sortable />
              <Column field="estado" header="Estado" sortable />
              <Column body={(rowData) => <PaymentDetailModal rowData={rowData} />} />
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
    </ContainerComp>
  );
};

export default PagoList;
