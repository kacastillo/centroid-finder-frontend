import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { thumbnailUrl } from "../api/api";

//  video: its first frame and its name. Clicking goes to the preview page.
export default function VideoCard({ filename }) {
  return (
    <Card data-testid="video-card">
      <CardActionArea component={Link} to={`/preview/${encodeURIComponent(filename)}`}>
        <CardMedia
          component="img"
          height="150"
          image={thumbnailUrl(filename)}
          alt={`First frame of ${filename}`}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography noWrap>{filename}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}