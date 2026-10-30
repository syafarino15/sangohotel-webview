import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BottomTabBar } from './BottomTabBar';

afterEach(cleanup);

describe('BottomTabBar', () => {
  it('menampilkan empat tab navigasi', () => {
    render(<BottomTabBar active="home" onSelect={() => undefined} />);

    expect(screen.getAllByRole('button')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Beranda' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Riwayat' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Voucher' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Akun' })).toBeTruthy();
  });

  it('memanggil onSelect dengan tab yang ditekan', () => {
    const onSelect = vi.fn();
    render(<BottomTabBar active="home" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: 'Riwayat' }));
    expect(onSelect).toHaveBeenLastCalledWith('history');

    fireEvent.click(screen.getByRole('button', { name: 'Akun' }));
    expect(onSelect).toHaveBeenLastCalledWith('account');
  });

  it('menandai tab yang sedang aktif', () => {
    render(<BottomTabBar active="vouchers" onSelect={() => undefined} />);

    expect(screen.getByRole('button', { name: 'Voucher' }).getAttribute('aria-current')).toBe(
      'page'
    );
    expect(
      screen.getByRole('button', { name: 'Beranda' }).getAttribute('aria-current')
    ).toBeNull();
  });
});