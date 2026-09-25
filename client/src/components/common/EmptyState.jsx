import React from 'react';
import { Inbox, SearchX, Plus } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: CustomIcon,
  title = 'No tickets found',
  description = 'No customer tickets match the selected criteria.',
  actionLabel,
  onAction,
  isSearch = false
}) => {
  const Icon = CustomIcon || (isSearch ? SearchX : Inbox);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={Plus} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
