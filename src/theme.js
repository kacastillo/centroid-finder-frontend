import { createTheme } from "@mui/material/styles";

/*
 * Colors used in more than one place below, kept together so they stay consistent.
 */
// Dark plum: all main text
const PLUM = "#3b2a66";

// Softer plum: hints and secondary text (still passes contrast on the sky)
const PLUM_SOFT = "#4f3d7c";

// Medium purple: the slider, outlines, focus rings
const LAVENDER_DEEP = "#7b5fc7";

// Pale lavender: borders on panels and buttons
const LAVENDER_BORDER = "rgba(185, 160, 240, 0.55)";

// Respect people who turn off animations in their system settings
const REDUCED_MOTION = "@media (prefers-reduced-motion: reduce)";

/*
 * Colors for the pixel-art main buttons.
 * Each button can swap its fill with the --pixel-fill and --pixel-fill-hover
 * CSS variables (PreviewPage does this to make the process button pink).
 */
const PIXEL_PLUM = "#493267";
const PIXEL_CREAM = "#fff5da";
const PIXEL_CREAM_HOVER = "#fffaeb";

// One "pixel" of the button's stepped edge, in screen pixels
const PX = 3;

/**
 * The outline of a soft pixel-art button: a rectangle whose four corners
 * are cut into small stair steps (4, 2, 1 pixels in), like a rounded
 * rectangle drawn on a pixel grid. Every point is measured from an edge,
 * so the shape stretches to fit any label length without distorting.
 *
 * Returns a CSS clip-path value.
 */
function pixelCorners(p) {
  const w = (n) => `calc(100% - ${n * p}px)`;
  const at = (n) => `${n * p}px`;
  return `polygon(
    ${at(4)} 0, ${w(4)} 0, ${w(4)} ${at(1)}, ${w(2)} ${at(1)}, ${w(2)} ${at(2)}, ${w(1)} ${at(2)}, ${w(1)} ${at(4)}, 100% ${at(4)},
    100% ${w(4)}, ${w(1)} ${w(4)}, ${w(1)} ${w(2)}, ${w(2)} ${w(2)}, ${w(2)} ${w(1)}, ${w(4)} ${w(1)}, ${w(4)} 100%,
    ${at(4)} 100%, ${at(4)} ${w(1)}, ${at(2)} ${w(1)}, ${at(2)} ${w(2)}, ${at(1)} ${w(2)}, ${at(1)} ${w(4)}, 0 ${w(4)},
    0 ${at(4)}, ${at(1)} ${at(4)}, ${at(1)} ${at(2)}, ${at(2)} ${at(2)}, ${at(2)} ${at(1)}, ${at(4)} ${at(1)}
  )`;
}

const PIXEL_SHAPE = pixelCorners(PX);

// The soft shadow under the button: resting, lifted (hover), and pressed
const PIXEL_SHADOW_REST = "drop-shadow(0 2px 2px rgba(73, 50, 103, 0.18))";
const PIXEL_SHADOW_LIFT = "drop-shadow(0 5px 6px rgba(73, 50, 103, 0.22))";
const PIXEL_SHADOW_PRESS = "drop-shadow(0 1px 1px rgba(73, 50, 103, 0.14))";

/**
 * The app's look: a soft, light lavender night sky with frosted-glass panels
 * and puffy cloud-like buttons. Every MUI component picks these styles up,
 * so all pages stay consistent without styling each one by hand.
 */
const theme = createTheme({
  palette: {
    // Light mode: dark plum text on a light sky
    mode: "light",

    primary: {
      main: LAVENDER_DEEP,
      dark: "#5f45a8",
      light: "#c9b6ff",
      contrastText: "#ffffff",
    },

    // Soft cyan for progress bars and small highlights
    secondary: {
      main: "#3f8fa3",
      contrastText: "#ffffff",
    },

    background: {
      // Transparent so the Sky gradient shows through
      default: "transparent",

      // Frosted white for cards and panels: light, but solid enough for easy reading
      paper: "rgba(255, 255, 255, 0.58)",
    },

    text: {
      primary: PLUM,
      secondary: PLUM_SOFT,
    },

    divider: LAVENDER_BORDER,
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: '"Nunito", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: {
      fontWeight: 700,
      // Normal capitalization instead of ALL CAPS on buttons
      textTransform: "none",
    },
  },

  components: {
    /*
     * Cards and panels: frosted white glass with a soft lavender border.
     * Opaque enough that text on them is always easy to read.
     */
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(12px) saturate(130%)",
          WebkitBackdropFilter: "blur(12px) saturate(130%)",
          border: `1px solid ${LAVENDER_BORDER}`,
          // A soft, wide shadow plus a thin bright line along the top edge, like glass
          boxShadow: "0 10px 30px rgba(91, 63, 170, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
        },
      },
    },

    /*
     * Video cards float up a little and glow when hovered.
     * With reduced motion they only glow.
     */
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 0 0 4px rgba(201, 182, 255, 0.35), 0 10px 24px rgba(91, 63, 170, 0.16)",
          },
          [REDUCED_MOTION]: {
            transition: "box-shadow 0.25s ease",
            "&:hover": { transform: "none" },
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        // Every button: fully rounded, with a clear focus ring for keyboard users
        root: {
          borderRadius: 999,
          paddingLeft: 20,
          paddingRight: 20,
          "&.Mui-focusVisible": {
            outline: `3px solid ${LAVENDER_DEEP}`,
            outlineOffset: 2,
          },
        },

        /*
         * Main buttons ("Choose a video", "Process Video..."): soft pixel-art
         * marshmallows. The button itself stays a plain, unclipped <button>
         * (so its shadow and focus ring aren't cut off), and two layers
         * behind the text draw the shape:
         *   ::before - the dark plum outline, cut to the stepped shape
         *   ::after  - the pastel fill, the same shape set 3px inside it,
         *              with a small pixel highlight on top and a faint
         *              darker band along the bottom for a raised look
         */
        contained: {
          position: "relative",
          // Keeps the two shape layers behind the text but inside the button
          isolation: "isolate",
          color: PIXEL_PLUM,
          background: "transparent",
          boxShadow: "none",
          border: "none",
          borderRadius: 0,
          minHeight: 48,
          padding: "12px 32px",
          fontWeight: 800,
          letterSpacing: "0.2px",
          filter: PIXEL_SHADOW_REST,
          transition:
            "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), filter 0.25s cubic-bezier(0.22, 1, 0.36, 1)",

          // The plum outline
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -2,
            background: PIXEL_PLUM,
            clipPath: PIXEL_SHAPE,
          },

          // The pastel fill, with a pixel highlight and a soft bottom shade
          "&::after": {
            content: '""',
            position: "absolute",
            inset: PX,
            zIndex: -1,
            clipPath: PIXEL_SHAPE,
            background: [
              // Small highlight dash near the top-left, like light on a soft surface
              `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) ${4 * PX}px ${PX + 1}px / ${6 * PX}px ${PX}px no-repeat`,
              // A shorter dot after it
              `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) ${11 * PX}px ${PX + 1}px / ${PX}px ${PX}px no-repeat`,
              // Faint darker band along the bottom
              `linear-gradient(rgba(73, 50, 103, 0.10), rgba(73, 50, 103, 0.10)) left bottom / 100% ${PX + 1}px no-repeat`,
              // The fill color itself
              `var(--pixel-fill, ${PIXEL_CREAM})`,
            ].join(", "),
            transition: "background-color 0.25s ease",
          },

          // MUI's ripple is a plain rectangle, which doesn't fit the pixel shape
          "& .MuiTouchRipple-root": {
            display: "none",
          },

          // Hover: lift 2px, a soft shadow, and a slightly brighter fill
          "&:hover": {
            background: "transparent",
            boxShadow: "none",
            transform: "translateY(-2px)",
            filter: PIXEL_SHADOW_LIFT,
            "&::after": {
              backgroundColor: `var(--pixel-fill-hover, ${PIXEL_CREAM_HOVER})`,
            },
          },

          // Click: press gently down with a smaller shadow, then spring back
          "&:active": {
            transform: "translateY(1px)",
            filter: PIXEL_SHADOW_PRESS,
          },

          /*
           * Keyboard focus: the plum outline grows outward by one more step,
           * so it's twice as thick and still follows the stepped shape.
           */
          "&.Mui-focusVisible": {
            outline: "none",
            "&::before": {
              inset: -PX,
            },
          },

          // Disabled (while a job is starting): faded, flat, no lift
          "&.Mui-disabled": {
            color: "rgba(73, 50, 103, 0.55)",
            background: "transparent",
            boxShadow: "none",
            filter: "none",
            transform: "none",
            "&::before": { background: "rgba(73, 50, 103, 0.35)" },
            "&::after": { background: "#f3eef6" },
          },

          // Reduced motion: no lifting or pressing, only the color and shadow change
          [REDUCED_MOTION]: {
            transition: "filter 0.25s ease",
            "&:hover, &:active": { transform: "none" },
          },
        },

        // Secondary buttons ("Back to videos", "Videos"): plain plum text, soft tint on hover
        text: {
          color: PLUM,
          "&:hover": {
            backgroundColor: "rgba(123, 95, 199, 0.10)",
          },
        },

        // Outlined buttons (like "Download CSV"): thin lavender outline
        outlined: {
          color: PLUM,
          borderColor: "#b9a2ec",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          "&:hover": {
            borderColor: LAVENDER_DEEP,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          },
        },
      },
    },

    // Alerts get the same rounded corners and soft border as panels
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${LAVENDER_BORDER}`,
        },
      },
    },

    // The threshold slider: a lavender track and a white, puffy thumb
    MuiSlider: {
      styleOverrides: {
        // A slightly thicker track, easier to see and to click anywhere along
        root: {
          height: 6,
        },
        rail: {
          backgroundColor: "#cdbdf0",
          opacity: 1,
        },
        track: {
          border: "none",
        },
        // A bigger, puffy white thumb that's easy to grab, with a soft halo on hover
        thumb: {
          width: 22,
          height: 22,
          backgroundColor: "#ffffff",
          border: `2px solid ${LAVENDER_DEEP}`,
          boxShadow: "0 2px 6px rgba(123, 95, 199, 0.3)",
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0 0 0 8px rgba(123, 95, 199, 0.16), 0 2px 6px rgba(123, 95, 199, 0.3)",
          },
          "&.Mui-active": {
            boxShadow: "0 0 0 10px rgba(123, 95, 199, 0.2), 0 2px 6px rgba(123, 95, 199, 0.3)",
          },
        },
      },
    },
  },
});

export default theme;