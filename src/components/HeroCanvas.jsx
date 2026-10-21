import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useInView.js';

/*
 * Animated hero background: two bi-rotor drones, side on, linked by rods to a
 * shared contact point below them. Air streams through each propeller disc,
 * drawn as streamlines that are drawn in from above, contract through the disc
 * and wash downward. The drones rock in opposite directions while the contact
 * point stays put, hinting at an overactuated pair. They lean toward the cursor.
 *
 * Geometry is laid out in design units (a 1250 x 820 box) and scaled to fit.
 */

const DESIGN = { w: 1250, h: 820 };
const ROTOR_X = 150; // rotor centre offset from the drone centre
const DISC_W = 165;
const DISC_H = 32;
const FLOW_UP = 175; // how far streamlines reach above the disc
const FLOW_DOWN = 210; // and below it
const GAP = 22; // streamlines stop short of the disc, as in a sketch
const LANES = [-1, -0.45, 0.45, 1];
const PARTICLES_PER_ROTOR = 16;
const PAYLOAD = { x: 625, y: 690 };
const DRONES = [
  { x: 290, y: 190, phase: 0 },
  { x: 960, y: 190, phase: Math.PI },
];

const LINE = 'rgba(220, 240, 255, 0.92)';
const FLOW = '143, 211, 255';

// Streamtube width relative to the disc: wide inflow above, contracted slipstream below.
const widthFactor = (v) => (v < 0 ? 1 + 0.9 * (1 - Math.exp(v / 140)) : 0.72 + 0.28 * Math.exp(-v / 80) + 0.0012 * v);
const flowX = (rx, s, v) => rx + s * (DISC_W / 2) * widthFactor(v);
// Air speeds up as it approaches and passes through the disc.
const flowSpeed = (v) => (v < 0 ? 0.45 + 0.75 * Math.exp(v / 110) : 1.2 + 0.5 * Math.exp(-v / 140));

const newParticle = (v = -FLOW_UP + Math.random() * (FLOW_UP + FLOW_DOWN)) => ({
  s: (Math.random() * 2 - 1) * 0.95,
  v,
});

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: null };
    let width = 0;
    let height = 0;
    let k = 1; // design units -> CSS px
    let ox = 0;
    let oy = 0;
    let alpha = 1;
    let lean = 0;
    let frame = 0;
    let last = performance.now();
    const start = last;

    // particles[drone][rotor] = [{ s, v }]
    const particles = DRONES.map(() => [0, 1].map(() => Array.from({ length: PARTICLES_PER_ROTOR }, () => newParticle())));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const narrow = width < 768;
      const sceneW = narrow ? width * 0.95 : Math.min(width * 0.5, 700);
      k = sceneW / DESIGN.w;
      ox = narrow ? (width - sceneW) / 2 : width - sceneW - Math.max(24, width * 0.04);
      oy = narrow ? height * 0.1 : (height - DESIGN.h * k) / 2 + 30;
      // Keep the hero text readable where the scene sits behind it.
      alpha = narrow ? 0.3 : width < 1200 ? 0.6 : 0.95;
    };

    const px = (n) => n / k; // a line width in CSS px, expressed in design units

    const drawStreamlines = (rx) => {
      for (const s of LANES) {
        ctx.strokeStyle = `rgba(${FLOW}, ${Math.abs(s) === 1 ? 0.32 : 0.14})`;
        ctx.lineWidth = px(1.5);
        for (const [from, to] of [[-FLOW_UP, -GAP], [GAP, FLOW_DOWN]]) {
          ctx.beginPath();
          for (let v = from; v <= to; v += 6) {
            const x = flowX(rx, s, v);
            if (v === from) ctx.moveTo(x, v);
            else ctx.lineTo(x, v);
          }
          ctx.stroke();
        }
      }
    };

    const drawParticles = (list, rx) => {
      ctx.lineWidth = px(2);
      ctx.lineCap = 'round';
      for (const p of list) {
        const tail = 14 * flowSpeed(p.v);
        const fade = Math.sin((Math.PI * (p.v + FLOW_UP)) / (FLOW_UP + FLOW_DOWN));
        ctx.strokeStyle = `rgba(${FLOW}, ${0.85 * Math.max(0, fade)})`;
        ctx.beginPath();
        ctx.moveTo(flowX(rx, p.s, p.v - tail), p.v - tail);
        ctx.lineTo(flowX(rx, p.s, p.v), p.v);
        ctx.stroke();
      }
    };

    const drawDroneBody = (spin) => {
      ctx.strokeStyle = LINE;
      ctx.lineWidth = px(2.5);
      ctx.beginPath();
      ctx.moveTo(-ROTOR_X + DISC_W / 2, 0);
      ctx.lineTo(ROTOR_X - DISC_W / 2, 0);
      ctx.stroke();

      ctx.fillStyle = 'rgba(7, 13, 26, 0.95)';
      ctx.fillRect(-22, -9, 44, 18);
      ctx.strokeRect(-22, -9, 44, 18);

      for (const rx of [-ROTOR_X, ROTOR_X]) {
        ctx.fillStyle = 'rgba(27, 163, 242, 0.14)';
        ctx.fillRect(rx - DISC_W / 2, -DISC_H / 2, DISC_W, DISC_H);
        ctx.strokeStyle = LINE;
        ctx.lineWidth = px(2.5);
        ctx.strokeRect(rx - DISC_W / 2, -DISC_H / 2, DISC_W, DISC_H);

        // Two blades seen edge-on sweep back and forth across the disc.
        ctx.lineWidth = px(2);
        for (const b of [0, Math.PI]) {
          const bx = rx + (DISC_W / 2 - 8) * Math.cos(spin + b);
          ctx.strokeStyle = 'rgba(200, 235, 255, 0.55)';
          ctx.beginPath();
          ctx.moveTo(bx, -DISC_H / 2 + 5);
          ctx.lineTo(bx, DISC_H / 2 - 5);
          ctx.stroke();
        }
      }
    };

    const draw = (now) => {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Lean toward the cursor, smoothed.
      const centre = ox + (DESIGN.w * k) / 2;
      const target = pointer.x === null ? 0 : Math.max(-0.5, Math.min(0.5, (pointer.x - centre) / width)) * 0.3;
      lean += (target - lean) * 0.04;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = alpha;
      ctx.translate(ox, oy);
      ctx.scale(k, k);

      const poses = DRONES.map((d) => ({
        x: d.x,
        y: d.y + 7 * Math.sin(t * 1.1 + d.phase * 0.5),
        theta: 0.13 * Math.sin(t * 0.7 + d.phase) + lean,
      }));

      // Rods from each drone to the shared contact point.
      ctx.strokeStyle = LINE;
      ctx.lineWidth = px(2.5);
      for (const pose of poses) {
        const ax = pose.x - 12 * Math.sin(pose.theta);
        const ay = pose.y + 12 * Math.cos(pose.theta);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(PAYLOAD.x, PAYLOAD.y);
        ctx.stroke();
      }

      // Contact point with a slow pulse.
      const pulse = (t % 2.4) / 2.4;
      ctx.strokeStyle = `rgba(${FLOW}, ${0.6 * (1 - pulse)})`;
      ctx.lineWidth = px(1.5);
      ctx.beginPath();
      ctx.arc(PAYLOAD.x, PAYLOAD.y, 10 + pulse * 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(7, 13, 26, 1)';
      ctx.strokeStyle = LINE;
      ctx.lineWidth = px(2.5);
      ctx.beginPath();
      ctx.arc(PAYLOAD.x, PAYLOAD.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      poses.forEach((pose, i) => {
        ctx.save();
        ctx.translate(pose.x, pose.y);
        ctx.rotate(pose.theta);
        [-ROTOR_X, ROTOR_X].forEach((rx, r) => {
          const list = particles[i][r];
          if (!reduced) {
            for (let j = 0; j < list.length; j++) {
              const p = list[j];
              p.v += 120 * flowSpeed(p.v) * dt;
              if (p.v > FLOW_DOWN) list[j] = newParticle(-FLOW_UP);
            }
          }
          drawStreamlines(rx);
          drawParticles(list, rx);
        });
        drawDroneBody(t * 22 + i);
        ctx.restore();
      });

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      pointer.x = e.clientX - canvas.getBoundingClientRect().left;
    };
    const onLeave = () => {
      pointer.x = null;
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
