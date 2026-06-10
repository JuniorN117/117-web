import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "117 | Del pensamiento a la realidad",
  description: "117 es un ecosistema donde ingeniería, arte, tecnología y propósito convergen para transformar ideas en realidad. Fundado por Junior Nieves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {/* Global Navigation */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 4rem',
          pointerEvents: 'none',
        }}>
          {/* Version & Hamburger icon (Left) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            pointerEvents: 'auto',
          }}>
            <span style={{
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              fontWeight: 300,
              textTransform: 'uppercase' as const,
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              VERSION 1.1.7
            </span>
            <div style={{
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '6px',
              cursor: 'pointer',
              opacity: 0.7,
            }}>
              <span style={{ width: '24px', height: '1px', background: '#fff' }} />
              <span style={{ width: '24px', height: '1px', background: '#fff' }} />
            </div>
          </div>

          {/* Logo 117 (Right) */}
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 200,
            letterSpacing: '-0.02em',
            color: 'rgba(255, 255, 255, 0.85)',
            pointerEvents: 'auto',
          }}>
            117
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
