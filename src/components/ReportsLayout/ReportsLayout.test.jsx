import { describe, it, expect, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ReportsLayout from './ReportsLayout.jsx';

describe('ReportsLayout', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders View Report links that open in a new tab', () => {
    render(<ReportsLayout />);
    const viewLinks = screen.getAllByRole('link', { name: /view report/i });
    expect(viewLinks.length).toBeGreaterThan(0);
    viewLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link.getAttribute('href')).toMatch(/patient_report\.pdf$/);
    });
  });

  it('renders Download Report links with download attribute', () => {
    render(<ReportsLayout />);
    const downloadLinks = screen.getAllByRole('link', { name: /download report/i });
    expect(downloadLinks.length).toBeGreaterThan(0);
    downloadLinks.forEach((link) => {
      expect(link).toHaveAttribute('download', 'patient_report.pdf');
      expect(link.getAttribute('href')).toMatch(/patient_report\.pdf$/);
    });
  });

  it('shows a message when there are no report rows', () => {
    render(<ReportsLayout rows={[]} />);
    expect(screen.getByRole('status')).toHaveTextContent(/no reports are available yet/i);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
