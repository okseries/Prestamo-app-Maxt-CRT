// useHttpDelete.js

import { useState } from 'react';
import axios from 'axios';

const useHttpDelete = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executeDelete };
};

export default useHttpDelete;
