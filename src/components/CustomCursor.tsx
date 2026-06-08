import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs to simulate rapid, elastic movement
  const springConfig = { damping: 40, stiffness: 450, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable custom cursor if fine pointer is available (desktops)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset cursor anchor to the extreme top-left tip of the cursor arrow
      mouseX.set(e.clientX - 4);
      mouseY.set(e.clientY - 4);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Watch for hovering interactive items to morph from filled (right image) -> outline (left image)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
      style={{
        left: cursorX,
        top: cursorY,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="w-6 h-6 text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
      >
        {/* Render precise custom cursor SVG matching reference image specs */}
        <svg 
          viewBox="0 0 32 32" 
          className="w-full h-full transform -rotate-[12deg] origin-top-left"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isHovered ? (
            /* Left Cursor Image: Outlined pointer with rounded vertices & thick boundary */
            <path
              d="M4 4 L26 14.5 C27.5 15.2 27.5 16.8 26 17.5 L19.2 20.2 C18.2 20.6 17.6 21.2 17.2 22.2 L14.5 29 C13.8 30.5 12.2 30.5 11.5 29 L4 4 Z"
              fill="none"
              stroke="white"
              strokeWidth="3.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : (
            /* Right Cursor Image: Solid filled pointer with rounded vertices */
            <path
              d="M4 4 L26 14.5 C27.5 15.2 27.5 16.8 26 17.5 L19.2 20.2 C18.2 20.6 17.6 21.2 17.2 22.2 L14.5 29 C13.8 30.5 12.2 30.5 11.5 29 L4 4 Z"
              fill="white"
              stroke="rgba(0, 0, 0, 0.4)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
}
