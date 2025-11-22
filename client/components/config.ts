import { type Config } from "@coinbase/cdp-react";

/**
 * CDP Configuration
 * 
 * Get your Project ID from https://portal.cdp.coinbase.com
 * Select your project from the top-left dropdown and copy the Project ID
 */
export const CDP_CONFIG: Config = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID || "b644c174-6c37-445e-abf8-9a1dc08d92db",
  appName: "Agentic Wallet",
  appLogoUrl: "/logo.svg",
  ethereum: {
    createOnLogin: "eoa",
  },
  authMethods: ["email", "sms", "oauth:google", ],
};

// Validate that projectId is set
if (!CDP_CONFIG.projectId) {
  console.warn(
    "Warning: NEXT_PUBLIC_CDP_PROJECT_ID environment variable is not set. " +
    "Please add it to your .env.local file to enable CDP features.",
  );
}
