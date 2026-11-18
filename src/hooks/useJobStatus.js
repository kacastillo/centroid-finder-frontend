import { useEffect, useState } from "react";
import { getJobStatus } from "../api/api";

const POLL_MS = 2000;

// Checks a job's status every 2 seconds until it is "done" or "error".
// Returns { status, result, error }. status is null until there is a jobId.

export default function useJobStatus(jobId) {

  const [answer, setAnswer] = useState({ jobId: null, status: null, result: null, error: null });

  useEffect(() => {
    if (!jobId) return;

    let cancelled = false;
    let timer;

    async function check() {
      try {
        const data = await getJobStatus(jobId);
        if (cancelled) return;
        setAnswer({
          jobId,
          status: data.status,
          result: data.result ?? null,
          error: data.error ?? null,
        });


        // Ask again only while it is still running. Waiting for each answer before
        // scheduling the next check means requests never pile up.
        if (data.status === "processing") timer = setTimeout(check, POLL_MS);
      } catch (err) {
      
        if (!cancelled) {
          setAnswer({ jobId, status: "error", result: null, error: err.message });
        }
      }
    }

    check();

   // runs when the component leaves the page or jobId changes
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [jobId]);

  if (!jobId) return { status: null, result: null, error: null };

  // No answer for this job yet: it has just started, so it counts as processing
  if (answer.jobId !== jobId) return { status: "processing", result: null, error: null };
  
  return { status: answer.status, result: answer.result, error: answer.error };
}