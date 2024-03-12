// useHttpPut.js

import { useState } from 'react';
import axios from 'axios';

const useHttpPut = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executePut = async (putData) => {
    try {
      setLoading(true);
      const response = await axios.put(url, putData);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePut };
};

export default useHttpPut;
