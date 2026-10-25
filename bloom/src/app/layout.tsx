import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Shell } from "@/components/Shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloom — Your Little Study Buddy",
  description: "A gentle NPTEL quiz study companion. Practice any weeks, one question at a time.",
};

export const viewport: Viewport = {
  themeColor: "#fff8fa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
