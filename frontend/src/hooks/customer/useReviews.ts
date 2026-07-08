import { useEffect, useState } from "react";
import { Review } from "../../types/customer";
import { getReviews } from "../../api/customer/reviewApi";

const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  return reviews;
};

export default useReviews;
