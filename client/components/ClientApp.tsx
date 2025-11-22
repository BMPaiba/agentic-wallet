"use client";

import { useIsSignedIn } from "@coinbase/cdp-hooks";
import Header from "@/components/Header";
import WalletAddress from "@/components/WalletAddress";
import UserBalance from "@/components/UserBalance";
import Transaction from "@/components/Transaction";
import SignInScreen from "@/components/SignInScreen";
import CreateServerWallet from "./CreateServerWallet";
import { useState, useEffect } from "react";
import SignMessage from "./SignMessage";
import WalletList from "./WalletList";

/**
 * Generar un UUID v4 aleatorio
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * ClientApp Component
 * 
 * Main application component that handles authentication flow and routing.
 * Shows SignInScreen if user is not connected, otherwise shows wallet features.
 * Generates a unique userId for each logged-in user session.
 */
export default function ClientApp() {
    const { isSignedIn } = useIsSignedIn();
    const [userId, setUserId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Generate or retrieve userId from localStorage when user logs in
    useEffect(() => {
      if (isSignedIn && !userId) {
        // Try to get existing userId from localStorage
        const existingUserId = localStorage.getItem('agentic-wallet-user-id');
        
        if (existingUserId) {
          setUserId(existingUserId);
        } else {
          // Generate new userId
          const newUserId = generateUUID();
          localStorage.setItem('agentic-wallet-user-id', newUserId);
          setUserId(newUserId);
        }
      } else if (!isSignedIn) {
        // Clear userId when logged out
        setUserId(null);
      }
      
      setMounted(true);
    }, [isSignedIn, userId]);

    if (!mounted || !isSignedIn) {
        return <SignInScreen />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <Header />
            <main className="mx-auto max-w-2xl space-y-6 p-6">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Wallet Address
                    </h2>
                    <WalletAddress />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Wallet Features
                    </h2>
                    <UserBalance />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Associated Wallets
                    </h2>
                    <WalletList />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Agent Wallet
                    </h2>
                    <CreateServerWallet userId={userId!} />
                </section>


                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Sign Message
                    </h2>
                    <SignMessage userId={userId!} />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Send Transaction
                    </h2>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                        <Transaction />
                    </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
                    <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        Network Info
                    </h2>
                    <dl className="mt-4 space-y-2 text-sm">
                        <div>
                            <dt className="font-medium text-slate-900 dark:text-white">
                                Network:
                            </dt>
                            <dd className="text-slate-600 dark:text-slate-400">
                                Base Sepolia (Testnet)
                            </dd>
                        </div>
                        <div>
                            <dt className="font-medium text-slate-900 dark:text-white">
                                Chain ID:
                            </dt>
                            <dd className="text-slate-600 dark:text-slate-400">84532</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-slate-900 dark:text-white">
                                Use Case:
                            </dt>
                            <dd className="text-slate-600 dark:text-slate-400">
                                Testing with testnet ETH
                            </dd>
                        </div>
                    </dl>
                </section>
            </main>
        </div>
    );
}
