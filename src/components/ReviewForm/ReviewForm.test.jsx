import { describe, it, expect, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './ReviewForm.jsx';

describe('ReviewForm', () => {
  beforeEach(() => {
    cleanup();
    window.sessionStorage?.clear?.();
  });

  it('shows validation when name, review, or rating missing', async () => {
    const user = userEvent.setup();
    render(<ReviewForm />);
    await user.click(screen.getAllByRole('button', { name: /click here/i })[0]);
    await user.click(screen.getByRole('button', { name: /^submit$/i }));
    expect(screen.getByText(/please fill all fields and choose rating/i)).toBeInTheDocument();
  });

  it('submits review and shows data in the table with button disabled', async () => {
    const user = userEvent.setup();
    render(<ReviewForm />);
    await user.click(screen.getAllByRole('button', { name: /click here/i })[0]);
    await user.type(screen.getByLabelText(/^name/i), 'Alex');
    await user.type(screen.getByLabelText(/^review/i), 'Great visit.');
    await user.click(screen.getByRole('button', { name: /rate 5/i }));
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByText('Great visit.')).toBeInTheDocument();
    const submitted = screen.getAllByRole('button', { name: /submitted/i });
    expect(submitted).toHaveLength(1);
    expect(submitted[0]).toBeDisabled();
  });

  it('keeps each doctor row independent after sequential reviews', async () => {
    const user = userEvent.setup();
    render(<ReviewForm />);

    await user.click(screen.getAllByRole('button', { name: /click here/i })[0]);
    await user.type(screen.getByLabelText(/^name/i), 'Pat');
    await user.type(screen.getByLabelText(/^review/i), 'Cardiology ok');
    await user.click(screen.getByRole('button', { name: /rate 4/i }));
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    await user.click(screen.getByRole('button', { name: /click here/i }));
    await user.type(screen.getByLabelText(/^name/i), 'Sam');
    await user.type(screen.getByLabelText(/^review/i), 'Skin care great');
    await user.click(screen.getByRole('button', { name: /rate 5/i }));
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    expect(screen.getByText('Cardiology ok')).toBeInTheDocument();
    expect(screen.getByText('Skin care great')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /submitted/i })).toHaveLength(2);
  });
});
