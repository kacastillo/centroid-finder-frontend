This is the React frontend for the server you’ve been planning. It’s a separate repo, and the backend is only reached through the 4 API endpoints.
What you’re building
A small React app where a user picks a video, tunes the color and threshold while watching the result live, then sends the job to your server and tracks it until the CSV is ready.
The five required features
1. Video chooser (/videos): call GET /api/videos, which returns a list of filenames, and render each as a clickable item. Clicking one navigates to /preview/:filename.
2. Thumbnail preview: on the preview page, fetch GET /thumbnail/{filename} (the first frame, which you already built). Show it next to a binarized version of the same image.
3. Live tuning: a threshold slider and a color picker. When either changes, the binarized image redraws immediately, with a dot at the centroid of the largest connected group.
    * This runs in the browser, not on the server.
    * It means rewriting your Java logic in JavaScript: color distance against the threshold, then the connected-component search (your DFS/BFS), then the centroid. They say “exactly” so the preview matches what the JAR will produce.
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
The backend wasn’t ready when this was written, so the assignment tells you to fake the API responses. You put arrays like mockVideoList in a mock/ folder and use them in your components. Later you swap in real fetch calls. You don’t need it for your project since your backend works, but it’s handy for building the UI without the server running, and for tests.
Things to watch when you connect to your server
* CORS or a proxy: React’s dev server and Express will run on different ports, so fetch("/api/videos") won’t reach Express by default. Either add the cors package to Express or set up a dev proxy in your React tooling (Vite or Create React App).
* Status words: your frontend will check for processing, done and error exactly, which is why your partner flagged the plan’s old words.
* CSV link: the status response gives a path like /results/<jobId>.csv. Prefix it with your server’s address when you build the link.
* CORS on the thumbnail canvas: if the image is loaded from another origin and you read its pixels, the canvas can be blocked. Using the proxy or enabling CORS on the thumbnail route avoids that.
The hardest part is feature 3, since it combines canvas pixel work with your graph-search code in JavaScript. I can help you plan that part, or explain how the canvas approach works, whichever you’d rather start with.

I have centroid-finder repo right now. So what I need to do is create a different repo? Even though I have index, app, route, etc?
Yes, create a new repo for the frontend. The assignment’s first requirement is “A new repo for your frontend.”
Your centroid-finder repo already holds two things: the Java project in processor/ and the Express server in server/. That server is the backend the React app will talk to. The new repo will have its own package.json, its own src/ with components, and its own npm run dev. Nothing from index.js, app.js or routes.js moves over.

centroid-finder/          (existing repo: backend)
├── processor/            Java JAR
├── server/               Express (index.js, app.js, routes.js...)
├── videos/, results/, jobs/
└── serverPlan.md

centroid-finder-frontend/ (new repo: React)
├── package.json
├── src/                  components, pages, hooks, tests
└── README.md             setup instructions + screenshots
At runtime you’ll have two things running side by side. The Express server runs from centroid-finder/server on port 3000, and the React dev server runs from the new repo on a different port, such as 5173 if you use Vite. The React app calls Express over HTTP, which is why you’ll need CORS or a dev proxy. The repos stay independent of each other.
The new repo needs a React setup (Vite is the quickest), plus React Router and Material UI. You’ll also write the JavaScript version of your centroid logic there, since it runs in the browser.


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