'use client';

import { Home, ReceiptText, Ticket, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppTab } from '@/types/account';

export const TAB_ITEMS: Array<{ id: AppTab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'history', label: 'Riwayat', icon: ReceiptText },
  { id: 'vouchers', label: 'Voucher', icon: Ticket },
  { id: 'account', label: 'Akun', icon: UserRound },
];

interface BottomTabBarProps {
  active: AppTab;
  onSelect: (tab: AppTab) => void;
}

export const BottomTabBar = ({ active, onSelect }: BottomTabBarProps) => (
  <nav
    aria-label="Navigasi utama"
    className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-t border-slate-100 bg-white pb-[calc(env(safe-area-inset-bottom,0px)+var(--host-bottom-offset,0px))]"
  >
    <ul className="grid grid-cols-4">
      {TAB_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelect(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-[56px] w-full flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-slate-400'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);