import jwt from 'jsonwebtoken';

const storedToken = localStorage.getItem('accessToken');
const { idSucursal } = jwt.decode(storedToken);

const baseURL = 'http://localhost:8080/api/v1';
const sucursalURL = `/sucursal/${idSucursal}`;

export const GenerarCuotaURL = `${baseURL}/cuotas`;
export const CrearClienteURL = `${baseURL}/clientes${sucursalURL}`;
export const ListaPrestamoURL = `${baseURL}/prestamos${sucursalURL}`;
export const LoginURL = `${baseURL}/usuarios${sucursalURL}`;
export const ListarUsuariosURL = `${baseURL}/usuarios${sucursalURL}`;
export const ListarClientesURL = `${baseURL}/clientes${sucursalURL}`;
export const PagarCuotaURL = `${baseURL}/cuotas/pagar`;
export const CrearPrestamoURL = `${baseURL}/prestamos${sucursalURL}`;
export const GetClientePorIdURL = `${baseURL}/clientes`;

//http://localhost:8080/api/v1/prestamos/sucursal/1
