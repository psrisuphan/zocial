import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, ToastProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "Zocial",
  description: "A clean, privacy-first chat app for everyone.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#313338",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Zocial" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Runs before paint to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('zocial-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
