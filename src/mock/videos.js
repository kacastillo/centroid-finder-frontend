/** using ai for a fake server Fake server data, used when USE_MOCK is on.*/

export const mockVideos = ["test-red-square.mp4", "salamander2.mov", "forest_intro.mp4"];

// a small drawn "frame", so the cards have a picture without needing the server
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"> 
  <rect width="320" height="180" fill="#3b4a2f"/>
  <ellipse cx="190" cy="100" rx="42" ry="16" fill="#d94b1a"/>
</svg>`;
export const mockThumbnail = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const calls = {};
export function nextMockStatus(jobId) {
  calls[jobId] = (calls[jobId] || 0) + 1;
  if (calls[jobId] < 3) return { status: "processing" };
  return { status: "done", result: `/results/${jobId}.csv` };
}