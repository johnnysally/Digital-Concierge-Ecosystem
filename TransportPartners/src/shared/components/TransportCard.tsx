import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TransportCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function TransportCard({ children, className = '', title }: TransportCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 backdrop-blur-xl ${className}`}
    >
      {title ? <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-slate-900">{title}</h2></div> : null}
      {children}
    </motion.section>
  );
}
