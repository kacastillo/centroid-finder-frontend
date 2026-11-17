import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

/**
 * Preview and processing page for one video.
 * The real version comes later (thumbnail, controls, process button).
 */
function PreviewPage() {
  // The video's name from the URL, like /preview/ensantina.mp4
  const { filename } = useParams();

  return <Typography variant="h4">Preview: {filename}</Typography>;
}

export default PreviewPage;