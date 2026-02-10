import { useState, useEffect, useCallback } from 'react';

const useFetch = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiFunc();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [apiFunc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, setData, fetchData };
};

export default useFetch;
