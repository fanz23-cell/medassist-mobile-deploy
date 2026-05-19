import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedAssist",
  description: "Elderly-friendly mobile hospital visit companion.",
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
                MedAssist
              </Link>
              <div className="nav-links">
                <a href="/">Hospital Guide</a>
              </div>
            </nav>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
