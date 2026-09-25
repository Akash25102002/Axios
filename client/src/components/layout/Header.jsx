import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import Button from '../common/Button';

export const Header = ({ onOpenSidebar, title, subtitle, showCreateButton = true }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title || 'SupportFlow CRM'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {subtitle || 'Customer Support Management'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showCreateButton && (
          <Link to="/tickets/new">
            <Button icon={Plus} size="sm" className="hidden sm:inline-flex">
              Create Ticket
            </Button>
            <Button icon={Plus} size="sm" className="sm:hidden px-3">
              New
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
