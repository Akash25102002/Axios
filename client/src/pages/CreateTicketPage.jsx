import React, { useState } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, LifeBuoy } from 'lucide-react';
import Header from '../components/layout/Header';
import TicketForm from '../components/tickets/TicketForm';
import { createTicket } from '../services/api';
import { useToast } from '../context/ToastContext';

export const CreateTicketPage = () => {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const created = await createTicket(formData);

      toast.success(
        `Ticket ${created.ticket_id} created successfully! Redirecting...`
      );

      // Navigate to the newly created ticket details page
      setTimeout(() => {
        navigate(`/tickets/${created.ticket_id}`);
      }, 700);
    } catch (err) {
      console.error('Error creating ticket:', err);
      toast.error(err.message || 'Failed to create ticket. Please verify inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-16">
      {/* Top Header */}
      <Header
        onOpenSidebar={openSidebar}
        title="Create Support Ticket"
        subtitle="Submit a customer issue or service request"
        showCreateButton={false}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-8 mt-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Ticket Details
              </h2>
              <p className="text-xs text-slate-500">
                Fill in the customer information and issue summary below.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <TicketForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;
