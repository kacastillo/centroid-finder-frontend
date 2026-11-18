import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
/*
 * The largest possible color distance is black to white:
 * sqrt(255^2 + 255^2 + 255^2) = 441.67, so 442 makes every pixel white.
 */
const MAX_THRESHOLD = 442;

/*
 * Two groups side by side: the color group takes only the width it needs,
 * and the threshold group takes the rest. Labels sit on the top row and
 * controls on the row below, so the two labels line up and the swatch
 * lines up with the slider.
 *
 * On small screens it becomes one column: color label, color picker,
 * threshold label, slider.
 */
const gridSx = {
  display: "grid",
  columnGap: 5,
  rowGap: 1,
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "auto minmax(0, 1fr)" },
  gridTemplateAreas: {
    xs: `"colorLabel" "colorControl" "thresholdLabel" "thresholdControl"`,
    sm: `"colorLabel thresholdLabel" "colorControl thresholdControl"`,
  },
};

// Both control cells are the same height, so the swatch and slider are centered on one line
const controlRowSx = {
  display: "flex",
  alignItems: "center",
  minHeight: 48,
};

// Small, bold label text above each control
const labelSx = {
  fontWeight: 700,
  fontSize: "0.9rem",
};

// The small pill that shows a value (the hex code, the threshold number)
const valuePillSx = {
  fontFamily: "monospace",
  fontSize: "0.85rem",
  lineHeight: 1.6,
  px: 1.25,
  borderRadius: 999,
  bgcolor: "rgba(255, 255, 255, 0.7)",
  border: "1px solid rgba(185, 160, 240, 0.5)",
};

/**
 * Color picker and threshold slider for tuning the binarized preview.
 *
 * Props: color ("#5c0005"), threshold (number),
 *        onColorChange(newColor), onThresholdChange(newThreshold)
 */
export default function ControlsPanel({ color, threshold, onColorChange, onThresholdChange }) {
  return (
    <Box sx={gridSx}>
      <Typography component="label" htmlFor="target-color" sx={{ ...labelSx, gridArea: "colorLabel" }}>
        Target color
      </Typography>

      <Box sx={{ ...controlRowSx, gridArea: "colorControl", gap: 1.5 }}>
        {/*
         * The browser's built-in color picker; its value looks like "#5c0005".
         * Styled as a rounded swatch, 44px tall so it's easy to tap.
         */}
        <Box
          component="input"
          id="target-color"
          data-testid="color-picker"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          sx={{
            width: 56,
            height: 44,
            p: 0.5,
            border: "1px solid rgba(185, 160, 240, 0.7)",
            borderRadius: "12px",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            cursor: "pointer",
            "&:focus-visible": {
              outline: "3px solid #7b5fc7",
              outlineOffset: 2,
            },
            // Rounds the color inside the picker in Chrome/Edge and Safari
            "&::-webkit-color-swatch-wrapper": { p: 0 },
            "&::-webkit-color-swatch": { border: "none", borderRadius: "8px" },
            // Same for Firefox
            "&::-moz-color-swatch": { border: "none", borderRadius: "8px" },
          }}
        />

        {/* The hex value; aria-hidden because the picker already reports its color */}
        <Typography component="span" aria-hidden="true" sx={valuePillSx}>
          {color}
        </Typography>
      </Box>

      {/* The label and the current number, kept together on one line */}
      <Box sx={{ gridArea: "thresholdLabel", display: "flex", alignItems: "center", gap: 1 }}>
        <Typography id="threshold-label" sx={labelSx}>
          Threshold
        </Typography>
        <Typography component="span" aria-hidden="true" sx={valuePillSx}>
          {threshold}
        </Typography>
      </Box>

      {/*
       * onChange fires while dragging, so the preview updates live.
       * Keyboard: arrow keys move by 1, Shift + arrows by 10, Home/End jump to the ends.
       * At either end the thumb sits in the panel's padding, so it's never cut off.
       */}
      <Box sx={{ ...controlRowSx, gridArea: "thresholdControl" }}>
        <Slider
          data-testid="threshold-slider"
          aria-labelledby="threshold-label"
          value={threshold}
          min={0}
          max={MAX_THRESHOLD}
          step={1}
          shiftStep={10}
          valueLabelDisplay="auto"
          onChange={(e, value) => onThresholdChange(value)}
        />
      </Box>
    </Box>
  );
}