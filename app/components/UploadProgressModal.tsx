// components/UploadProgressModal.tsx
'use client';
import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadProgressModal({ isOpen, onClose, onUploadComplete }: { isOpen: boolean; onClose: () => void; onUploadComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setErrorMsg('');
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setStatus('uploading');
    setProgress(0);

    // Simulated Progress Upload
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate random success/failure
          const isSuccess = Math.random() > 0.2;
          if (isSuccess) {
            setStatus('success');
            onUploadComplete();
          } else {
            setStatus('error');
            setErrorMsg('Network error: Failed to upload file to storage.');
          }
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Upload Document</h2>

        {status === 'idle' && (
          <div className="space-y-4">
            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <button onClick={handleUpload} disabled={!file} className="w-full py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300">
              Start Upload
            </button>
          </div>
        )}

        {status === 'uploading' && (
          <div className="space-y-3 text-center py-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Uploading {file?.name}...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-4 text-green-600 space-y-2">
            <CheckCircle className="w-12 h-12 mx-auto" />
            <p className="font-semibold">Document Uploaded Successfully!</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm">Close</button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-4 text-red-600 space-y-2">
            <AlertCircle className="w-12 h-12 mx-auto" />
            <p className="font-semibold">Upload Failed</p>
            <p className="text-xs text-red-500">{errorMsg}</p>
            <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md text-sm">Retry Upload</button>
          </div>
        )}
      </div>
    </div>
  );
}