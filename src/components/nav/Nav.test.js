import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../App";
import Nav, { NAV_LINKS } from "./Nav";

describe("Nav", () => {
  afterEach(() => {
    delete window.gtag;
  });

  test("renders a labelled link for every section", () => {
    render(<Nav />);
    NAV_LINKS.forEach(({ href, label }) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    });
  });

  test("every link points at a section that exists on the page", () => {
    const { container } = render(<App />);
    NAV_LINKS.filter(({ href }) => href !== "#").forEach(({ href }) => {
      expect(container.querySelector(href)).not.toBeNull();
    });
  });

  test("marks the clicked link active and reports it to analytics", () => {
    window.gtag = jest.fn();
    render(<Nav />);

    const link = screen.getByRole("link", { name: "Portfolio" });
    fireEvent.click(link);

    expect(link).toHaveClass("active");
    expect(window.gtag).toHaveBeenCalledWith("event", "nav_click", {
      section: "#portfolio",
    });
  });
});
