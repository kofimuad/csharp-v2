'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import CustomCursor from '@/components/ui/CustomCursor';

interface SiteLayoutProps {
  children: React.ReactNode;
  settings?: any;
}

export default function SiteLayout({ children, settings }: SiteLayoutProps) {
  return (
    <ThemeProvider>
      <CustomCursor />
      <Navbar logoUrl={settings?.logoUrl} logoText={settings?.logoText || settings?.agencyName} />
      <main>{children}</main>
      <Footer settings={settings} />
    </ThemeProvider>
  );
}
