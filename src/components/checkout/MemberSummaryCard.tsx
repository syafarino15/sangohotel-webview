'use client';

import { Mail, Pencil, Phone, User } from 'lucide-react';
import type { MemberProfile } from '@/types/account';

interface MemberSummaryCardProps {
  member: MemberProfile;
  onEdit: () => void;
}

export const MemberSummaryCard = ({ member, onEdit }: MemberSummaryCardProps) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
    <header className="mb-2.5 flex items-start justify-between gap-2">
      <div>
        <h2 className="text-[14px] font-bold text-slate-900">Data Pemesan</h2>
        <p className="text-[11px] text-slate-500">Terisi otomatis dari akun Sango Anda</p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-lg bg-primary-surface px-2.5 text-[11px] font-bold text-primary active:bg-primary/15"
      >
        <Pencil size={12} /> Ubah
      </button>
    </header>

    <ul className="space-y-1.5 text-[12px] text-slate-700">
      <li className="flex items-center gap-1.5">
        <User size={12} className="text-slate-400" /> {member.fullName}
      </li>
      <li className="flex items-center gap-1.5">
        <Mail size={12} className="text-slate-400" /> {member.email}
      </li>
      <li className="flex items-center gap-1.5">
        <Phone size={12} className="text-slate-400" /> {member.phone}
      </li>
    </ul>
  </section>
);