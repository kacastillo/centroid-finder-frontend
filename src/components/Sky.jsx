import { useMemo } from "react";
import "./sky.css";

// How many small round glints to draw. Sparse, so the sky feels calm.
const STAR_COUNT = 22;

// How many brighter four-point sparkles. Just a few, as accents.
const SPARKLE_COUNT = 5;

// A random number between min and max
function random(min, max) {
  return min + Math.random() * (max - min);
}

/*
 * Where a star goes. Stars thin out toward the bottom, like a real night sky,
 * and stay out of the bright pink glow at the very bottom.
 */
function randomSpot() {
  return {
    left: `${random(2, 98)}%`,
    top: `${Math.pow(Math.random(), 1.4) * 85}%`,
  };
}

/*
 * Slow twinkle timing: 5–9 seconds per fade in and out.
 * A negative delay starts each one partway through, so they're out of sync.
 */
function randomTiming() {
  return {
    duration: `${random(5, 9)}s`,
    delay: `${random(-9, 0)}s`,
  };
}

/**
 * The page background: a lavender-to-pink gradient with small, scattered
 * stars and a few four-point sparkles. Some stars and all sparkles twinkle
 * slowly, each on its own timing, so they never all fade at once.
 *
 * It sits behind everything (see .sky in sky.css) and ignores clicks.
 */
export default function Sky() {
  /*
   * useMemo with [] makes the stars once, so they don't
   * jump to new spots every time the page re-renders.
   */
  const stars = useMemo(() => {
    const dots = Array.from({ length: STAR_COUNT }, () => {
      /*
       * Three sizes: mostly small, some medium, a few a little bigger.
       * These sizes include the soft fade around each glint, so the
       * bright center is only about a third as wide.
       */
      const roll = Math.random();
      const size = roll < 0.55 ? random(5, 6.5) : roll < 0.9 ? random(7, 9) : random(10, 12);

      return {
        type: "star",
        size,
        twinkles: Math.random() < 0.5,
        ...randomSpot(),
        ...randomTiming(),
      };
    });

    const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
      type: "sparkle",
      size: random(9, 14),
      twinkles: true,
      /*
       * Sparkles take turns between the left and right side of the screen,
       * and each one gets its own band from top to bottom, so they're spread
       * out evenly, never bunch up, and never sit behind the text in the middle.
       */
      left: `${i % 2 === 0 ? random(3, 22) : random(78, 97)}%`,
      top: `${((i + random(0.15, 0.85)) / SPARKLE_COUNT) * 85}%`,
      ...randomTiming(),
    }));

    return [...dots, ...sparkles];
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          className={star.twinkles ? `${star.type} twinkle` : star.type}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            "--duration": star.duration,
            "--delay": star.delay,
          }}
        />
      ))}
    </div>
  );
}