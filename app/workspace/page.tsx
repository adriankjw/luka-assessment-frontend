// app/workspace/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Building, ArrowRight } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  role: string;
}

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'ws-1', name: 'Acme Corp Marketing', role: 'Owner' },
    { id: 'ws-2', name: 'Engineering Devs', role: 'Member' },
  ]);
  const [newWsName, setNewWsName] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) {
      setValidationError('Workspace name cannot be empty.');
      return;
    }
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWsName,
      role: 'Owner',
    };
    setWorkspaces([...workspaces, newWs]);
    setNewWsName('');
    setValidationError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-black">Your Workspaces</h1>
        <p className="text-gray-600">Select a workspace to enter or create a new one.</p>
      </div>

      {/* Workspace Creation */}
      <form onSubmit={handleCreateWorkspace} className="bg-white p-4 border rounded-lg shadow-sm space-y-3">
        <h2 className="text-md font-semibold text-blue-600 text-black">Create Workspace</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. Design Team"
            value={newWsName}
            onChange={(e) => setNewWsName(e.target.value)}
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
        {validationError && <p className="text-xs text-red-500">{validationError}</p>}
      </form>

      {/* Workspace Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => (
          <div key={ws.id} className="bg-white border rounded-lg p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{ws.role}</span>
              </div>
            </div>
            <Link href={`/workspace/${ws.id}`} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              Switch <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}