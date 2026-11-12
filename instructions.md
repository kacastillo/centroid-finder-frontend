This is the React frontend for a server; It’s a separate repo, and the backend is only reached through the 4 API endpoints.
What you’re building
A small React app where a user picks a video, tunes the color and threshold while watching the result live, then sends the job to your server and tracks it until the CSV is ready.

The five required features
1. Video chooser (/videos): call GET /api/videos, which returns a list of filenames, and render each as a clickable item. Clicking one navigates to /preview/:filename.
2. Thumbnail preview: on the preview page, fetch GET /thumbnail/{filename} (the first frame, which you already built). Show it next to a binarized version of the same image.
3. Live tuning: a threshold slider and a color picker. When either changes, the binarized image redraws immediately, with a dot at the centroid of the largest connected group.
    * This runs in the browser, not on the server.
    * It means rewriting Java logic in JavaScript: color distance against the threshold, then the connected-component search (your DFS/BFS), then the centroid. They say “exactly” so the preview matches what the JAR will produce.
    * You’d typically draw the thumbnail onto a <canvas>, read its pixels, and write the binarized pixels to a second canvas.
4. Submit a job: a button labeled exactly “Process Video with These Settings.” It sends POST /process/{filename}?targetColor=<hex>&threshold=<int> and gets back a jobId.
5. Track status: poll GET /process/{jobId}/status until it says done (or error). Show progress while it’s processing, then a link to the CSV from the result path.
Other requirements
* Routes: at minimum /videos and /preview/:filename, using React Router.
* React basics: state, props, and useEffect for the API calls.
* Higher-order component: the learning objectives say to write at least one. A common choice is a wrapper that adds loading and error handling to a component.
* Testing: basic tests with Cypress or Mocha.
* Styling: Material UI, applied consistently.
* One unique feature of your choice: anything extra that you and your partner pick.
* Deliverable: a GitHub repo with a working app and a README that has setup instructions and screenshots.
Mock data


centroid-finder/          (existing repo: backend)
├── processor/            Java JAR
├── server/               Express (index.js, app.js, routes.js...)
├── videos/, results/, jobs/
└── serverPlan.md

centroid-finder-frontend/ (new repo: React)
├── package.json
├── src/                  components, pages, hooks, tests
└── README.md             setup instructions + screenshots



Architecture : 

src/
├── main.jsx                 BrowserRouter + MUI ThemeProvider
├── App.jsx                  <Sky /> plus the three <Route>s
├── theme.js                 purple primary, cyan/yellow accents
├── api.js                   fetch helpers for the 4 endpoints
├── pages/
│   ├── Home.jsx             the bordered "Videos" cloud link
│   ├── VideoChooser.jsx     /videos, grid of VideoCards
│   └── Preview.jsx          /preview/:filename
├── components/
│   ├── Sky.jsx              stars and clouds background
│   ├── VideoCard.jsx        thumbnail + filename, links to preview
│   ├── withLoading.jsx      your HOC (loading and error wrapper)
│   ├── BinarizedCanvas.jsx  draws the binarized image + centroid dot
│   └── JobStatus.jsx        progress bar, then the CSV link
├── lib/
│   ├── binarize.js          color distance vs. threshold
│   └── findCentroid.js      your Java connected-group logic in JS
├── mock/                    mock video list, status responses
└── tests/