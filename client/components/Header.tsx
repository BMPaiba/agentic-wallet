"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useSignOut } from '@coinbase/cdp-hooks';

/**
 * Header Component
 * 
 * Displays the user's wallet address at the top of the page.
 */
export default function Header() {
  const { evmAddress } = useEvmAddress();
  const { signOut } = useSignOut();
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Wallet
        </h1>
        <div className="flex items-center gap-4">
          {evmAddress && (
            <div className="rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-700">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Address
              </p>
              <p className="font-mono text-sm text-slate-900 dark:text-white">
                {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
              </p>
            </div>
          )}
          {evmAddress && (
            <button
              onClick={signOut}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
