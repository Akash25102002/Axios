import React from 'react';
import { Skeleton } from '../common/LoadingSpinner';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  variant = 'indigo',
  isLoading = false,
  description
}) => {
  const variantStyles = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      border: 'border-slate-200/80',
      ring: 'group-hover:border-indigo-300'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-slate-200/80',
      ring: 'group-hover:border-emerald-300'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-slate-200/80',
      ring: 'group-hover:border-amber-300'
    },
    slate: {
      bg: 'bg-slate-100 text-slate-600',
      border: 'border-slate-200/80',
      ring: 'group-hover:border-slate-300'
    }
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <div
      className={`group relative bg-white rounded-2xl border ${style.border} ${style.ring} p-5 shadow-xs transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <Skeleton className="h-9 w-20 mb-1" />
        ) : (
          <div className="text-3xl font-bold tracking-tight text-slate-900">
            {value ?? 0}
          </div>
        )}

        {description && (
          <p className="mt-1 text-xs text-slate-400 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
