import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-indigo-600`} />
      {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />
  );
};

export const TableRowSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b border-slate-100">
          <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
          <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
          <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
          <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
        </tr>
      ))}
    </>
  );
};

export default LoadingSpinner;
