import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAH Terminal",
  description: "Bloomberg-style financial terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap"
        />
      </head>
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
