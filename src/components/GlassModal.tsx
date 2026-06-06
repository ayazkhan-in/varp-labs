import { ReactNode, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function GlassModal({ isOpen, onClose, title, children }: GlassModalProps) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Glass Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-3xl glass-panel text-on-surface h-[85vh] md:h-auto md:max-h-[85vh] flex flex-col z-10 select-text overflow-hidden"
          >
            {/* Header top edge highlight */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <h3 className="font-display text-lg md:text-xl font-medium lowercase text-primary tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-secondary hover:text-primary hover:bg-white/5 transition-all outline-none"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {children}
            </div>
            
            {/* Soft decorative status bar in foot of the modal */}
            <div className="px-6 py-2 border-t border-white/5 bg-black/20 text-right">
              <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                varp labs // secure session verified
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
