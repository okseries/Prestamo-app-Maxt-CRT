import React, { useEffect, useState } from 'react';
import {
  Add,
  AddBusiness,
  Delete,
  Edit,
  PendingActions,
  Refresh,
  Remove,
  Search,
} from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import {
  DeletePrestamoByID,
  GenerarCuotaURL,
  GenerarMoraURL,
  ListaPrestamoURL,
  MarkDeletedCuotasPorIdPrestamo,
} from '../../../BaseURL';
import PaymentForm from '../payment/PaymentForm';
import PrestamoForm from './PrestamoForm/PrestamoForm';
import Formatter from 'app/components/Formatter/Formatter';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import PrestamoDetail from 'app/components/Modal/PrestamoDetail';
import { useNavigate } from 'react-router-dom';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';
import ModalOption from 'app/components/Modal/ModalOption';
import ModalConfirmarMora from 'app/components/Modal/ModalConfirmarMora';

const FinancingList = () => {
  const navigate = useNavigate();
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [prestamos, setPrestamos] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selected, setSelected] = useState(false);

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

  const notificacionPagoRealizado = () => {
    showNotification('Pago realizado exitosamente', 'success');
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
            Icono={<AddBusiness />}
            listarPrestamos={listarPrestamos}
            color={'success'}
            Title={'Nuevo Prestamo'}
          />
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

  const handleGenerarMoras = async () => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const idsCuotasData = selectedRows.map((cuota) => cuota.idCuota);
      const { data } = await axiosInstance.post(`${GenerarMoraURL}`, { idCuota: idsCuotasData });
      if (data.result === 'success') {
        listarPrestamos();
        showNotification(`${data.message}`, 'success');
      } else {
        showNotification(`${data.message}`, 'error');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Si el error es debido a una falta de autenticación
        showNotification('Error de autenticación. Por favor, inicie sesión de nuevo.', 'error');
      } else if (error.response && error.response.status === 400) {
        // Si el error es debido a una solicitud incorrecta
        showNotification(
          'Solicitud incorrecta. Por favor, verifique los datos y vuelva a intentarlo.',
          'error'
        );
      } else if (error.response && error.response.status === 500) {
        // Para otros errores, mostramos un mensaje genérico
        showNotification(
          'Es posible que la cuota no esté vencida o que ya se haya generado una mora hoy.',
          'error'
        );
      }
      console.log('Error al generar las moras:', error);
    }
  };

  const markCuotasForPrestamoAsDeleted = async (rowData) => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { status } = await axiosInstance.put(
        `${MarkDeletedCuotasPorIdPrestamo}/${rowData.idPrestamo}`
      );
      if (status === 200) {
        listarPrestamos();
        showNotification('Las Cuotas se han elimonado!', 'success');
      }
    } catch (error) {
      console.error('Error al intentar eliminar las cuotas', error);
      showNotification('Error: No es posible eliminar estas cuotas', 'error');

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    } finally {
      setLoading1(false);
    }
  };

  /* const eliminarPrestamo = async (rowData) => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { status } = await axiosInstance.delete(`${DeletePrestamoByID}/${rowData.idPrestamo}`);
      if (status === 200) {
        listarPrestamos();
        showNotification('Prestamo Eliminado!', 'warning');
      }
    } catch (error) {
      console.error('Error al intentar eliminar el prestamo', error);
      showNotification('Error: Este prestamo no se puede eliminar', 'error');

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    } finally {
      setLoading1(false);
    }
  };*/

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
    if (!e.value || e.value.length === 0) {
      setSelectedRows({});

      setSelected(false); // No hay filas seleccionadas
      //console.log('No hay datos seleccionados');
      clearSelectedRows();
      return;
    }

    setSelectedRows(e.value);
    setSelected(true); // Hay filas seleccionadas
    //console.log('Hay datos seleccionados', e.value);
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
        <Grid container spacing={2}>
          {/* Botones a la izquierda */}
          <Grid item xs={12} md={6}>
            {/* PaymentForm Component */}
            <PaymentForm
              btnText={'Pagar Cuota'}
              selectedRows={selectedRows}
              refrescarFinanciamientos={listarPrestamos}
              clearSelectedRows={clearSelectedRows} // Función para limpiar las filas seleccionadas
              notificacionPagoRealizado={notificacionPagoRealizado}
              disabled={selectedRows.length === 0}
            />
            {/* Botón Verificar Moras */}
            <ModalConfirmarMora
              Icono={<PendingActions />}
              titleCard={'Generar Moras'}
              Title={'Generar Moras'}
              color={'warning'}
              listarPrestamos={listarPrestamos}
              disabled={selectedRows.length === 0} // Deshabilitar si no hay filas seleccionadas
              selectedRows={selectedRows}
              clearSelectedRows={clearSelectedRows}
              handleGenerarMoras={handleGenerarMoras}
            />
            {/*<Tooltip title={'Generar Moras'}>
              <IconButton color="warning" onClick={handleGenerarMoras}>
                <PendingActions />
              </IconButton>
            </Tooltip>*/}

            <ModalOption
              handleModalOptionOK={() => {
                markCuotasForPrestamoAsDeleted(rowData);
              }}
              Title={'Eliminar todas las Cuotas'}
              color={'error'}
              Icono={<Delete />}
              action={'eliminar las cuotas de este prestamo'}
              titleCard={'Eliminar todas las Cuotas'}
            />
          </Grid>

          {/* Datos del cliente al final a la derecha */}
          <Grid item xs={12} md={6} container justifyContent="flex-end">
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
          <Column field="idCuota" header="ID" />
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
              <Column field="idPrestamo" header="ID" sortable />
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
              <Column field="umbralDiasPago" header="Umbral" sortable />
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
              <Column
                className="text-info"
                header="Deta"
                body={(rowData) => (
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4}>
                      <PrestamoDetail rowData={rowData} />
                    </Grid>
                  </Grid>
                )}
              />

              <Column
                header="Edit"
                body={(rowData) => (
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4}>
                      <PrestamoForm
                        Icono={<Edit />}
                        listarPrestamos={listarPrestamos}
                        color={'warning'}
                        Title={'Actualizar'}
                        rowData={rowData}
                        disabled={rowData.cuotas.length === 0 ? false : true}
                      />
                    </Grid>
                  </Grid>
                )}
              />

              <Column
                header="Elim"
                body={(rowData) => (
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={4}>
                      <ModalOption
                        Icono={<Delete />}
                        listarPrestamos={listarPrestamos}
                        color={'error'}
                        titleCard={'Eliminar Prestamo'}
                        Title={'Eliminar'}
                        action={`eliminar el prestamo ID: ${rowData.idPrestamo}`}
                        handleModalOptionOK={null}
                        disabled={rowData.cuotas.length === 0 ? false : true}
                      />
                    </Grid>
                  </Grid>
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
