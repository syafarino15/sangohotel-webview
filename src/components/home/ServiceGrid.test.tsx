import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServiceGrid } from './ServiceGrid';

afterEach(cleanup);

describe('ServiceGrid', () => {
  it('menampilkan dua layanan aktif', () => {
    render(<ServiceGrid onSelect={() => undefined} />);

    expect(screen.getByRole('button', { name: /Rent/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Food/i })).toBeTruthy();
  });

  it('memanggil onSelect dengan layanan yang tepat', () => {
    const onSelect = vi.fn();
    render(<ServiceGrid onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /Rent/i }));
    expect(onSelect).toHaveBeenLastCalledWith('rent');

    fireEvent.click(screen.getByRole('button', { name: /Food/i }));
    expect(onSelect).toHaveBeenLastCalledWith('food');
  });

  it('menandai dua slot lain sebagai segera hadir', () => {
    const { container } = render(<ServiceGrid onSelect={() => undefined} />);

    expect(container.querySelectorAll('[aria-disabled="true"]')).toHaveLength(2);
    expect(screen.getAllByText('Segera')).toHaveLength(2);
  });
});