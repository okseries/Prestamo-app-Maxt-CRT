import React, { useEffect, useState } from 'react';
import {
  Add,
  Delete,
  NoteAddOutlined,
  Paid,
  Payment,
  Refresh,
  Remove,
  RequestQuoteOutlined,
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
import { GenerarCuotaURL, ListaPrestamoURL } from '../../../BaseURL';
import PaymentForm from '../payment/PaymentForm';
import PrestamoForm from './PrestamoForm/PrestamoForm';

const FinancingList = () => {
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [prestamos, setPrestamos] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState();

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
          <Button size="medium" onClick={toggleAll} startIcon={allExpanded ? <Remove /> : <Add />}>
            {allExpanded ? 'Expandido' : 'Expandir Todo'}
          </Button>
          <PrestamoForm color={'success'} startIcon={<RequestQuoteOutlined />} TextBtn={'Nuevo'} />
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
    listarPrestamos();
    initFilters1();
  }, []);

  const clearSelectedRows = () => {
    setSelectedRows([]);
  };

  const listarPrestamos = async () => {
    try {
      const { data, status } = await axios.get(ListaPrestamoURL);
      setPrestamos(data);

      console.log(data);
      console.log(status);
    } catch (error) {
      console.error('error al obtener los prestamos');
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

  const formatCurrencyMontoPagado = (rowData) => {
    const formattedCurrency = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'DOP',
    }).format(rowData.montoPagado);
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

  const toggleAll = () => {
    if (allExpanded) collapseAll();
    else expandAll();
  };

  const expandAll = () => {
    let _expandedRows = {};
    prestamos.forEach((p) => (_expandedRows[`${p.idPrestamo}`] = true));

    setExpandedRows(_expandedRows);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    setExpandedRows([]);
    setAllExpanded(false);
  };

  const handleRowSelect = (e) => {
    if (!e.value) {
      setSelectedRows({});
      //setSelected((prevSelected) => !prevSelected);
      return;
    }
    setSelectedRows(e.value);
    //setSelected((prevSelected) => !prevSelected);
  };

  const rowExpansionTemplate = (rowData) => {
    const handleCrearCuotas = async () => {
      try {
        const { idPrestamo } = rowData;
        const cuotasSincronizadas = await axios.post(GenerarCuotaURL, {
          idPrestamo,
        });

        console.log('Cuotas sincronizadas:', cuotasSincronizadas.data);

        listarPrestamos();
      } catch (error) {
        console.error('Error al crear cuotas:', error);
      }
    };

    if (rowData.cuotas && rowData.cuotas.length === 0) {
      return (
        <div>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleCrearCuotas}
            startIcon={<Refresh />}
          >
            Generar Cuotas
          </Button>
        </div>
      );
    }

    return (
      <Box flex={true} justifyContent={'center'} alignItems={'center'}>
        <Grid justifyItems={'center'} container className="p-2">
          {/* Left section */}
          <Grid item xs={12} md={6} className="d-flex justify-content-start align-items-center">
            <PaymentForm
              refrescarFinanciamientos={listarPrestamos}
              selectedRows={selectedRows}
              clearSelectedRows={clearSelectedRows}
              btnText={'Pagar Factura'}
            />
          </Grid>

          {/* Right section */}
          <Grid item xs={12} md={6} className="d-flex justify-content-end align-items-center">
            <span>
              {rowData.cliente.primerNombre} {rowData.cliente.apellidoPaterno} |{' '}
              {rowData.cliente.identificacion}
            </span>
          </Grid>
        </Grid>
        <DataTable
          className="table"
          value={rowData.cuotas}
          responsiveLayout="scroll"
          selectionMode="multiple"
          selection={selectedRows} // Usa el estado selectedRows como la selección
          onSelectionChange={handleRowSelect} // Maneja los cambios de selección
        >
          <Column selectionMode="multiple" style={{ width: '3em' }} />
          <Column field="numeroCuota" header="#" />
          <Column field="fechaCuota" header="Vence" body={formatDate} sortable />
          <Column field="montoCuota" header="Monto" body={formatCurrency} sortable />
          <Column field="montoPagado" header="Pagado" body={formatCurrencyMontoPagado} sortable />
          <Column field="estado" header="Estado" sortable />
        </DataTable>
      </Box>
    );
  };

  const header1 = renderHeader1();

  return (
    <ContainerComp>
      <SimpleCard title={'Lista de prestamos'}>
        <Grid>
          <Grid xs={12} md={12}>
            <DataTable
              className="table"
              value={prestamos}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              responsiveLayout="scroll"
              rowExpansionTemplate={rowExpansionTemplate}
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
              <Column expander style={{ width: '3em' }} />
              <Column field="capital" header="Capital" sortable />
              <Column field="tasaPorcentaje" header="(%)" sortable />
              <Column field="porcentajeMora" header="(% Mora)" sortable />
              <Column
                body={(rowData) => `${rowData.tiempo} ${rowData.frecuenciaCuota}`}
                header="Tiempo"
                sortable
              />
              <Column field="interes" header="Interés" sortable />
              <Column field="monto" header="Monto" sortable />
              <Column field="montoRestante" header="Restante" sortable />
              <Column field="fechaInicioPago" header="Inicio" sortable />
              <Column field="cliente.primerNombre" header="Cliente" sortable />
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
    </ContainerComp>
  );
};

export default FinancingList;
