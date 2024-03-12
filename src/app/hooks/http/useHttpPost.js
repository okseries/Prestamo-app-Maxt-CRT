// En useHttpPost.js
import { useState } from 'react';
import axios from 'axios';

const useHttpPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null); // Agrega un estado para la respuesta

  const sendPostRequest = async (url, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, data);
      setResponse({ status: response.status, data: response.data }); // Guarda la respuesta
      return response.data; // Devuelve solo los datos de la respuesta
    } catch (error) {
      setError(error.response?.data || 'Ha ocurrido un error en la solicitud.');
      setResponse({ status: error.response?.status, data: undefined }); // Guarda la respuesta de error
      return undefined; // Devuelve undefined en caso de error
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, sendPostRequest };
};

export default useHttpPost;
