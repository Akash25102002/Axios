import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { TableRowSkeleton } from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { formatDate, getInitials } from '../../utils/formatters';

export const TicketTable = ({ tickets, isLoading, isSearch, onResetFilter }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Ticket ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Created Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <TableRowSkeleton rows={5} />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <EmptyState
          isSearch={isSearch}
          title={isSearch ? 'No matching tickets' : 'No tickets found'}
          description={
            isSearch
              ? 'Try refining your search terms or selecting a different status filter.'
              : 'There are currently no tickets in this view.'
          }
          actionLabel={isSearch ? 'Clear Filters' : undefined}
          onAction={isSearch ? onResetFilter : undefined}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-3.5">Ticket ID</th>
              <th className="px-6 py-3.5">Customer</th>
              <th className="px-6 py-3.5">Subject</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Priority</th>
              <th className="px-6 py-3.5">Created Date</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Ticket ID */}
                <td className="px-6 py-4 font-mono font-semibold text-indigo-600 text-xs whitespace-nowrap">
                  {ticket.ticket_id}
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {getInitials(ticket.customer_name)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 leading-tight">
                        {ticket.customer_name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {ticket.customer_email || '—'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4 max-w-xs truncate text-slate-800 font-medium">
                  {ticket.subject}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Priority */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(ticket.created_at)}
                </td>

                {/* Action View */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <Link
                    to={`/tickets/${ticket.ticket_id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 transition-colors"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <div key={ticket.ticket_id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">
                {ticket.ticket_id}
              </span>
              <div className="flex items-center gap-1.5">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                {ticket.subject}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{ticket.customer_name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 truncate max-w-[150px]">{ticket.customer_email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(ticket.created_at)}</span>
              </div>

              <Link
                to={`/tickets/${ticket.ticket_id}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
              >
                <span>View</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketTable;
