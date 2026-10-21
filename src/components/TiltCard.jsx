import { useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useInView.js';

/*
 * Card wrapper that tilts toward the cursor and moves a soft glow with it.
 * React only writes CSS custom properties; styles.css does the rendering.
 */
export default function TiltCard({ className = '', accent, children, maxTilt = 6 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (prefersReducedMotion() || e.pointerType === 'touch') return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--rx', `${(0.5 - py) * maxTilt}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * maxTilt}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={accent ? { '--accent': accent } : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}
