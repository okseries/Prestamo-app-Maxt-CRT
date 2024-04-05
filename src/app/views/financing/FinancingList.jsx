import React, { useEffect, useRef, useState } from 'react';
import { Add, Delete, Refresh, Remove, RequestQuoteOutlined, Search } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { GenerarCuotaURL, GenerarMoraURL, ListaPrestamoURL } from '../../../BaseURL';
import PaymentForm from '../payment/PaymentForm';
import PrestamoForm from './PrestamoForm/PrestamoForm';
import Formatter from 'app/components/Formatter/Formatter';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import PaymentDetailModal from 'app/components/Modal/PaymentDetailModal';
import PrestamoDetail from 'app/components/Modal/PrestamoDetail';
import { useNavigate } from 'react-router-dom';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';

const FinancingList = () => {
  const navigate = useNavigate();
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [prestamos, setPrestamos] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

  useEffect(() => {
    setLoading2(true);
    listarPrestamos();
    initFilters1();
  }, []);

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1['global'].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const closeNotification = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificationOpen(false);
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
          <PrestamoForm
            listarPrestamos={listarPrestamos}
            color={'success'}
            startIcon={<RequestQuoteOutlined />}
            TextBtn={'Nuevo'}
          />

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

  const clearSelectedRows = () => {
    setSelectedRows([]);
  };

  const listarPrestamos = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, status } = await axiosInstance.get(ListaPrestamoURL);
      if (status === 200) {
        setPrestamos(data);

        console.log(data);
      }
    } catch (error) {
      console.error('error al obtener los prestamos', error);
      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
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
        // Obtener el token de autorización del almacenamiento local
        const storedToken = localStorage.getItem('accessToken');

        // Configurar Axios para incluir el token en el encabezado Authorization
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const { idPrestamo } = rowData;

        const { data, status } = await axiosInstance.post(GenerarCuotaURL, {
          idPrestamo,
        });

        if (status === 200) {
          console.log('Cuotas sincronizadas:', data);
        } else {
          alert(data);
        }

        listarPrestamos();
      } catch (error) {
        console.error('Error al crear cuotas:', error);

        if (error.response && error.response.status === 403) {
          setIsModalOpenSessionFinishModal(true);
        }
      }
    };

    const handleGenerarMoras = async () => {
      try {
        // Obtener el token de autorización del almacenamiento local
        const storedToken = localStorage.getItem('accessToken');

        // Configurar Axios para incluir el token en el encabezado Authorization
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const { data } = await axiosInstance.post(`${GenerarMoraURL}/${rowData.idPrestamo}`);
        if (data.result === 'success') {
          console.log('Moras generadas:', data);
          showNotification(data.message, 'success');
          listarPrestamos();
        } else {
          showNotification(data.message, 'info');
        }
      } catch (error) {
        console.error('Error al generar las moras:', error);

        if (error.response && error.response.status === 403) {
          setIsModalOpenSessionFinishModal(true);
        }
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
          <Grid item xs={12} md={4} className="d-flex justify-content-start align-items-center">
            <PaymentForm
              refrescarFinanciamientos={listarPrestamos}
              selectedRows={selectedRows}
              clearSelectedRows={clearSelectedRows}
              btnText={'Pagar Cuota'}
            />
          </Grid>

          <Grid item xs={12} md={4} className="d-flex justify-content-start align-items-center">
            <Button onClick={handleGenerarMoras}>Verificar Moras</Button>
          </Grid>

          {/* Right section */}
          <Grid item xs={12} md={4} className="d-flex justify-content-end align-items-center">
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
          <Column
            field="fechaCuota"
            header="Vence"
            body={(rowData) => <Formatter value={rowData.fechaCuota} type="dateUTC" />}
            sortable
          />
          <Column
            field="montoCuota"
            header="Monto"
            body={(rowData) => <Formatter value={rowData.montoCuota} type="currency" />}
            sortable
          />
          <Column
            field="montoPagado"
            header="Pagado"
            body={(rowData) => <Formatter value={rowData.montoPagado} type="currency" />}
            sortable
          />
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
              <Column
                field="capital"
                header="Capital"
                body={(rowData) => <Formatter value={rowData.capital} type="currency" />}
                sortable
              />
              <Column
                field="tasaPorcentaje"
                header="Tasa"
                body={(rowData) => <Formatter value={rowData.tasaPorcentaje} type="percentage" />}
                sortable
              />
              <Column
                field="porcentajeMora"
                header="Mora / Dia"
                body={(rowData) => <Formatter value={rowData.porcentajeMora} type="percentage" />}
                sortable
              />
              <Column
                body={(rowData) => {
                  const { tiempo, detalleFrecuencia } = rowData;
                  const frecuenciaPago = detalleFrecuencia[0].frecuenciaPago.descripcion;
                  const cadaCuantosDias = detalleFrecuencia[0].cadaCuantosDias;
                  const tiempoNumero = tiempo;

                  let tiempoTexto = tiempo;
                  let cantidadDiasTexto = '';

                  const tiempoMap = {
                    Mensual: 'Meses',
                    Quincenal: 'Quincenas',
                    Diario: 'Días',
                    Semanal: 'Semanas',
                  };

                  if (frecuenciaPago in tiempoMap) {
                    tiempoTexto += ` ${tiempoMap[frecuenciaPago]}`;
                  } else {
                    tiempoTexto += ' (Frecuencia no reconocida)';
                  }

                  if (frecuenciaPago === 'Diario') {
                    const cantidadDias = cadaCuantosDias * tiempoNumero;
                    cantidadDiasTexto = `${cantidadDias} Días`;
                  }

                  return cantidadDiasTexto ? cantidadDiasTexto : tiempoTexto;
                }}
                header="Tiempo"
                sortable
              />

              <Column
                field="interes"
                header="Interés"
                body={(rowData) => <Formatter value={rowData.interes} type="currency" />}
                sortable
              />
              <Column
                field="monto"
                header="Monto"
                body={(rowData) => <Formatter value={rowData.monto} type="currency" />}
                sortable
              />

              <Column
                field="createdAt"
                header="Creado"
                body={(rowData) => <Formatter value={rowData.createdAt} type="date" />}
                sortable
              />
              <Column field="cliente.primerNombre" header="Cliente" sortable />
              <Column body={(rowData) => <PrestamoDetail rowData={rowData} />} />
              <Column
                body={(rowData) => (
                  <PrestamoForm
                    listarPrestamos={listarPrestamos}
                    color={'warning'}
                    TextBtn={'Actualizar'}
                    rowData={rowData}
                  />
                )}
              />
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />

      <SessionFinishModal
        isOpen={isModalOpenSessionFinishModal}
        closeModalSesion={closeModalSesion}
        title={'Sesión Terminada'}
      />
    </ContainerComp>
  );
};

export default FinancingList;
