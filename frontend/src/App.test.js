/**Der Test überprüft, ob die App-Komponente korrekt gerendert 
 * wird und ob der Text "learn react" im gerenderten HTML-Dokument vorhanden ist.*/

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
