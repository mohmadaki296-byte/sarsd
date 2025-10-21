import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "نظام إدارة وثائق النقل",
  description: "نظام إدارة وثائق النقل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
