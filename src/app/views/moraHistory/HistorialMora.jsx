import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { HistorialMoraURL, UCancelarHistorialDePago } from 'BaseURL';
import Formatter from 'app/components/Formatter/Formatter';
import { Search } from '@mui/icons-material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import PaymentMoraDetailModal from 'app/components/Modal/PaymentMoraDetailModal';

const HisrialMora = () => {
  const [historialPago, setHistorialPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters1, setFilters1] = useState();
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
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

  useEffect(() => {
    initFilters1();
    fetchHistorialMora();
  }, []);

  const CancelarPago = async (rowData) => {
    try {
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, message } = await axiosInstance.put(
        `${UCancelarHistorialDePago}/${rowData.idHistorialPago}`,
        { estado: 'Cancelado' }
      );
      if (data.respose === 'success') {
        fetchHistorialMora();
        showNotification(`${data.message}`, 'success');
      } else {
        showNotification(`${data.message}`, 'error');
      }
    } catch (error) {
      alert(error);
      console.error(
        'Error: Ha ocurrido un error al intentar actualizar el historial de pago ',
        error
      );

      if (error.response && error.response.status === 403) {
        //setIsModalOpenSessionFinishModal(true);
      }
    }
  };

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

  const fetchHistorialMora = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data } = await axiosInstance.get(HistorialMoraURL);
      setHistorialPago(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los pagos:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <SimpleCard title={'Historial de Pago por concepto de Mora'}>
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
              <Column field="idHistorialPagoMora" header="ID" sortable />
              <Column
                field="montoPagado"
                header="Monto Pagado"
                body={(rowData) => <Formatter value={rowData.montoPagado} type="currency" />}
                sortable
              />
              <Column
                field="createdAt"
                header="Pago de mora realizado"
                body={(rowData) => <Formatter value={rowData.createdAt} type="date" />}
                sortable
              />
              <Column field="cliente.identificacion" header="Identificacion" sortable />
              <Column field="cliente.primerNombre" header="Cliente" sortable />

              {
                <Column
                  body={(rowData) => (
                    <Grid container md={12} spacing={1}>
                      <Grid xs={12} md={6}>
                        <PaymentMoraDetailModal rowData={rowData} />
                      </Grid>
                      {/*<Grid xs={12} md={6}>
                      <ModalOption
                        titleCard={`cancelar Pago #: ${rowData.idHistorialPago}`}
                        action={'Cancelar este pago'}
                        Icono={<Block color="error" />}
                        Title={'Cancelar pago'}
                        handleModalOptionOK={() => {
                          CancelarPago(rowData);
                        }}
                      />
                    </Grid>*/}
                    </Grid>
                  )}
                />
              }
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
      <SessionFinishModal
        isOpen={isModalOpenSessionFinishModal}
        closeModalSesion={closeModalSesion}
        title={'Sesión Terminada'}
      />
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />
    </ContainerComp>
  );
};

export default HisrialMora;
