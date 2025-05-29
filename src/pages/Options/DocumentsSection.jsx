import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const DocumentsSection = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['documents'], (result) => {
      setDocuments(result.documents || []);
      setLoading(false);
    });
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const newDoc = {
      name: file.name,
      date: new Date().toLocaleString()
    };
    const updated = [...documents, newDoc];
    setDocuments(updated);
    chrome.storage.local.set({ documents: updated }, () => setUploading(false));
  };

  const handleDelete = (index) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    chrome.storage.local.set({ documents: updated });
  };

  if (loading) return <Card>Loading...</Card>;

  return (
    <Card>
      <SectionTitle>Documents</SectionTitle>
      <div className="flex items-center gap-4 mb-4">
        <Input type="file" onChange={handleUpload} className="w-auto" />
        {uploading && (
          <span className="text-blue-600 text-sm">Uploading...</span>
        )}
      </div>
      <ul className="mt-2 space-y-2">
        {documents.length === 0 && (
          <li className="text-gray-500">No documents uploaded.</li>
        )}
        {documents.map((doc, i) => (
          <li
            key={i}
            className="flex items-center gap-4 bg-gray-50 rounded p-2"
          >
            <span className="flex-1">
              {doc.name} <small className="text-gray-400">({doc.date})</small>
            </span>
            <Button
              variant="secondary"
              onClick={() => handleDelete(i)}
              className="px-2 py-1 text-xs"
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default DocumentsSection;
