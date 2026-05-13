'use client';

import { motion } from 'framer-motion';
import FranchiseForm from '@/components/franchise/FranchiseForm';

export default function FranchisePage() {
  return (
    <div className="min-h-screen pt-[100px] pb-20 px-6 relative overflow-hidden bg-[#080d1c]">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(22, 163, 74, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
        {/* Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <FranchiseForm />
      </div>

      <style jsx global>{`
        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
        .input-brand {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(22, 163, 74, 0.2);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          transition: all 0.2s;
        }
        .input-brand:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </div>
  );
}
