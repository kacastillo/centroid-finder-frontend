/**
 * This is create using MUI - which helps implement the sky theme that has moving clouds and stars. This will be the overall
 * layout for the remainder of the project. The main goal is to have a drop down cloud in the middle of the screen 
 * that eventually shows a border that says 'Video'.
 */

// components/Sky.jsx
import { useMemo } from "react";
import "./sky.css";

const rand = (min, max) => min + Math.random() * (max - min);

export default function Sky() {
  // useMemo so positions are generated once, not on every re-render
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        left: `${rand(0, 100)}%`,
        top: `${rand(0, 100)}%`,
        dur: `${rand(4, 9)}s`,
        delay: `${rand(-9, 0)}s`,
      })),
    []
  );
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        top: `${rand(5, 80)}%`,
        dur: `${rand(60, 120)}s`,
        delay: `${rand(-120, 0)}s`,
        scale: rand(0.6, 1.4),
      })),
    []
  );

  return (
    <div className="sky" aria-hidden="true">
      {stars.map((s, i) => (
        <span key={i} className="star"
          style={{ left: s.left, top: s.top, "--dur": s.dur, "--delay": s.delay }} />
      ))}
      {clouds.map((c, i) => (
        <span key={i} className="cloud"
          style={{ top: c.top, "--dur": c.dur, "--delay": c.delay, "--scale": c.scale }} />
      ))}
    </div>
  );
}