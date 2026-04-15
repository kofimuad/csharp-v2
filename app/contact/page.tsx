export const dynamic = 'force-dynamic';

import SiteLayout from '@/components/layout/SiteLayout';
import connectDB from '@/lib/mongodb';
import { SiteSettings } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';
import ContactContent from '@/components/sections/ContactContent';
import { serialize } from '@/lib/serialize';

async function getData() {
  try {
    await connectDB();
    await seedDatabase();
    const settings = await SiteSettings.findOne().lean();
    return { settings: settings ? serialize(settings) : null };
  } catch { return { settings: null }; }
}

export default async function ContactPage() {
  const { settings } = await getData();
  return (
    <SiteLayout settings={settings as any}>
      <ContactContent settings={settings as any} />
    </SiteLayout>
  );
}
