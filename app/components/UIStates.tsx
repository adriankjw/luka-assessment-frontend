// components/UIStates.tsx
import React from 'react';
import { Loader2, FolderOpen, Lock, AlertTriangle, AlertCircle } from 'lucide-react';

// 1. Loading State
export function LoadingState({ message = 'Loading workspace data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-900 min-h-[300px]">
      <Loader2 className="w-8 h-8 animate-spin mb-3 text-black" />
      <p className="font-semibold text-sm text-gray-800">{message}</p>
    </div>
  );
}

// 2. Empty State
export function EmptyState({
  title = 'No items found',
  description = 'Get started by creating a new item.',
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-white text-center">
      <FolderOpen className="w-12 h-12 text-gray-400 mb-3" />
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-600 mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
}

// 3. Validation Error State (Inline Callout)
export function ValidationError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded-md text-red-900 text-xs font-semibold">
      <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// 4. Unauthorized State (403 Access Denied)
export function UnauthorizedState({ onBack }: { onBack?: () => void }) {
  return (
    <div className="max-w-md mx-auto my-12 p-8 text-center bg-red-50 rounded-lg border border-red-200 shadow-sm space-y-3">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-800">
        <Lock className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-red-950">403 - Access Denied</h3>
      <p className="text-xs text-red-800 font-medium">
        You do not have the required permissions to view or modify this resource.
      </p>
      {onBack && (
        <button
          onClick={onBack}
          className="mt-2 px-4 py-2 bg-red-900 hover:bg-red-950 text-white rounded-md text-xs font-semibold transition-colors"
        >
          Return to Safety
        </button>
      )}
    </div>
  );
}

// 5. Unexpected Error State (500 Error with Retry)
export function UnexpectedErrorState({
  message = 'An unexpected server error occurred.',
  retry,
}: {
  message?: string;
  retry?: () => void;
}) {
  return (
    <div className="max-w-md mx-auto my-12 p-8 text-center bg-amber-50 rounded-lg border border-amber-300 shadow-sm space-y-3">
      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-800">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-amber-950">Unexpected Error</h3>
      <p className="text-xs text-amber-800 font-medium">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md text-xs font-semibold transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}