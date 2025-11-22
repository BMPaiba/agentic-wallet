"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useCallback, useState } from "react";

/**
 * UserBalance Component
 * 
 * Displays the user's balance on Base Sepolia testnet.
 * Fetches balance from RPC endpoint.
 */
export default function UserBalance() {
  const { evmAddress } = useEvmAddress();
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!evmAddress) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://sepolia.base.org",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [evmAddress, "latest"],
            id: 1,
          }),
        }
      );

      const data = await response.json();
      if (data.result) {
        // Convert wei to ETH
        const balanceInEth = (parseInt(data.result, 16) / 1e18).toFixed(6);
        setBalance(balanceInEth);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [evmAddress]);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Balance (Base Sepolia)
      </p>
      {balance !== null ? (
        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {balance} ETH
        </p>
      ) : (
        <button
          onClick={fetchBalance}
          disabled={isLoading || !evmAddress}
          className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400"
        >
          {isLoading ? "Loading..." : "Fetch Balance"}
        </button>
      )}
    </div>
  );
}
