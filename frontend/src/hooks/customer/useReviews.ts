import { useEffect, useState } from 'react';
import { Review } from '../../types/customer';
import { getMyReviews } from '../../api/customer/reviewApi';

const useReviews = (refreshKey = 0) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getMyReviews()
            .then((res) => {
                if (!isMounted) return;
                setReviews(res.reviews || []);
                setError(null);
            })
            .catch((err) => {
                if (!isMounted) return;
                setReviews([]);
                setError(err?.response?.data?.message || 'Unable to load reviews right now.');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [refreshKey]);

    return { reviews, loading, error };
};

export default useReviews;