"use client";

import { CDPReactProvider } from "@coinbase/cdp-react";
import { CDP_CONFIG } from "@/components/config";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers Component
 * 
 * Wraps the application with CDP context and theme providers.
 * This is a client component to enable CDP hooks and components.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <CDPReactProvider config={CDP_CONFIG} >
      {children}
    </CDPReactProvider>
  );
}
