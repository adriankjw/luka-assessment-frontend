'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Building2, AlertCircle } from 'lucide-react';

export default function WorkspaceManager() {
  // Initial state for workspaces
  const [workspaces, setWorkspaces] = useState([
    { id: '1', name: 'Acme Corp', role: 'Owner', membersCount: 12 },
    { id: '2', name: 'Personal Projects', role: 'Admin', membersCount: 1 },
    { id: '3', name: 'Design Team', role: 'Member', membersCount: 5 },
  ]);

  // Form & UI States
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  // Handle Creating a Workspace
  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const newWorkspace = {
      id: Date.now().toString(),
      name: newWorkspaceName.trim(),
      role: 'Owner',
      membersCount: 1,
    };

    setWorkspaces([...workspaces, newWorkspace]);
    setNewWorkspaceName('');
    setIsCreating(false);
  };

  // Handle Deleting a Workspace
  const handleDeleteWorkspace = () => {
    if (!workspaceToDelete) return;
    setWorkspaces(workspaces.filter((ws) => ws.id !== workspaceToDelete.id));
    setWorkspaceToDelete(null);
  };

  return (
    <div className="w-full min-h-screen p-6 md:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-white-900">Workspaces</h1>
          <p className="text-sm text-gray-500 pb-2">Manage your workspaces</p>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
            <Plus className="w-4 h-4" />
            Create Workspace
          </button>
        </div>
      </div>

      {/* Workspace List */}
      <div className="grid gap-4">
        {workspaces.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No workspaces found</h3>
            <p className="text-sm text-gray-500 mt-1">Get started by creating a new workspace.</p>
          </div>
        ) : (
          workspaces.map((ws) => (
            <div
              key={ws.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                      {ws.role}
                    </span>
                    <span>•</span>
                    <span>{ws.membersCount} {ws.membersCount === 1 ? 'member' : 'members'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setWorkspaceToDelete(ws)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Workspace"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Workspace Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Create New Workspace</h2>
            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g. My Startup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {workspaceToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Delete Workspace</h2>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{workspaceToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWorkspaceToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteWorkspace}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}