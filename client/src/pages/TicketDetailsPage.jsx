import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Save,
  CheckCircle,
  FileText
} from 'lucide-react';
import Header from '../components/layout/Header';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import NotesSection from '../components/tickets/NotesSection';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getTicketById, updateTicket } from '../services/api';
import { formatDate, getInitials } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const TicketDetailsPage = () => {
  const { ticketId } = useParams();
  const { openSidebar } = useOutletContext();
  const { toast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [error, setError] = useState(null);

  // Fetch ticket details
  const fetchTicket = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTicketById(ticketId);
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedPriority(data.priority || 'Medium');
    } catch (err) {
      console.error('Failed to fetch ticket:', err);
      setError(err.message || 'Ticket not found or unable to load details.');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Handle status and/or priority update
  const handleSaveMeta = async () => {
    if (!ticket) return;

    const payload = {};
    if (selectedStatus && selectedStatus !== ticket.status) {
      payload.status = selectedStatus;
    }
    if (selectedPriority && selectedPriority !== ticket.priority) {
      payload.priority = selectedPriority;
    }

    if (Object.keys(payload).length === 0) {
      toast.info('No changes made to status or priority');
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateTicket(ticketId, payload);
      setTicket((prev) => ({
        ...prev,
        status: res.ticket.status,
        priority: res.ticket.priority,
        updated_at: res.updated_at
      }));
      toast.success('Ticket updated successfully!');
    } catch (err) {
      console.error('Failed to update ticket:', err);
      toast.error(err.message || 'Failed to update ticket.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding a new note
  const handleAddNote = async (noteText, onSuccess) => {
    try {
      setIsAddingNote(true);
      const res = await updateTicket(ticketId, { notes: noteText });

      if (res.note) {
        setTicket((prev) => ({
          ...prev,
          updated_at: res.updated_at,
          notes: [...prev.notes, res.note]
        }));
      }

      toast.success('Note added successfully');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add note:', err);
      toast.error(err.message || 'Failed to add note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const hasMetaChanges =
    ticket &&
    (selectedStatus !== ticket.status || selectedPriority !== (ticket.priority || 'Medium'));

  return (
    <div className="pb-16">
      <Header
        onOpenSidebar={openSidebar}
        title={`Ticket ${ticketId}`}
        subtitle="Manage ticket status, priority, and follow-up notes"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner label="Loading ticket details..." />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorMessage
            title="Ticket Not Found"
            message={error}
            onRetry={fetchTicket}
          />
        )}

        {/* Ticket Content */}
        {!isLoading && !error && ticket && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Subject, Description & Notes Activity Timeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Details Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
                {/* Header row with badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-indigo-600 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
                      {ticket.ticket_id}
                    </span>
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Created {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                    {ticket.subject}
                  </h2>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Issue Description</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                    {ticket.description}
                  </div>
                </div>

                {/* Customer Contact Card */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Customer Information
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {getInitials(ticket.customer_name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {ticket.customer_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a
                          href={`mailto:${ticket.customer_email}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {ticket.customer_email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Timeline Section */}
              <NotesSection
                notes={ticket.notes}
                onAddNote={handleAddNote}
                isSubmitting={isAddingNote}
              />
            </div>

            {/* Right Column: Actions & Metadata Sidebar */}
            <div className="space-y-6">
              {/* Status & Priority Management Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                  Ticket Controls
                </h3>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Priority Dropdown (Bonus Feature) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    disabled={isSaving}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Save Changes Button */}
                <Button
                  onClick={handleSaveMeta}
                  isLoading={isSaving}
                  disabled={!hasMetaChanges}
                  icon={Save}
                  className="w-full"
                >
                  Save Changes
                </Button>

                {hasMetaChanges && (
                  <p className="text-[11px] text-amber-600 text-center font-medium">
                    You have unsaved changes to status/priority.
                  </p>
                )}
              </div>

              {/* Metadata Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Audit Metadata
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Created
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Last Updated
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {formatDate(ticket.updated_at || ticket.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                      Resolution State
                    </span>
                    <span className="font-semibold text-slate-800 text-right">
                      {ticket.status === 'Closed' ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsPage;
