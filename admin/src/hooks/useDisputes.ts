import { useEffect, useState } from 'react';
import { Dispute } from '../types';
import { getAllDisputes } from '../api/disputeApi';

const useDisputes = (params?: any) => {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getAllDisputes(params)
            .then((res) => { setDisputes(res.disputes); setTotal(res.total); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { disputes, loading, total };
};

export default useDisputes;