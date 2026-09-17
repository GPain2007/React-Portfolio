import { render, screen } from '@testing-library/react';
import App from './App';

// This replaces Create React App's scaffolded "renders learn react link"
// test, which asserted on placeholder boilerplate text that no longer
// exists on the page. A smoke test that renders the whole tree is still
// valuable: it's the one place that would catch a component throwing
// during mount (e.g. a missing Three.js/Motion mock) before it reaches
// a real browser.
test('renders the header headline', () => {
  render(<App />);
  const headline = screen.getByRole('heading', {
    name: /From HVAC Tech to Controls Engineer to Software Engineer/i,
  });
  expect(headline).toBeInTheDocument();
});
