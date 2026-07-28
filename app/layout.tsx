import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shine Garage — profesjonalny car detailing",
  description:
    "Detailing samochodowy, korekta lakieru i powłoki ceramiczne w Shine Garage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
