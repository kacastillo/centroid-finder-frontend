import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import useJobStatus from "../hooks/useJobStatus";

// Shows a progress bar, then the CSV link, or the error.
export default function JobStatus({ jobId }) {
  const { status, result, error } = useJobStatus(jobId);

  if (!jobId || !status) return null;

  if (status === "processing") {
    return (
      <Box data-testid="job-status">
        <Typography gutterBottom>Processing video…</Typography>
        <LinearProgress color="secondary" />
      </Box>
    );
  }

  if (status === "done") {
    return (
      <Box data-testid="job-status">
        <Alert severity="success" sx={{ mb: 2 }}>
          Done! Your results are ready.
        </Alert>
        <Button variant="contained" component="a" href={result} download>
          Download CSV
        </Button>
      </Box>
    );
  }

  return (
    <Alert severity="error" data-testid="job-status">
      Processing failed{error ? `: ${error}` : "."}
    </Alert>
  );
}