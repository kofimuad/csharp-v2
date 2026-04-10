import SiteLayout from '@/components/layout/SiteLayout';
import connectDB from '@/lib/mongodb';
import { SiteSettings, Project, Testimonial } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';
import PortfolioContent from '@/components/sections/PortfolioContent';
import { serialize, serializeArray } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    await connectDB();
    await seedDatabase();
    const [settings, projects, testimonials] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({ visible: true }).sort({ order: 1 }).lean(),
      Testimonial.find({ visible: true }).lean(),
    ]);
    return {
      settings: settings ? serialize(settings) : null,
      projects: serializeArray(projects as any[]),
      testimonials: serializeArray(testimonials as any[]),
    };
  } catch { return { settings: null, projects: [], testimonials: [] }; }
}

export default async function PortfolioPage() {
  const { settings, projects, testimonials } = await getData();
  return (
    <SiteLayout settings={settings as any}>
      <PortfolioContent projects={projects} testimonials={testimonials} />
    </SiteLayout>
  );
}
