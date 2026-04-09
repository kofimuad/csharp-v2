# C Sharp Agency — Next.js

Premium tech agency website built with Next.js 14, MongoDB, and Tailwind CSS.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local` and fill in your values:
```
MONGODB_URI=mongodb://localhost:27017/csharp-agency
NEXT_PUBLIC_ADMIN_PASSWORD=your-password-here
```

For MongoDB Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/csharp-agency`

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Dashboard
Visit [http://localhost:3000/admin](http://localhost:3000/admin)

Default password: `admin123` (change via `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`)

### What you can manage:
| Section | What you can edit |
|---|---|
| **Site Settings** | Hero image, agency name, contact info, social links, Calendly URL |
| **About** | Company story, vision, mission, rotating quotes, stats |
| **Services** | Add/edit/delete/hide services with icons |
| **Portfolio** | Add/edit/delete/hide projects, mark as featured |
| **Testimonials** | Add/edit/delete/hide client quotes |
| **Inbox** | View & reply to contact form submissions |

## Project Structure
```
app/
├── api/              # REST API routes
│   ├── about/
│   ├── contact/
│   ├── portfolio/
│   ├── services/
│   ├── settings/
│   ├── submissions/
│   └── testimonials/
├── about/            # About page
├── admin/            # Admin dashboard
├── contact/          # Contact page
├── portfolio/        # Portfolio page
├── services/         # Services page
└── page.tsx          # Home page

components/
├── admin/            # Admin panel components
├── layout/           # Navbar, Footer, SiteLayout
├── sections/         # Page section components
└── ui/               # Shared UI (RevealOnScroll, etc.)

lib/
├── models.ts         # Mongoose models
├── mongodb.ts        # DB connection
└── seed.ts           # Initial data seeder
```

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB + Mongoose
- **Styling**: CSS custom properties + Tailwind utilities
- **Icons**: Lucide React
- **Fonts**: Playfair Display + DM Sans
- **Theme**: Light/Dark mode (persisted in localStorage)

## Deployment
Deploy to Vercel with one click. Set `MONGODB_URI` and `NEXT_PUBLIC_ADMIN_PASSWORD` in Vercel environment variables.
