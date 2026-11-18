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
import useJobStatus from "../hooks/useJobStatus";
import { PIXEL_PINK_FILL } from "../theme";
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

/*
 * The process / download area: one narrow column, centered under the frames.
 */
const actionColumnSx = {
  mt: 5,
  mx: "auto",
  maxWidth: 520,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  textAlign: "center",
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

  /*
   * The processing job, and the color and threshold it was started with.
   * null means nothing has been processed yet (or the user chose Reprocess).
   */
  const [job, setJob] = useState(null);
  const { status, result, error } = useJobStatus(job ? job.id : null);

  /*
   * ProcessButton calls this after the server accepts the job.
   * The color and threshold here are the ones from the click that started it.
   */
  function handleJobStarted(jobId) {
    setJob({ id: jobId, color, threshold });
  }

  // Back to "ready to process". The video, color, and threshold all stay as they are.
  function handleReprocess() {
    setJob(null);
  }

  // True when the finished results were made with different settings than the ones shown now
  const outdated = job !== null && (job.color !== color || job.threshold !== threshold);

  /*
   * Configure -> Process -> Download:
   * the process button shows until a job is done with the current settings,
   * then Download CSV (inside JobStatus) takes its place.
   */
  const showProcessButton = !(status === "done" && !outdated);

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
              <Typography variant="h6" component="h2">
                Original frame
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tip: click the salamander to pick its color.
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

            {/*
             * This caption matches binarize.js: a pixel turns white when its
             * color distance to the target is less than the threshold.
             */}
            <Box sx={{ gridArea: "binHead", mt: { xs: 2, md: 0 } }}>
              <Typography variant="h6" component="h2">
                Binarized frame
              </Typography>
              <Typography variant="body2" color="text.secondary">
                White pixels are within the threshold of the target color.
              </Typography>
            </Box>

            <Box sx={{ gridArea: "binFrame", ...frameSx }}>
              <BinarizedCanvas image={image} color={color} threshold={threshold} />
            </Box>
          </Box>

          {/* Configure → Process → Download, centered under both frames */}
          <Box component="section" aria-label="Process video" sx={actionColumnSx}>
            {showProcessButton && (
              // PIXEL_PINK_FILL makes this pixel-art button pink instead of cream
              <Box sx={{ ...PIXEL_PINK_FILL, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ProcessButton
                  filename={filename}
                  color={color}
                  threshold={threshold}
                  onJobStarted={handleJobStarted}
                  disabled={status === "processing"}
                />
              </Box>
            )}

            {!job && (
              <Typography variant="body2" color="text.secondary">
                Happy with the preview? Process the whole video with these settings.
              </Typography>
            )}

            <JobStatus
              status={status}
              result={result}
              error={error}
              used={job}
              outdated={outdated}
              onReprocess={handleReprocess}
            />
          </Box>
        </>
      )}
    </Container>
  );
}