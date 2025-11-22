"use client";

import { useSendEvmTransaction, useEvmAddress } from "@coinbase/cdp-hooks";
import { type MouseEvent, useCallback, useState } from "react";

interface Props {
  balance?: string;
  onSuccess?: () => void;
}

/**
 * Transaction Component
 * 
 * Demonstrates sending ETH on Base Sepolia testnet.
 * Sends 0.000001 ETH to the user's own address for testing.
 */
export default function Transaction(props: Props) {
  const { balance, onSuccess } = props;
  const { sendEvmTransaction } = useSendEvmTransaction();
  const { evmAddress } = useEvmAddress();

  const [isPending, setIsPending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendTransaction = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!evmAddress) return;

      e.preventDefault();
      setIsPending(true);
      setError(null);

      try {
        const { transactionHash } = await sendEvmTransaction({
          transaction: {
            to: evmAddress, // Send to yourself for testing
            value: BigInt("1000000000000"), // 0.000001 ETH in wei
            gas: BigInt("21000"), // Standard ETH transfer gas limit
            chainId: 84532, // Base Sepolia testnet
            type: "eip1559", // Modern transaction type
          },
          evmAccount: evmAddress,
          network: "base-sepolia",
        });

        setTransactionHash(transactionHash);
        onSuccess?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to send transaction";
        setError(errorMessage);
        console.error("Transaction error:", err);
      } finally {
        setIsPending(false);
      }
    },
    [evmAddress, sendEvmTransaction, onSuccess],
  );

  if (transactionHash) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          Transaction Sent Successfully!
        </p>
        <p className="mt-2 break-all font-mono text-sm text-green-700 dark:text-green-300">
          {transactionHash}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleSendTransaction}
        disabled={isPending || !evmAddress}
        className="w-full rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400"
      >
        {isPending ? "Sending..." : "Send Test Transaction"}
      </button>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}
