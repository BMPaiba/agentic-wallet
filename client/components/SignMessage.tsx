"use client";

import { useState } from "react";
import { useSign } from "@/hooks/useSign";

interface SignComponentProps {
  userId?: string;
}

/**
 * SignMessage Component
 * 
 * Permite firmar un mensaje con el server wallet
 */
export default function SignMessage({ userId }: SignComponentProps) {
  const { signMessage, isLoading, error, data } = useSign();
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (!userId) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Sign Message
        </p>
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          userId is required
        </p>
      </div>
    );
  }

  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    await signMessage(userId, message);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Sign Message
      </p>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Sign Message
        </button>
      ) : (
        <form onSubmit={handleSignMessage} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Message to Sign
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter the message you want to sign..."
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700"
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded bg-red-100 p-2 text-xs text-red-700 dark:bg-red-900 dark:text-red-100">
              Error: {error}
            </div>
          )}

          {data && (
            <div className="rounded bg-green-100 p-3 text-xs text-green-700 dark:bg-green-900 dark:text-green-100">
              <p className="font-semibold">✓ Message signed successfully</p>
              <p className="mt-2 break-all font-mono">Signature: {data.signature}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-400"
            >
              {isLoading ? "Signing..." : "Sign"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setMessage("");
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
