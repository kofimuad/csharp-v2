export const dynamic = 'force-dynamic';

import SiteLayout from '@/components/layout/SiteLayout';
import connectDB from '@/lib/mongodb';
import { SiteSettings, About } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';
import AboutContent from '@/components/sections/AboutContent';
import { serialize } from '@/lib/serialize';

async function getData() {
  try {
    await connectDB();
    await seedDatabase();
    const [settings, about] = await Promise.all([SiteSettings.findOne().lean(), About.findOne().lean()]);
    return {
      settings: settings ? serialize(settings) : null,
      about: about ? serialize(about) : null,
    };
  } catch { return { settings: null, about: null }; }
}

export default async function AboutPage() {
  const { settings, about } = await getData();
  return (
    <SiteLayout settings={settings as any}>
      <AboutContent about={about as any} />
    </SiteLayout>
  );
}
