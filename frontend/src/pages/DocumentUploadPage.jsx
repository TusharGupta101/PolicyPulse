import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileUp,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('Aadhaar Card');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewDoc, setViewDoc] = useState(null);

  const docTypes = [
    'Aadhaar Card',
    'Income Certificate',
    'Caste Certificate',
    'Land Records',
    'Bank Passbook',
    'Ration Card',
    'Birth Certificate',
    'College ID',
    'Business Registration',
    'Other'
  ];

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('document_type', documentType);

    try {
      await documentService.uploadDocument(formData);
      setMessage({ type: 'success', text: `"${selectedFile.name}" uploaded and processed successfully!` });
      setSelectedFile(null);
      const input = document.getElementById('file-upload-input');
      if (input) input.value = '';
      await fetchDocuments();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Document upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    try {
      await documentService.deleteDocument(docId);
      setDocuments(documents.filter((d) => d.id !== docId));
      setMessage({ type: 'success', text: 'Document deleted successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete document.' });
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving citizen document vault..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
              Encrypted Evidence Vault
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#173B32]">Supporting Document Evidence Vault</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Upload PDF & image proofs to verify eligibility and unlock scheme applications.
          </p>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2 text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#173B32] mb-4 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-[#246B55]" />
          Upload New Document
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1.5">
                Document Classification <span className="text-rose-500">*</span>
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#D1C7B7] rounded-xl text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white font-medium"
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1.5">
                Select File (PDF, JPG, PNG &le; 10MB) <span className="text-rose-500">*</span>
              </label>
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="w-full text-xs text-[#6B7280] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E8F3EE] file:text-[#173B32] hover:file:bg-[#D4E8DF] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D8]">
            <span className="text-xs text-[#6B7280]">
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Max file size: 10 MB per document.'}
            </span>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-5 py-2.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <FileUp className="w-4 h-4 text-[#D9A441]" />
              {uploading ? 'Processing File...' : 'Upload & Extract Evidence'}
            </button>
          </div>
        </form>
      </div>

      {/* Vault List */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#173B32] flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-[#246B55]" />
          Uploaded Documents on File ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <FileText className="w-10 h-10 text-[#9CA3AF] mx-auto" />
            <p className="text-xs text-[#6B7280]">No documents uploaded to your vault yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-start justify-between gap-3"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
                      {doc.document_type}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">{doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : ''}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#173B32] truncate">{doc.original_filename || doc.stored_filename}</h4>
                  <p className="text-[10px] text-[#6B7280]">Uploaded: {new Date(doc.upload_time || doc.uploaded_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleDelete(doc.id, doc.original_filename || doc.stored_filename)}
                    className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
