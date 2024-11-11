import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils";
import { Header } from "./header";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { NotificationProvider } from "./notif-providers";
import { SessionProvider } from "next-auth/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Constauction",
  description: "Auction off construction equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <SessionProvider>
          <NotificationProvider>
            <Header />
            <div>
              {children}
            </div>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
