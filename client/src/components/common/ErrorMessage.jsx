import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorMessage = ({
  title = 'Unable to load tickets',
  message = 'Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 my-4 max-w-lg mx-auto text-center shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700/90 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw} className="border-rose-300 text-rose-800 hover:bg-rose-100">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
