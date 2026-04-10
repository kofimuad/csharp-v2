import mongoose, { Schema, Model } from 'mongoose';

/* ── About ── */
export interface IAbout {
  headline: string;
  subheadline: string;
  body: string[];
  vision: string;
  mission: string;
  philosophy: string;
  quotes: string[];
  stats: { value: string; suffix: string; label: string }[];
}
const AboutSchema = new Schema<IAbout>({
  headline: { type: String, default: 'We are C Sharp. We make ideas ship.' },
  subheadline: { type: String, default: 'The Digital Auteur' },
  body: [{ type: String }],
  vision: { type: String },
  mission: { type: String },
  philosophy: { type: String },
  quotes: [{ type: String }],
  stats: [{ value: String, suffix: String, label: String }],
}, { timestamps: true });
export const About: Model<IAbout> = mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);

/* ── Services ── */
export interface IService {
  _id?: string;
  order: number;
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
  visible: boolean;
}
const ServiceSchema = new Schema<IService>({
  order: { type: Number, default: 0 },
  icon: { type: String, default: 'Code' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: String,
  linkLabel: String,
  visible: { type: Boolean, default: true },
}, { timestamps: true });
export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

/* ── Portfolio ── */
export interface IProject {
  _id?: string;
  order: number;
  title: string;
  category: string;
  tags: string[];
  year: string;
  image: string;
  problem: string;
  solution: string;
  stack: string[];
  stats: { label: string; value: string }[];
  gallery: { type: 'image' | 'video'; url: string; caption?: string }[];
  client: string;
  deliverables: string[];
  featured: boolean;
  visible: boolean;
}
const ProjectSchema = new Schema<IProject>({
  order: { type: Number, default: 0 },
  title: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  year: String,
  image: String,
  problem: String,
  solution: String,
  stack: [String],
  stats: [{ label: String, value: String }],
  gallery: [{ type: { type: String, default: 'image' }, url: String, caption: String }],
  client: String,
  deliverables: [String],
  featured: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
}, { timestamps: true });
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

/* ── Testimonials ── */
export interface ITestimonial {
  _id?: string;
  name: string;
  role: string;
  company: string;
  text: string;
  initials: string;
  visible: boolean;
}
const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: String,
  company: String,
  text: { type: String, required: true },
  initials: String,
  visible: { type: Boolean, default: true },
}, { timestamps: true });
export const Testimonial: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

/* ── Site Settings ── */
export interface ISiteSettings {
  agencyName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroServices: string[];
  address: string;
  phone: string;
  email: string;
  hours: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  dribbbleUrl: string;
  calendlyUrl: string;
  footerTagline: string;
  heroBackgroundImage: string;
  heroVideoUrl: string;
  logoUrl: string;
  logoText: string;
  partnerLogos: { name: string; imageUrl: string; website: string }[];
  metaDescription: string;
}
const SiteSettingsSchema = new Schema<ISiteSettings>({
  agencyName: { type: String, default: 'C Sharp' },
  tagline: { type: String, default: 'The Digital Auteur' },
  heroTitle: { type: String, default: 'We build digital things.' },
  heroSubtitle: { type: String, default: 'Premium tech agency crafting cinematic digital experiences.' },
  heroServices: [{ type: String }],
  address: String,
  phone: String,
  email: String,
  hours: String,
  linkedinUrl: { type: String, default: '#' },
  twitterUrl: { type: String, default: '#' },
  instagramUrl: { type: String, default: '#' },
  dribbbleUrl: { type: String, default: '#' },
  calendlyUrl: { type: String, default: 'https://calendly.com' },
  footerTagline: String,
  heroBackgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  heroVideoUrl: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  logoText: { type: String, default: 'C#' },
  partnerLogos: [{ name: String, imageUrl: String, website: String }],
  metaDescription: String,
}, { timestamps: true });
export const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

/* ── Contact Submissions ── */
export interface IContactSubmission {
  name: string;
  email: string;
  service: string;
  message: string;
  read: boolean;
}
const ContactSubmissionSchema = new Schema<IContactSubmission>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: String,
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });
export const ContactSubmission: Model<IContactSubmission> = mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);

/* ── Uploads (binary media stored in MongoDB) ── */
export interface IUpload {
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
}
const UploadSchema = new Schema<IUpload>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
}, { timestamps: true });
export const Upload: Model<IUpload> = mongoose.models.Upload || mongoose.model<IUpload>('Upload', UploadSchema);
