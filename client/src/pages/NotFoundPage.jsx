import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono mb-2">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          The requested page does not exist or may have been relocated.
        </p>
        <Link to="/">
          <Button icon={Home} className="w-full">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
