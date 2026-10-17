import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTG Buylist Maker",
  description:
    "Import a Moxfield deck, pick the cards you want, and build a TCGplayer buylist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
