"use client";

import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

/**
 * SignInScreen Component
 * 
 * Displays the sign-in UI with AuthButton from CDP.
 * Shown when the user is not authenticated.
 */
export default function SignInScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900 dark:text-white">
          Welcome
        </h1>
        <p className="mb-8 text-center text-slate-600 dark:text-slate-300">
          Sign in with your email to create or access your wallet
        </p>
        <div className="flex justify-center">
          <AuthButton />
        </div>
      </div>
    </main>
  );
}
