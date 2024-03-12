import axios from 'axios';
import { useState } from 'react';

const crearInstanciaApi = (baseURL) => axios.create({ baseURL });

const useSolicitudesApi = (apiUrl) => {
  const api = crearInstanciaApi(apiUrl);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const manejarSolicitud = async (funcionSolicitud) => {
    try {
      setLoading(true);
      const respuesta = await funcionSolicitud();

      // Verifica el código de estado
      if (respuesta.status === 200 || respuesta.status === 201) {
        // La solicitud fue exitosa (código 200 o 201)
        setData(respuesta.data);
      } else {
        // La solicitud no fue exitosa, manejar según el código de estado
        setError(`Error: ${respuesta.status} - ${respuesta.statusText}`);
        console.error(
          `La solicitud no fue exitosa. Código: ${respuesta.status}, Texto: ${respuesta.statusText}`
        );
      }
    } catch (error) {
      console.error(`Ocurrió un error: ${error.message}`);
      setError(null);
      if (error.message) {
        setError('Ocurrió un error al procesar la solicitud');
        console.log('malfry: ', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await manejarSolicitud(() => api.get(''));
  };

  const postData = async (nuevosDatos) => {
    await manejarSolicitud(() => api.post('', nuevosDatos));
  };

  const putData = async (datosActualizados) => {
    await manejarSolicitud(() => api.put(`/${datosActualizados.id}`, datosActualizados));
  };

  const deleteData = async (id) => {
    await manejarSolicitud(() => api.delete(`/${id}`));
  };

  return { fetchData, postData, putData, deleteData, data, loading, error, manejarSolicitud };
};

export default useSolicitudesApi;
