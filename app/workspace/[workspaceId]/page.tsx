// app/workspace/[workspaceId]/page.tsx
'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { Upload, FileText, Users, ArrowLeft, Loader2, FolderOpen, Lock, AlertCircle, CheckCircle, X } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  version: string;
  owner: string;
  updatedAt: string;
}

export default function WorkspaceDocumentList({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = use(params);

  // States for Req 24
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Document & Modal States (Req 20, 21)
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc-1', name: 'Q3_Financial_Report.pdf', version: 'v2.1', owner: 'Sarah Connor', updatedAt: '2026-09-10 14:32' },
    { id: 'doc-2', name: 'Product_Roadmap.docx', version: 'v1.0', owner: 'John Doe', updatedAt: '2026-09-08 09:15' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');

  // Simulating Upload Process (Req 21)
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setValidationError('Please select a file to upload.');
      return;
    }

    setValidationError('');
    setUploadStatus('uploading');
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate outcome (90% success rate)
          if (Math.random() > 0.1) {
            setUploadStatus('success');
            setDocuments((prevDocs) => [
              {
                id: `doc-${Date.now()}`,
                name: uploadFile.name,
                version: 'v1.0',
                owner: 'Current User',
                updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              },
              ...prevDocs,
            ]);
          } else {
            setUploadStatus('error');
          }
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setUploadFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setValidationError('');
  };

  // State UI Handlers (Req 24)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-700 min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-black" />
        <p className="font-medium text-sm">Loading workspace documents...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 text-center bg-red-50 rounded-lg border border-red-200">
        <Lock className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900">Access Restricted</h3>
        <p className="text-xs text-red-700 mt-1">You lack permissions to view documents in this workspace.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 text-center bg-amber-50 rounded-lg border border-amber-200">
        <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-amber-900">Unexpected Error</h3>
        <p className="text-xs text-amber-700 mt-1 mb-4">{error}</p>
        <button onClick={() => setError(null)} className="px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/workspace" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black mb-2">
            <ArrowLeft className="w-4 h-4" /> Switch Workspace
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Workspace Documents</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/workspace/${workspaceId}/members`} className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-md text-sm font-medium">
            <Users className="w-4 h-4" /> Manage Members
          </Link>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium">
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      </div>

      {/* Feature 20: Document Listing Table */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 rounded-lg bg-white text-center">
          <FolderOpen className="w-10 h-10 text-gray-400 mb-2" />
          <h3 className="text-md font-semibold text-gray-900">No documents yet</h3>
          <p className="text-xs text-gray-500 mb-4">Upload a document to get started.</p>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-black text-white text-xs rounded font-medium">
            Upload First File
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="p-3 font-semibold text-gray-900">Document Name</th>
                <th className="p-3 font-semibold text-gray-900">Current Version</th>
                <th className="p-3 font-semibold text-gray-900">Owner</th>
                <th className="p-3 font-semibold text-gray-900">Updated Time</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                  <td className="p-3">
                    <Link href={`/workspace/${workspaceId}/documents/${doc.id}`} className="flex items-center gap-2 font-semibold text-blue-600 hover:underline">
                      <FileText className="w-4 h-4 text-gray-500" /> {doc.name}
                    </Link>
                  </td>
                  <td className="p-3 font-mono text-xs text-gray-800">{doc.version}</td>
                  <td className="p-3 text-gray-900 font-medium">{doc.owner}</td>
                  <td className="p-3 text-gray-600 text-xs">{doc.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Feature 21: Document Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative border border-gray-300">
            <button onClick={resetModal} className="absolute top-4 right-4 text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Document</h2>

            {uploadStatus === 'idle' && (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => {
                    setUploadFile(e.target.files?.[0] || null);
                    setValidationError('');
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-900 font-medium hover:file:bg-gray-200 cursor-pointer"
                />
                {validationError && <p className="text-xs text-red-600">{validationError}</p>}
                <button type="submit" className="w-full py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                  Upload File
                </button>
              </form>
            )}

            {uploadStatus === 'uploading' && (
              <div className="space-y-3 text-center py-4">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-black" />
                <p className="text-xs font-semibold text-gray-900">Uploading {uploadFile?.name}...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span className="text-xs font-mono text-gray-600">{uploadProgress}%</span>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="text-center py-4 text-green-800 space-y-2">
                <CheckCircle className="w-10 h-10 mx-auto text-green-700" />
                <p className="font-bold text-sm">Upload Successful</p>
                <button onClick={resetModal} className="mt-2 px-4 py-1.5 bg-gray-100 text-gray-900 font-medium rounded text-xs">Close</button>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="text-center py-4 text-red-800 space-y-2">
                <AlertCircle className="w-10 h-10 mx-auto text-red-700" />
                <p className="font-bold text-sm">Upload Failed</p>
                <p className="text-xs text-red-600">Storage request timed out. Please try again.</p>
                <button onClick={handleUploadSubmit} className="mt-2 px-4 py-1.5 bg-red-700 text-white rounded text-xs font-semibold">Retry</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}