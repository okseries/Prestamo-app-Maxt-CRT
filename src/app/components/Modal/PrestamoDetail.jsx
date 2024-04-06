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
import { Modal } from 'reactstrap';
import { Info, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import axios from 'axios';
import { SimpleCard } from '..';
import { StyledTable } from '../StyledTable';
import { GetPrestamoByID } from 'BaseURL';
import Formatter from '../Formatter/Formatter';

const PrestamoDetail = ({ rowData }) => {
  const [isModalOpenPrestamoDetail, setIsModalOpenPrestamoDetail] = useState(false);
  const [datosPrestamo, setDatosPrestamo] = useState({});

  const openModalPrestamoDetail = () => {
    setIsModalOpenPrestamoDetail(true);
    getDetallePrestamoById();
  };

  const closeModalPrestamoDetail = () => {
    setIsModalOpenPrestamoDetail(false);
  };

  const getDetallePrestamoById = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, status } = await axiosInstance.get(`${GetPrestamoByID}/${rowData.idPrestamo}`);
      if (status === 200) {
        setDatosPrestamo(data);
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error('Ha ocurrido un error: ', error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
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
          <TableCell align="center">
            {<Formatter value={cuota.montoCuota} type={'currency'} />}
          </TableCell>
          <TableCell align="center">
            {<Formatter value={cuota.fechaCuota} type={'dateUTC'} />}
          </TableCell>
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
                  Historial de Moras para la Cuota #{cuota.numeroCuota}
                </Typography>

                <Table size="small" aria-label="detalle-moras" className="table-danger">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">ID Mora</TableCell>
                      <TableCell align="center">Monto</TableCell>
                      <TableCell align="center">Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {datosPrestamo.cuotas &&
                      cuota.mora.map((mora) => (
                        <TableRow key={mora.idMora}>
                          <TableCell align="center">{mora.idMora}</TableCell>
                          <TableCell align="center">
                            {<Formatter value={mora.montoMora} type={'currency'} />}
                          </TableCell>
                          <TableCell align="center">
                            {<Formatter value={mora.createdAt} type={'date'} />}
                          </TableCell>
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

  const body = () => {
    return (
      <>
        <Typography variant="h6" align="center" gutterBottom>
          Detalles del Prestamo
        </Typography>
        <List>
          <Grid container spacing={2}>
            <ListItem>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText primary="ID del Préstamo:" secondary={datosPrestamo.idPrestamo} />
              </Grid>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText
                  primary="Capital:"
                  secondary={<Formatter value={datosPrestamo.capital} type={'currency'} />}
                />
              </Grid>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText
                  primary="Tasa de interes:"
                  secondary={`${datosPrestamo.tasaPorcentaje}%`}
                />
              </Grid>
            </ListItem>
            <ListItem>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText
                  primary="Porcentaje de mora:"
                  secondary={`${datosPrestamo.porcentajeMora}%`}
                />
              </Grid>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText primary="Cantidad de pago:" secondary={datosPrestamo.tiempo} />
              </Grid>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText
                  primary="Interes:"
                  secondary={<Formatter value={datosPrestamo.interes} type={'currency'} />}
                />
              </Grid>
            </ListItem>

            <ListItem>
              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText
                  primary="Monto:"
                  secondary={<Formatter value={datosPrestamo.monto} type={'currency'} />}
                />
              </Grid>

              <Grid textAlign={'center'} md={4} xs={6}>
                <ListItemText
                  primary="Cuota Inicial:"
                  secondary={<Formatter value={datosPrestamo.cuota} type={'currency'} />}
                />
              </Grid>

              <Grid textAlign={'center'} md={4} xs={6}>
                {datosPrestamo && datosPrestamo.cliente && (
                  <ListItemText
                    primary="Frecuencia de pago:"
                    secondary={datosPrestamo.detalleFrecuencia[0].frecuenciaPago.descripcion}
                  />
                )}
              </Grid>
            </ListItem>
            <ListItem>
              <Grid textAlign={'center'} md={12} xs={12}>
                {datosPrestamo &&
                  datosPrestamo.detalleFrecuencia &&
                  datosPrestamo.detalleFrecuencia.length > 0 && (
                    <ListItemText
                      primary="Detalle de la frecuencia de pago:"
                      secondary={(() => {
                        const descripcion =
                          datosPrestamo.detalleFrecuencia[0].frecuenciaPago.descripcion;
                        switch (descripcion) {
                          case 'Semanal':
                            return (
                              'La cuota debe ser pagada el ' +
                              datosPrestamo.detalleFrecuencia[0].nombreDiaSemana +
                              ' de cada semana.'
                            );
                          case 'Mensual':
                            return (
                              'La cuota debe ser pagada el día ' +
                              datosPrestamo.detalleFrecuencia[0].diaDelMesEnNumero +
                              ' de cada mes.'
                            );
                          case 'Diario':
                            return (
                              'La cuota debe ser pagada cada ' +
                              datosPrestamo.detalleFrecuencia[0].cadaCuantosDias +
                              ' día.'
                            );
                          case 'Quincenal':
                            return 'La cuota debe ser pagada los 15 y los 30 de cada mes.';
                          default:
                            return 'Frecuencia de pago no especificada.';
                        }
                      })()}
                    />
                  )}
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
                {datosPrestamo && datosPrestamo.cliente && (
                  <ListItemText
                    primary="Nombre:"
                    secondary={`${datosPrestamo.cliente.primerNombre} ${datosPrestamo.cliente.apellidoPaterno}`}
                  />
                )}
              </Grid>
              <Grid textAlign={'center'} md={4} xs={6}>
                {datosPrestamo && datosPrestamo.cliente && (
                  <ListItemText
                    primary="Identificación:"
                    secondary={datosPrestamo.cliente.identificacion}
                  />
                )}
              </Grid>
              <Grid textAlign={'center'} md={4} xs={6}>
                {datosPrestamo && datosPrestamo.cliente && (
                  <ListItemText primary="Teléfono:" secondary={datosPrestamo.cliente.telefono} />
                )}
              </Grid>
            </ListItem>
          </Grid>
        </List>
        <hr />

        <Typography variant="h6" align="center" gutterBottom>
          Detalles de cuotas
        </Typography>

        <Table size="small" aria-label="detalle-cuotas" className="table-hover">
          <TableHead>
            <TableRow>
              <TableCell align="center" />
              <TableCell align="center">ID Cuota</TableCell>
              <TableCell align="center">Cuota #</TableCell>
              <TableCell align="center">Monto</TableCell>
              <TableCell align="center">Vencimiento</TableCell>
              <TableCell align="center">Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosPrestamo.cuotas &&
              datosPrestamo.cuotas.map((cuota) => <Row key={cuota.idCuota} cuota={cuota} />)}
          </TableBody>
        </Table>
      </>
    );
  };

  return (
    <>
      <Tooltip title="Ver Detalle">
        <IconButton onClick={openModalPrestamoDetail}>
          <Info color="primary" />
        </IconButton>
      </Tooltip>
      <Modal all backdrop="static" className="modal-lg focus" isOpen={isModalOpenPrestamoDetail}>
        <SimpleCard onClose={closeModalPrestamoDetail}>{body()}</SimpleCard>
      </Modal>
    </>
  );
};

export default PrestamoDetail;
