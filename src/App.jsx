import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Sky from "./components/Sky";
import Home from "./pages/Home";
import VideoChooser from "./pages/VideoChooser";
import PreviewPage from "./pages/PreviewPage";

/**
 * The app's routes:
 *   /                   -> Home
 *   /videos             -> Video Chooser (pick a video)
 *   /preview/:filename  -> Preview and processing for one video
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Resets browser default styles so MUI looks the same everywhere */}
      <CssBaseline />

      {/* Animated background behind every page */}
      <Sky />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<VideoChooser />} />
          <Route path="/preview/:filename" element={<PreviewPage />} />

          {/* Any unknown URL goes back to the video list */}
          <Route path="*" element={<Navigate to="/videos" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;