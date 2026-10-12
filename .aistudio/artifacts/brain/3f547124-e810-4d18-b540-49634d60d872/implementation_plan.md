# Gorkhali Gym — Production Architecture & Implementation Plan (Finalized)

A modern, high-impact web presence and Content Management System (CMS) for **Gorkhali Gym** (Itahari, Koshi Province, Nepal) built with **Next.js App Router**, **TypeScript**, **Prisma ORM v6**, **Neon PostgreSQL**, **Vercel Blob**, and protected server-side session authentication.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The implementation plan incorporates all 5 required corrections and technical safeguards:

- **1. Prisma ORM v6 Architecture**: Pinned explicitly to Prisma ORM v6 (`^6.4.1`). The datasource configuration cleanly supports `url = env("DATABASE_URL")` (pooled Neon connection for high-concurrency runtime queries) and `directUrl = env("DIRECT_URL")` (direct connection for Prisma migrations and CLI operations) with zero experimental schema conflicts.
- **2. Zero-Unverified-Content Policy (`isPublished: false` by default)**:
  - All content models (Programs, Offers, Events, Trainers, Blog Posts, Reviews, FAQs, Gallery items) default strictly to `isPublished: false`.
  - `publishedAt` is set only when an administrator explicitly approves and publishes a record.
  - Public pages only query records where `isPublished: true`.
  - Unconfirmed membership prices, trainer credentials, and facilities remain null/draft in the CMS and are never published as genuine claims.
- **3. Dedicated Public Review Moderation Pipeline**:
  - Public endpoint `POST /api/reviews/submit` validates visitor submissions and writes them to the database with `isPublished: false` (pending moderation).
  - The review submission modal on `/reviews` provides immediate feedback that the review was received and awaits gym staff approval.
  - Protected endpoint `PATCH /api/cms/reviews/[id]` allows administrators in `/gorkhali-gym-management` to moderate, approve, or reject submissions.
- **4. Removal of Invented Business Details**:
  - Contact email is left empty (`null` / `""`) until officially configured by the gym owner.
  - No fabricated trainer qualifications, official membership pricing, or unconfirmed amenities.
  - Initial configuration only contains verified official business data:
    - Phone / WhatsApp: `+977 982-8405453`
    - Physical address: `Opposite Soaltee Westend Hotel, Dharan Road, Itahari, Koshi Province 56705, Nepal`
    - Location Map: `https://maps.app.goo.gl/U8ACjdU8KZUmqsfV9`
    - Facebook: `https://www.facebook.com/p/Gorkhali-Fitness-61571983437753/`
    - Instagram: `https://www.instagram.com/gorkhali_fitness/`
    - TikTok: `https://www.tiktok.com/@gorkhali.fitness`
    - Opening hours: `5:00 AM – 9:00 PM`
- **5. Executable Verification Protocol**:
  - Validation commands: `npx prisma validate`, `npx prisma generate`, and `npm run build`.
  - End-to-end verification of public routes, admin authentication, CSRF/session security, and lead submission.

---

## 1. Complete Multi-Page Route Map

Every navigation destination leads to a dedicated Next.js App Router page with metadata, breadcrumbs, and real CMS data binding:

| Route Path | Page Description & Components |
| :--- | :--- |
| `/` | **Homepage**: Hero, Announcement Banner, Welcome, Training Bento, Offers, Gallery, Reviews, Trainers, Blog, FAQ, Contact/Map, Footer |
| `/about` | **About Gorkhali Gym**: Mission, facility philosophy, discipline, community, and certified location details |
| `/training` | **Training Overview**: All available training disciplines, fitness goals, coach assignments |
| `/training/[slug]` | **Program Detail**: Personal Training, Strength Training, Yoga Class (syllabus, schedule, application CTA) |
| `/membership` | **Membership Hub**: Overview of club tiers, day passes, member benefits |
| `/membership/club` | **Club Membership**: Plan tier cards (draft pricing marked), amenities, direct inquiry CTA |
| `/membership/refer-a-friend` | **Refer a Friend**: Referral rewards breakdown, inquiry submission |
| `/services` | **Services Overview**: Health & fitness services |
| `/services/[slug]` | **Service Detail**: Certified Nutritionist & Meal Planning, consult booking |
| `/offers` | **Promotional Offers**: Active promotions with validity dates |
| `/offers/[slug]` | **Offer Detail**: Promotional terms, validity dates, pre-filled "Book Now" inquiry flow |
| `/events` | **Community Events**: Seminars, lifting workshops, community runs |
| `/events/[slug]` | **Event Detail**: Event itinerary, dates, location, attendance registration |
| `/gallery` | **Full Gallery**: Dual-mode grid (Landscape & Portrait photography), category filters, fullscreen lightbox |
| `/reviews` | **Member Reviews**: Verified testimonials, expandable body text, interactive public submission modal |
| `/team` | **Our Team**: Complete trainer roster, verified roles, short bios, direct social/WhatsApp links |
| `/blog` | **Fitness & Nutrition Blog**: Articles, search, category filters, reading time |
| `/blog/[slug]` | **Blog Article Detail**: Full markdown article, author profile, publication date, related posts |
| `/faq` | **Frequently Asked Questions**: Categorized accordion, question search, support inquiry jump |
| `/contact` | **Contact & Location**: Verified address, map embed, hours, validated contact form |
| `/apply` | **Membership Application**: Streamlined application form, goal selection, preferred schedule, WhatsApp direct jump |
| `/gorkhali-gym-management` | **Protected Administration Portal**: Full CMS suite, entity CRUD, review moderation, media manager, inquiries inbox |

---

## 2. Complete Entity & Prisma Schema Specification (Prisma v6)

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Administrators & Cryptographic Sessions
model Admin {
  id           String         @id @default(cuid())
  username     String         @unique
  passwordHash String
  name         String
  role         String         @default("admin") // "superadmin" | "admin"
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  sessions     AdminSession[]
}

model AdminSession {
  id         String   @id @default(cuid())
  tokenHash  String   @unique // SHA-256 hash of the session token
  adminId    String
  admin      Admin    @relation(fields: [adminId], references: [id], onDelete: Cascade)
  expiresAt  DateTime
  createdAt  DateTime @default(now())

  @@index([adminId])
}

// 2. Global Site Configuration & Announcements
model SiteSetting {
  id                 String   @id @default("global")
  gymName            String   @default("Gorkhali Gym")
  phone              String   @default("+977 982-8405453")
  whatsapp           String   @default("+977 982-8405453")
  address            String   @default("Opposite Soaltee Westend Hotel, Dharan Road, Itahari, Koshi Province 56705, Nepal")
  mapUrl             String   @default("https://maps.app.goo.gl/U8ACjdU8KZUmqsfV9")
  openingHours       String   @default("5:00 AM – 9:00 PM")
  facebookUrl        String   @default("https://www.facebook.com/p/Gorkhali-Fitness-61571983437753/")
  instagramUrl       String   @default("https://www.instagram.com/gorkhali_fitness/")
  tiktokUrl          String   @default("https://www.tiktok.com/@gorkhali.fitness")
  contactEmail       String?  // null until officially provided
  primaryColor       String   @default("#DC2626")
  darkBackground     String   @default("#0B0E14")
  applyButtonLabel   String   @default("Apply Now")
  applyButtonUrl     String   @default("/apply")
  footerDescription  String   @default("Premium fitness, discipline, and community in Itahari, Koshi Province.")
  copyrightText      String   @default("© 2026 Gorkhali Gym. All rights reserved.")
  metaTitle          String   @default("Gorkhali Gym | Premier Fitness Club in Itahari, Nepal")
  metaDescription    String   @default("Gorkhali Gym in Itahari, Koshi Province, Nepal. Strength training, personal training, yoga, and nutrition.")
  updatedAt          DateTime @updatedAt
}

model AnnouncementBanner {
  id        String    @id @default(cuid())
  text      String
  linkUrl   String?
  linkLabel String?
  isActive  Boolean   @default(false) // Safe default
  startDate DateTime?
  endDate   DateTime?
  updatedAt DateTime  @updatedAt
}

model PageSection {
  id          String   @id @default(cuid())
  pageSlug    String   // e.g. "home", "about"
  sectionKey  String   // e.g. "hero", "welcome", "contact"
  heading     String
  subheading  String?
  bodyText    String?
  imageUrl    String?
  ctaLabel    String?
  ctaUrl      String?
  displayOrder Int     @default(0)
  isVisible   Boolean  @default(true)
  updatedAt   DateTime @updatedAt

  @@unique([pageSlug, sectionKey])
}

// 3. Navigation Menus
model NavigationItem {
  id           String           @id @default(cuid())
  label        String
  href         String
  displayOrder Int              @default(0)
  parentId     String?
  parent       NavigationItem?  @relation("NavHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children     NavigationItem[] @relation("NavHierarchy")
  isPublished  Boolean          @default(true)
}

// 4. Programs, Services & Memberships (Safe defaults: unpublished)
model Program {
  id           String    @id @default(cuid())
  slug         String    @unique
  title        String
  category     String    // "training" | "service"
  shortDesc    String
  fullDesc     String
  imageUrl     String?
  badge        String?
  duration     String?
  features     String[]  // bullet points
  ctaLabel     String    @default("Apply Now")
  displayOrder Int       @default(0)
  isPublished  Boolean   @default(false) // Default unpublished
  publishedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model MembershipPlan {
  id           String   @id @default(cuid())
  slug         String   @unique
  name         String
  priceInfo    String?  // null or clearly draft
  period       String?  // "Monthly", "Annual"
  description  String
  features     String[]
  isFeatured   Boolean  @default(false)
  displayOrder Int      @default(0)
  isPublished  Boolean  @default(false) // Default unpublished
  updatedAt    DateTime @updatedAt
}

model ReferralProgram {
  id           String   @id @default(cuid())
  title        String
  benefitText  String
  rules        String
  isActive     Boolean  @default(false) // Default inactive
  updatedAt    DateTime @updatedAt
}

// 5. Offers & Events (Safe defaults: unpublished)
model Offer {
  id           String    @id @default(cuid())
  slug         String    @unique
  title        String
  badge        String?
  shortDesc    String
  fullDesc     String
  discountInfo String?
  imageUrl     String?
  validUntil   DateTime?
  displayOrder Int       @default(0)
  isPublished  Boolean   @default(false) // Default unpublished
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Event {
  id           String    @id @default(cuid())
  slug         String    @unique
  title        String
  date         DateTime
  location     String
  shortDesc    String
  fullDesc     String
  imageUrl     String?
  displayOrder Int       @default(0)
  isPublished  Boolean   @default(false) // Default unpublished
  updatedAt    DateTime  @updatedAt
}

// 6. Trainers & Staff (Safe defaults: unpublished)
model Trainer {
  id             String   @id @default(cuid())
  name           String
  role           String
  bio            String
  qualifications String[]
  imageUrl       String?
  facebookUrl    String?
  instagramUrl   String?
  whatsappUrl    String?
  email          String?
  displayOrder   Int      @default(0)
  isPublished    Boolean  @default(false) // Default unpublished
  updatedAt      DateTime @updatedAt
}

// 7. Gallery Media & Categories
model GalleryItem {
  id           String   @id @default(cuid())
  title        String
  caption      String?
  orientation  String   @default("landscape") // "landscape" | "portrait"
  category     String   @default("general")
  imageUrl     String
  displayOrder Int      @default(0)
  isPublished  Boolean  @default(false) // Default unpublished
  createdAt    DateTime @default(now())
}

// 8. Reviews & Testimonials (Safe default: isPublished = false pending moderation)
model Review {
  id          String    @id @default(cuid())
  author      String
  rating      Int       @default(5)
  previewText String
  fullText    String
  avatarUrl   String?
  reviewDate  DateTime  @default(now())
  isPublished Boolean   @default(false) // Moderation required
  publishedAt DateTime?
  displayOrder Int      @default(0)
}

// 9. Blog Articles (Safe default: isPublished = false)
model BlogPost {
  id           String    @id @default(cuid())
  slug         String    @unique
  title        String
  excerpt      String
  content      String
  coverImage   String?
  author       String    @default("Gorkhali Gym")
  category     String    @default("Fitness")
  readTime     String    @default("4 min read")
  isPublished  Boolean   @default(false) // Default unpublished draft
  publishedAt  DateTime? // Set when published
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

// 10. FAQs (Safe default: isPublished = false)
model Faq {
  id           String   @id @default(cuid())
  question     String
  answer       String
  category     String   @default("General")
  displayOrder Int      @default(0)
  isPublished  Boolean  @default(false) // Default unpublished
}

// 11. Inquiries & Membership Applications
model Inquiry {
  id            String   @id @default(cuid())
  referenceCode String   @unique // e.g. GKG-2026-8912
  fullName      String
  phone         String
  email         String?
  goal          String   // "strength", "personal-training", "yoga", "nutrition", "general"
  preferredTime String?  // "morning", "afternoon", "evening"
  message       String?
  selectedOffer String?
  status        String   @default("new") // "new" | "contacted" | "scheduled" | "enrolled" | "archived"
  adminNotes    String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([createdAt])
}

// 12. Persistent Media Asset Registry
model MediaAsset {
  id        String   @id @default(cuid())
  url       String   @unique
  pathname  String
  filename  String
  size      Int
  mimeType  String
  altText   String?
  caption   String?
  createdAt DateTime @default(now())
}
```

---

## 3. Dedicated API Endpoints

```
┌────────────────────────────────────────────────────────────────────────┐
│                        API ROUTE ARCHITECTURE                          │
├───────────────────────────────┬────────────────────────────────────────┤
│  ROUTE                        │  METHODS & FUNCTION                    │
├───────────────────────────────┼────────────────────────────────────────┤
│  /api/auth/login              │  POST: Authenticate admin credentials   │
│  /api/auth/logout             │  POST: Terminate session & clear cookie │
│  /api/auth/session            │  GET: Verify active session & role      │
│  /api/auth/change-password    │  POST: Authorized password mutation     │
│  /api/auth/admins             │  GET, POST: Admin account management    │
├───────────────────────────────┼────────────────────────────────────────┤
│  /api/reviews/submit          │  POST: Public review submission         │
│                               │  (Saves with isPublished: false)       │
├───────────────────────────────┼────────────────────────────────────────┤
│  /api/inquiries               │  POST: Public validated lead submission │
│                               │  GET: Authorized inquiries inbox view   │
│                               │  PATCH: Update lead status & notes      │
├───────────────────────────────┼────────────────────────────────────────┤
│  /api/cms/[entity]            │  GET: Public (where isPublished=true)   │
│                               │  POST, PUT, DELETE: Protected CRUD     │
├───────────────────────────────┼────────────────────────────────────────┤
│  /api/upload                  │  POST: Authorized Vercel Blob upload    │
│                               │  DELETE: Remove media asset             │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 4. Admin Portal Modules (`/gorkhali-gym-management`)

The administration portal is organized into 12 dedicated, tabbed management modules:

1. **Dashboard & Metrics**: Summary counts of published programs, active offers, new inquiries, pending reviews, and recent activity.
2. **Business & Global Settings**: Name, phone, WhatsApp (`+977 982-8405453`), physical address, Google Maps link, opening hours, social URLs, theme colors, SEO metadata, and footer text (contact email is empty until provided).
3. **Announcement Banner**: Active status toggle, promo text, destination link, start/end date controls.
4. **Page & Section Editor**: Reorder and toggle visibility of homepage sections; edit headings, subtitles, and imagery.
5. **Programs & Services**: Create and edit Personal Training, Strength Training, Yoga, and Nutritionist with draft/published status toggles.
6. **Offers & Events**: Manage promotions, discount text, valid dates, and upcoming gym seminars.
7. **Media Library & Uploads**: Upload new files via Vercel Blob, edit alt text, copy URLs, and view storage assets.
8. **Trainers & Team**: Manage coach profiles, bio descriptions, verified qualifications, and direct WhatsApp/Instagram links.
9. **Reviews Moderation & Testimonials**: Review list, public submissions queue, approve/publish toggles, star ratings, and preview length adjustments.
10. **Blog & FAQs**: Draft and publish fitness articles; organize expandable FAQ items into categories.
11. **Inquiries Inbox**: Filter leads by status (`new`, `contacted`, `enrolled`), view contact info, goal, and preferred schedule; update admin notes and launch 1-click WhatsApp messaging.
12. **Admin Security**: Change current password and manage staff administrator accounts.

---

## 5. Executable Verification Protocol

Verification will be executed using the actual commands available in the project:

1. **Prisma Schema Validation**: Run `npx prisma validate` to confirm schema correctness.
2. **Prisma Client Generation**: Run `npx prisma generate` to generate the typed client.
3. **Production Build**: Run `npm run build` to verify Next.js App Router compilation, TypeScript compliance, and zero bundling errors.
4. **End-to-End Functional Verification**:
   - Verify all 18+ public routes render with dynamic breadcrumbs, correct metadata, and footer.
   - Verify header scroll-hiding and scroll-revealing behavior.
   - Verify public lead submission (`/apply`) generates a unique reference code (`GKG-YYYY-XXXX`).
   - Verify public review submission on `/reviews` saves with `isPublished: false`.
   - Verify admin authentication at `/gorkhali-gym-management` (dev seed `gorkhagym` / `gymgorkha` strictly in development).
   - Verify review moderation approval and CMS CRUD updates.
