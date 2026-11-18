import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
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
    <Container sx={{ py: 3 }}>
      <Button component={RouterLink} to="/videos" sx={{ mb: 2 }}>
        ← Back to videos
      </Button>

      <Typography variant="h4" gutterBottom>
        {filename}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
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
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">Original frame</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tip: click the salamander to pick its color
              </Typography>
              <ThumbnailCanvas
                image={image}
                color={color}
                threshold={threshold}
                onPickColor={setColor}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Binarized frame
              </Typography>
              <BinarizedCanvas image={image} color={color} threshold={threshold} />
            </Box>
          </Stack>

          <ProcessButton
            filename={filename}
            color={color}
            threshold={threshold}
            onJobStarted={setJobId}
          />

          <Box sx={{ mt: 2 }}>
            <JobStatus jobId={jobId} />
          </Box>
        </>
      )}
    </Container>
  );
}