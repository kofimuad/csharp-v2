import connectDB from './mongodb';
import { About, Service, Project, Testimonial, SiteSettings } from './models';

export async function seedDatabase() {
  await connectDB();

  // Seed SiteSettings
  const settingsCount = await SiteSettings.countDocuments();
  if (settingsCount === 0) {
    await SiteSettings.create({
      agencyName: 'C Sharp',
      tagline: 'The Digital Auteur',
      heroTitle: 'We build digital things.',
      heroSubtitle: 'Premium tech agency crafting cinematic digital experiences.',
      heroServices: ['Web', 'Mobile', 'Design', 'Strategy'],
      address: '25 Independence Ave, Accra, Ghana',
      phone: '+233 30 000 0000',
      email: 'hello@csharp.agency',
      hours: 'Monday – Friday, 8:00 AM – 6:00 PM GMT',
      linkedinUrl: '#',
      twitterUrl: '#',
      instagramUrl: '#',
      dribbbleUrl: '#',
      calendlyUrl: 'https://calendly.com',
      footerTagline: 'We build digital things. Premium tech agency crafting cinematic digital experiences for brands that demand excellence.',
      heroBackgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      heroVideoUrl: '',
      logoUrl: '',
      logoText: 'C#',
      partnerLogos: [
        { name: 'Google', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', website: 'https://google.com' },
        { name: 'Meta', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', website: 'https://meta.com' },
        { name: 'Apple', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', website: 'https://apple.com' },
        { name: 'Netflix', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', website: 'https://netflix.com' },
        { name: 'Stripe', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', website: 'https://stripe.com' },
        { name: 'Notion', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', website: 'https://notion.so' },
      ],
      metaDescription: 'C Sharp is a premium tech agency building world-class digital experiences. Web development, mobile apps, UX/UI design, and consulting.',
    });
  }

  // Seed About
  const aboutCount = await About.countDocuments();
  if (aboutCount === 0) {
    await About.create({
      headline: 'We are C Sharp. We make ideas ship.',
      subheadline: 'The Digital Auteur',
      body: [
        'C Sharp was founded on a simple but radical belief: that every digital product deserves to be treated as a work of art. Not in the aesthetic-only sense — but in the sense that craft, intention, and mastery should be poured into every line of code and every pixel on screen.',
        'We are a team of designers, developers, and strategists who refuse to settle for average. We\'ve worked with startups finding their footing, enterprises reimagining their digital stack, and founders building products that have never existed before.',
        'What unites all our work is the philosophy we call "The Digital Auteur" — the idea that an interface should disappear in favour of the content, using motion and light to guide the user through a curated narrative.',
        'We operate across the full spectrum of digital product work: from the first wireframe to the last performance optimization. We don\'t hand off — we see it through.',
      ],
      vision: 'To be the agency that proves African tech talent can compete with — and surpass — anyone in the world. To build digital products so exceptional that they redefine what a tech agency from Ghana can achieve on the global stage.',
      mission: 'To craft digital experiences that move people — emotionally, aesthetically, and commercially. Every project we take on is an opportunity to raise the bar: for our clients, for our industry, and for the continent we\'re proud to represent.',
      philosophy: 'An interface should disappear in favour of the content.',
      quotes: [
        '"An interface should disappear in favour of the content."',
        '"Typography is a lead character, not a supporting one."',
        '"Every pixel should serve a purpose."',
        '"We don\'t hand off — we see it through."',
      ],
      stats: [
        { value: '40', suffix: '+', label: 'Projects Delivered' },
        { value: '12', suffix: '', label: 'Countries Served' },
        { value: '150', suffix: '+', label: 'Happy Clients' },
        { value: '5', suffix: '', label: 'Years of Excellence' },
      ],
    });
  }

  // Seed Services
  const servicesCount = await Service.countDocuments();
  if (servicesCount === 0) {
    await Service.insertMany([
      { order: 1, icon: 'Monitor', title: 'Web Development', description: 'We build fast, scalable, and beautiful websites and web applications. From marketing sites that convert to complex SaaS platforms with real-time capabilities — we handle the full stack with precision and craft.', link: '/portfolio', linkLabel: 'View case study', visible: true },
      { order: 2, icon: 'Smartphone', title: 'Mobile App Development', description: 'Native and cross-platform mobile apps for iOS and Android. We use React Native and Flutter to deliver polished, performant apps that users actually love — not just tolerate.', link: '/portfolio', linkLabel: 'View case study', visible: true },
      { order: 3, icon: 'Layers', title: 'UX / UI Design', description: 'Research-driven design that balances aesthetics with usability. From user research and wireframing through to final high-fidelity UI and interactive prototypes — we design systems that feel inevitable.', link: '/portfolio', linkLabel: 'View case study', visible: true },
      { order: 4, icon: 'BarChart3', title: 'Business & Tech Consulting', description: 'Strategic technology advice to help businesses make the right digital decisions. We audit your current stack, map out your roadmap, and give you a clear path from where you are to where you need to be.', link: '/contact', linkLabel: 'Book a consultation', visible: true },
      { order: 5, icon: 'Settings2', title: 'IT Support & Maintenance', description: 'Ongoing technical support, system maintenance, security monitoring, and infrastructure management. We keep your digital systems healthy so you can focus on running your business.', link: '/contact', linkLabel: 'Get support', visible: true },
    ]);
  }

  // Seed Projects
  const projectsCount = await Project.countDocuments();
  if (projectsCount === 0) {
    await Project.insertMany([
      {
        order: 1, title: 'Lumina Dashboard', category: 'web', tags: ['Web', 'Fintech'], year: '2024',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaYKSKUX-G8VaH5zJ8kyPFhIf_Jf1NdURhAneET5hfYhZGTC12SCUwINl3LVhXPWyTYJpEogRm7pnEzetf_VJcwbcHRmDaAAHRaNUYH5tRMcFWp03LU6sgpuHYMPizHN8BTyBOIOrtkk3FP8bSqGdz_yCn3g1tuS-RsSS-6myYMGuSsRXBEVC2lZqY0mHGZly6JMKpRe6FVkIa8M8MHlz8mEH0_OetmDWjb3qIJk3YxqQCSJqIxJKu9CdLwhAR8x_P-MVSa4r48qaK',
        problem: 'A fintech startup needed a real-time analytics dashboard that could handle millions of data points without sacrificing performance or aesthetics.',
        solution: 'We built a React-based dashboard with WebSocket data streaming, lazy-loading charts, and a custom design system that made complexity feel effortless.',
        stack: ['React', 'Node.js', 'WebSockets', 'PostgreSQL', 'Figma'],
        stats: [{ label: 'Load time', value: '1.2s' }, { label: 'Data points', value: '2M+' }],
        featured: true, visible: true,
      },
      {
        order: 2, title: 'Aether OS', category: 'design', tags: ['Design', 'Concept'], year: '2024',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVxtjUN9LiPrMiMIc9dnewhiDTHW9AGIDyg4PM67tH1wnrw0bEi_D7Zr3W1eSVSNpHUyvChMp7ah9OxnzVczx1ZbTQ_DWAMdjBoLkw9-gb5qjjDwWAXcdwikwwHZZeGT-E6DSufxgVpPma2ZuFhIhARxp3Og7mV-Zi7tCn1vqLu7MN1pFpralgHN7O2W-PhjKjRgYpVU7W341fGSb46-VzIKU-SVlJUkkGyNKt3WV3-R3HCAtXDHObZv8uZqCYXgNQC5VaI2-kyViO',
        problem: 'Reimagining what a modern operating system UI could look like — blending functionality with high-fidelity aesthetics.',
        solution: 'A concept OS design featuring fluid animations, a spatial computing-inspired layout, and a revolutionary app paradigm built entirely in Figma.',
        stack: ['Figma', 'Principle', 'After Effects'],
        stats: [{ label: 'Screens designed', value: '120+' }, { label: 'Prototype flows', value: '18' }],
        featured: true, visible: true,
      },
      {
        order: 3, title: 'Vertex Studio', category: 'web', tags: ['Web', 'E-Commerce'], year: '2025',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Taf7MzLeMoaP6Fo3HgUuWpDnuJJgSSkMugLFqRRqS-bH2wKIVPXM2nwmpeeECqq_EtS0VGptvSsGNzjg_4EF81DzBErL76hgQSpg6zw4a5i__7k-EtotHGwah9wujYFbDXk9yVWzOv-f2hJMcPtx71yhsgIIjIWiZRgRyFDeJTt7k5wHe056O7pgYRxcMergxTuSmwu_dsxgvZPLJwQjiTmGwahW49eupGBKFuEbIklsq4048uLdNEtH3jegFd1PeiZ0xGFqo7o8',
        problem: 'A creative studio needed an e-commerce presence that could showcase their premium products without feeling like a typical online shop.',
        solution: 'We crafted a cinematic shopping experience with 3D product previews, gesture-based navigation, and a checkout flow that reduced abandonment by 40%.',
        stack: ['Next.js', 'Three.js', 'Stripe', 'Sanity CMS'],
        stats: [{ label: 'Conversion rate', value: '+40%' }, { label: 'Page speed', value: '98/100' }],
        featured: true, visible: true,
      },
      {
        order: 4, title: 'Pulse Mobile', category: 'mobile', tags: ['Mobile', 'Health Tech'], year: '2025',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaYKSKUX-G8VaH5zJ8kyPFhIf_Jf1NdURhAneET5hfYhZGTC12SCUwINl3LVhXPWyTYJpEogRm7pnEzetf_VJcwbcHRmDaAAHRaNUYH5tRMcFWp03LU6sgpuHYMPizHN8BTyBOIOrtkk3FP8bSqGdz_yCn3g1tuS-RsSS-6myYMGuSsRXBEVC2lZqY0mHGZly6JMKpRe6FVkIa8M8MHlz8mEH0_OetmDWjb3qIJk3YxqQCSJqIxJKu9CdLwhAR8x_P-MVSa4r48qaK',
        problem: 'A health-tech startup needed a mobile app that could make complex health tracking feel approachable and even enjoyable for everyday users.',
        solution: 'We designed and built a React Native app with intuitive health visualizations, smart notifications, and seamless wearable device integration.',
        stack: ['React Native', 'TypeScript', 'Firebase', 'HealthKit'],
        stats: [{ label: 'App Store rating', value: '4.9★' }, { label: 'Daily active users', value: '12K+' }],
        featured: false, visible: true,
      },
    ]);
  }

  // Seed Testimonials
  const testimonialsCount = await Testimonial.countDocuments();
  if (testimonialsCount === 0) {
    await Testimonial.insertMany([
      { name: 'Ama Asante', role: 'CEO', company: 'Novus Tech', initials: 'AA', text: 'C Sharp didn\'t just build us a website — they built us a presence. The attention to detail and cinematic quality of the final product blew our entire team away.', visible: true },
      { name: 'Kwame Osei', role: 'CTO', company: 'Fidelity Payments', initials: 'KO', text: 'Working with C Sharp felt like having an in-house team that actually cared. They challenged our thinking, improved our product scope, and delivered on every promise.', visible: true },
      { name: 'Serwa Mensah', role: 'Founder', company: 'Bloom Studio', initials: 'SM', text: 'The mobile app they built for us has a 4.9-star rating on the App Store. Our users constantly mention how smooth and beautiful it feels. That\'s C Sharp.', visible: true },
    ]);
  }
}
