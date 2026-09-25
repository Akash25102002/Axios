import React from 'react';
import { STATUS_LIST } from '../../utils/constants';

export const StatusFilter = ({ selectedStatus, onSelectStatus, stats }) => {
  const getCount = (status) => {
    if (!stats) return null;
    if (status === 'All') return stats.total;
    if (status === 'Open') return stats.open;
    if (status === 'In Progress') return stats.in_progress;
    if (status === 'Closed') return stats.closed;
    return null;
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl overflow-x-auto max-w-full">
      {STATUS_LIST.map((status) => {
        const isSelected = selectedStatus === status;
        const count = getCount(status);

        return (
          <button
            key={status}
            onClick={() => onSelectStatus(status)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none ${
              isSelected
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>{status}</span>
            {count !== null && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-slate-200/70 text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
