import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import useReviews from "../../hooks/customer/useReviews";

const ReviewsPage = () => {
  const reviews = useReviews();

  return (
    <div className="space-y-8">
      <SectionHeader title="Reviews" subtitle="See feedback from customers across DigitalSafaris experiences." />
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5 text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{review.title}</h3>
                <p className="text-sm text-slate-400">{review.source} · {review.createdAt}</p>
              </div>
              <span className="text-sm text-emerald-400">{review.rating}</span>
            </div>
            <p className="mt-3 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
