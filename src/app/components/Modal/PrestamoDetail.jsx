import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Table,
} from '@mui/material';
import Formatter from 'app/components/Formatter/Formatter';
import { Modal } from 'reactstrap';
import { Info, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import { SimpleCard } from '..';
import { StyledTable } from '../StyledTable';
import { GetPrestamoByID } from 'BaseURL';

const PrestamoDetail = ({ onResetForm, handleSubmit, isAnyFieldNull, rowData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosPrestamo2, setDatosPrestamo] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
    console.log('ya cargo el prestamodetail.');
    getDetallePrestamoById();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    //console.log('ya cargo el prestamodetail.');
  }, [rowData]);

  const getDetallePrestamoById = async () => {
    try {
      const { data, status } = await axios.get(`${GetPrestamoByID}/${rowData.idPrestamo}`);
      if (status === 200) {
        setDatosPrestamo(data);
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error('Ha ocurrido un error: ', error);
    }
  };

  const prueba = () => {
    console.log(datosPrestamo2);
  };
  // Datos del préstamo
  const datosPrestamo = {
    idPrestamo: 10,
    capital: '5000.00',
    tasaPorcentaje: '3.00',
    porcentajeMora: '2.00',
    tiempo: 5,
    interes: '750.00',
    monto: '5750.00',
    cuota: '1150.00',
    fechaInicioPago: '2024-04-08',
    fechaFin: null,
    estado: true,
    idCliente: 1,
    idSucursal: 1,
    createdAt: '2024-04-01T14:57:59.000Z',
    updatedAt: '2024-04-02T17:00:13.000Z',
    detalleFrecuencia: [
      {
        idDetalleFrecuencia: 8,
        idPrestamo: 10,
        idFrecuencia: 3,
        cadaCuantosDias: null,
        diaDelMesEnNumero: null,
        nombreDiaSemana: 'Lunes',
        createdAt: '2024-04-01T14:57:59.000Z',
        updatedAt: '2024-04-01T14:57:59.000Z',
        frecuenciaPago: {
          idFrecuencia: 3,
          descripcion: 'Semanal',
          createdAt: '2024-03-23T16:13:25.000Z',
          updatedAt: '2024-03-23T16:13:25.000Z',
        },
      },
    ],
    cliente: {
      idCliente: 1,
      identificacion: '402-0005249-9',
      primerNombre: 'Milaurys',
      segundoNombre: '',
      apellidoPaterno: 'Contreras',
      apellidoMaterno: 'Popa1236',
      telefono: '829-848-2490',
      correo: 'Milaurys@gmail.com',
      direccion: 'Santo Domingo',
      ingresos: '18000.00',
      dondeLabora: 'Colegio Amapola',
      estado: true,
      idSucursal: 1,
      createdAt: '2024-03-20T12:34:35.000Z',
      updatedAt: '2024-04-02T16:57:09.000Z',
    },
    cuotas: [
      {
        idCuota: 115,
        numeroCuota: 1,
        fechaCuota: '2024-04-08T00:00:00.000Z',
        montoCuota: '1150.00',
        montoPagado: '1150.00',
        estado: 'Aplicado',
        idPrestamo: 10,
        idSucursal: 1,
        createdAt: '2024-04-02T16:54:15.000Z',
        updatedAt: '2024-04-02T16:59:04.000Z',
        mora: [],
        detallePago: [
          {
            idDetallePago: 105,
            estadoAnterior: 'Pendiente',
            idCuota: 115,
            montoPagado: '1150.00',
            idHistorialPago: 86,
            idSucursal: 1,
            createdAt: '2024-04-02T16:59:04.000Z',
            updatedAt: '2024-04-02T16:59:04.000Z',
            historialPago: {
              idHistorialPago: 86,
              monto: '1150.00',
              estado: 'Aplicado',
              createdAt: '2024-04-02T16:59:04.000Z',
              updatedAt: '2024-04-02T16:59:04.000Z',
              idSucursal: 1,
              idCliente: 1,
            },
          },
        ],
      },
      {
        idCuota: 116,
        numeroCuota: 2,
        fechaCuota: '2024-04-15T00:00:00.000Z',
        montoCuota: '1150.00',
        montoPagado: '1150.00',
        estado: 'Aplicado',
        idPrestamo: 10,
        idSucursal: 1,
        createdAt: '2024-04-02T16:54:15.000Z',
        updatedAt: '2024-04-02T17:00:13.000Z',
        mora: [],
        detallePago: [
          {
            idDetallePago: 106,
            estadoAnterior: 'Pendiente',
            idCuota: 116,
            montoPagado: '1000.00',
            idHistorialPago: 87,
            idSucursal: 1,
            createdAt: '2024-04-02T16:59:25.000Z',
            updatedAt: '2024-04-02T16:59:25.000Z',
            historialPago: {
              idHistorialPago: 87,
              monto: '1000.00',
              estado: 'Aplicado',
              createdAt: '2024-04-02T16:59:25.000Z',
              updatedAt: '2024-04-02T16:59:25.000Z',
              idSucursal: 1,
              idCliente: 1,
            },
          },
          {
            idDetallePago: 107,
            estadoAnterior: 'PagoParcial',
            idCuota: 116,
            montoPagado: '150.00',
            idHistorialPago: 88,
            idSucursal: 1,
            createdAt: '2024-04-02T17:00:13.000Z',
            updatedAt: '2024-04-02T17:00:13.000Z',
            historialPago: {
              idHistorialPago: 88,
              monto: '3600.00',
              estado: 'Aplicado',
              createdAt: '2024-04-02T17:00:13.000Z',
              updatedAt: '2024-04-02T17:00:13.000Z',
              idSucursal: 1,
              idCliente: 1,
            },
          },
        ],
      },
      {
        idCuota: 117,
        numeroCuota: 3,
        fechaCuota: '2024-04-22T00:00:00.000Z',
        montoCuota: '1150.00',
        montoPagado: '1150.00',
        estado: 'Aplicado',
        idPrestamo: 10,
        idSucursal: 1,
        createdAt: '2024-04-02T16:54:15.000Z',
        updatedAt: '2024-04-02T17:00:13.000Z',
        mora: [],
        detallePago: [
          {
            idDetallePago: 108,
            estadoAnterior: 'Pendiente',
            idCuota: 117,
            montoPagado: '1150.00',
            idHistorialPago: 88,
            idSucursal: 1,
            createdAt: '2024-04-02T17:00:13.000Z',
            updatedAt: '2024-04-02T17:00:13.000Z',
            historialPago: {
              idHistorialPago: 88,
              monto: '3600.00',
              estado: 'Aplicado',
              createdAt: '2024-04-02T17:00:13.000Z',
              updatedAt: '2024-04-02T17:00:13.000Z',
              idSucursal: 1,
              idCliente: 1,
            },
          },
        ],
      },
      {
        idCuota: 118,
        numeroCuota: 4,
        fechaCuota: '2024-04-29T00:00:00.000Z',
        montoCuota: '1150.00',
        montoPagado: '1150.00',
        estado: 'Aplicado',
        idPrestamo: 10,
        idSucursal: 1,
        createdAt: '2024-04-02T16:54:15.000Z',
        updatedAt: '2024-04-02T17:00:13.000Z',
        mora: [],
        detallePago: [
          {
            idDetallePago: 109,
            estadoAnterior: 'Pendiente',
            idCuota: 118,
            montoPagado: '1150.00',
            idHistorialPago: 88,
            idSucursal: 1,
            createdAt: '2024-04-02T17:00:13.000Z',
            updatedAt: '2024-04-02T17:00:13.000Z',
            historialPago: {
              idHistorialPago: 88,
              monto: '3600.00',
              estado: 'Aplicado',
              createdAt: '2024-04-02T17:00:13.000Z',
              updatedAt: '2024-04-02T17:00:13.000Z',
              idSucursal: 1,
              idCliente: 1,
            },
          },
        ],
      },
      {
        idCuota: 119,
        numeroCuota: 5,
        fechaCuota: '2024-05-06T00:00:00.000Z',
        montoCuota: '1150.00',
        montoPagado: '1150.00',
        estado: 'Aplicado',
        idPrestamo: 10,
        idSucursal: 1,
        createdAt: '2024-04-02T16:54:15.000Z',
        updatedAt: '2024-04-02T17:00:13.000Z',
        mora: [],
        detallePago: [
          {
            idDetallePago: 110,
            estadoAnterior: 'Pendiente',
            idCuota: 119,
            montoPagado: '1150.00',
            idHistorialPago: 88,
            idSucursal: 1,
            createdAt: '2024-04-02T17:00:13.000Z',
            updatedAt: '2024-04-02T17:00:13.000Z',
            historialPago: {
              idHistorialPago: 88,
              monto: '3600.00',
              estado: 'Aplicado',
              createdAt: '2024-04-02T17:00:13.000Z',
              updatedAt: '2024-04-02T17:00:13.000Z',
              idSucursal: 1,
              idCliente: 1,
            },
          },
        ],
      },
    ],
    sucursal: {
      idSucursal: 1,
      nombreSucursal: 'PYP',
      estadoSucursal: true,
      createdAt: '2024-03-20T12:34:21.000Z',
      updatedAt: '2024-03-20T12:34:21.000Z',
    },
  };

  const Row = ({ cuota }) => {
    const [open, setOpen] = useState(false);

    const handleExpandClick = () => {
      setOpen(!open);
    };

    return (
      <>
        <TableRow>
          <TableCell align="center">
            <IconButton aria-label="expand row" size="small" onClick={handleExpandClick}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell align="center">{cuota.idCuota}</TableCell>
          <TableCell align="center">{cuota.numeroCuota}</TableCell>
          <TableCell align="center">{cuota.montoCuota}</TableCell>
          <TableCell align="center">{cuota.fechaCuota}</TableCell>
          <TableCell align="center">{cuota.estado}</TableCell>
        </TableRow>
        {open && (
          <TableRow>
            <TableCell align="center" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  component="div"
                  style={{ margin: '10px 0' }}
                >
                  Hsitorial de Moras para la Cuota #{cuota.numeroCuota}
                </Typography>
                <Table size="small" aria-label="detalle-moras">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID Mora</TableCell>
                      <TableCell align="center">Monto</TableCell>
                      <TableCell align="center">Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cuota.mora.map((mora) => (
                      <TableRow key={mora.idMora}>
                        <TableCell align="center">{mora.idMora || 'null'}</TableCell>
                        <TableCell align="center">{mora.monto || 'null'}</TableCell>
                        <TableCell align="center">{mora.fecha || 'null'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <>
      <Tooltip title="Ver Detalle">
        <IconButton onClick={openModal}>
          <Info color="primary" />
        </IconButton>
      </Tooltip>
      <Modal all backdrop="static" className="modal-lg focus" isOpen={isModalOpen}>
        <SimpleCard onClose={closeModal}>
          <Typography variant="h6" align="center" gutterBottom>
            Detalles del Prestamo
          </Typography>
          <List>
            <Grid container spacing={2}>
              <ListItem>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="#:" secondary={datosPrestamo.idPrestamo} />
                </Grid>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Capital:" secondary={datosPrestamo.capital} />
                </Grid>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText
                    primary="Tasa de interes:"
                    secondary={datosPrestamo.tasaPorcentaje}
                  />
                </Grid>
              </ListItem>
              <ListItem>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText
                    primary="Porcentaje de mora:"
                    secondary={datosPrestamo.porcentajeMora}
                  />
                </Grid>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Cantidad de pago:" secondary={datosPrestamo.tiempo} />
                </Grid>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Interes:" secondary={datosPrestamo.interes} />
                </Grid>
              </ListItem>

              <ListItem>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Monto:" secondary={datosPrestamo.monto} />
                </Grid>

                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Cuota Inicial:" secondary={datosPrestamo.cuota} />
                </Grid>

                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText
                    primary="Frecuencia de pago:"
                    secondary={datosPrestamo.detalleFrecuencia[0].frecuenciaPago.descripcion}
                  />
                </Grid>
              </ListItem>
            </Grid>
          </List>
          <hr />

          <Typography variant="h6" align="center" gutterBottom>
            Detalles del Cliente
          </Typography>

          <List>
            <Grid container spacing={2}>
              <ListItem>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Nombre:" secondary={datosPrestamo.cliente.primerNombre} />
                </Grid>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText
                    primary="Apellido:"
                    secondary={datosPrestamo.cliente.apellidoPaterno}
                  />
                </Grid>
                <Grid textAlign={'center'} md={4} xs={6}>
                  <ListItemText primary="Telefono:" secondary={datosPrestamo.cliente.telefono} />
                </Grid>
              </ListItem>
            </Grid>
          </List>
          <hr />

          <Typography variant="h6" align="center" gutterBottom>
            Detalles de cuotas
          </Typography>

          <Table size="small" aria-label="detalle-cuotas">
            <TableHead>
              <TableRow>
                <TableCell align="center" />
                <TableCell align="center">Id cuota</TableCell>
                <TableCell align="center">Cuota #</TableCell>
                <TableCell align="center">Monto</TableCell>
                <TableCell align="center">Fecha de Vencimiento</TableCell>
                <TableCell align="center">Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosPrestamo.cuotas.map((cuota) => (
                <Row key={cuota.idCuota} cuota={cuota} />
              ))}
            </TableBody>
          </Table>

          <Button onClick={prueba}>prueba</Button>
        </SimpleCard>
      </Modal>
    </>
  );
};

export default PrestamoDetail;
