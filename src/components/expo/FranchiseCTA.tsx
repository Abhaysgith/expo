'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, IndianRupee, MessageSquare, 
  Send, CheckCircle2, ArrowRight, Loader2, Sparkles, ChevronDown
} from 'lucide-react';
import { generateLeadId } from '@/lib/exportLeads';
import type { Lead } from '@/lib/exportLeads';

const BUDGET_OPTIONS = [
  { value: "22L - 24L", label: "₹22 Lakhs - ₹24 Lakhs" },
  { value: "45L - 65L", label: "₹45 Lakhs - ₹65 Lakhs" },
  { value: "Depends on City", label: "Varies by City Price" },
];

export default function FranchiseCTA() {
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
      source: 'nfc',
      syncStatus: 'pending',
      cityTier: 'unknown'
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
        className="h-full flex flex-col items-center justify-center text-center px-6"
      >
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 mb-4">Lead Captured!</h2>
        <p className="text-slate-600 text-xl max-w-md mb-8">
          Prospect details have been saved securely to the dashboard. Ready for the next one.
        </p>
        <button
          onClick={handleReset}
          className="px-10 py-4 rounded-2xl font-bold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          Capture Next Lead
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start sm:justify-center w-full max-w-xl mx-auto pb-8">
      {/* Form Container */}
      <div className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight">
            Capture <span className="text-green-600">Lead</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Enter prospective partner details</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-2 sm:space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-800 focus:outline-none focus:border-green-500 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-800 focus:outline-none focus:border-green-500 transition-all"
                placeholder="john@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-800 focus:outline-none focus:border-green-500 transition-all"
                placeholder="+91 98765..."
              />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-800 focus:outline-none focus:border-green-500 transition-all"
                placeholder="e.g. Mumbai"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              Investment Budget
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-slate-50 border ${isDropdownOpen ? 'border-green-500' : 'border-slate-200'} rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-left transition-all flex items-center justify-between outline-none ${!formData.investmentBudget ? 'text-slate-400' : 'text-slate-800'}`}
              >
                {formData.investmentBudget ? BUDGET_OPTIONS.find(o => o.value === formData.investmentBudget)?.label : 'Select Range'}
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-green-500' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden"
                  >
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, investmentBudget: option.value });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm sm:text-base hover:bg-green-50 transition-colors ${
                          formData.investmentBudget === option.value 
                            ? 'bg-green-50/80 text-green-700 font-bold' 
                            : 'text-slate-700 font-medium'
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

          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
              Note
            </label>
            <textarea
              rows={1}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-800 focus:outline-none focus:border-green-500 transition-all resize-none"
              placeholder="Any specific questions?"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white font-black py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all flex items-center justify-center gap-2 mt-2 sm:mt-4 group"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Save Lead Details
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
