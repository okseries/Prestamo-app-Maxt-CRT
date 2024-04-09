import React, { useEffect, useState } from 'react';
import { Add, Close, Delete, Edit, PersonAdd, Search, Update } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import {
  ActualizarClienteURL,
  GenerarCuotaURL,
  ListaPrestamoURL,
  ListarClientesURL,
  markClienteAsDeletedURL,
} from '../../../BaseURL';
import ClientForm from './ClientForm';
import Formatter from 'app/components/Formatter/Formatter';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';
import ModalOption from 'app/components/Modal/ModalOption';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';

const ClientList = () => {
  const [filters1, setFilters1] = useState();
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selected, setSelected] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);

  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

  useEffect(() => {
    setLoading2(true);
    listarClientes();
    initFilters1();
  }, []);

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
          <ClientForm
            selectedRows={selectedRows}
            listarClientes={listarClientes}
            Icono={selected ? <Edit color="warning" /> : <PersonAdd color="success" />}
            Title={selected ? 'Editar' : 'Nuevo'}
          />
          <ModalOption
            action={`eliminar este cliente`}
            Title={'Eliminar'}
            titleCard={`Eliminar Cliente #: ${selectedRows.idCliente}`}
            Icono={<Delete />}
            color={'error'}
            disabled={selected ? false : true}
            size={'large'}
            handleModalOptionOK={() => {
              markClienteAsDeleted(selectedRows);
            }}
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

  const listarClientes = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      // Realizar la solicitud utilizando Axios configurado
      const { data, status } = await axiosInstance.get(ListarClientesURL);
      setClientes(data);
    } catch (error) {
      console.error('error al obtener los clientes');

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    } finally {
      setLoading1(false); // Asegúrate de cambiar el estado a false.
    }
  };

  const markClienteAsDeleted = async (selectedRows) => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data } = await axiosInstance.put(
        `${markClienteAsDeletedURL}/${selectedRows.idCliente}`
      );

      if (data.response === 'success') {
        showNotification(`${data.message}`, 'success');
        listarClientes();
      } else {
        showNotification(`${data.message}`, 'error');
      }
    } catch (error) {}
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
      setSelected(false); // No hay filas seleccionadas
      return;
    }

    setSelectedRows(e.value);
    setSelected(true); // Hay filas seleccionadas
  };

  const header1 = renderHeader1();

  return (
    <ContainerComp>
      <SimpleCard title={'Lista de clientes'}>
        <Grid>
          <Grid xs={12} md={12}>
            <DataTable
              className="table bg-white p-datatable"
              value={clientes}
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
              selectionMode="single"
              selection={selectedRows}
              onSelectionChange={handleRowSelect}
              rowClassName={(rowData, rowIndex) =>
                rowIndex % 2 === 0 ? 'p-datatable-row-even' : 'p-datatable-row-odd'
              } // Aplicar estilos a filas alternas
            >
              <Column selectionMode="single" style={{ width: '3em' }} />
              <Column field="idCliente" header="#" />
              <Column field="identificacion" header="Identificacion" />
              <Column field="primerNombre" header="Nombre" sortable />
              <Column field="apellidoPaterno" header="Apellido" sortable />
              <Column field="telefono" header="Teléfono" />
              <Column field="correo" header="Correo" />
              <Column
                field="ingresos"
                header="Ingresos"
                sortable
                body={(rowData) => <Formatter value={rowData.ingresos} type="currency" />}
              />
              <Column field="dondeLabora" header="Trabajo" sortable />
              <Column field="direccion" header="Dirección" sortable />
            </DataTable>
          </Grid>
        </Grid>
        <ClientForm selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
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

export default ClientList;
