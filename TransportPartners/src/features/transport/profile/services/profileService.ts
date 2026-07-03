import {
  fetchRiderProfile as fetchRiderProfileApi,
  updateRiderProfile as updateRiderProfileApi,
  fetchDocuments as fetchDocumentsApi,
  uploadDocument as uploadDocumentApi,
} from '../../../../shared/services/transportService';

export async function fetchRiderProfile(riderId: string) {
  return fetchRiderProfileApi(riderId);
}

export async function updateRiderProfile(riderId: string, data: any) {
  return updateRiderProfileApi(riderId, data);
}

export async function fetchDocuments() {
  return fetchDocumentsApi();
}

export async function uploadDocument(formData: FormData) {
  return uploadDocumentApi(formData);
}
