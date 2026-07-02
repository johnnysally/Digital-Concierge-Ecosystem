import {
  fetchNotifications as fetchNotificationsApi,
  markNotificationRead as markNotificationReadApi,
} from '../../../../shared/services/restaurantService';

export async function fetchNotifications() {
  return fetchNotificationsApi();
}

export async function markNotificationRead(id: string) {
  return markNotificationReadApi(id);
}
