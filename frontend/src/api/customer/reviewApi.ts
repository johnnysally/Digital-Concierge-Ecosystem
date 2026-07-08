import { apiClient } from "../axiosClient";
import { Review } from "../../types/customer";

export async function getReviews(): Promise<Review[]> {
  const response = await apiClient.get<{ reviews: Review[] }>("/customer/reviews");
  return response.data.reviews;
}
