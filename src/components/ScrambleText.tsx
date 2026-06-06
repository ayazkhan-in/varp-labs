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
    let timeoutId: NodeJS.Timeout;

    const startScramble = () => {
      const length = text.length;
      let iterations = 0;
      const maxIterations = length * 3; // total iterations to ensure smooth full resolver

      const tick = () => {
        if (!isMounted) return;

        // Calculate how many characters has resolved based on progress
        const solvedCount = Math.floor((iterations / maxIterations) * length);

        const scrambled = text
          .split('')
          .map((char, index) => {
            if (index < solvedCount) {
              return char; // Output resolved character
            }
            if (char === ' ') {
              return ' '; // Keep spaces as is to prevent weird structural shifts
            }
            // Otherwise, get random glyph
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');

        setDisplayText(scrambled);

        if (iterations < maxIterations) {
          iterations++;
          timeoutId = setTimeout(tick, scrambleSpeed);
        } else {
          setDisplayText(text); // Ensure precise match at the absolute end
        }
      };

      tick();
    };

    // Stagger opening delay
    const initialTimeout = setTimeout(() => {
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
      clearTimeout(initialTimeout);
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [text, delayMs, scrambleSpeed]);

  return <span className="font-mono">{displayText}</span>;
}
