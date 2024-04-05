import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
import { CardBody, Modal } from 'reactstrap';
import { Close, Edit } from '@mui/icons-material';
import axios from 'axios';
import { ContainerComp } from 'app/components/ContainerComp';
import { SimpleCard } from 'app/components';
import { StyledTable } from 'app/components/StyledTable';
import CustomizedSnackbars from 'app/components/notification/CustomizedSnackbars';
import jwt from 'jsonwebtoken';
import { ListarUsuariosURL, LoginURL } from '../../../BaseURL';
import { baseURL } from 'api/Services_api';
import SessionFinishModal from 'app/components/Modal/SessionFinishModal';

const storedToken = localStorage.getItem('accessToken');

const { idSucursal } = jwt.decode(storedToken);

const UserAdmin = () => {
  const initialState = {
    idUsuario: '',
    usuarioCorreo: '',
    nombre: '',
    clave: '',
    repetirclave: '',
    estado: true,
    idSucursal: idSucursal,
  };

  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('');

  const [isModalOpenSessionFinishModal, setIsModalOpenSessionFinishModal] = useState(false);
  const closeModalSesion = () => {
    setIsModalOpenSessionFinishModal(false);
  };

  useEffect(() => {
    fetchUsers(); // Fetch initial user data
  }, []);

  useEffect(() => {
    setRecords([...users]);
    setOriginalRecords([...users]);
  }, [users]);

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

  const fetchUsers = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data } = await axiosInstance.get(ListarUsuariosURL);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    }
  };

  const handleTextFieldPasswordChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'repetirclave') {
      setPasswordMatch(formData.clave === e.target.value);
    }
  };

  const clearForm = () => {
    setFormData(initialState);
    setValidated(false);
  };

  const editUser = (row) => {
    setFormData({
      idUsuario: row.idUsuario,
      usuarioCorreo: row.usuarioCorreo,
      nombre: row.nombre,
      clave: row.clave,
      repetirclave: row.clave,
      estado: row.estado,
    });
  };

  const handleFilter = (event) => {
    const newSearchTerm = event.target.value.toLowerCase();
    setFilter(newSearchTerm);

    const newData = originalRecords.filter((row) => {
      return (
        row.usuarioCorreo.toLowerCase().includes(newSearchTerm) ||
        row.nombre.toString().toLowerCase().includes(newSearchTerm)
      );
    });
    setRecords(newData);
  };

  const openDeleteModal = (idUsuario) => {
    setUserIdToDelete(idUsuario);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || formData.clave.length < 8 || !passwordMatch) {
      e.stopPropagation();
      setValidated(true);
      showNotification('Datos erroneos', 'error');
    } else {
      formData.idUsuario ? await updateUserData() : await createUserData();
    }
  };

  const createUserData = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { idUsuario, repetirclave, ...newUserData } = formData;

      const { status } = await axiosInstance.post(LoginURL, newUserData);

      if (status === 200) {
        showNotification('El usuario ha sido creado!', 'success');
        fetchUsers();
        clearForm();
      }
    } catch (error) {
      console.error('Error creating user:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    }
  };

  const updateUserData = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { repetirclave, ...newUserData } = formData;
      console.log('formData ', formData);
      const { status } = await axiosInstance.put(
        `${baseURL}/usuarios/${newUserData.idUsuario}`,
        newUserData
      );

      if (status === 200) {
        showNotification('El usuario ha sido actualizado!', 'success');
        fetchUsers();
        clearForm();
      }
    } catch (error) {
      console.error('Error updating user:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
    }
  };

  const deleteUserData = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { status } = await axiosInstance.delete(`${baseURL}/usuarios/${userIdToDelete}`);
      if (status === 200) {
        showNotification('El usuario ha sido eliminado!', 'success');
        fetchUsers();
        closeDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting user:', error);

      if (error.response && error.response.status === 403) {
        setIsModalOpenSessionFinishModal(true);
      }
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
      <Grid container spacing={2}>
        {/* User List */}
        <Grid item xs={12} md={6}>
          <SimpleCard title={'Lista de usuarios'}>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Grid xs={12} md={6}>
                <TextField type="search" value={filter} onChange={handleFilter} />
              </Grid>
            </Box>

            <CardBody>
              <Box width="100%" overflow="auto">
                <StyledTable>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Correo</TableCell>
                      <TableCell align="center">Nombre</TableCell>
                      <TableCell align="center">Estado</TableCell>
                      <TableCell width={45} align="right" />
                      <TableCell width={45} align="right" />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {records.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{row.usuarioCorreo}</TableCell>
                        <TableCell align="center">{`${row.nombre}`}</TableCell>
                        <TableCell align="center">
                          {row.estado ? 'Habilitado' : 'Hinabilitado'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            variant="contained"
                            onClick={() => editUser(row)}
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            color="error"
                            variant="contained"
                            onClick={() => openDeleteModal(row.idUsuario)}
                          >
                            <Close />
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
          </SimpleCard>
        </Grid>

        {/* User Registration/Update Form */}
        <Grid item xs={12} md={6}>
          <SimpleCard title={'Registrar / Actualizar usuario'}>
            <form autoComplete="off" noValidate validated={validated} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* User ID */}
                <Grid item xs={12} md={4}>
                  <TextField
                    className="bg-white"
                    type="number"
                    name="id"
                    id="TextField"
                    label="ID"
                    value={formData.idUsuario}
                    onChange={handleTextFieldPasswordChange}
                    disabled
                    placeholder=""
                  />
                </Grid>

                {/* User Email */}
                <Grid item xs={12} md={4}>
                  <TextField
                    type="email"
                    name="usuarioCorreo"
                    id="TextField"
                    label="Correo"
                    required
                    value={formData.usuarioCorreo}
                    onChange={handleTextFieldPasswordChange}
                  />
                </Grid>

                {/* User Name */}
                <Grid item xs={12} md={4}>
                  <TextField
                    type="text"
                    id="TextField"
                    name="nombre"
                    label="Nombre"
                    required
                    value={formData.nombre}
                    onChange={handleTextFieldPasswordChange}
                  />
                </Grid>

                {/* Password */}
                <Grid item xs={12} md={4}>
                  <TextField
                    type={'password'}
                    name="clave"
                    label="Clave"
                    required
                    minLength={8}
                    value={formData.clave}
                    onChange={handleTextFieldPasswordChange}
                    autoComplete="none"
                  />
                </Grid>

                {/* Repeat Password */}
                <Grid item xs={12} md={4}>
                  <TextField
                    type={'password'}
                    name="repetirclave"
                    label="Repetir clave"
                    required
                    minLength={8}
                    error={!passwordMatch}
                    value={formData.repetirclave}
                    onChange={handleTextFieldPasswordChange}
                  />
                </Grid>

                {/* User State */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Estado"
                    name="estado"
                    select
                    required
                    value={formData.estado}
                    onChange={handleTextFieldPasswordChange}
                    fullWidth
                  >
                    <MenuItem value={true}>Habilitado</MenuItem>
                    <MenuItem value={false}>Deshabilitado</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <hr />
              <Box display={'flex'} justifyContent={'end'}>
                <Button className="mr-1" variant="contained" color="secondary" onClick={clearForm}>
                  Limpiar
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {formData.idUsuario ? 'Actualizar' : 'Crear'}
                </Button>
              </Box>
            </form>
          </SimpleCard>
        </Grid>
      </Grid>

      {userIdToDelete && (
        <Modal all backdrop="static" className="modal-lx focus" isOpen={deleteModal}>
          <SimpleCard
            title={'Cancelar pago'}
            subtitle={'¿Estás seguro de que quieres eliminar este usuario?'}
            onClose={() => setDeleteModal(false)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" variant="contained" onClick={deleteUserData}>
                Ok
              </Button>
            </Box>
          </SimpleCard>
        </Modal>
      )}
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

UserAdmin.displayName = 'UserAdmin';

export default UserAdmin;
