import React, { useEffect, useState } from 'react';
import { Button, Box, Stepper, Step, StepLabel, IconButton, Tooltip } from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';
import { CrearPrestamoURL, GetClientePorIdenteificaciondURL, getFrecuenciaPagoURL } from 'BaseURL';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { Add, AddAPhoto } from '@mui/icons-material';

const PrestamoForm = ({ Title, Icono, color, listarPrestamos, rowData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [nombreCliente, setNombreCliente] = useState(null);
  const [frecuenciaPago, setFrecuenciaPago] = useState([]);
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    capital: rowData?.capital || null,
    tasaPorcentaje: rowData?.tasaPorcentaje || null,
    porcentajeMora: rowData?.porcentajeMora || null,
    tiempo: rowData?.tiempo || null,
    interes: rowData?.interes || null,
    monto: rowData?.monto || null,
    cuota: rowData?.cuota || null,
    fechaInicioPago: rowData?.fechaInicioPago || null,
    fechaFin: rowData?.fechaFin || null,
    estado: rowData?.estado || true,
    idCliente: rowData?.idCliente || null,
    idFrecuencia: rowData?.detalleFrecuencia[0]?.frecuenciaPago?.idFrecuencia || null,
    frecuencia: rowData?.detalleFrecuencia[0]?.frecuenciaPago?.descripcion || null,
    cadaCuantosDias: rowData?.detalleFrecuencia[0]?.cadaCuantosDias || null,
    diaDelMesEnNumero: rowData?.detalleFrecuencia[0]?.diaDelMesEnNumero || null,
    nombreDiaSemana: rowData?.detalleFrecuencia[0]?.nombreDiaSemana || null,
    nombreCliente: rowData?.cliente?.primerNombre + ' ' + rowData?.cliente?.apellidoPaterno || null,
    identificacion: rowData?.cliente?.identificacion || null,
    search: rowData?.cliente.identificacion || null,
  });

  useEffect(() => {
    getFrecuenciaPago();
  }, []);

  const steps = [
    'Datos del Cliente',
    'Detalles del Préstamo',
    'Configuración del Préstamo',
    'Resumen',
  ];

  //const fechaInicioPago = new Date(formState.fechaInicioPago);
  //const diaDelMesEnNumero = fechaInicioPago.split('-')[2];
  //const options = { weekday: 'long' };
  //const diaEnTexto = fechaInicioPago.toLocaleDateString('es-ES', options);

  const closeModal = () => {
    setIsModalOpen(false);
    setStep(0);
    onResetForm();
  };

  const handleSubmit = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { status, data } = await axiosInstance.post(CrearPrestamoURL, formState);
      if (status === 200) {
        listarPrestamos();
        closeModal();
      }
      console.log(formState);
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
  };

  const handleSubmitUpdate = () => {
    alert('handleSubmitUpdate');
  };

  const getClienteByIdentificacion = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { status, data } = await axiosInstance.get(
        `${GetClientePorIdenteificaciondURL}/${formState.search}`
      );
      if (status === 200) {
        const nombreCliente = data ? `${data.primerNombre} ${data.apellidoPaterno}` : '';
        const identificacion = data ? `${data.identificacion}` : '';
        const idCliente = data ? `${data.idCliente}` : '';
        setFormState((prevState) => ({
          ...prevState,
          nombreCliente: nombreCliente,
          identificacion: identificacion,
          idCliente: idCliente,
        }));
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
  };

  const getFrecuenciaPago = async () => {
    try {
      // Obtener el token de autorización del almacenamiento local
      const storedToken = localStorage.getItem('accessToken');

      // Configurar Axios para incluir el token en el encabezado Authorization
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const { data, status } = await axiosInstance.get(getFrecuenciaPagoURL);
      if (status === 200) {
        setFrecuenciaPago(data);
        const defaultIdFrecuencia = data.length > 0 ? data[0].idFrecuencia : null;
        const frecuenciaDescripcion = data.length > 0 ? data[0].descripcion : null;
        setFormState((prevState) => ({
          ...prevState,
          idFrecuencia: defaultIdFrecuencia,
          frecuencia: frecuenciaDescripcion,
        }));
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 403) {
        // El token ha expirado o es inválido
        // Aquí puedes mostrar una alerta o mensaje al usuario para que vuelva a iniciar sesión
        // También puedes redirigir al usuario a la página de inicio de sesión
        // history.push('/login'); // Asegúrate de importar history de 'react-router-dom'
      }
    }
  };

  return (
    <>
      <Tooltip title={Title}>
        <IconButton color={color} onClick={() => setIsModalOpen(true)}>
          {Icono}
        </IconButton>
      </Tooltip>
      <Modal
        isOpen={isModalOpen}
        toggle={closeModal}
        backdrop="static"
        id="ModalPrestamo"
        className={`modal-lg`}
      >
        <SimpleCard title={'Resumen Prestamo'} onClose={closeModal}>
          <Box>
            <>
              {step === 0 && (
                <Step1
                  onInputChange={onInputChange}
                  setClienteInfo={setClienteInfo}
                  getClienteByIdentificacion={getClienteByIdentificacion}
                  formState={formState}
                />
              )}
              {step === 1 && (
                <Step2
                  onInputChange={onInputChange}
                  formState={formState}
                  setFormState={setFormState}
                />
              )}
              {step === 2 && (
                <Step3
                  onInputChange={onInputChange}
                  onSubmit={handleSubmit}
                  clienteInfo={clienteInfo}
                  formState={formState}
                  setFormState={setFormState}
                  frecuenciaPago={frecuenciaPago}
                />
              )}
              {step === 3 && (
                <Step4
                  onInputChange={onInputChange}
                  onSubmit={handleSubmit}
                  clienteInfo={clienteInfo}
                  frecuenciaPago={frecuenciaPago}
                  formState={formState}
                  handleSubmit={handleSubmit}
                  handleSubmitUpdate={handleSubmitUpdate}
                  onResetForm={onResetForm}
                  rowData={rowData}
                />
              )}
            </>
            <Stepper className="mt-8" activeStep={step} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} onClick={() => setStep(index)}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </SimpleCard>
      </Modal>
    </>
  );
};
export default PrestamoForm;
