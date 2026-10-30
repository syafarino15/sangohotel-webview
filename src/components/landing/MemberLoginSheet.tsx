'use client';

import { useState } from 'react';
import { Mail, Phone, User } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { MemberProfile } from '@/types/account';

interface MemberLoginSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (member: MemberProfile) => void;
}

const inputClass = (hasError: boolean): string =>
  cn(
    'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2',
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-primary focus:ring-primary/15'
  );

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export const MemberLoginSheet = ({ open, onClose, onSubmit }: MemberLoginSheetProps) => {
  const [form, setForm] = useState<MemberProfile>({ fullName: '', email: '', phone: '' });
  const [touched, setTouched] = useState(false);

  const errors = {
    fullName: form.fullName.trim().length < 3 ? 'Nama minimal 3 karakter' : '',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email) ? '' : 'Format email belum benar',
    phone:
      digitsOnly(form.phone).length >= 9 && digitsOnly(form.phone).length <= 15
        ? ''
        : 'Nomor WhatsApp 9-15 digit',
  };
  const isValid = !errors.fullName && !errors.email && !errors.phone;

  const update = (patch: Partial<MemberProfile>) =>
    setForm((current) => ({ ...current, ...patch }));

  const handleSubmit = () => {
    setTouched(true);
    if (!isValid) {
      return;
    }
    onSubmit({ fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim() });
    setForm({ fullName: '', email: '', phone: '' });
    setTouched(false);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Masuk sebagai Member"
      subtitle="Data dipakai untuk mengisi otomatis formulir pemesanan."
      footer={
        <Button fullWidth size="lg" onClick={handleSubmit}>
          Masuk
        </Button>
      }
    >
      <div className="space-y-3 pb-2">
        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <User size={12} /> Nama Lengkap
          </span>
          <input
            value={form.fullName}
            onChange={(event) => update({ fullName: event.target.value })}
            placeholder="Nama sesuai identitas"
            autoComplete="name"
            className={inputClass(Boolean(touched && errors.fullName))}
          />
          {touched && errors.fullName ? (
            <span className="mt-1 block text-[10px] font-semibold text-red-500">{errors.fullName}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <Mail size={12} /> Alamat Email
          </span>
          <input
            value={form.email}
            onChange={(event) => update({ email: event.target.value })}
            placeholder="nama@email.com"
            inputMode="email"
            autoComplete="email"
            className={inputClass(Boolean(touched && errors.email))}
          />
          {touched && errors.email ? (
            <span className="mt-1 block text-[10px] font-semibold text-red-500">{errors.email}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-600">
            <Phone size={12} /> No. WhatsApp
          </span>
          <input
            value={form.phone}
            onChange={(event) => update({ phone: event.target.value })}
            placeholder="081234567890"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass(Boolean(touched && errors.phone))}
          />
          {touched && errors.phone ? (
            <span className="mt-1 block text-[10px] font-semibold text-red-500">{errors.phone}</span>
          ) : null}
        </label>
      </div>
    </BottomSheet>
  );
};