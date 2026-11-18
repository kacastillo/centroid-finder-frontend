import { Link as RouterLink, Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

/**
 * The frame around every page: a top bar with the app name and a link
 * to the video list. Each page appears where <Outlet /> is.
 */
export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          /*
           * No box behind the header. The sky never moves, so filling the header
           * with the sky's own top color makes it invisible against the sky,
           * while still hiding page content that scrolls up under it.
           * Only the last few pixels fade out, so there's no hard edge.
           */
          background:
            "linear-gradient(180deg, #b7a1e4 0%, rgba(185, 164, 229, 0.97) 72%, rgba(185, 164, 229, 0) 100%)",
          color: "text.primary",
          border: "none",
          boxShadow: "none",
          // No frosted blur here: it would show as a tinted box behind the header
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        }}
      >
        {/*
         * The same max width as the pages, so the app name lines up
         * with each page's title instead of hugging the window edge.
         */}
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              component={RouterLink}
              to="/"
              variant="h6"
              sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
            >
              ✦ Salamander Tracker
            </Typography>

            <Button component={RouterLink} to="/videos" color="inherit" sx={{ mr: -1.5, px: 1.5 }}>
              Videos
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* The current page */}
      <Outlet />
    </Box>
  );
}