'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientText from '@/components/ui/GradientText';

type Val = 'yes' | 'no' | 'partial';
interface Row { feature: string; sub?: string; inhouse: Val; other: Val; uclean: Val }

const ROWS: Row[] = [
  { feature: 'Brand Recognition',      sub: 'Trusted by 50,000+ customers',           inhouse: 'no',      other: 'partial', uclean: 'yes' },
  { feature: 'Proven Business Model',  sub: 'Documented SOPs & training',             inhouse: 'no',      other: 'partial', uclean: 'yes' },
  { feature: 'In-House Tech Platform', sub: 'App, dashboard, analytics',              inhouse: 'no',      other: 'yes',     uclean: 'yes' },
  { feature: 'Monthly Software Fees',  sub: 'Third-party avg ₹4,500/mo',              inhouse: 'partial', other: 'no',      uclean: 'yes' },
  { feature: 'Staff Training',         sub: '3-week intensive program',               inhouse: 'no',      other: 'no',      uclean: 'yes' },
  { feature: 'Marketing Support',      sub: 'National & local campaigns',             inhouse: 'no',      other: 'no',      uclean: 'yes' },
  { feature: 'Real-Time Analytics',    sub: 'Live revenue & order tracking',          inhouse: 'no',      other: 'partial', uclean: 'yes' },
  { feature: 'Data Ownership',         sub: 'You own your customer data',             inhouse: 'yes',     other: 'no',      uclean: 'yes' },
  { feature: 'Bug Fix SLA',            sub: 'Third-party avg 2 weeks',               inhouse: 'partial', other: 'no',      uclean: 'yes' },
  { feature: 'Network Buying Power',   sub: 'Cheaper equipment & supplies',          inhouse: 'no',      other: 'no',      uclean: 'yes' },
  { feature: '100% Ownership',         sub: 'You run your own business',             inhouse: 'yes',     other: 'yes',     uclean: 'yes' },
  { feature: 'Ongoing R&D',            sub: 'Continuous product improvements',        inhouse: 'no',      other: 'partial', uclean: 'yes' },
];

const ICON = {
  yes:     <CheckCircle className="w-5 h-5 text-emerald-400" />,
  no:      <XCircle className="w-5 h-5 text-slate-600" />,
  partial: <MinusCircle className="w-5 h-5 text-amber-400" />,
};

const SCORES = {
  inhouse: ROWS.filter(r => r.inhouse === 'yes').length,
  other:   ROWS.filter(r => r.other   === 'yes').length + ROWS.filter(r => r.other === 'partial').length * 0.5,
  uclean:  ROWS.filter(r => r.uclean  === 'yes').length,
};

export default function ComparisonTable() {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-50 mb-1">
          Why <GradientText>UClean Wins</GradientText>
        </h3>
        <p className="text-sm text-slate-500">Side-by-side comparison — make an informed decision</p>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full min-w-[420px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-4 pr-4">Feature</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-4 px-3 w-24">In-House</th>
              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-4 px-3 w-24">Others</th>
              <th className="text-center pb-4 px-3 w-24">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">UClean ✦</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <motion.tr
                key={row.feature}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, ease: 'easeOut' }}
                className="border-t border-slate-800/50 hover:bg-slate-800/20 transition-colors"
              >
                <td className="py-3 pr-4">
                  <p className="text-sm text-slate-200 font-medium">{row.feature}</p>
                  {row.sub && <p className="text-xs text-slate-600 mt-0.5">{row.sub}</p>}
                </td>
                <td className="py-3 text-center px-3">{ICON[row.inhouse]}</td>
                <td className="py-3 text-center px-3">{ICON[row.other]}</td>
                <td className="py-3 text-center px-3">{ICON[row.uclean]}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score summary */}
      <div className="mt-6 pt-5 border-t border-slate-800/60 grid grid-cols-3 gap-4">
        {[
          { label: 'In-House', score: SCORES.inhouse, color: 'text-slate-400' },
          { label: 'Others', score: SCORES.other, color: 'text-slate-300' },
          { label: 'UClean', score: SCORES.uclean, color: 'text-cyan-400' },
        ].map(({ label, score, color }) => (
          <div key={label} className="text-center">
            <p className={`text-2xl font-black num ${color}`}>{score}/{ROWS.length}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
