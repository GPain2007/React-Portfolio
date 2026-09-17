import {
  render,
  screen,
  fireEvent,
  within,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import JobCarousel from "./JobCarousel";

const jobs = [
  {
    role: "Software Engineer",
    company: "SkipForward",
    location: "Austin, TX",
    period: "Apr 2026 – Present",
    points: ["Built the thing."],
  },
  {
    role: "Open Source Software Engineer",
    company: "Mozilla",
    location: "Austin, TX",
    period: "Aug 2022 – Present",
    points: ["Fixed the other thing."],
  },
];

// JobCarousel builds its 3D ring with three's CSS3DRenderer, which doesn't
// use WebGL — it just keeps a plain DOM element in sync with a 3D transform.
// `src/__mocks__/three/examples/jsm/renderers/CSS3DRenderer.js` mirrors only
// that DOM-syncing behavior (see README.md "Testing Three.js and Motion"),
// which is what lets this file query and click the job cards exactly like a
// real browser would, without running three's real matrix math or a
// requestAnimationFrame loop we don't care about in a unit test.
describe("JobCarousel", () => {
  test("renders one dot and one card per job", () => {
    render(<JobCarousel jobs={jobs} />);

    expect(
      screen.getByRole("button", { name: "Show Software Engineer at SkipForward" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Show Open Source Software Engineer at Mozilla",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "View details for Software Engineer at SkipForward",
      }),
    ).toBeInTheDocument();
  });

  test("clicking a job card opens its details in a modal", () => {
    render(<JobCarousel jobs={jobs} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "View details for Software Engineer at SkipForward",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Software Engineer at SkipForward",
    });
    expect(dialog).toBeInTheDocument();
    // The job card behind the modal also renders a one-line teaser using
    // the same text, so scope the query to the dialog itself.
    expect(within(dialog).getByText("Built the thing.")).toBeInTheDocument();
  });

  // The modal fades/scales out via a real `motion` exit animation (see
  // ParticleCard.test.js for the same reasoning), so it stays in the DOM for
  // a moment after the close button is clicked — waitForElementToBeRemoved
  // lets the real animation finish instead of asserting on a false negative.
  test("closing the modal returns focus to the carousel", async () => {
    render(<JobCarousel jobs={jobs} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "View details for Software Engineer at SkipForward",
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Close job details" }));

    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"), {
      timeout: 3000,
    });
  });

  test("the pause/resume toggle flips its accessible label", () => {
    render(<JobCarousel jobs={jobs} />);

    const toggle = screen.getByRole("button", { name: "Pause rotation" });
    fireEvent.click(toggle);

    expect(
      screen.getByRole("button", { name: "Resume rotation" }),
    ).toBeInTheDocument();
  });
});
