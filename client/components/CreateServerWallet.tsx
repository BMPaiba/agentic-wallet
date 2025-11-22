"use client";

import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useCreateWallet } from "@/hooks/useCreateWallet";

interface Props {
  userId?: string;
}
/**
 * CreateServerWallet Component
 * 
 * Permite crear un server wallet (agent wallet) para el usuario
 * Genera automáticamente un UUID y usa la dirección Ethereum de la sesión iniciada
 */
export default function CreateServerWallet({ userId }: Props) {
  const { evmAddress } = useEvmAddress();
  const { createWallet, isLoading, error, data } = useCreateWallet();

  const handleCreateWallet = async () => {
    if (!evmAddress) {
      alert("Wallet address not available");
      return;
    }

    await createWallet(userId!, evmAddress);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Server Wallet
      </p>

      {data ? (
        <div className="mt-4 space-y-2">
          <div className="rounded bg-green-100 p-3 text-xs text-green-700 dark:bg-green-900 dark:text-green-100">
            <p className="font-semibold">✓ Wallet creado exitosamente</p>
            <p className="mt-2 break-all font-mono text-xs">Server: {data.serverWalletAddress}</p>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <button
            onClick={handleCreateWallet}
            disabled={!evmAddress || isLoading}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-slate-400"
          >
            {isLoading ? "Creating..." : "Create Server Wallet"}
          </button>

          {error && (
            <div className="rounded bg-red-100 p-2 text-xs text-red-700 dark:bg-red-900 dark:text-red-100">
              Error: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
