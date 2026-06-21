import { useEffect, useState, useTransition } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function GlowBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const [, startTransition] = useTransition();

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Configure smooth spring animations for the glow tracker
  const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 250); // Offset by half the width of the glow (500/2)
      mouseY.set(e.clientY - 250); // Offset by half the height
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  // mouseX and mouseY are stable MotionValue objects — they never change identity,
  // so including them in deps is unnecessary and misleading.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Background radial dots for that labs visual structure */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Floating abstract organic glass orb in top right corner */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none" />
      
      {/* Floating ambient grid glow */}
      <motion.div
        className="fixed w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none hidden md:block"
        style={{
          left: glowX,
          top: glowY,
        }}
      />
    </div>
  );
}
