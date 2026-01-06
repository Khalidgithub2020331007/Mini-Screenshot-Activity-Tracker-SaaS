import React, { useState } from 'react';
import api from '../../api/axios'; // make sure this axios instance includes JWT header

const Add_ScreenShots: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  // Upload file
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/upload-screenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Screenshot uploaded successfully!');
      setFile(null);
      setPreviewUrl(null);

      console.log('Uploaded screenshot:', res.data);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Failed to upload screenshot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Screenshot</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* File Input */}
        <div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Preview */}
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

        {/* Upload Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {/* Message */}
        {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Add_ScreenShots;
