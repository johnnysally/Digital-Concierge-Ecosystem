import { useEffect, useState } from 'react';
import { Partner } from '../types';
import { getAllPartners } from '../api/partnerApi';

const usePartners = (params?: any) => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        getAllPartners(params)
            .then((res) => { setPartners(res.partners); setTotal(res.total); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { partners, loading, total };
};

export default usePartners;