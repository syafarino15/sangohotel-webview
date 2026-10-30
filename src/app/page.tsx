'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckoutSection } from '@/components/CheckoutSection';
import { PaymentSection } from '@/components/PaymentSection';
import { VoucherSection } from '@/components/VoucherSection';
import { AccountScreen } from '@/components/account/AccountScreen';
import { HistoryScreen } from '@/components/account/HistoryScreen';
import { VoucherListScreen } from '@/components/account/VoucherListScreen';
import { HotelsScreen } from '@/components/hotels/HotelsScreen';
import { LandingScreen } from '@/components/landing/LandingScreen';
import { MemberLoginSheet } from '@/components/landing/MemberLoginSheet';
import { BottomTabBar } from '@/components/nav/BottomTabBar';
import { RoomsScreen } from '@/components/rooms/RoomsScreen';
import { ServiceScreen } from '@/components/service/ServiceScreen';
import { ToastHost } from '@/components/ui/ToastHost';
import { useHostBottomOffset } from '@/hooks/useHostBottomOffset';
import { useHostContext } from '@/hooks/useHostContext';
import { useWebviewBack } from '@/hooks/useWebviewBack';
import { closeWebview } from '@/services/bridge.service';
import { useBookingStore } from '@/stores/useBookingStore';
import { useSessionStore } from '@/stores/useSessionStore';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const step = useBookingStore((state) => state.step);
  const selectedHotelId = useBookingStore((state) => state.selectedHotelId);
  const selectedRoomId = useBookingStore((state) => state.selectedRoomId);
  const goToStep = useBookingStore((state) => state.goToStep);
  const closeRoomDetail = useBookingStore((state) => state.closeRoomDetail);
  const activeService = useBookingStore((state) => state.activeService);
  const closeService = useBookingStore((state) => state.closeService);
  const showToast = useBookingStore((state) => state.showToast);

  const entered = useSessionStore((state) => state.entered);
  const member = useSessionStore((state) => state.member);
  const activeTab = useSessionStore((state) => state.activeTab);
  const enterAsGuest = useSessionStore((state) => state.enterAsGuest);
  const enterAsMember = useSessionStore((state) => state.enterAsMember);
  const login = useSessionStore((state) => state.login);
  const setTab = useSessionStore((state) => state.setTab);

  const { isEmbedded } = useHostContext();
  const bottomOffset = useHostBottomOffset();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleBack = useCallback(() => {
    if (activeTab !== 'home') {
      setTab('home');
      return;
    }
    if (activeService) {
      closeService();
      return;
    }
    if (step === 2) {
      goToStep(1);
      return;
    }
    if (step === 3) {
      closeRoomDetail();
      return;
    }
    if (step === 4) {
      goToStep(3);
      return;
    }
    if (step === 5) {
      goToStep(4);
    }
  }, [activeService, activeTab, closeService, setTab, step, closeRoomDetail, goToStep]);

  const handleExit = useCallback(() => {
    const target = closeWebview();
    if (target === 'browser') {
      showToast('Pratinjau browser: event close_webview dikirim ke parent.', 'info');
    }
  }, [showToast]);

  useWebviewBack({
    enabled: isEmbedded && entered,
    atRoot: activeTab === 'home' && !activeService && (step === 1 || step === 6),
    onBack: handleBack,
    onExit: handleExit,
  });

  const showTabBar = entered && !activeService && (activeTab !== 'home' || step === 1);

  return (
    <div
      className="flex flex-1 flex-col"
      style={{ '--host-bottom-offset': `${bottomOffset}px` } as CSSProperties}
    >
      {!mounted ? (
        <div className="flex flex-1 items-center justify-center text-[11px] text-slate-400">
          Memuat…
        </div>
      ) : null}

      {mounted && !entered ? (
        <LandingScreen
          onGuest={enterAsGuest}
          onMember={member ? enterAsMember : () => setLoginOpen(true)}
          memberName={member?.fullName ?? null}
        />
      ) : null}

      {mounted && entered ? (
        <>
          {activeTab === 'home' ? (
            <>
              {activeService ? <ServiceScreen /> : null}
              {!activeService && step === 1 ? <HotelsScreen /> : null}
              {!activeService && (step === 2 || step === 3) && selectedHotelId ? (
                <RoomsScreen />
              ) : null}
              {!activeService && step === 4 && selectedRoomId ? <CheckoutSection /> : null}
              {!activeService && step === 5 && selectedRoomId ? <PaymentSection /> : null}
              {!activeService && step === 6 ? <VoucherSection /> : null}
            </>
          ) : null}

          {activeTab === 'history' ? <HistoryScreen /> : null}
          {activeTab === 'vouchers' ? <VoucherListScreen /> : null}
          {activeTab === 'account' ? <AccountScreen /> : null}

          {showTabBar ? <BottomTabBar active={activeTab} onSelect={setTab} /> : null}
        </>
      ) : null}

      <ToastHost />

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
}