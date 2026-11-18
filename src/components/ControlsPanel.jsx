import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/*
 * The largest possible color distance is black to white:
 * sqrt(255^2 + 255^2 + 255^2) = 441.67, so 442 makes every pixel white.
 */
const MAX_THRESHOLD = 442;

/**
 * Color picker and threshold slider for tuning the binarized preview.
 *
 * Props: color ("#5c0005"), threshold (number),
 *        onColorChange(newColor), onThresholdChange(newThreshold)
 */
export default function ControlsPanel({ color, threshold, onColorChange, onThresholdChange }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography component="label" htmlFor="target-color">
          Target color
        </Typography>

        {/* The browser's built-in color picker; its value looks like "#5c0005" */}
        <input
          id="target-color"
          data-testid="color-picker"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          style={{ width: 48, height: 32, border: "none", background: "none", cursor: "pointer" }}
        />

        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
          {color}
        </Typography>
      </Stack>

      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography id="threshold-label" gutterBottom>
          Threshold: {threshold}
        </Typography>

        {/* onChange fires while dragging, so the preview updates live */}
        <Slider
          data-testid="threshold-slider"
          aria-labelledby="threshold-label"
          value={threshold}
          min={0}
          max={MAX_THRESHOLD}
          step={1}
          valueLabelDisplay="auto"
          onChange={(e, value) => onThresholdChange(value)}
        />
      </Box>
    </Stack>
  );
}