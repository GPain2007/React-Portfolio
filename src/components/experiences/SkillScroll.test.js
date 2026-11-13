import { render, screen, fireEvent, act } from "@testing-library/react";
import SkillScroll from "./SkillScroll";

const skills = [
  { name: "React", level: "Experienced", description: "Builds UIs." },
  { name: "Node JS", level: "Experienced", description: "Runs JS on servers." },
];

// jsdom (Jest's DOM) does not implement `Element.prototype.scrollTo` — there
// is no real viewport to scroll. `SkillScroll` calls it when the user picks
// a skill other than the currently active one, so without this stub that
// click would throw "scrollTo is not a function" and the test would be
// unable to reach the behavior we actually want to verify.
beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

describe("SkillScroll", () => {
  test("renders one button per skill", () => {
    render(<SkillScroll skills={skills} />);

    expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Node JS" }),
    ).toBeInTheDocument();
  });

  test("clicking the active skill opens its detail panel", () => {
    render(<SkillScroll skills={skills} />);

    // The first skill is active by default.
    fireEvent.click(screen.getByRole("button", { name: "React" }));

    expect(screen.getByText("Builds UIs.")).toBeInTheDocument();
    expect(screen.getByText("Experienced")).toBeInTheDocument();
  });

  test("clicking a different skill makes it active instead of opening it", () => {
    render(<SkillScroll skills={skills} />);

    fireEvent.click(screen.getByRole("button", { name: "Node JS" }));

    const nodeButton = screen.getByRole("button", { name: "Node JS" });
    expect(nodeButton).toHaveAttribute("aria-current", "true");
    expect(screen.queryByText("Runs JS on servers.")).not.toBeInTheDocument();
  });

  test("scroll events that don't change the skill leave its details open", () => {
    jest.useFakeTimers();
    render(<SkillScroll skills={skills} />);

    fireEvent.click(screen.getByRole("button", { name: "React" }));
    expect(screen.getByText("Builds UIs.")).toBeInTheDocument();

    // e.g. iOS momentum or the page nudging the list; scrollTop stays at 0.
    const list = screen.getByRole("button", { name: "React" }).parentElement;
    fireEvent.scroll(list);
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText("Builds UIs.")).toBeInTheDocument();
    jest.useRealTimers();
  });

  test("scrolling to another skill selects it and closes the old details", () => {
    jest.useFakeTimers();
    render(<SkillScroll skills={skills} />);

    fireEvent.click(screen.getByRole("button", { name: "React" }));
    const list = screen.getByRole("button", { name: "React" }).parentElement;
    list.scrollTop = 48; // one row down (rows measure 0px in jsdom, so 48px is used)
    fireEvent.scroll(list);
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole("button", { name: "Node JS" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "React" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    jest.useRealTimers();
  });
});
