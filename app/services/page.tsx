export const dynamic = 'force-dynamic';

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

function findInitialOpenIndex(services: any[], selectedService?: string | string[]) {
  const target = Array.isArray(selectedService) ? selectedService[0] : selectedService;
  if (!target) return 0;

  const indexById = services.findIndex(service => String(service._id) === target);
  if (indexById >= 0) return indexById;

  const normalizedTarget = target.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const indexByTitle = services.findIndex(service =>
    String(service.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') === normalizedTarget,
  );

  return indexByTitle >= 0 ? indexByTitle : 0;
}

export default async function ServicesPage({ searchParams }: { searchParams?: { service?: string | string[] } }) {
  const { settings, services } = await getData();
  const initialOpenIndex = findInitialOpenIndex(services, searchParams?.service);
  return (
    <SiteLayout settings={settings as any}>
      <ServicesContent services={services} initialOpenIndex={initialOpenIndex} />
    </SiteLayout>
  );
}
