import api from './api';

export const documentService = {
  async getDocuments() {
    const res = await api.get('/documents');
    return res.data;
  },

  async uploadDocument(formData) {
    const res = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async deleteDocument(id) {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  }
};
