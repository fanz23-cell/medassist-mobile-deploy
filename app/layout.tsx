import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeProbe",
  description: "Interview prep tool for resume deep-dive questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <main className="page">
            <nav className="nav">
              <Link href="/" className="eyebrow">
                ResumeProbe
              </Link>
              <div className="nav-links">
                <Link href="/session/new">New Session</Link>
                <Link href="/session/demo/practice">Practice</Link>
                <Link href="/session/demo/cards">Cards</Link>
              </div>
            </nav>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
