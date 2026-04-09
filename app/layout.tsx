import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'C Sharp | The Digital Auteur',
  description: 'C Sharp is a premium tech agency building world-class digital experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.className=t;}catch(e){}})();`
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
