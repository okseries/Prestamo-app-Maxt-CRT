// Services_api.js
import useSolicitudesApi from './useSolicitudesApi';

const baseURL = 'http://localhost:8080/api/v1';

const ClienteService = () => useSolicitudesApi(`${baseURL}/clientes`);
const UsuarioService = () => useSolicitudesApi(`${baseURL}/usuarios`);
const PagoService = () => useSolicitudesApi(`${baseURL}/pagos`);
const FinanciarService = () => useSolicitudesApi(`${baseURL}/financiamientos`);

export { ClienteService, UsuarioService, PagoService, FinanciarService, baseURL };
