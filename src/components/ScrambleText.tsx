import { useEffect, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  delayMs?: number;
  scrambleSpeed?: number;
}

const GLYPHS = "X*#%&@+$?<>[]{}-_\\|/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({ text, delayMs = 200, scrambleSpeed = 30 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let isMounted = true;
    let frameId: number;
    let initialTimeoutId: ReturnType<typeof setTimeout>;

    const startScramble = () => {
      const length = text.length;
      let iterations = 0;
      const maxIterations = length * 3; // total iterations for smooth full resolve
      let lastFrameTime = 0;

      // Use requestAnimationFrame instead of setTimeout for cooperative scheduling.
      // rAF yields to the browser's rendering pipeline, preventing long tasks that
      // would block input processing and increase INP.
      const tick = (timestamp: number) => {
        if (!isMounted) return;

        // Throttle to scrambleSpeed ms per frame to match the original timing
        if (timestamp - lastFrameTime < scrambleSpeed) {
          frameId = requestAnimationFrame(tick);
          return;
        }
        lastFrameTime = timestamp;

        // Calculate how many characters have resolved based on progress
        const solvedCount = Math.floor((iterations / maxIterations) * length);

        const scrambled = text
          .split('')
          .map((char, index) => {
            if (index < solvedCount) {
              return char; // Output resolved character
            }
            if (char === ' ') {
              return ' '; // Keep spaces to prevent weird structural shifts
            }
            // Otherwise, get random glyph
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');

        setDisplayText(scrambled);

        if (iterations < maxIterations) {
          iterations++;
          frameId = requestAnimationFrame(tick);
        } else {
          setDisplayText(text); // Ensure precise match at the absolute end
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    // Stagger opening delay
    initialTimeoutId = setTimeout(() => {
      startScramble();
    }, delayMs);

    // Placeholder initial state with pure random symbols or blank
    setDisplayText(
      text
        .split('')
        .map((char) => (char === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('')
    );

    return () => {
      isMounted = false;
      clearTimeout(initialTimeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [text, delayMs, scrambleSpeed]);

  return <span className="font-mono">{displayText}</span>;
}
