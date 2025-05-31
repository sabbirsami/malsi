import type { Metadata } from 'next';

import { Cormorant_Garamond, Roboto } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});
export const metadata: Metadata = {
  title: 'PrepWise',
  description: 'An AI-powered platform for preparing for mock interviews',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light ">
      <body className={`${cormorant.variable} ${roboto.variable}`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
