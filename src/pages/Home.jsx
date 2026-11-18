import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// The small sparkles on each side of the title: smaller and softer than the text
const titleSparkleSx = {
  fontSize: "0.42em",
  color: "primary.main",
  opacity: 0.7,
  verticalAlign: "middle",
  mx: { xs: 1, sm: 2 },
};

/**
 * Route: /
 * The title, a short description, and a button to the video list,
 * floating directly on the sky with no card around them.
 */
export default function Home() {
  return (
    /*
     * Fills the screen below the top bar (64px) and centers the content
     * up and down. The extra bottom padding on larger screens lifts it
     * slightly above the middle, which looks more balanced to the eye.
     */
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        pb: { xs: 0, md: "10vh" },
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 8, sm: 10 }, textAlign: "center" }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: { xs: "2.25rem", sm: "3rem" },
            letterSpacing: "-0.5px",
            lineHeight: 1.15,
            mb: 3,
          }}
        >
          <Box component="span" aria-hidden="true" sx={titleSparkleSx}>
            ✦
          </Box>
          Salamander Tracker
          <Box component="span" aria-hidden="true" sx={titleSparkleSx}>
            ✦
          </Box>
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            // About 50 characters per line, a comfortable reading width
            maxWidth: "30rem",
            mx: "auto",
            mb: 5.5,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.75,
          }}
        >
          Pick a video, tune the color and threshold while watching a live preview,
          then process the whole video to get a CSV of where the salamander went.
        </Typography>

        <Button variant="contained" size="large" component={RouterLink} to="/videos">
          Choose a video
        </Button>
      </Container>
    </Box>
  );
}