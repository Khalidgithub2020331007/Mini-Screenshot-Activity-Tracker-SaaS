

'use client'
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/app/api/axios';

const Add_ScreenShots: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // Mutation for uploading
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setMessage('Screenshot uploaded successfully!');
      setFile(null);
      setPreviewUrl(null);
      console.log('Uploaded screenshot:', data);
    },
    onError: () => {
      setMessage('Failed to upload screenshot');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      console.log(reader,'----------')
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    uploadMutation.mutate(file);
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Screenshot</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {previewUrl && (
          <div className="text-center">
            <p className="text-gray-600 mb-2">Preview:</p>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-48 object-cover mx-auto rounded border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={uploadMutation.isPending}
          className={`w-full p-3 rounded text-white ${
            uploadMutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
        </button>

        {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Add_ScreenShots;
