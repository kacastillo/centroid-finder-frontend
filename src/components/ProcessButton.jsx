import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { startJob } from "../api/api";

/* Sends the chosen settings to the server and hands back the new job ID.
 Propps filename, color, threshold, onJobStarted(jobId)
 */

export default function ProcessButton({ filename, color, threshold, onJobStarted, disabled }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setSubmitting(true);
    setError("");
    try {
      const hex = color.replace(/^#/, ""); 
      const { jobId } = await startJob(filename, hex, threshold);
      onJobStarted(jobId);
    } catch (err) {
      setError(`Could not start processing: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={handleClick} disabled={submitting || disabled}>
        Process Video with These Settings
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
}