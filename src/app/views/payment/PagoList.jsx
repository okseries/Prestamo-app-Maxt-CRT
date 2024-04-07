import React, { useEffect, useState } from 'react';
import { Box, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { HistorialPagosURL, UpdateHistorialDePago } from 'BaseURL';
import Formatter from 'app/components/Formatter/Formatter';
import PaymentDetailModal from '../../components/Modal/PaymentDetailModal';
import { Cancel, Search } from '@mui/icons-material';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';
import ModalOption from 'app/components/Modal/ModalOption';

const PagoList = () => {
  const [historialPago, setHistorialPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters1, setFilters1] = useState();
  const [globalFilterValue1, setGlobalFilterValue1] = useState('');
  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

  useEffect(() => {
    initFilters1();
  }, []);

  const actualizarHistorialPago = async (rowData) => {
    try {
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const estado = {
        estado: 'Cancelado',
      };

      const { data, status } = await axiosInstance.put(
        `${UpdateHistorialDePago}/${rowData.idHistorialPago}`,
        estado
      );

      if (status === 200) {
        alert('El pago ha sido cancelado');
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

  useEffect(() => {
    const fetchHistorialPago = async () => {
      try {
        // Obtener el token de autorización del almacenamiento local
        const storedToken = localStorage.getItem('accessToken');

        // Configurar Axios para incluir el token en el encabezado Authorization
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const { data } = await axiosInstance.get(HistorialPagosURL);
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
              <Column
                body={(rowData) => (
                  <Grid container md={12} spacing={1}>
                    <Grid md={5}>
                      <PaymentDetailModal rowData={rowData} />
                    </Grid>
                    <Grid md={5}>
                      <ModalOption
                        titleCard={'Cancelar Pago'}
                        action={'Cancelar este pago'}
                        Icono={<Cancel color="error" />}
                        Title={'Cancelar pago'}
                        handleModalOptionOK={() => {
                          actualizarHistorialPago(rowData);
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              />
            </DataTable>
          </Grid>
        </Grid>
      </SimpleCard>
      <SessionFinishModal
        isOpen={isModalOpenSessionFinishModal}
        closeModalSesion={closeModalSesion}
        title={'Sesión Terminada'}
      />
    </ContainerComp>
  );
};

export default PagoList;
