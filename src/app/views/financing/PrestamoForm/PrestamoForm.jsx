import React, { useEffect, useState } from 'react';
import { Button, Box, Stepper, Step, StepLabel } from '@mui/material';
import { Modal } from 'reactstrap';
import { SimpleCard } from 'app/components';
import { useForm } from 'app/hooks/useForm';
import axios from 'axios';
import { CrearPrestamoURL, GetClientePorIdenteificaciondURL, getFrecuenciaPagoURL } from 'BaseURL';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const PrestamoForm = ({ startIcon, TextBtn, color, listarPrestamos }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [nombreCliente, setNombreCliente] = useState(null);
  const [frecuenciaPago, setFrecuenciaPago] = useState([]);
  const { formState, onInputChange, onResetForm, setFormState } = useForm({
    capital: null,
    tasaPorcentaje: null,
    porcentajeMora: null,
    tiempo: null,
    interes: null,
    monto: null,
    cuota: null,
    fechaInicioPago: null,
    fechaFin: null,
    estado: true,
    idCliente: null,
    idFrecuencia: null,
    frecuencia: null,
    cadaCuantosDias: null,
    diaDelMesEnNumero: null,
    nombreDiaSemana: null,
    nombreCliente: null,
    identificacion: null,
    search: null,
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
      const { status, data } = await axios.post(CrearPrestamoURL, formState);
      if (status === 200) {
        listarPrestamos();
        closeModal();
      }
      console.log(formState);
    } catch (error) {
      console.error(error);
    }
  };

  const getClienteByIdentificacion = async () => {
    try {
      const { status, data } = await axios.get(
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
    }
  };

  const getFrecuenciaPago = async () => {
    try {
      const { data, status } = await axios.get(getFrecuenciaPagoURL);
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
    }
  };

  return (
    <>
      <Button color={color} size="small" onClick={() => setIsModalOpen(true)} startIcon={startIcon}>
        {TextBtn}
      </Button>
      <Modal
        isOpen={isModalOpen}
        toggle={closeModal}
        backdrop="static"
        id="ModalPrestamo"
        className={`modal-lg`}
      >
        <SimpleCard title={'Nuevo Prestamo'} onClose={closeModal}>
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
                  onResetForm={onResetForm}
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
