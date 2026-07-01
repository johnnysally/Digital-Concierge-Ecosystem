import axios from 'axios';

const BASE = '/api/partners/accommodation/documents';

export async function uploadDocument(formData: FormData) {
  const { data } = await axios.post(BASE, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function fetchDocuments() {
  const { data } = await axios.get(BASE);
  return data;
}
