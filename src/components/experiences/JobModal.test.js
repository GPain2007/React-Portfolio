import { render, screen, fireEvent } from "@testing-library/react";
import JobModal from "./JobModal";

const job = {
  role: "Software Engineer",
  company: "SkipForward",
  location: "Austin, TX",
  period: "Apr 2026 – Present",
  points: ["Built the thing.", "Fixed the other thing."],
};

// TDD note: writing these three cases first is what pinned down the modal's
// actual contract — it renders as an accessible dialog, closes on the "X"
// button, and closes on Escape. All three are one-line user actions, so a
// test takes seconds to write and instantly proves the contract still holds
// after any future refactor of JobCarousel or JobModal's internals.
describe("JobModal", () => {
  test("renders the job's details in an accessible dialog", () => {
    render(<JobModal job={job} onClose={() => {}} />);

    const dialog = screen.getByRole("dialog", {
      name: "Software Engineer at SkipForward",
    });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("SkipForward")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Software Engineer" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Built the thing.")).toBeInTheDocument();
    expect(screen.getByText("Fixed the other thing.")).toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    const onClose = jest.fn();
    render(<JobModal job={job} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close job details" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when the Escape key is pressed", () => {
    const onClose = jest.fn();
    render(<JobModal job={job} onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
