import React, { useState } from 'react';
import { MessageSquarePlus, Clock, MessageSquare } from 'lucide-react';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatters';

export const NotesSection = ({ notes = [], onAddNote, isSubmitting }) => {
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setError('Please enter a note before submitting');
      return;
    }
    setError('');
    onAddNote(noteText.trim(), () => {
      setNoteText('');
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Internal Notes & Activity
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {/* Notes List / Timeline */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No notes recorded yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Add internal updates, follow-up notes, or troubleshooting details below.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-slate-200">
            {notes.map((note, index) => (
              <div key={note.id || index} className="relative group">
                {/* Timeline Dot */}
                <span className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 shadow-xs" />

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-sm hover:border-slate-300 transition-colors">
                  <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {note.note_text}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-100 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Add New Note
        </label>
        <textarea
          rows={3}
          placeholder="Write internal support notes, troubleshooting logs, or customer phone notes..."
          value={noteText}
          onChange={(e) => {
            setNoteText(e.target.value);
            if (error) setError('');
          }}
          disabled={isSubmitting}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            icon={MessageSquarePlus}
          >
            Add Note
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotesSection;
