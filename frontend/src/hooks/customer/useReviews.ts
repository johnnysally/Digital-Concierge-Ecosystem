import { useEffect, useState } from 'react';
import { Review } from '../../types/customer';
import { getMyReviews } from '../../api/customer/reviewApi';

const useReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        getMyReviews()
            .then((res) => setReviews(res.reviews || []))
            .catch(() => setReviews([]));
    }, []);

    return reviews;
};

export default useReviews;