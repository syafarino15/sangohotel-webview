'use client';

import { useState } from 'react';
import { LogOut, Mail, Phone, Ticket, UserRound } from 'lucide-react';
import { Header } from '@/components/Header';
import { MemberLoginSheet } from '@/components/landing/MemberLoginSheet';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/stores/useSessionStore';

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const AccountScreen = () => {
  const member = useSessionStore((state) => state.member);
  const history = useSessionStore((state) => state.history);
  const login = useSessionStore((state) => state.login);
  const logout = useSessionStore((state) => state.logout);
  const [loginOpen, setLoginOpen] = useState(false);

  const voucherCount = history.filter((record) => record.kind === 'hotel').length;

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <div className="sticky top-0 z-30">
        <Header title="Akun" subtitle="Profil dan ringkasan aktivitas" />
      </div>

      <div className="flex-1 space-y-2.5 px-3 pb-[calc(5rem+env(safe-area-inset-bottom,0px)+var(--host-bottom-offset,0px))] pt-2.5">
        {member ? (
          <>
            <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sango-ink text-[15px] font-bold text-sango-cream">
                  {initials(member.fullName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-slate-900">
                    {member.fullName}
                  </p>
                  <p className="text-[11px] font-semibold text-primary">Member Sango</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> {member.email}
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> {member.phone}
                </li>
              </ul>

              <p className="mt-2.5 rounded-lg bg-primary-surface px-2.5 py-2 text-[10px] leading-relaxed text-primary-dark">
                Data pemesan terisi otomatis setiap kali Anda memesan.
              </p>
            </section>

            <section className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Transaksi
                </p>
                <p className="text-[17px] font-bold text-slate-900">{history.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  <Ticket size={10} /> Voucher
                </p>
                <p className="text-[17px] font-bold text-slate-900">{voucherCount}</p>
              </div>
            </section>

            <Button variant="ghost" size="lg" fullWidth onClick={logout}>
              <LogOut size={16} /> Keluar dari akun
            </Button>
          </>
        ) : (
          <section className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-surface text-primary">
              <UserRound size={24} />
            </span>
            <p className="text-[14px] font-bold text-slate-900">Anda masuk sebagai Guest</p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Masuk sebagai member agar data pemesan terisi otomatis dan riwayat tersimpan rapi.
            </p>
            <Button fullWidth size="md" className="mt-1" onClick={() => setLoginOpen(true)}>
              Masuk sebagai Member
            </Button>
          </section>
        )}
      </div>

      <MemberLoginSheet
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={(profile) => {
          login(profile);
          setLoginOpen(false);
        }}
      />
    </div>
  );
};