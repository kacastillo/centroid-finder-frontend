import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { thumbnailUrl } from "../api/api";
import ControlsPanel from "../components/ControlsPanel";
import ThumbnailCanvas from "../components/ThumbnailCanvas";
import BinarizedCanvas from "../components/BinarizedCanvas";
import ProcessButton from "../components/ProcessButton";
import JobStatus from "../components/JobStatus";

/*
 * Starting settings. These matched the salamander well when we tested
 * the real video (color 5C0005, threshold 80).
 */
const DEFAULT_COLOR = "#5c0005";
const DEFAULT_THRESHOLD = 80;

/*
 * A soft rounded frame around each canvas. Only the border around the
 * canvas changes; the pixels inside are drawn exactly the same.
 * The radius is the canvas's 8px corner plus the 8px padding, so the
 * inner and outer corners curve together.
 */
const frameSx = {
  p: 1,
  borderRadius: "16px",
  bgcolor: "rgba(255, 255, 255, 0.55)",
  border: "1px solid rgba(185, 160, 240, 0.55)",
  boxShadow: "0 8px 24px rgba(91, 63, 170, 0.10)",
};

/*
 * The two frames as a grid. The headings sit in one row and the frames in
 * the next, so both frames always start at the same height, even though
 * only the original has a tip line. minmax(0, 1fr) makes the two columns
 * exactly equal and lets them shrink instead of overflowing the page.
 *
 * On small screens it becomes one column, in the order:
 * original heading, original frame, binarized heading, binarized frame.
 */
const framesGridSx = {
  display: "grid",
  columnGap: 3,
  rowGap: 1.5,
  gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
  gridTemplateAreas: {
    xs: `"origHead" "origFrame" "binHead" "binFrame"`,
    md: `"origHead binHead" "origFrame binFrame"`,
  },
  // Both headings start at the same height; the frames' row starts below the taller one
  alignItems: "start",
};

/**
 * Route: /preview/:filename
 *
 * Loads the video's first frame, shows it next to a live binarized version,
 * lets the user tune the color and threshold, and starts a processing job.
 */
export default function PreviewPage() {
  // The video's name from the URL, like /preview/ensantina.mp4
  const { filename } = useParams();

  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [jobId, setJobId] = useState(null);

  /*
   * Load the first frame whenever the filename changes.
   * The canvases need a fully loaded image before they can read its pixels,
   * so the image is only stored in state once it has finished loading.
   */
  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!cancelled) {
        setImage(img);
        setImageError("");
      }
    };
    img.onerror = () => {
      if (!cancelled) setImageError(`Could not load the first frame of ${filename}.`);
    };
    img.src = thumbnailUrl(filename);

    // Ignore a load that finishes after leaving the page or switching videos
    return () => {
      cancelled = true;
    };
  }, [filename]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* The negative margin lines the arrow up with the title's left edge */}
      <Button component={RouterLink} to="/videos" sx={{ mb: 1, ml: -1.5, px: 1.5 }}>
        ← Back to videos
      </Button>

      <Typography variant="h4" component="h1" sx={{ mb: 2.5, overflowWrap: "anywhere" }}>
        {filename}
      </Typography>

      <Paper sx={{ px: { xs: 2.5, sm: 3 }, py: 2.5, mb: 4 }}>
        <ControlsPanel
          color={color}
          threshold={threshold}
          onColorChange={setColor}
          onThresholdChange={setThreshold}
        />
      </Paper>

      {imageError && <Alert severity="error">{imageError}</Alert>}

      {!image && !imageError && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {image && (
        <>
          {/* Original and binarized frames side by side (stacked on small screens) */}
          <Box sx={framesGridSx}>
            <Box sx={{ gridArea: "origHead" }}>
              <Typography variant="h6">Original frame</Typography>
              <Typography variant="body2" color="text.secondary">
                Tip: click the salamander to pick its color
              </Typography>
            </Box>

            <Box sx={{ gridArea: "origFrame", ...frameSx }}>
              <ThumbnailCanvas
                image={image}
                color={color}
                threshold={threshold}
                onPickColor={setColor}
              />
            </Box>

            <Typography variant="h6" sx={{ gridArea: "binHead", mt: { xs: 2, md: 0 } }}>
              Binarized frame
            </Typography>

            <Box sx={{ gridArea: "binFrame", ...frameSx }}>
              <BinarizedCanvas image={image} color={color} threshold={threshold} />
            </Box>
          </Box>

          {/*
           * The process button, centered under both frames.
           * The two --pixel-fill variables make its pixel-art fill pink
           * instead of the default cream (see "contained" in theme.js).
           */}
          <Box
            sx={{
              "--pixel-fill": "#f4a8c4",
              "--pixel-fill-hover": "#f8bdd3",
              mt: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <ProcessButton
              filename={filename}
              color={color}
              threshold={threshold}
              onJobStarted={setJobId}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <JobStatus jobId={jobId} />
          </Box>
        </>
      )}
    </Container>
  );
}