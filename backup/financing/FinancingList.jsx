import { Close, Edit, Print } from '@mui/icons-material';
import { Box, Button, Grid, Icon, IconButton, MenuItem, TextField } from '@mui/material';
import { FinanciarService } from 'api/Services_api';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import React, { useEffect, useState } from 'react';
import { CardBody, CardText, Pagination, PaginationItem, PaginationLink, Modal } from 'reactstrap';
import PagoCreateModal from '../payment/PagoCreateModal';
import axios from 'axios';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import FinancingUpdateModal from './FinancingUpdateModal';
//import ModalPago from "src/components/Modals/ModalPago";

const url = 'http://localhost:8080/api/v1/financiamientos';

const FinancingList = () => {
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [idFinancimientoDelete, setIdFinancimientoDelete] = useState(null);
  const [modalPago, setModalPago] = useState(false);
  const [datosAEnviar, setDatosAEnviar] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  const { fetchData, data, loading, error, deleteData } = FinanciarService();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setOriginalRecords([...data]);
    setRecords([...data]);
  }, [data]);

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

  const handleFilter = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    const newData = originalRecords.filter((row) => {
      return (
        row.cliente.identificacion.toLowerCase().includes(newSearchTerm) ||
        row.cliente.primerNombre.toLowerCase().includes(newSearchTerm) ||
        row.cliente.apellidoPaterno.toLowerCase().includes(newSearchTerm)
      );
    });

    setRecords(newData);
    setCurrentPage(1);
  };

  const handleFilterEstatus = (selectedStatus) => {
    const filteredData = originalRecords.filter((row) => {
      if (selectedStatus === 'true') {
        return row.estado === true;
      } else if (selectedStatus === 'false') {
        return row.estado === false;
      }
      return true;
    });

    setRecords(filteredData);
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = records.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageNumbers = Math.ceil(records.length / itemsPerPage);

    return (
      <Pagination className="d-flex flex-column align-items-end">
        {[...Array(pageNumbers)].map((_, index) => (
          <PaginationItem key={index} active={index + 1 === currentPage}>
            <PaginationLink onClick={() => handlePageClick(index + 1)}>{index + 1}</PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    );
  };

  if (loading) {
    return (
      <div className="pt-3 text-center">{/*<CSpinner color="primary" variant="grow" /> */}</div>
    );
  }

  const handleActionClick = (action, row) => {
    console.log(`Acción ${action} clickeada para ${row.title}`);
  };

  const handlePrintClick = (row) => {
    const printContent = `
      --------------------------------
      +       REcomunicaciones       +
      --------------------------------
      --------------------------------
      + DETALLES DEL FINANCIAMIENTO  +
      --------------------------------
      + INFORMACION DEL CLIENTE      +
      --------------------------------
      Identificacion: ${row.cliente.identificacion}
      Nombre: ${row.cliente.primerNombre} ${row.cliente.apellidoPaterno}
      Telefono: ${row.cliente.telefono}
      --------------------------------
      + INFORMACION DEL DINERO       +
      --------------------------------
      Capital: ${row.capital}
      Monto: ${row.monto}
      Monto restante: ${row.montoRestante}
      Tasa: ${row.tasaPorcentaje}
      Tiempo: ${row.tiempo}
      Estado: ${row.estado ? 'Activo' : 'Inactivo'}
      --------------------------------
      --------------------------------
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(
      `<html><head><title>${row.cliente.primerNombre} ${row.cliente.apellidoPaterno}</title></head><body>`
    );
    printWindow.document.write(`<pre>${printContent}</pre>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const AbrirModaleliminar = (row) => {
    //obtengo los datos de esa fila en row
    setIdFinancimientoDelete(row.idFinanciamiento); //le asigno el id del financimaiento
    setModalEliminar(true); //abro el modal
  };

  const ConfirmarEliminacion = async () => {
    try {
      const { status, data } = await axios.delete(`${url}/${idFinancimientoDelete}`);
      if (status === 200) {
        showNotification('Eliminado correctamente', 'error');
        fetchData();
        setModalEliminar(false);
      } else {
        showNotification('No es posible eliminar este financimaineto', 'error');
      }
    } catch (error) {
      console.error('Ha ocurrido un error: ', error);
    }
  };

  const handleModalButtonClick = (rowData) => {
    setDatosAEnviar(rowData);
    setModalPago(!modalPago);
  };

  return (
    <>
      <ContainerComp>
        <>
          <SimpleCard>
            <Grid container spacing={2}>
              {/* Filtro de Búsqueda */}
              <Grid item xs={12} md={3}>
                <TextField
                  id="TextField"
                  type="search"
                  label="Filtrar"
                  onChange={handleFilter}
                  fullWidth
                />
              </Grid>

              {/* Filtro de Estado */}
              <Grid item xs={12} md={3}>
                <TextField
                  name="filterStatus"
                  select
                  value={filterStatus}
                  label="Filtrar por estado"
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    handleFilterEstatus(e.target.value);
                  }}
                  fullWidth
                >
                  <MenuItem value="null">Activos y finalizados</MenuItem>
                  <MenuItem value="true">Activos</MenuItem>
                  <MenuItem value="false">Finalizados</MenuItem>
                </TextField>
              </Grid>

              {/* Elementos por Página */}
              <Grid item xs={12} md={3}>
                <TextField
                  name="itemsPerPage"
                  select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  required
                  fullWidth
                >
                  <MenuItem value="5">Mostrar 5</MenuItem>
                  <MenuItem value="10">Mostrar 10</MenuItem>
                  <MenuItem value="20">Mostrar 20</MenuItem>
                  <MenuItem value="50">Mostrar 50</MenuItem>
                </TextField>
              </Grid>

              {/* Paginación */}
              <Grid item xs={12} md={3}>
                {renderPagination()}
              </Grid>
            </Grid>
          </SimpleCard>
        </>

        <CardBody>
          <Grid container>
            {currentItems.map((row) => (
              <Grid xs={12} md={4} key={row.idFinanciamiento}>
                <Box margin={1}>
                  <SimpleCard title={'Detalles del financiamiento'}>
                    <CardBody>
                      <CardText>
                        <strong>Cliente</strong>
                        <hr className="m-1" />
                        <div>
                          <strong>Identificación:</strong> {row.cliente.identificacion}
                        </div>
                        <div>
                          <strong>Nombre:</strong> {row.cliente.primerNombre}{' '}
                          {row.cliente.apellidoPaterno}
                        </div>
                      </CardText>

                      <CardText>
                        <strong style={!row.estado ? { color: '#08ad6c' } : { color: '#E53935' }}>
                          Financiamiento
                        </strong>
                        <hr className="m-1" />
                        <div>
                          <strong>Código:</strong> {row.idFinanciamiento}
                        </div>
                        <div>
                          <strong>Capital:</strong> {row.capital}
                        </div>
                        <div>
                          <strong>Monto:</strong> {row.monto}
                        </div>
                        <div>
                          <strong>Monto restante:</strong> {row.montoRestante}
                        </div>
                        <div>
                          <strong>Tasa:</strong> {row.tasaPorcentaje + '%'}
                        </div>
                        <div>
                          <strong>Tiempo:</strong> {row.tiempo} {row.frecuenciaPago}
                        </div>
                        <div>
                          <strong>Estado:</strong> {`${row.estado ? 'Activo' : 'Finalizado'}`}
                        </div>
                      </CardText>

                      <div className="d-flex justify-content-center">
                        <FinancingUpdateModal
                          disabled={!row.estado}
                          color="primary"
                          financingData={row}
                          onUpdate={() => fetchData()}
                        />

                        <IconButton
                          disabled={row.monto != row.montoRestante}
                          color="error"
                          onClick={() => AbrirModaleliminar(row)}
                        >
                          <Close />
                        </IconButton>

                        <PagoCreateModal
                          onClick={() => handleModalButtonClick(row)}
                          datosAEnviar={row}
                          onUpdate={fetchData}
                          disabled={!row.estado}
                        />

                        {
                          <IconButton
                            className="m-1"
                            color="info"
                            onClick={() => handlePrintClick(row)}
                          >
                            <Print />
                          </IconButton>
                        }
                      </div>
                    </CardBody>
                  </SimpleCard>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardBody>

        <Modal al backdrop="static" className="modal-lx focus" isOpen={modalEliminar}>
          <SimpleCard
            title={'Eliminar'}
            subtitle={'¿Estás seguro de que quieres eliminar este financiamiento?'}
            onClose={() => setModalEliminar(false)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" variant="contained" onClick={ConfirmarEliminacion}>
                ok
              </Button>
            </Box>
          </SimpleCard>
        </Modal>
      </ContainerComp>
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />
    </>
  );
};

export default FinancingList;
