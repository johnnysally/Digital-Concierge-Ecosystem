import { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { getAllTransactions } from '../api/transactionApi';

const useTransactions = (params?: any) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getAllTransactions(params)
            .then((res) => { setTransactions(res.transactions); setTotal(res.total); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { transactions, loading, total };
};

export default useTransactions;