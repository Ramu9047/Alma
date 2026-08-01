import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Alma Academic Command Center Application', () => {
  it('renders Alma branding and layout header correctly', () => {
    render(<App />);
    const brandingElements = screen.getAllByText(/Alma/i);
    expect(brandingElements.length).toBeGreaterThan(0);
    expect(brandingElements[0]).toBeInTheDocument();
  });

  it('renders Predictive Risk Radar dashboard on startup', () => {
    render(<App />);
    expect(screen.getByText(/PREDICTIVE INTELLIGENCE & RISK RADAR/i)).toBeInTheDocument();
  });

  it('renders docked Alma AI Copilot button', () => {
    render(<App />);
    const copilotBtn = screen.getByLabelText(/Toggle Alma AI Copilot/i);
    expect(copilotBtn).toBeInTheDocument();
  });
});
