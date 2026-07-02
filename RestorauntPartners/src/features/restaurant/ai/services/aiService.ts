import { askAIAssistant as askAIAssistantApi } from '../../../../shared/services/restaurantService';

export async function askAIAssistant(query: string) {
  return askAIAssistantApi(query);
}
