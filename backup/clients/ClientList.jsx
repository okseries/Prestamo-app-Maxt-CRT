import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Modal, ModalBody } from 'reactstrap';
import ClienteUpdateModal from './ClienteUpdateModal';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import { StyledTable } from 'app/components/StyledTable';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import FinancingCreate from '../financing/FinancingCreateModal';
import { ConfirmationNumber, OneK } from '@mui/icons-material';

const url = 'http://localhost:8080/api/v1/clientes';

const ClientList = () => {
  const [records, setRecords] = useState([]);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  useEffect(() => {
    fetchData();
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

  const handleFilter = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = records.filter((row) =>
    Object.values(row).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm)
    )
  );

  const handlePdfButtonClick = () => {
    console.log('Botón PDF clickeado');
  };

  const handleDeleteClient = (id) => {
    setClientIdToDelete(id);
    setModalEliminar(true);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const { data } = response;
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onHandleEliminarCliente = async () => {
    try {
      const response = await axios.delete(`${url}/${clientIdToDelete}`);
      if (response.status === 200) {
        setClientIdToDelete(null);
        fetchData();
        showNotification('¡El cliente ha sido eliminado!', 'success');
      }
    } catch (error) {
      console.error('Error during client deletion:', error);
      showNotification('¡El cliente no se puede eliminar!', 'error');
    } finally {
      setModalEliminar(false);
    }
  };

  const handleCloseModal = () => {
    setModalEliminar(false);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <ContainerComp>
      <SimpleCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <Button variant="contained" color="primary" onClick={handlePdfButtonClick}>
            PDF
          </Button>

          <TextField
            id="input"
            className="text-center"
            type="search"
            onChange={handleFilter}
            placeholder="Filtrar"
          />
        </Box>

        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left">Identificacion</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Apellido</TableCell>
                <TableCell align="center">Telefono</TableCell>
                <TableCell align="center">Correo</TableCell>
                <TableCell align="center">Donde labora</TableCell>
                <TableCell align="center">Direccion</TableCell>
                <TableCell width={'40'} align="center"></TableCell>
                <TableCell width={'40'} align="center"></TableCell>
                <TableCell width={'40'} align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.identificacion}</TableCell>
                    <TableCell align="center">{`${row.primerNombre} ${row.segundoNombre}`}</TableCell>
                    <TableCell align="center">{`${row.apellidoPaterno} ${row.apellidoMaterno}`}</TableCell>
                    <TableCell align="center">{row.telefono}</TableCell>
                    <TableCell align="center">{row.correo}</TableCell>
                    <TableCell align="center">{row.dondeLabora}</TableCell>
                    <TableCell align="center">{row.direccion}</TableCell>
                    <TableCell align="right">
                      <FinancingCreate clientData={row} />
                    </TableCell>
                    <TableCell align="right">
                      <ClienteUpdateModal clientData={row} onUpdate={() => fetchData()} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDeleteClient(row.id)}>
                        <CloseIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </StyledTable>
        </Box>

        <TablePagination
          sx={{ margin: 'auto', alignSelf: 'flex-end' }}
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Modal
          backdrop="static"
          className="modal-lx focus"
          isOpen={modalEliminar}
          toggle={() => setModalEliminar(!modalEliminar)}
        >
          <SimpleCard
            title={'Eliminar'}
            subtitle={'¿Estás seguro de que quieres eliminar este cliente?'}
            onClose={() => setModalEliminar(!modalEliminar)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" variant="contained" onClick={onHandleEliminarCliente}>
                ok
              </Button>
            </Box>
          </SimpleCard>
        </Modal>
      </SimpleCard>
      {/* Componente de notificación */}
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
