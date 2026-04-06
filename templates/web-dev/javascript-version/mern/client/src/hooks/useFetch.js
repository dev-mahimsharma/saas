import { useState, useEffect } from 'react';
import api from '@/api/axiosInstance';

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(url)
            .then(res => setData(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, error, loading };
};
