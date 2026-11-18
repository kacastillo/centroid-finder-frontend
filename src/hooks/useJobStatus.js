import { useEffect, useState } from "react";
import { getJobStatus } from "../api/api";

const POLL_MS = 2000; 

/* Checks a job's status every 2 seconds until it is "done" or "error".
returns { status, result, error }. status is null until there is a jobId.
*/

export default function useJobStatus(jobId) {
  const [state, setState] = useState({ status: null, result: null, error: null });

  useEffect(() => {
    if (!jobId) {
      setState({ status: null, result: null, error: null });
      return;
    }

    let cancelled = false;
    let timer;
    setState({ status: "processing", result: null, error: null });

    async function check() {
      try {
        const data = await getJobStatus(jobId);
        if (cancelled) return;
        setState({
          status: data.status,
          result: data.result ?? null,
          error: data.error ?? null,
        });


        // asks again only while it is still running. Waiting for each answer before scheduling the next check means requests never pile up.

        if (data.status === "processing") timer = setTimeout(check, POLL_MS);
      } catch (err) {
        // e.g. the server says 404 for an unknown job ID: stop and show the error
        if (!cancelled) setState({ status: "error", result: null, error: err.message });
      }
    }

    check();

    // runs when the component leaves the page or jobId changes
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [jobId]);

  return state;
}