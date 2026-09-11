// components/UIStates.tsx
import React from 'react';
import { AlertCircle, Lock, FolderOpen, Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 text-gray-500">
    <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
    <p>{message}</p>
  </div>
);

export const EmptyState = ({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-gray-50 text-center">
    <FolderOpen className="w-12 h-12 text-gray-400 mb-3" />
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-1 mb-4">{description}</p>
    {action}
  </div>
);

export const UnauthorizedState = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-lg border border-red-200">
    <Lock className="w-12 h-12 text-red-500 mb-3" />
    <h3 className="text-lg font-semibold text-red-900">Access Denied</h3>
    <p className="text-sm text-red-600 mt-1">You do not have permission to view this resource.</p>
  </div>
);

export const ErrorState = ({ message, retry }: { message?: string; retry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-amber-50 rounded-lg border border-amber-200">
    <AlertCircle className="w-12 h-12 text-amber-500 mb-3" />
    <h3 className="text-lg font-semibold text-amber-900">Something went wrong</h3>
    <p className="text-sm text-amber-700 mt-1 mb-4">{message || 'An unexpected error occurred.'}</p>
    {retry && (
      <button onClick={retry} className="px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700">
        Try Again
      </button>
    )}
  </div>
);