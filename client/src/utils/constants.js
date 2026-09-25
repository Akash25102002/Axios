export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const STATUS_LIST = ['All', 'Open', 'In Progress', 'Closed'];

export const STATUS_CONFIG = {
  Open: {
    label: 'Open',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/20',
    dot: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    bgLight: 'bg-emerald-50/50'
  },
  'In Progress': {
    label: 'In Progress',
    color: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/20',
    dot: 'bg-amber-500',
    iconColor: 'text-amber-600',
    bgLight: 'bg-amber-50/50'
  },
  Closed: {
    label: 'Closed',
    color: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20',
    dot: 'bg-slate-400',
    iconColor: 'text-slate-500',
    bgLight: 'bg-slate-50'
  }
};

export const PRIORITY_CONFIG = {
  High: {
    label: 'High',
    color: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/20',
    dot: 'bg-rose-500'
  },
  Medium: {
    label: 'Medium',
    color: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/20',
    dot: 'bg-amber-500'
  },
  Low: {
    label: 'Low',
    color: 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/20',
    dot: 'bg-blue-500'
  }
};
