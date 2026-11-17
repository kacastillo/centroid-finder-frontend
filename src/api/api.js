/** for getVideos, thumbmail, start, getjobstatus, usemock */

import { mockVideos, mockThumbnail, nextMockStatus } from "../mock/videos";

const USE_MOCK = import.meta.env.VITE_USE_MOCK
  ? import.meta.env.VITE_USE_MOCK === "true"
  : true;

// The server sends { error: "..." } with its error responses. Use that message if it is there.
async function errorMessage(res) {
  try {
    const body = await res.json();
    if (body.error) return body.error;
  } catch {
  }
  return `Server returned ${res.status}`;
}

export async function getVideos() {
  if (USE_MOCK) return mockVideos;
  const res = await fetch("/api/videos");
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}

export function thumbnailUrl(filename) {
  if (USE_MOCK) return mockThumbnail;
  return `/thumbnail/${encodeURIComponent(filename)}`;
}

export async function startJob(filename, color, threshold) {
  if (USE_MOCK) return { jobId: `mock-job-${Date.now()}` };
  const url =
    `/process/${encodeURIComponent(filename)}` +
    `?targetColor=${color}&threshold=${threshold}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}

export async function getJobStatus(jobId) {
  if (USE_MOCK) return nextMockStatus(jobId);
  const res = await fetch(`/process/${encodeURIComponent(jobId)}/status`);
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json();
}