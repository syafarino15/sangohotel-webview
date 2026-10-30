'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckoutSection } from '@/components/CheckoutSection';
import { PaymentSection } from '@/components/PaymentSection';
import { VoucherSection } from '@/components/VoucherSection';
import { AccountScreen } from '@/components/account/AccountScreen';
import { HistoryScreen } from '@/components/account/HistoryScreen';
import { TransactionDetail } from '@/components/account/TransactionDetail';
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
import { useServiceStore } from '@/stores/useServiceStore';
import { useSessionStore } from '@/stores/useSessionStore';

const SERVICE_PREVIOUS = {
  select: null,
  checkout: 'select',
  payment: 'checkout',
  receipt: null,
} as const;

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [detailCode, setDetailCode] = useState<string | null>(null);

  const step = useBookingStore((state) => state.step);
  const selectedHotelId = useBookingStore((state) => state.selectedHotelId);
  const selectedRoomId = useBookingStore((state) => state.selectedRoomId);
  const goToStep = useBookingStore((state) => state.goToStep);
  const closeRoomDetail = useBookingStore((state) => state.closeRoomDetail);
  const showToast = useBookingStore((state) => state.showToast);

  const activeService = useServiceStore((state) => state.activeService);
  const serviceStep = useServiceStore((state) => state.step);
  const serviceGoToStep = useServiceStore((state) => state.goToStep);
  const closeService = useServiceStore((state) => state.closeService);

  const entered = useSessionStore((state) => state.entered);
  const member = useSessionStore((state) => state.member);
  const activeTab = useSessionStore((state) => state.activeTab);
  const history = useSessionStore((state) => state.history);
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
  }, [activeTab, detailCode]);

  const handleBack = useCallback(() => {
    if (detailCode) {
      setDetailCode(null);
      return;
    }
    if (activeTab !== 'home') {
      setTab('home');
      return;
    }
    if (activeService) {
      const previous = SERVICE_PREVIOUS[serviceStep];
      if (previous) {
        serviceGoToStep(previous);
      } else {
        closeService();
      }
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
  }, [
    activeService,
    activeTab,
    closeService,
    closeRoomDetail,
    detailCode,
    goToStep,
    serviceGoToStep,
    serviceStep,
    setTab,
    step,
  ]);

  const handleExit = useCallback(() => {
    const target = closeWebview();
    if (target === 'browser') {
      showToast('Pratinjau browser: event close_webview dikirim ke parent.', 'info');
    }
  }, [showToast]);

  const atServiceRoot = Boolean(activeService) && serviceStep === 'select';
  const atHotelRoot = step === 1 || step === 6;

  useWebviewBack({
    enabled: isEmbedded && entered,
    atRoot:
      !detailCode &&
      activeTab === 'home' &&
      (atServiceRoot || (!activeService && atHotelRoot)),
    onBack: handleBack,
    onExit: handleExit,
  });

  const showTabBar =
    entered &&
    !activeService &&
    !detailCode &&
    (activeTab !== 'home' || step === 1);

  const detailRecord = detailCode
    ? history.find((record) => record.code === detailCode) ?? null
    : null;

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

          {activeTab === 'history' ? (
            detailRecord ? (
              <TransactionDetail record={detailRecord} onBack={() => setDetailCode(null)} />
            ) : (
              <HistoryScreen onOpen={setDetailCode} />
            )
          ) : null}
          {activeTab === 'vouchers' ? (
            detailRecord ? (
              <TransactionDetail record={detailRecord} onBack={() => setDetailCode(null)} />
            ) : (
              <VoucherListScreen onOpen={setDetailCode} />
            )
          ) : null}
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