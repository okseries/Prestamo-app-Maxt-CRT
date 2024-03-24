import React, { useEffect, useState } from 'react';
import { Add, Delete, Search, Update } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import ClientForm from '../clients/ClientForm';
import Formatter from 'app/components/Formatter/Formatter';
import { HistorialPagosURL } from 'BaseURL';

const PagoList = () => {
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [historialPago, setHistorialPago] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selected, setSelected] = useState(false);

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

  useEffect(() => {
    setLoading2(true);
    ListarHistorialDePago();
    initFilters1();
  }, []);

  const ListarHistorialDePago = async () => {
    try {
      const { data, status } = await axios.get(HistorialPagosURL);
      setHistorialPago(data);
      console.log(data);
      console.log(status);
    } catch (error) {
      console.error('error al obtener los clientes');
    } finally {
      setLoading1(false);
    }
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

  const handleRowSelect = (e) => {
    if (!e.value) {
      setSelectedRows({});
      setSelected((prevSelected) => !prevSelected);

      return;
    }
    setSelectedRows(e.value);
    setSelected((prevSelected) => !prevSelected);
  };

  const header1 = renderHeader1();

  return (
    <ContainerComp>
      <SimpleCard title={'Historial de Pagos'}>
        <Grid>
          <Grid xs={12} md={12}>
            <DataTable
              className="table bg-white p-datatable custom-table" // Clases de estilo para la tabla
              value={historialPago}
              responsiveLayout="scroll"
              dataKey="idCliente"
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
              <Column
                field="monto"
                header="Monto"
                body={(rowData) => <Formatter value={rowData.monto} type="currency" />}
                sortable
                className="text-success"
              />

              <Column
                field="createdAt"
                header="Fecha"
                body={(rowData) => <Formatter value={rowData.createdAt} type="dateUTC" />}
                sortable
              />

              <Column
                field="cliente.identificacion"
                header="Cliente Identificación"
                body={(rowData) => rowData.cliente.identificacion}
                sortable
              />

              <Column
                field="cliente.primerNombre"
                header="Nombre del Cliente"
                body={(rowData) => rowData.cliente.primerNombre}
                sortable
              />

              <Column
                field="estado"
                header="Estado"
                body={(rowData) => rowData.estado}
                sortable
                className="text-success"
              />

              <Column
                field="detallePago"
                header="Corresponde"
                body={(rowData) =>
                  rowData.detallePago.map((detalle, index) => (
                    <div key={index}>Cuota #: {detalle.cuota.numeroCuota}</div>
                  ))
                }
                className="text-primary"
              />
            </DataTable>
          </Grid>
        </Grid>
        <ClientForm selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
      </SimpleCard>
    </ContainerComp>
  );
};

export default PagoList;
