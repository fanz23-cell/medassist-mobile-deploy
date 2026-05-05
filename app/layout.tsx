import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedAssist",
  description: "AR glasses and smart bracelet concept for elderly hospital visits.",
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
                <a href="/#research">Research</a>
                <a href="/#journey">Journey</a>
                <a href="/#demo">Prototype</a>
              </div>
            </nav>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
