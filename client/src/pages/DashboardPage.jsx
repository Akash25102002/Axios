import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import SearchBar from '../components/dashboard/SearchBar';
import StatusFilter from '../components/dashboard/StatusFilter';
import TicketTable from '../components/dashboard/TicketTable';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import useDebounce from '../hooks/useDebounce';
import { getTickets, getTicketStats } from '../services/api';
import { useToast } from '../context/ToastContext';

export const DashboardPage = () => {
  const { openSidebar } = useOutletContext();
  const { toast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search term by 350ms to prevent excessive API calls while typing
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Fetch stats for KPI metric cards
  const fetchStats = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      const data = await getTicketStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Fetch tickets based on active status filter and debounced search term
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTickets({
        status: selectedStatus,
        search: debouncedSearch
      });
      setTickets(data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError(err.message || 'Unable to load tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, debouncedSearch]);

  // Initial load and stats load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refetch tickets whenever filter or search query changes
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All');
  };

  const handleRefresh = async () => {
    await Promise.all([fetchStats(), fetchTickets()]);
    toast.info('Dashboard refreshed');
  };

  return (
    <div className="pb-12">
      {/* Top Header */}
      <Header
        onOpenSidebar={openSidebar}
        title="SupportFlow CRM"
        subtitle="Customer Support Management"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {/* KPI Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tickets"
            value={stats?.total}
            icon={TicketIcon}
            variant="indigo"
            isLoading={isStatsLoading}
            description="All tickets across lifecycle"
          />
          <StatCard
            title="Open Tickets"
            value={stats?.open}
            icon={AlertCircle}
            variant="emerald"
            isLoading={isStatsLoading}
            description="Pending team assignment"
          />
          <StatCard
            title="In Progress"
            value={stats?.in_progress}
            icon={Clock}
            variant="amber"
            isLoading={isStatsLoading}
            description="Currently being investigated"
          />
          <StatCard
            title="Closed Tickets"
            value={stats?.closed}
            icon={CheckCircle2}
            variant="slate"
            isLoading={isStatsLoading}
            description="Resolved customer requests"
          />
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          {/* Search bar with debounce */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />

          {/* Right Toolbar: Segmented Status Filter + Refresh */}
          <div className="flex items-center gap-3">
            <StatusFilter
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
              stats={stats}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              icon={RefreshCw}
              className="p-2 sm:px-3 text-slate-500 hover:text-slate-700"
              title="Refresh tickets"
              aria-label="Refresh tickets"
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Tickets Content Section */}
        {error ? (
          <ErrorMessage
            title="Unable to load tickets"
            message={error}
            onRetry={fetchTickets}
          />
        ) : (
          <TicketTable
            tickets={tickets}
            isLoading={isLoading}
            isSearch={Boolean(searchTerm.trim() || selectedStatus !== 'All')}
            onResetFilter={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
