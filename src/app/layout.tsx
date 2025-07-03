import type { Metadata } from 'next';
import { Orbitron, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'LuminousAI | Future Intelligence',
  description: 'Transforming Creativity with Next-Gen AI, by Parul',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`${orbitron.variable} ${poppins.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen w-full">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
