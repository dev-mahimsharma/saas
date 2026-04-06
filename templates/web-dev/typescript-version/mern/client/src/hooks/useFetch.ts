import { useState, useEffect } from 'react';
import api from '@/api/axiosInstance';

export const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(url)
            .then(res => setData(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, error, loading };
};
