import { useEffect, useState } from 'react';
import { Customer } from '../types';
import { getAllCustomers } from '../api/customerApi';

const useCustomers = (params?: any) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getAllCustomers(params)
            .then((res) => { setCustomers(res.customers); setTotal(res.total); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { customers, loading, total };
};

export default useCustomers;