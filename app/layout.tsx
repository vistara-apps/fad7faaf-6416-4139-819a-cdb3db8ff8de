import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduConnect - Find Your Study Squad',
  description: 'Connect with students for study groups and shared interests on Base',
  keywords: ['education', 'study groups', 'students', 'base', 'blockchain'],
  authors: [{ name: 'EduConnect Team' }],
  openGraph: {
    title: 'EduConnect - Find Your Study Squad',
    description: 'Connect with students for study groups and shared interests on Base',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
