import { useState, useEffect } from 'react';
import axios from 'axios';

const useHttpGet = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
        setStatus(response.status);
      } catch (error) {
        console.error('Error during data fetching:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, status };
};

export default useHttpGet;
