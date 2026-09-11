// app/workspace/[workspaceId]/documents/[docId]/page.tsx
'use client';
import React, { useState } from 'react';
import { Download, Upload, Shield, History, UserCheck, Trash2 } from 'lucide-react';

export default function DocumentDetailPage() {
  const [versionHistory, setVersionHistory] = useState([
    { version: 'v2.0', uploadedBy: 'Sarah Connor', date: '2026-09-10 14:32' },
    { version: 'v1.0', uploadedBy: 'John Doe', date: '2026-09-01 10:00' },
  ]);

  const [permissions, setPermissions] = useState([
    { user: 'alex@company.com', role: 'Editor' },
    { user: 'jane@company.com', role: 'Viewer' },
  ]);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newRole, setNewRole] = useState('Viewer');

  const handleGrantPermission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail) return;
    setPermissions([...permissions, { user: newUserEmail, role: newRole }]);
    setNewUserEmail('');
  };

  const handleRevokePermission = (email: string) => {
    setPermissions(permissions.filter((p) => p.user !== email));
  };

  const handleNewVersionUpload = () => {
    const nextVer = `v${versionHistory.length + 1}.0`;
    setVersionHistory([
      { version: nextVer, uploadedBy: 'Current User', date: new Date().toISOString().slice(0, 16).replace('T', ' ') },
      ...versionHistory,
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Top Details Header */}
      <div className="bg-white p-6 border rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Q3_Financial_Report.pdf</h1>
          <p className="text-sm text-gray-500">Current Version: {versionHistory[0].version}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium">
            <Download className="w-4 h-4" /> Download
          </button>
          <button onClick={handleNewVersionUpload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
            <Upload className="w-4 h-4" /> Upload New Version
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        {/* Version History (Req 22) */}
        <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500 text-black" /> Version History
          </h2>
          <ul className="divide-y text-sm">
            {versionHistory.map((ver, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{ver.version}</p>
                  <p className="text-xs text-gray-500">By {ver.uploadedBy} on {ver.date}</p>
                </div>
                <button className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                  <Download className="w-3 h-3" /> Fetch
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Access Management Interface (Req 23) */}
        <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500 text-black" /> Access Management
          </h2>

          <form onSubmit={handleGrantPermission} className="flex gap-2">
            <input
              type="email"
              placeholder="user@company.com"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="flex-1 border rounded-md px-3 py-1.5 text-sm"
            />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="border rounded-md text-sm px-2">
              <option value="Viewer">Viewer</option>
              <option value="Editor">Editor</option>
            </select>
            <button type="submit" className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm">Grant</button>
          </form>

          <ul className="divide-y text-sm">
            {permissions.map((p) => (
              <li key={p.user} className="py-3 flex justify-between items-center">
                <span className="font-medium">{p.user}</span>
                <div className="flex items-center gap-3">
                  <select
                    value={p.role}
                    onChange={(e) => {
                      const updated = permissions.map((item) => (item.user === p.user ? { ...item, role: e.target.value } : item));
                      setPermissions(updated);
                    }}
                    className="border rounded px-2 py-0.5 text-xs bg-gray-50"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button onClick={() => handleRevokePermission(p.user)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}