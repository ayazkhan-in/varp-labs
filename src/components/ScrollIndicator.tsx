import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalHeight > 0) {
        setScrollProgress(currentScroll / totalHeight);
      }

      // Show indicator when user has scrolled past 400px (typically past the main hero title block)
      setIsVisible(currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 select-none"
        >
          {/* Vertical Track indicator */}
          <div className="relative w-[2px] h-36 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 inset-x-0 bg-primary origin-top"
              style={{
                height: `${scrollProgress * 100}%`,
              }}
            />
          </div>

          {/* Minimal Percentage Label */}
          <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
            {Math.round(scrollProgress * 100)}%
          </span>

          {/* Quick return anchor button */}
          <button
            onClick={handleScrollToTop}
            className="w-5 h-5 flex items-center justify-center border border-white/15 bg-background hover:border-primary active:scale-95 transition-all outline-none rounded-none cursor-pointer"
            aria-label="Scroll to top"
            title="Scroll to Top"
          >
            <span className="font-mono text-[8px] text-zinc-400 hover:text-primary">↑</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
