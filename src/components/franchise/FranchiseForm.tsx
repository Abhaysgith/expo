'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, IndianRupee, MessageSquare, 
  Send, CheckCircle2, ArrowRight, Loader2, ChevronDown 
} from 'lucide-react';
import { generateLeadId } from '@/lib/exportLeads';
import type { Lead } from '@/lib/exportLeads';

const BUDGET_OPTIONS = [
  { value: "22L - 24L", label: "₹22 Lakhs - ₹24 Lakhs" },
  { value: "45L - 65L", label: "₹45 Lakhs - ₹65 Lakhs" },
  { value: "Depends on City", label: "Varies by City Price" },
];

export default function FranchiseForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    investmentBudget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newLead: Lead = {
      id: generateLeadId(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      investmentBudget: formData.investmentBudget,
      message: formData.message,
      submittedAt: new Date().toISOString(),
      source: 'nfc', // Keeping as nfc for compatibility or I could update the lib
      syncStatus: 'pending',
      cityTier: 'unknown' // Default or I could add a field
    };

    try {
      const existingLeads: Lead[] = JSON.parse(localStorage.getItem('uclean-leads') || '[]');
      localStorage.setItem('uclean-leads', JSON.stringify([newLead, ...existingLeads]));
    } catch (error) {
      console.error('Error saving lead:', error);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      investmentBudget: '',
      message: ''
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto p-8 rounded-3xl text-center"
        style={{
          background: 'rgba(8, 13, 28, 0.6)',
          border: '1px solid rgba(22, 163, 74, 0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Lead Captured!</h2>
        <p className="text-slate-400 text-lg mb-8">
          Prospect details have been saved securely to the dashboard. Ready for the next one.
        </p>
        <button
          onClick={handleReset}
          className="px-8 py-3 rounded-xl font-bold bg-green-500 text-black hover:bg-green-400 transition-colors flex items-center gap-2 mx-auto"
        >
          Capture Next Lead
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 md:px-0"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Capture <span className="text-green-500">Lead</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Enter details of the prospective franchise partner below.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="space-y-6 p-6 md:p-8 rounded-2xl md:rounded-3xl relative overflow-hidden"
        style={{
          background: 'rgba(8, 13, 28, 0.4)',
          border: '1px solid rgba(22, 163, 74, 0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4 text-green-500" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="John Doe"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              Target City
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="e.g. Mumbai"
            />
          </div>
        </div>

        {/* Investment Budget */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-500" />
            Investment Budget
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full bg-slate-900/50 border ${isDropdownOpen ? 'border-green-500/50' : 'border-slate-800'} rounded-xl px-4 py-3 text-left transition-colors flex items-center justify-between outline-none ${!formData.investmentBudget ? 'text-slate-400' : 'text-white'}`}
            >
              {formData.investmentBudget ? BUDGET_OPTIONS.find(o => o.value === formData.investmentBudget)?.label : 'Select Budget Range'}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-green-500' : 'text-slate-500'}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                >
                  {BUDGET_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, investmentBudget: option.value });
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors ${
                        formData.investmentBudget === option.value 
                          ? 'bg-green-500/10 text-green-400 font-bold' 
                          : 'text-slate-300 font-medium'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Note / Message */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            Note / Special Requirements
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors resize-none"
            placeholder="Tell us more about your background or requirements..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-900/50 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
          style={{
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)',
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Save Lead Details
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>

        {/* Note */}
        <p className="text-center text-xs text-slate-500 pt-2">
          Make sure all details are correct before saving to the database.
        </p>
      </form>
    </motion.div>
  );
}
