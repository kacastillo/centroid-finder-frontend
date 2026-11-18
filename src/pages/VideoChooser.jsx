/**
 * Video Chooser page: lists the videos from the server.
 * Placeholder for now.
 */

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getVideos } from "../api/api";
import VideoCard from "../components/VideoCard";
import withLoading from "../hoc/withLoading";

// The grid of videos. It only knows how to show a list.
function VideoList({ videos }) {
  if (videos.length === 0) {
    return <Typography>No videos found on the server yet.</Typography>;
  }
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      }}
    >
      {videos.map((name) => (
        <VideoCard key={name} filename={name} />
      ))}
    </Box>
  );
}

// The same list, now with a spinner and an error message added by the HOC
const VideoListWithLoading = withLoading(VideoList);

// Route: /videos
export default function VideoChooser() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false; // so we don't set state after leaving the page

    getVideos()
      .then((list) => {
        if (!cancelled) setVideos(list);
      })
      .catch((err) => {
        if (!cancelled) setError(`Could not load videos: ${err.message}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Choose a video
      </Typography>
      <VideoListWithLoading loading={loading} error={error} videos={videos} />
    </Container>
  );
}