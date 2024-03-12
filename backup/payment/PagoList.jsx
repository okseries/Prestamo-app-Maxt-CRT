import React, { useEffect, useState } from 'react';
import { Button, CardBody, Modal } from 'reactstrap';
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import { Close, Edit, Print, RestartAlt } from '@mui/icons-material';
import { StyledTable } from 'app/components/StyledTable';
import { SimpleCard } from 'app/components';
import { ContainerComp } from 'app/components/ContainerComp';
import axios from 'axios';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';

const url = 'http://localhost:8080/api/v1/pagos';

const PagoList = () => {
  const [modalActualizarEstado, setModalActualizarEstado] = useState(false);
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [pago, setPago] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  const filtrarPorEstado = () => {
    if (filtroEstado === 'Todos') {
      setRecords(originalRecords);
    } else {
      const filteredData = originalRecords.filter((row) => row.estado === filtroEstado);
      setRecords(filteredData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filtrarPorEstado();
  }, [filtroEstado]);

  const fetchData = async () => {
    try {
      const response = await axios.get(url);
      setRecords(response.data);
      setOriginalRecords(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  const filtroGeneral = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    const newData = originalRecords.filter((row) => {
      const idString = String(row.id);
      return (
        row.prestamo.cliente.identificacion.toLowerCase().includes(newSearchTerm) ||
        row.prestamo.cliente.primerNombre.toString().toLowerCase().includes(newSearchTerm) ||
        row.prestamo.cliente.apellidoPaterno.toLowerCase().includes(newSearchTerm) ||
        idString.toLowerCase().includes(newSearchTerm) ||
        row.fechaPago.toLowerCase().includes(newSearchTerm)
      );
    });
    setRecords(newData);
  };

  const handlePrintClick = (row) => {
    const printContent = `
      --------------------------------
      +       REcomunicaciones       +
      --------------------------------
      --------------------------------
      +      COMPROBANTE DE PAGO     +
      --------------------------------
      --------------------------------
      Cliente: ${row.prestamo.cliente.primerNombre} ${row.prestamo.cliente.apellidoPaterno}
      --------------------------------
      ID de pago: ${row.id}
      Monto del pago: ${row.montoPago}
      Monto restante: ${row.prestamo.montoRestante}

      Fecha de pago: ${row.fechaPago}
      --------------------------------
      --------------------------------
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(
      `<html><head><title>${row.prestamo.cliente.primerNombre}</title></head><body>`
    );
    printWindow.document.write(`<pre>${printContent}</pre>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleOpenmodalActualizarEstado = (pagoRecibido) => {
    setPago(pagoRecibido);
    setModalActualizarEstado(true);
  };

  const handleClosemodalActualizarEstado = () => {
    setPago([]);
    setModalActualizarEstado(false);
  };

  const handleChangeEstado = async () => {
    try {
      const nuevoPago = {
        id: pago.id,
        fechaPago: pago.fechaPago,
        montoPago: pago.montoPago,
        estado: pago.estado === 'Aplicado' ? 'Cancelado' : 'Aplicado',
        prestamo: {
          idPrestamo: pago.prestamo.idPrestamo,
        },
      };

      const { status } = await axios.put(`${url}/${pago.id}`, nuevoPago);

      if (status === 201 || status === 200) {
        showNotification('Realizado!', 'success');
        handleClosemodalActualizarEstado();
        fetchData();
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
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
        <Grid container>
          <Grid xs={12} spacing={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid xs={12} md={4}>
              <TextField fullWidth type="search" onChange={filtroGeneral} placeholder="Filtrar" />
            </Grid>

            <Grid xs={12} md={4}>
              <TextField
                select
                onChange={(e) => setFiltroEstado(e.target.value)}
                value={filtroEstado}
                fullWidth
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Aplicado">Aplicado</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <CardBody>
          <Box width="100%" overflow="auto">
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell width={45} align="left">
                    Id
                  </TableCell>
                  <TableCell align="center">Fecha</TableCell>
                  <TableCell align="center">Monto</TableCell>
                  <TableCell align="center">Prestamo</TableCell>
                  <TableCell align="center">Cedula</TableCell>
                  <TableCell align="center">CLiente</TableCell>
                  <TableCell width={45} align="right" />
                  <TableCell width={45} align="right" />
                </TableRow>
              </TableHead>

              <TableBody>
                {records.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="center">{`${row.fechaPago}`}</TableCell>
                    <TableCell align="center">{`${row.montoPago}`}</TableCell>
                    <TableCell align="center">{row.prestamo.idPrestamo || ''}</TableCell>
                    <TableCell align="center">
                      {row.prestamo.cliente.identificacion || ''}
                    </TableCell>
                    <TableCell align="center">
                      {row.prestamo.cliente.primerNombre} {row.prestamo.cliente.apellidoPaterno}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        color="success"
                        variant="contained"
                        onClick={() => handlePrintClick(row)}
                        disabled={row.estado === 'Aplicado' ? false : true}
                      >
                        <Print />
                      </IconButton>
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        variant="contained"
                        onClick={() => handleOpenmodalActualizarEstado(row)}
                      >
                        {row.estado === 'Cancelado' ? (
                          <RestartAlt color="secondary" />
                        ) : (
                          <Close color="error" />
                        )}
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
            count={records.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardBody>

        <Modal backdrop="static" className="modal-lx focus" isOpen={modalActualizarEstado}>
          <SimpleCard
            title={'Cancelar pago'}
            subtitle={'¿Estás seguro de que quieres cambiar el estado del pago?'}
            onClose={() => setModalActualizarEstado(false)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" variant="contained" onClick={handleChangeEstado}>
                ok
              </Button>
            </Box>
          </SimpleCard>
        </Modal>
      </SimpleCard>
      <CustomizedSnackbars
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        handleClose={closeNotification}
      />
    </ContainerComp>
  );
};

export default PagoList;
