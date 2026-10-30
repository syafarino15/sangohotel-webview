'use client';

import { useEffect, useState } from 'react';

export interface HostContext {
  token: string | null;
  tenantId: string | null;
  source: string | null;
  isEmbedded: boolean;
}

const EMPTY_CONTEXT: HostContext = {
  token: null,
  tenantId: null,
  source: null,
  isEmbedded: false,
};

export const useHostContext = (): HostContext => {
  const [context, setContext] = useState<HostContext>(EMPTY_CONTEXT);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setContext({
      token: params.get('token'),
      tenantId: params.get('tenant_id'),
      source: params.get('source'),
      isEmbedded: window.parent !== window,
    });
  }, []);

  return context;
};