import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Himanshu Dahiya — AI Engineer",
  description: "Himanshu Dahiya is an AI engineer building reliable agentic systems, high-performance APIs, and intelligent developer tools.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en"><body>{children}</body></html>;
}
