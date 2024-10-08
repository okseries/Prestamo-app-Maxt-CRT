import React, { useState, useEffect } from 'react';
import { CardBody, Modal } from 'reactstrap';
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
import { ContainerComp } from 'app/components/ContainerComp';
import { SimpleCard } from 'app/components';
import { StyledTable } from 'app/components/StyledTable';
import { Close, Edit } from '@mui/icons-material';
import axios from 'axios';

const url = 'http://localhost:8080/api/v1/usuarios';

const UserAdmin = () => {
  const initialState = {
    id: '',
    usuarioCorreo: '',
    nombre: '',
    clave: '',
    repetirclave: '',
    estado: true,
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

  const fetchUsers = async () => {
    const { data } = await axios.get(url);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers(); // Fetch initial user data
  }, []);

  useEffect(() => {
    setRecords([...users]);
    setOriginalRecords([...users]);
  }, [users]);

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
      id: row.id,
      usuarioCorreo: row.usuarioCorreo,
      nombre: row.nombre,
      clave: row.clave,
      repetirclave: '',
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

  const openDeleteModal = (id) => {
    setUserIdToDelete(id);
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
    } else {
      formData.id ? await updateUserData() : await createUserData();
    }
  };

  const createUserData = async () => {
    try {
      const { id, repetirclave, ...newUserData } = formData;

      const { status } = await axios.post(`${url}`, newUserData);
      alert(status);

      if (status === 201) {
        fetchUsers();
        clearForm();
      }
    } catch (error) {
      console.error('Ha ocurrido un error: ', error);
    }
  };

  const updateUserData = async () => {
    try {
      const { repetirclave, ...newUserData } = formData;
      const { status } = await axios.put(`${url}/${newUserData.id}`, newUserData);
      alert(status);

      if (status === 201) {
        fetchUsers();
        clearForm();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUserData = async () => {
    try {
      const { status } = await axios.delete(`${url}/${userIdToDelete}`);
      if (status === 200) {
        fetchUsers();
        closeDeleteModal();
      }
    } catch (error) {
      console.error('Ha ocurrido un error al intentar eliminar este usuario: ', error);
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
                      <TableCell width={45} align="right" />
                      <TableCell width={45} align="right" />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {records.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">{row.usuarioCorreo}</TableCell>
                        <TableCell align="center">{`${row.nombre}`}</TableCell>

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
                            onClick={() => openDeleteModal(row.id)}
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
                    value={formData.id}
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
                    invalid={!passwordMatch}
                    value={formData.repetirclave}
                    onChange={handleTextFieldPasswordChange}
                  />
                </Grid>

                {/* User State */}
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Estado"
                    name="estado"
                    type="select"
                    required
                    value={formData.estado}
                    onChange={handleTextFieldPasswordChange}
                  >
                    <MenuItem value={true}>Activo</MenuItem>
                    <MenuItem value={false}>Inactivo</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <hr />
              <Box className="d-flex justify-content-evenly w-75">
                <Button variant="contained" color="secondary" onClick={clearForm}>
                  Limpiar
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {formData.id ? 'Actualizar' : 'Crear'}
                </Button>
              </Box>
            </form>
          </SimpleCard>
        </Grid>
      </Grid>

      <Modal al backdrop="static" className="modal-lx focus" isOpen={deleteModal}>
        <SimpleCard
          title={'Cancelar pago'}
          subtitle={'¿Estás seguro de que quieres eliminar este usuario?'}
          onClose={() => setDeleteModal(false)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="primary" variant="contained" onClick={deleteUserData}>
              ok
            </Button>
          </Box>
        </SimpleCard>
      </Modal>
    </ContainerComp>
  );
};

UserAdmin.displayName = 'UserAdmin';

export default UserAdmin;
