import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const TicketForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (data = formData) => {
    const errs = {};

    if (!data.customer_name.trim()) {
      errs.customer_name = 'Customer name is required';
    } else if (data.customer_name.trim().length < 2) {
      errs.customer_name = 'Name must be at least 2 characters';
    }

    if (!data.customer_email.trim()) {
      errs.customer_email = 'Customer email is required';
    } else if (!EMAIL_REGEX.test(data.customer_email.trim())) {
      errs.customer_email = 'Please enter a valid email address';
    }

    if (!data.subject.trim()) {
      errs.subject = 'Subject is required';
    } else if (data.subject.trim().length < 3) {
      errs.subject = 'Subject must be at least 3 characters';
    }

    if (!data.description.trim()) {
      errs.description = 'Description is required';
    } else if (data.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }

    return errs;
  };

  const handleChange = (field, value) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);

    if (touched[field]) {
      const fieldErrors = validate(nextData);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field]
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate();
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      customer_name: true,
      customer_email: true,
      subject: true,
      description: true,
      priority: true
    });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const priorities = [
    { value: 'Low', label: 'Low', desc: 'General queries & minor issues', dot: 'bg-blue-500' },
    { value: 'Medium', label: 'Medium', desc: 'Standard support requests', dot: 'bg-amber-500' },
    { value: 'High', label: 'High', desc: 'Critical blockers & urgent bugs', dot: 'bg-rose-500' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 2-Column Row for Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah Connor"
            value={formData.customer_name}
            onChange={(e) => handleChange('customer_name', e.target.value)}
            onBlur={() => handleBlur('customer_name')}
            disabled={isLoading}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
              touched.customer_name && errors.customer_name
                ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {touched.customer_name && errors.customer_name && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.customer_name}</span>
            </p>
          )}
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Customer Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. sarah@example.com"
            value={formData.customer_email}
            onChange={(e) => handleChange('customer_email', e.target.value)}
            onBlur={() => handleBlur('customer_email')}
            disabled={isLoading}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
              touched.customer_email && errors.customer_email
                ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
                : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {touched.customer_email && errors.customer_email && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.customer_email}</span>
            </p>
          )}
        </div>
      </div>

      {/* Priority Selector (Bonus Feature) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Priority Level
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {priorities.map((item) => {
            const isSelected = formData.priority === item.value;
            return (
              <label
                key={item.value}
                className={`relative flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={item.value}
                  checked={isSelected}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="text-sm font-semibold text-slate-800">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-1 leading-snug">
                  {item.desc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Issue Title / Subject <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Brief summary of the issue..."
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          onBlur={() => handleBlur('subject')}
          disabled={isLoading}
          maxLength={200}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
            touched.subject && errors.subject
              ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        <div className="flex justify-between items-center mt-1.5">
          {touched.subject && errors.subject ? (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.subject}</span>
            </p>
          ) : (
            <span className="text-xs text-slate-400">Minimum 3 characters</span>
          )}
          <span className="text-xs text-slate-400 font-mono">
            {formData.subject.length}/200
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Provide detailed steps to reproduce or context about the issue..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          disabled={isLoading}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
            touched.description && errors.description
              ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-200/90 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        <div className="flex justify-between items-center mt-1.5">
          {touched.description && errors.description ? (
            <p className="flex items-center gap-1 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.description}</span>
            </p>
          ) : (
            <span className="text-xs text-slate-400">Minimum 10 characters</span>
          )}
          <span className="text-xs text-slate-400 font-mono">
            {formData.description.length} chars
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          icon={Send}
        >
          Create Ticket
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
