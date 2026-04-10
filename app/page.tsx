import SiteLayout from '@/components/layout/SiteLayout';
import Hero from '@/components/sections/Hero';
import HomePage from '@/components/sections/HomePage';
import connectDB from '@/lib/mongodb';
import { SiteSettings, Project, Service, Testimonial } from '@/lib/models';
import { seedDatabase } from '@/lib/seed';
import { serialize, serializeArray } from '@/lib/serialize';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    await connectDB();
    await seedDatabase();
    const [settings, projects, services, testimonials] = await Promise.all([
      SiteSettings.findOne().lean(),
      Project.find({ visible: true, featured: true }).sort({ order: 1 }).limit(6).lean(),
      Service.find({ visible: true }).sort({ order: 1 }).lean(),
      Testimonial.find({ visible: true }).lean(),
    ]);
    return {
      settings: settings ? serialize(settings) : null,
      projects: serializeArray(projects as any[]),
      services: serializeArray(services as any[]),
      testimonials: serializeArray(testimonials as any[]),
    };
  } catch {
    return { settings: null, projects: [], services: [], testimonials: [] };
  }
}

export default async function Home() {
  const { settings, projects, services, testimonials } = await getData();
  const s = settings as any;

  return (
    <SiteLayout settings={s}>
      <Hero
        title={s?.heroTitle || 'We build digital things.'}
        services={s?.heroServices || ['Web', 'Mobile', 'Design', 'Strategy']}
        bgImage={s?.heroBackgroundImage}
        bgVideo={s?.heroVideoUrl || undefined}
      />
      <HomePage settings={s} projects={projects} services={services} testimonials={testimonials} />
    </SiteLayout>
  );
}
