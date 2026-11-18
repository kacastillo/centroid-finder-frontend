import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

// Status messages fill the column; their text stays left-aligned next to the icon
const messageSx = {
  width: "100%",
  textAlign: "left",
};

/**
 * Shows where a processing job is: a loading bar, the CSV download, or the error.
 * PreviewPage checks the job (with useJobStatus) and passes the answer in.
 *
 * Props:
 *   status     - null, "processing", "done", or "error"
 *   result     - the CSV link, once the job is done
 *   error      - what went wrong, if it failed
 *   used       - { color, threshold } the job was started with
 *   outdated   - true when the color or threshold changed after the job finished
 *   onReprocess() - goes back to the "ready to process" step
 */
export default function JobStatus({ status, result, error, used, outdated, onReprocess }) {
  if (!status) return null;

  // The settings the job used, written out for the messages below
  const usedText = used ? `color ${used.color} and threshold ${used.threshold}` : "";

  if (status === "processing") {
    return (
      // role="status" makes screen readers announce this when it appears
      <Box role="status" data-testid="job-status" sx={{ width: "100%" }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Processing video…</Typography>
        <LinearProgress aria-label="Processing video" />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This can take a minute. The results will use {usedText}.
        </Typography>
      </Box>
    );
  }

  if (status === "done" && outdated) {
    return (
      <>
        <Alert severity="warning" role="status" data-testid="job-status" sx={messageSx}>
          <strong>Your settings changed after processing.</strong>
          <br />
          The finished results used {usedText}, so they don't match the preview anymore.
          Process the video again to get results for the new settings.
        </Alert>

        {/* The old results are still there, clearly labeled with the settings they used */}
        <Button variant="text" size="small" component="a" href={result} download>
          Download previous results ({used.color}, threshold {used.threshold})
        </Button>
      </>
    );
  }

  if (status === "done") {
    return (
      <>
        <Alert severity="success" role="status" data-testid="job-status" sx={messageSx}>
          <strong>Done! Your results are ready.</strong>
          <br />
          Processed with {usedText}.
        </Alert>

        {/* Download CSV is the main action now: the cream pixel button */}
        <Button variant="contained" component="a" href={result} download>
          Download CSV
        </Button>

        <Button variant="text" onClick={onReprocess}>
          Reprocess Video
        </Button>
      </>
    );
  }

  // Errors use MUI's default role="alert", so they're announced right away
  return (
    <Alert severity="error" data-testid="job-status" sx={messageSx}>
      <strong>Processing failed.</strong>
      <br />
      {error ? `${error}. ` : ""}Your settings are kept, so you can try again.
    </Alert>
  );
}