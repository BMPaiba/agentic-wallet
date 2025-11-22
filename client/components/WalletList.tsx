"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useState } from "react";
import { useGetWalletsByAddress } from "@/hooks/useGetWalletsByAddress";

/**
 * WalletList Component
 * 
 * Muestra todas las wallets asociadas a la dirección Ethereum del usuario
 */
export default function WalletList() {
  const { evmAddress } = useEvmAddress();
  const { getWalletsByAddress, isLoading, error, data } = useGetWalletsByAddress();
  const [hasSearched, setHasSearched] = useState(false);

  const handleFetchWallets = async () => {
    if (!evmAddress) {
      alert("Wallet address not available");
      return;
    }

    await getWalletsByAddress(evmAddress);
    setHasSearched(true);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Associated Wallets
      </p>

      <button
        onClick={handleFetchWallets}
        disabled={!evmAddress || isLoading}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400"
      >
        {isLoading ? "Loading..." : "Fetch Wallets"}
      </button>

      {error && (
        <div className="mt-3 rounded bg-red-100 p-2 text-xs text-red-700 dark:bg-red-900 dark:text-red-100">
          Error: {error}
        </div>
      )}

      {data && data.wallets && data.wallets.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Found {data.wallets.length} wallet(s):
          </p>
          {data.wallets.map((wallet, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-600 dark:bg-slate-700"
            >
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    User ID:
                  </span>
                  <p className="break-all font-mono text-slate-900 dark:text-white">
                    {wallet.userId}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Embedded Wallet:
                  </span>
                  <p className="break-all font-mono text-slate-900 dark:text-white">
                    {wallet.embeddedWalletAddress}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Server Wallet:
                  </span>
                  <p className="break-all font-mono text-slate-900 dark:text-white">
                    {wallet.serverWalletAddress}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Agent Authorized:
                  </span>
                  <p className="text-slate-900 dark:text-white">
                    {wallet.agentAuthorized ? (
                      <span className="text-green-600 dark:text-green-400">✓ Yes</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">✗ No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSearched && data && data.wallets && data.wallets.length === 0 && (
        <div className="mt-3 rounded bg-yellow-100 p-2 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100">
          No wallets found for this address
        </div>
      )}
    </div>
  );
}
