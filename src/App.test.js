import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the tower defense shell', () => {
  render(<App />);
  expect(screen.getByText(/tower defense/i)).toBeInTheDocument();
});
