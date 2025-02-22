import { RelayPool } from 'nostr-relaypool';
import { createContext, useMemo } from 'react';

export const RelayContext = createContext({});

export default function RelayProvider({ relays, children }: { relays: Array<string>; children: React.ReactNode }) {
  const value = useMemo(() => new RelayPool(relays, { useEventCache: false, logSubscriptions: false }), [relays]);
  return <RelayContext.Provider value={value}>{children}</RelayContext.Provider>;
}
