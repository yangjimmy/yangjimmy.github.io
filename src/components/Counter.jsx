import { useEffect, useState } from 'react';
import useInView, { prefersReducedMotion } from '../hooks/useInView.js';

// Counts up from 0 to `value` once the number scrolls into view.
export default function Counter({ value, duration = 1200, suffix = '' }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
