import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CDP Embedded Wallet",
  description: "A wallet app powered by Coinbase Developer Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
