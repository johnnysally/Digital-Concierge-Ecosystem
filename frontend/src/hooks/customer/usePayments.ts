import { useEffect, useState } from 'react';
import { Payment } from '../../types/customer';
import { getPaymentHistory } from '../../api/customer/paymentApi';

const usePayments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        getPaymentHistory()
            .then((res) => setPayments(res.payments || []))
            .catch(() => setPayments([]));
    }, []);

    return payments;
};

export default usePayments;