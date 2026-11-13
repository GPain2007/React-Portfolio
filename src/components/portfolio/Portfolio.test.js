import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import Portfolio from "./Portfolio";
import ProjectModal from "./ProjectModal";
import projects from "./projects";

describe("project data", () => {
  test("every project has a unique id and title, and a description", () => {
    const ids = projects.map((p) => p.id);
    const titles = projects.map((p) => p.title);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(titles).size).toBe(titles.length);
    projects.forEach((p) => {
      expect(p.title.trim()).not.toBe("");
      expect(p.description.trim().length).toBeGreaterThan(20);
    });
  });

  test("contains no leftover placeholder projects", () => {
    projects.forEach((p) => {
      expect(p.title).not.toMatch(/new project|another project/i);
      expect(p.description).not.toMatch(/goes here/i);
    });
  });

  test("links are either empty or https URLs", () => {
    projects.forEach(({ github, demo }) => {
      [github, demo].forEach((link) => {
        if (link !== null && link !== undefined) {
          expect(link).toMatch(/^https:\/\//);
        }
      });
    });
  });
});

describe("Portfolio", () => {
  test("renders one card per project", () => {
    render(<Portfolio />);
    projects.forEach(({ title }) => {
      expect(
        screen.getByRole("button", { name: `Preview ${title}` }),
      ).toBeInTheDocument();
    });
  });

  test("clicking a card opens its preview, and Escape closes it", async () => {
    render(<Portfolio />);
    const [first] = projects;

    fireEvent.click(screen.getByRole("button", { name: `Preview ${first.title}` }));
    const close = await screen.findByRole("button", {
      name: "Close project preview",
    });
    expect(close).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    await waitForRemoval(() =>
      screen.queryByRole("button", { name: "Close project preview" }),
    );
  });

  test("Enter on a focused card opens its preview", async () => {
    render(<Portfolio />);
    const last = projects[projects.length - 1];

    fireEvent.keyDown(
      screen.getByRole("button", { name: `Preview ${last.title}` }),
      { key: "Enter" },
    );
    expect(
      await screen.findByRole("button", { name: "Close project preview" }),
    ).toBeInTheDocument();
  });
});

describe("ProjectModal", () => {
  const base = {
    id: 99,
    image: null,
    title: "Test Project",
    description: "A project used only in tests.",
    tags: ["React", "Jest"],
  };

  test("shows GitHub and Live Demo buttons when both links exist", () => {
    render(
      <ProjectModal
        project={{ ...base, github: "https://github.com/x/y", demo: "https://example.com" }}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole("link", { name: "Github" })).toHaveAttribute(
      "href",
      "https://github.com/x/y",
    );
    expect(screen.getByRole("link", { name: "Live Demo" })).toBeInTheDocument();
  });

  test("hides the GitHub button for a private repo instead of rendering a dead link", () => {
    render(
      <ProjectModal project={{ ...base, github: null, demo: null }} onClose={() => {}} />,
    );
    expect(screen.queryByRole("link", { name: "Github" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Live Demo" })).not.toBeInTheDocument();
    expect(screen.getByText("Private repository")).toBeInTheDocument();
  });

  test("lists the project's technologies", () => {
    render(<ProjectModal project={{ ...base, github: null }} onClose={() => {}} />);
    const list = screen.getByRole("list", { name: "Technologies" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  test("calls onClose from the close button", () => {
    const onClose = jest.fn();
    render(<ProjectModal project={{ ...base, github: null }} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Close project preview" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// The modal leaves via motion's exit animation, so wait on the real clock
// (same approach as ParticleCard.test.js) rather than fake timers.
async function waitForRemoval(query) {
  await waitFor(() => expect(query()).not.toBeInTheDocument(), {
    timeout: 3000,
  });
}
