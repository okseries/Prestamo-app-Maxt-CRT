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
import { useLocation } from 'react-router-dom';
import { BASE_URL } from 'api/ConexionAPI';

const PagoList = () => {
  const location = useLocation();
  const pagoState = location.state.pago;

  const [modalActualizarEstado, setModalActualizarEstado] = useState(false);
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [url, setUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pago, setPago] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');
  const [state, setState] = useState(pagoState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { status, data } = await axios.get(`${BASE_URL}/pagos/informacionPago`);
      if (status === 200) {
        setRecords(data);
        setOriginalRecords(data);
      }
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
      const idString = String(row.idPago);
      return (
        row.cliente.toLowerCase().includes(newSearchTerm) ||
        idString.toLowerCase().includes(newSearchTerm)
      );
    });
    setRecords(newData);
  };

  const handlePrintClick = (row) => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprobante de Pago</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 10px;
            font-size: 12px;
          }
  
          h2, h3 {
            color: #333;
            border-bottom: 1px solid #333;
            padding-bottom: 3px;
          }
  
          strong {
            color: #555;
          }
  
          .info-section {
            margin-bottom: 10px;
          }
  
          .footer {
            margin-top: 10px;
            font-size: 10px;
            color: #777;
          }
  
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <h2>REcomunicaciones</h2>
  
        <h3>Comprobante de Pago</h3>
  
        <div class="info-section">
          <strong>Cliente:</strong> ${row.cliente}
        </div>
  
        <div class="info-section">
          <strong>Id transaccion:</strong> ${row.idTransaccion}<br>
          <strong>Id del pago:</strong> ${row.montoPago}<br>
          <strong>Monto restante:</strong> ${row.prestamo.montoRestante}<br>
          <strong>Fecha de pago:</strong> ${row.fechaPago}
        </div>
  
        <div class="footer">
          <p>Este documento es un comprobante de pago generado por REcomunicaciones.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
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

      const { status } = await axios.put(`${BASE_URL}/pagos/${pago.id}`, nuevoPago);

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
          <Grid xs={12} spacing={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid xs={12} md={4}>
              <TextField
                fullWidth
                type="search"
                onChange={filtroGeneral}
                placeholder="Nombre o Id Pago"
              />
            </Grid>
          </Grid>
        </Grid>
        <CardBody>
          <Box width="100%" overflow="auto">
            <StyledTable align="center">
              <TableHead>
                <TableRow>
                  <TableCell width={70}>Id pago</TableCell>
                  <TableCell>Id prestamo</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Estado anterior</TableCell>
                  <TableCell width={45} align="center" />
                  <TableCell width={45} align="center" />
                </TableRow>
              </TableHead>

              <TableBody>
                {records.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{`${row.idPago}`}</TableCell>
                    <TableCell>{`${row.idPrestamo}`}</TableCell>
                    <TableCell>{`${row.monto}`}</TableCell>
                    <TableCell>{`${row.fecha}`}</TableCell>
                    <TableCell>{`${row.cliente}`}</TableCell>
                    <TableCell>{`${row.estado}`}</TableCell>
                    <TableCell>{`${row.estadoAnterior}`}</TableCell>

                    <TableCell>
                      <IconButton
                        color="success"
                        variant="contained"
                        onClick={() => handlePrintClick(row)}
                      >
                        <Print />
                      </IconButton>
                    </TableCell>

                    <TableCell>
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
