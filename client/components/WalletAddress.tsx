"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useState } from "react";

/**
 * WalletAddress Component
 * 
 * Displays the complete wallet address with copy functionality.
 */
export default function WalletAddress() {
  const { evmAddress } = useEvmAddress();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (evmAddress) {
      navigator.clipboard.writeText(evmAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!evmAddress) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Wallet Address
      </p>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 break-all rounded bg-white px-3 py-2 font-mono text-sm text-slate-900 dark:bg-slate-700 dark:text-white">
          {evmAddress}
        </code>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
