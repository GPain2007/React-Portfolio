import { render, screen, fireEvent } from "@testing-library/react";
import ParticleCard from "./ParticleCard";

// ParticleCard drives a real Three.js particle sphere in a <canvas>. jsdom
// has no GPU, so `src/__mocks__/three.js` (an automatic Jest mock — see
// README.md "Testing Three.js and Motion") swaps in plain-object stand-ins
// for Scene/Points/etc. That lets this file test the actual contract that
// matters to users of the component — click to materialize, see the
// content, click back to return — without ever touching WebGL.
//
// These cases run on real timers instead of Jest's fake ones on purpose:
// the materialize/dematerialize swap is gated by `motion`'s own
// requestAnimationFrame-driven exit animation (AnimatePresence mode="wait"),
// and faking time doesn't reliably drive that animation loop to completion.
// Waiting on the real clock costs a fraction of a second per test but
// verifies the actual transition users experience.
describe("ParticleCard", () => {
  test("starts as a sphere prompt showing the title", () => {
    render(<ParticleCard title="Frontend Development">details</ParticleCard>);

    expect(
      screen.getByRole("button", { name: /Frontend Development/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Click to materialize")).toBeInTheDocument();
  });

  test("reveals the children after the sphere materializes", async () => {
    render(<ParticleCard title="Frontend Development">Skill list</ParticleCard>);

    fireEvent.click(screen.getByRole("button", { name: /Frontend Development/i }));

    // ParticleCard waits 550ms (the explode animation) before swapping the
    // sphere prompt for the real content.
    expect(await screen.findByText("Skill list", {}, { timeout: 3000 })).toBeInTheDocument();
  });

  test("returning via the back button hides the content again", async () => {
    render(<ParticleCard title="Frontend Development">Skill list</ParticleCard>);

    fireEvent.click(screen.getByRole("button", { name: /Frontend Development/i }));
    await screen.findByText("Skill list", {}, { timeout: 3000 });

    fireEvent.click(
      screen.getByRole("button", { name: "Return to particle sphere" }),
    );

    expect(
      await screen.findByText("Click to materialize", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Skill list")).not.toBeInTheDocument();
  });
});
