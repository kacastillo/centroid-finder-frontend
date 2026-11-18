//this part for cypress uses ai -  A tiny fake first frame, so the cards have a picture
const thumbSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">
  <rect width="320" height="180" fill="#3b4a2f"/></svg>`;

describe("Video chooser", () => {
  beforeEach(() => {
    cy.intercept("GET", "/thumbnail/*", {
      headers: { "content-type": "image/svg+xml" },
      body: thumbSvg,
    });
  });

  it("lists the videos from the API and opens the preview page", () => {
    cy.intercept("GET", "/api/videos", ["a.mp4", "b.mp4"]);

    cy.visit("/videos");
    cy.get("[data-testid=video-card]").should("have.length", 2);
    cy.contains("a.mp4").click();
    cy.location("pathname").should("eq", "/preview/a.mp4");
  });

  it("shows a message when the API fails", () => {
    cy.intercept("GET", "/api/videos", { statusCode: 500, body: { error: "boom" } });

    cy.visit("/videos");
    cy.contains("Could not load videos");
  });
});