import SiteLayout from '@/components/layout/SiteLayout';
import connectDB from '@/lib/mongodb';
import { SiteSettings, Service } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';
import ServicesContent from '@/components/sections/ServicesContent';
import { serialize, serializeArray } from '@/lib/serialize';

async function getData() {
  try {
    await connectDB();
    await seedDatabase();
    const [settings, services] = await Promise.all([
      SiteSettings.findOne().lean(),
      Service.find({ visible: true }).sort({ order: 1 }).lean(),
    ]);
    return {
      settings: settings ? serialize(settings) : null,
      services: serializeArray(services as any[]),
    };
  } catch { return { settings: null, services: [] }; }
}

export default async function ServicesPage() {
  const { settings, services } = await getData();
  return (
    <SiteLayout settings={settings as any}>
      <ServicesContent services={services} />
    </SiteLayout>
  );
}
