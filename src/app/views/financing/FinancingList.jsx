import React, { useEffect, useState } from 'react';
import { Add, Remove, Search } from '@mui/icons-material';
import { Box, Button, Grid, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';

const BaseURL = 'http://localhost:8080/api/v1/prestamos/sucursal/1';

const FinancingList = () => {
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [prestamos, setPrestamos] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1['global'].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const items = [
    {
      label: 'Agregar',
      icon: 'pi pi-plus',
      severity: 'success',
      command: () => handleButtonClick('Agregar'),
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      severity: 'danger',
      command: () => handleButtonClick('Eliminar'),
    },
    {
      label: 'Actualizar',
      icon: 'pi pi-trash',
      severity: 'danger',
      command: () => handleButtonClick('Actualizar'),
    },
    {
      label: 'Exportar Datos',
      icon: 'pi pi-upload',
      severity: 'help',
      command: () => handleButtonClick('Exportar Datos'),
    },
  ];

  const handleButtonClick = (action) => {
    // Handle button click logic for 'New', 'Delete', 'Export'
    console.log(`Button clicked: ${action}`);
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
        <Grid item xs={12} md={4}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={toggleAll}
            startIcon={allExpanded ? <Remove /> : <Add />}
          >
            {allExpanded ? 'Expandido' : 'Expandir'}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
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

  const listarPrestamos = async () => {
    try {
      const { data, status } = await axios.get(BaseURL);
      setPrestamos(data);
      console.log(data);
      console.log(status);
    } catch (error) {
      console.error('error al obtener los prestamos');
    } finally {
      setLoading1(false); // Asegúrate de cambiar el estado a false.
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
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

  const rowExpansionTemplate = (data) => {
    const cuotas = data.cuotas || [];
    const handleSynchronizeClick = async () => {
      try {
        console.log(data.idPrestamo);
        const cuotasSincronizadas = await axios.post('http://localhost:8080/api/v1/cuotas', {
          idPrestamo: data.idPrestamo,
          intervalo: 11,
          dia: 4,
        });
        console.log(cuotasSincronizadas);
        listarPrestamos();
      } catch (error) {}
    };

    if (cuotas.length === 0) {
      return (
        <div className="orders-subtable">
          <h5>Cuotas del préstamo {data.cliente.primerNombre}</h5>
          <Button
            severity="info"
            label="Sincronizar Cuotas"
            icon="pi pi-sync"
            onClick={handleSynchronizeClick}
          />
        </div>
      );
    }

    return (
      <Box>
        <h5>
          Cuotas de prestamo | {data.cliente.primerNombre} {data.cliente.apellidoPaterno} |{' '}
          {data.cliente.identificacion}
        </h5>
        <DataTable className="table" value={cuotas} responsiveLayout="scroll">
          <Column field="idCuota" header="ID" sortable></Column>
          <Column field="numeroCuota" header="#" sortable></Column>
          <Column field="fechaCuota" header="Vence" sortable></Column>
          <Column field="montoCuota" header="Monto" sortable></Column>
          <Column field="montoPagado" header="Pagado" sortable></Column>
          <Column field="estado" header="Estado" sortable></Column>
          <Column
            body={(rowData) => (
              <Button
                icon="pi pi-dollar"
                rounded
                severity="success"
                onClick={() => handleButtonClick(rowData)}
              />
            )}
            header="Acción"
          />
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
              <Column field="fechaFin" header="Fin" sortable />
              <Column field="cliente.primerNombre" header="Cliente" sortable />
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
    </ContainerComp>
  );
};

export default FinancingList;
