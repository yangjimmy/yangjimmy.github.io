import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useInView.js';

/*
 * Animated hero background: two bi-rotor drones, side on, holding steady, each
 * with a tapered arm angled down toward the other.
 *
 * The airflow follows the classic hover-rotor picture (actuator-disc momentum
 * theory with a vortex-cylinder wake):
 *   - axial velocity along the axis  v(z) = vi * (1 + z / sqrt(z^2 + R^2)),
 *     z measured downward from the disc: ~0 far above, vi at the disc, 2 vi far below;
 *   - continuity then sets the streamtube radius  r(z) = R * sqrt(vi / v(z)),
 *     so air is drawn in from a wide region above and the slipstream contracts
 *     to about R / sqrt(2) within roughly one radius below the disc;
 *   - tip vortices shed at the blade tips trail down the slipstream boundary.
 *
 * Geometry is laid out in design units (a 1250 x 640 box) and scaled to fit.
 */

const DESIGN = { w: 1250, h: 640 };
const ROTOR_X = 150; // rotor centre offset from the drone centre
const DISC_W = 165;
const DISC_H = 30;
const R = DISC_W / 2;
const Z_TOP = -1.1; // flow drawn from 1.1 R above the disc...
const Z_BOTTOM = 3.2; // ...to 3.2 R below it
const GAP = 0.2; // streamlines stop short of the disc, as in a sketch
const LANES = [-1, -0.6, 0.6, 1];
const PARTICLES_PER_ROTOR = 22;
const SPEED = 0.55; // flow speed at the disc, in rotor radii per second
const VORTEX_PERIOD = 0.55; // seconds between tip vortices on each side
const DRONES = [
  { x: 290, y: 150, armDir: 1 },
  { x: 960, y: 150, armDir: -1 },
];
const ARM_LENGTH = 400;
const ARM_SLOPE = 0.58; // horizontal run per unit drop

const LINE = '220, 240, 255';
const FLOW = '143, 211, 255';

// Axial velocity in units of the induced velocity at the disc; z in rotor radii.
const axialVelocity = (z) => 1 + z / Math.sqrt(z * z + 1);
// Streamtube radius as a fraction of R, from continuity.
const tubeRadius = (z) => Math.sqrt(1 / axialVelocity(z));
const flowX = (rx, s, z) => rx + s * R * tubeRadius(z);

const newParticle = (z = Z_TOP + Math.random() * (Z_BOTTOM - Z_TOP)) => ({ s: (Math.random() * 2 - 1) * 0.97, z });

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let k = 1; // design units -> CSS px
    let ox = 0;
    let oy = 0;
    let alpha = 1;
    let frame = 0;
    let last = performance.now();

    // Per drone, per rotor: flow particles and tip vortices ({ z, side }).
    const rotors = DRONES.map(() =>
      [0, 1].map((r) => ({
        particles: Array.from({ length: PARTICLES_PER_ROTOR }, () => newParticle()),
        vortices: [],
        clock: r * 0.2, // offset so the rotors don't shed in lockstep
        nextSide: 1,
      }))
    );
    // Pre-seed the wakes so the first frame already looks developed.
    for (const drone of rotors) for (const rotor of drone) for (let i = 0; i < 400; i++) stepRotor(rotor, 1 / 60);

    function stepRotor(rotor, dt) {
      for (let j = 0; j < rotor.particles.length; j++) {
        const p = rotor.particles[j];
        p.z += SPEED * axialVelocity(p.z) * dt;
        if (p.z > Z_BOTTOM) rotor.particles[j] = newParticle(Z_TOP);
      }
      // Tip vortices are shed at the disc edge, alternating sides (a helix seen side on),
      // and convect down a little slower than the slipstream core.
      rotor.clock += dt;
      if (rotor.clock > VORTEX_PERIOD / 2) {
        rotor.clock = 0;
        rotor.vortices.push({ z: 0.05, side: rotor.nextSide });
        rotor.nextSide *= -1;
      }
      for (const v of rotor.vortices) v.z += SPEED * 0.75 * axialVelocity(v.z) * dt;
      rotor.vortices = rotor.vortices.filter((v) => v.z < Z_BOTTOM * 0.8);
    }

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
      oy = narrow ? height * 0.1 : (height - DESIGN.h * k) / 2;
      // Keep the hero text readable where the scene sits behind it.
      alpha = narrow ? 0.3 : width < 1200 ? 0.6 : 0.95;
    };

    const px = (n) => n / k; // a line width in CSS px, expressed in design units

    const drawStreamlines = (rx) => {
      for (const s of LANES) {
        ctx.strokeStyle = `rgba(${FLOW}, ${Math.abs(s) === 1 ? 0.3 : 0.13})`;
        ctx.lineWidth = px(1.4);
        for (const [from, to] of [[Z_TOP, -GAP], [GAP, Z_BOTTOM]]) {
          ctx.beginPath();
          for (let z = from; z <= to + 1e-6; z += 0.05) {
            const x = flowX(rx, s, z);
            if (z === from) ctx.moveTo(x, z * R);
            else ctx.lineTo(x, z * R);
          }
          ctx.stroke();
        }
      }
    };

    const fadeAt = (z) => Math.min(1, (z - Z_TOP) / 0.6, (Z_BOTTOM - z) / 1.2);

    const drawParticles = (particles, rx) => {
      ctx.lineWidth = px(2);
      ctx.lineCap = 'round';
      for (const p of particles) {
        // Streak length tracks local speed: short and slow above, long in the wake.
        const tail = 0.16 * axialVelocity(p.z);
        const a = 0.85 * Math.max(0, fadeAt(p.z));
        if (a <= 0) continue;
        ctx.strokeStyle = `rgba(${FLOW}, ${a})`;
        ctx.beginPath();
        ctx.moveTo(flowX(rx, p.s, p.z - tail), (p.z - tail) * R);
        ctx.lineTo(flowX(rx, p.s, p.z), p.z * R);
        ctx.stroke();
      }
    };

    const drawVortices = (vortices, rx, t) => {
      ctx.lineWidth = px(1.6);
      for (const v of vortices) {
        const x = rx + v.side * R * tubeRadius(v.z);
        const y = v.z * R;
        const radius = 5 + 4 * Math.min(1, v.z / 2);
        const a = 0.7 * Math.max(0, Math.min(1, (Z_BOTTOM * 0.8 - v.z) / 1.2));
        // Inner side moves down with the slipstream, outer side moves up.
        const spin = -v.side * t * 7;
        ctx.strokeStyle = `rgba(${FLOW}, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, spin, spin + Math.PI * 1.5);
        ctx.stroke();
      }
    };

    const drawArm = (drone) => {
      const startX = drone.x;
      const startY = drone.y + 9;
      const len = Math.hypot(ARM_SLOPE, 1);
      const dx = (drone.armDir * ARM_SLOPE) / len;
      const dy = 1 / len;
      const endX = startX + dx * ARM_LENGTH;
      const endY = startY + dy * ARM_LENGTH;
      // Taper: a thin wedge from full width at the drone to a point, fading out.
      const nx = -dy;
      const ny = dx;
      const w = 4;
      const grad = ctx.createLinearGradient(startX, startY, endX, endY);
      grad.addColorStop(0, `rgba(${LINE}, 0.9)`);
      grad.addColorStop(1, `rgba(${LINE}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(startX + nx * w, startY + ny * w);
      ctx.lineTo(endX, endY);
      ctx.lineTo(startX - nx * w, startY - ny * w);
      ctx.closePath();
      ctx.fill();
    };

    const drawDroneBody = (spin) => {
      ctx.strokeStyle = `rgba(${LINE}, 0.92)`;
      ctx.lineWidth = px(2.5);
      ctx.beginPath();
      ctx.moveTo(-ROTOR_X + R, 0);
      ctx.lineTo(ROTOR_X - R, 0);
      ctx.stroke();

      ctx.fillStyle = 'rgba(7, 13, 26, 0.95)';
      ctx.fillRect(-22, -9, 44, 18);
      ctx.strokeRect(-22, -9, 44, 18);

      for (const rx of [-ROTOR_X, ROTOR_X]) {
        ctx.fillStyle = 'rgba(27, 163, 242, 0.14)';
        ctx.fillRect(rx - R, -DISC_H / 2, DISC_W, DISC_H);
        ctx.strokeStyle = `rgba(${LINE}, 0.92)`;
        ctx.lineWidth = px(2.5);
        ctx.strokeRect(rx - R, -DISC_H / 2, DISC_W, DISC_H);

        // Two blades seen edge-on sweep back and forth across the disc.
        ctx.lineWidth = px(2);
        ctx.strokeStyle = 'rgba(200, 235, 255, 0.55)';
        for (const b of [0, Math.PI]) {
          const bx = rx + (R - 8) * Math.cos(spin + b);
          ctx.beginPath();
          ctx.moveTo(bx, -DISC_H / 2 + 5);
          ctx.lineTo(bx, DISC_H / 2 - 5);
          ctx.stroke();
        }
      }
    };

    const draw = (now) => {
      const t = now / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = alpha;
      ctx.translate(ox, oy);
      ctx.scale(k, k);

      DRONES.forEach(drawArm);

      DRONES.forEach((drone, i) => {
        ctx.save();
        ctx.translate(drone.x, drone.y);
        [-ROTOR_X, ROTOR_X].forEach((rx, r) => {
          const rotor = rotors[i][r];
          if (!reduced) stepRotor(rotor, dt);
          drawStreamlines(rx);
          drawParticles(rotor.particles, rx);
          drawVortices(rotor.vortices, rx, t);
        });
        drawDroneBody(t * 22 + i);
        ctx.restore();
      });

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
