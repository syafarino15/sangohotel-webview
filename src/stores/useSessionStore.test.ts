import { beforeEach, describe, expect, it } from 'vitest';
import type { HistoryRecord } from '@/types/account';
import { useSessionStore } from './useSessionStore';

const record: HistoryRecord = {
  code: 'RNT-TEST',
  kind: 'rent',
  title: 'City Car',
  subtitle: '1 hari · Manhattan Hotel Jakarta',
  hotelName: 'Manhattan Hotel Jakarta',
  total: 350_000,
  createdAt: '2026-11-14T08:00:00.000Z',
  status: 'REQUESTED',
};

const reset = () =>
  useSessionStore.setState({
    entered: false,
    member: null,
    history: [],
    activeTab: 'home',
  });

beforeEach(reset);

describe('useSessionStore', () => {
  it('memasuki aplikasi sebagai guest tanpa profil member', () => {
    useSessionStore.getState().enterAsGuest();

    expect(useSessionStore.getState().entered).toBe(true);
    expect(useSessionStore.getState().member).toBeNull();
  });

  it('menyimpan profil saat login member', () => {
    useSessionStore
      .getState()
      .login({ fullName: 'Rian Kusuma', email: 'rian@example.com', phone: '081234567890' });

    const state = useSessionStore.getState();
    expect(state.entered).toBe(true);
    expect(state.member).toEqual({
      fullName: 'Rian Kusuma',
      email: 'rian@example.com',
      phone: '081234567890',
    });
  });

  it('logout menghapus profil dan kembali ke landing page', () => {
    useSessionStore
      .getState()
      .login({ fullName: 'Rian Kusuma', email: 'rian@example.com', phone: '081234567890' });

    useSessionStore.getState().logout();

    expect(useSessionStore.getState().member).toBeNull();
    expect(useSessionStore.getState().entered).toBe(false);
  });

  it('masuk sebagai member memakai profil tersimpan tanpa mengisi form lagi', () => {
    useSessionStore
      .getState()
      .login({ fullName: 'Rian Kusuma', email: 'rian@example.com', phone: '081234567890' });
    useSessionStore.setState({ entered: false });

    useSessionStore.getState().enterAsMember();

    expect(useSessionStore.getState().entered).toBe(true);
    expect(useSessionStore.getState().member?.fullName).toBe('Rian Kusuma');
  });

  it('enterAsMember tidak berbuat apa-apa tanpa profil tersimpan', () => {
    useSessionStore.getState().enterAsMember();

    expect(useSessionStore.getState().entered).toBe(false);
  });

  it('mencatat riwayat sekali untuk kode yang sama', () => {
    useSessionStore.getState().addHistory(record);
    useSessionStore.getState().addHistory(record);

    expect(useSessionStore.getState().history).toHaveLength(1);
    expect(useSessionStore.getState().history[0].code).toBe('RNT-TEST');
  });

  it('menaruh transaksi terbaru di urutan pertama', () => {
    useSessionStore.getState().addHistory(record);
    useSessionStore.getState().addHistory({ ...record, code: 'FOD-TEST', kind: 'food' });

    expect(useSessionStore.getState().history[0].code).toBe('FOD-TEST');
  });

  it('mengganti tab aktif', () => {
    useSessionStore.getState().setTab('vouchers');

    expect(useSessionStore.getState().activeTab).toBe('vouchers');
  });
});