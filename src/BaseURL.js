import jwt from 'jsonwebtoken';

const storedToken = localStorage.getItem('accessToken');
const { idSucursal } = jwt.decode(storedToken);

const baseURL = 'http://localhost:8080/api/v1';
const sucursalURL = `sucursal/${idSucursal}`;

// Rutas de cuotas
export const GenerarCuotaURL = `${baseURL}/cuotas`;
export const PagarCuotaURL = `${baseURL}/cuotas/pagar`;
export const GetCuotasQueVencenHoyURL = `${baseURL}/cuotas/vencenHoy/${sucursalURL}`;
export const MarkDeletedCuotasPorIdPrestamo = `${baseURL}/cuotas/deleted/prestamos`;

// Rutas de clientes
export const CrearClienteURL = `${baseURL}/clientes/${sucursalURL}`;
export const ListarClientesURL = `${baseURL}/clientes/${sucursalURL}`;
export const GetClientePorIdenteificaciondURL = `${baseURL}/clientes/${sucursalURL}/identificacion`;
export const ActualizarClienteURL = `${baseURL}/clientes`;
export const markClienteAsDeletedURL = `${baseURL}/clientes/deleted`;

// Rutas de préstamos
export const ListaPrestamoURL = `${baseURL}/prestamos/${sucursalURL}`;
export const CrearPrestamoURL = `${baseURL}/prestamos/${sucursalURL}`;
export const GetPrestamoByID = `${baseURL}/prestamos`;
export const UpdatePrestamoByID = `${baseURL}/prestamos`;
export const DeletePrestamoByID = `${baseURL}/prestamos`;
export const GetPrestamosConCuotasVencidas = `${baseURL}/prestamos/vencidos/${sucursalURL}`;

// Rutas de sucursales
export const GetSucursalURL = `${baseURL}/sucursales/${sucursalURL}`;

// Rutas de usuarios
export const LoginURL = `${baseURL}/usuarios/${sucursalURL}`;
export const ListarUsuariosURL = `${baseURL}/usuarios/${sucursalURL}`;

// Otras rutas
export const getFrecuenciaPagoURL = `${baseURL}/frecuenciaPagos`;
export const HistorialPagosURL = `${baseURL}/historialPagos/${sucursalURL}`;
export const GenerarMoraURL = `${baseURL}/moras/sucursal/${idSucursal}`;
export const GetDetallePagos = `${baseURL}/detallePagos/historialPago`;
export const UCancelarHistorialDePago = `${baseURL}/historialPagos/cancelarPago`;
export const GetMorasURL = `${baseURL}/moras/sucursal/${idSucursal}`;

//Dashboard
export const DashboardURL = `${baseURL}/gestorFinanciero/${sucursalURL}`;

//Mora
export const GenerarMoraPorIdCuotaURL = `${baseURL}/moras/cuota`;
