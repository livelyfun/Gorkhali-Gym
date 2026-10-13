import prisma, { isDbConfigured } from './prisma';

export interface SiteSettings {
  gymName: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapUrl: string;
  openingHours: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  contactEmail: string | null;
  primaryColor: string;
  secondaryColor: string;
  darkBackground: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  applyButtonLabel: string;
  applyButtonUrl: string;
  footerDescription: string;
  copyrightText: string;
  metaTitle: string;
  metaDescription: string;
}

export interface Announcement {
  id: string;
  text: string;
  linkUrl: string | null;
  linkLabel: string | null;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PageSectionItem {
  id: string;
  pageSlug: string;
  sectionKey: string;
  heading: string;
  subheading?: string | null;
  bodyText?: string | null;
  imageUrl?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  displayOrder: number;
  isVisible: boolean;
}

export interface NavigationItemType {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
  parentId?: string | null;
  isPublished: boolean;
  children?: NavigationItemType[];
}

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  category: 'training' | 'service';
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  badge: string | null;
  duration: string | null;
  features: string[];
  ctaLabel: string;
  displayOrder: number;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface MembershipPlanItem {
  id: string;
  slug: string;
  name: string;
  priceInfo: string | null;
  period: string | null;
  description: string;
  features: string[];
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface ReferralProgramItem {
  id: string;
  title: string;
  benefitText: string;
  rules: string;
  isActive: boolean;
}

export interface OfferItem {
  id: string;
  slug: string;
  title: string;
  badge: string | null;
  shortDesc: string;
  fullDesc: string;
  discountInfo: string | null;
  imageUrl: string;
  validUntil: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface TrainerItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  qualifications: string[];
  imageUrl: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
  email: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export interface GalleryItemType {
  id: string;
  title: string;
  caption: string | null;
  orientation: 'landscape' | 'portrait';
  category: string;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
}

export type GalleryItem = GalleryItemType;

export interface ReviewItem {
  id: string;
  author: string;
  authorName?: string;
  rating: number;
  previewText: string;
  fullText: string;
  content?: string;
  role?: string;
  avatarUrl: string | null;
  reviewDate: string;
  createdAt?: string;
  isPublished: boolean;
  publishedAt: string | null;
  displayOrder: number;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  readTime: string;
  isPublished: boolean;
  publishedAt: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface InquiryItem {
  id: string;
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string | null;
  goal: string;
  program?: string;
  preferredTime: string | null;
  message: string | null;
  selectedOffer: string | null;
  status: 'new' | 'contacted' | 'scheduled' | 'enrolled' | 'converted' | 'archived';
  adminNotes: string | null;
  createdAt: string;
}

export interface MediaAssetItem {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  size: number;
  mimeType: string;
  altText: string | null;
  caption: string | null;
  createdAt: string;
}

const initialSettings: SiteSettings = {
  gymName: 'Gorkhali Gym',
  phone: '+977 982-8405453',
  whatsapp: '+977 982-8405453',
  address: 'Opposite Soaltee Westend Hotel, Dharan Road, Itahari, Koshi Province 56705, Nepal',
  mapUrl: 'https://maps.app.goo.gl/U8ACjdU8KZUmqsfV9',
  openingHours: '5:00 AM – 9:00 PM',
  facebookUrl: 'https://www.facebook.com/p/Gorkhali-Fitness-61571983437753/',
  instagramUrl: 'https://www.instagram.com/gorkhali_fitness/',
  tiktokUrl: 'https://www.tiktok.com/@gorkhali.fitness',
  contactEmail: null,
  primaryColor: '#DC2626',
  secondaryColor: '#1F2937',
  darkBackground: '#0B0E14',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  applyButtonLabel: 'Apply Now',
  applyButtonUrl: '/apply',
  footerDescription:
    'Premier strength, conditioning, and fitness facility in Itahari, Koshi Province. Dedicated to discipline, health, and athletic community.',
  copyrightText: '© 2026 Gorkhali Gym. All rights reserved.',
  metaTitle: 'Gorkhali Gym | Premier Fitness & Strength Club in Itahari, Nepal',
  metaDescription:
    'Join Gorkhali Gym on Dharan Road, opposite Soaltee Westend Hotel, Itahari. Personal training, strength equipment, yoga, and nutrition.',
};

const initialAnnouncement: Announcement = {
  id: 'ann-1',
  text: 'Welcome to Gorkhali Gym Itahari — Strength conditioning, certified coaching & Olympic gear. Open 5:00 AM – 9:00 PM.',
  linkUrl: '/apply',
  linkLabel: 'Join Now',
  isActive: true,
  startDate: null,
  endDate: null,
};

const initialSections: PageSectionItem[] = [
  {
    id: 'sec-hero',
    pageSlug: 'home',
    sectionKey: 'hero',
    heading: 'Forged in Discipline. Built for Strength.',
    subheading: "Itahari's Premier Strength & Conditioning Club · Koshi Province",
    bodyText:
      'Train with authentic Olympic barbells, calibrated iron, and certified coaches opposite Soaltee Westend Hotel on Dharan Road.',
    imageUrl: '/images/hero_gorkhali_gym.jpg',
    ctaLabel: 'Apply for Membership',
    ctaUrl: '/apply',
    displayOrder: 1,
    isVisible: true,
  },
  {
    id: 'sec-intro',
    pageSlug: 'home',
    sectionKey: 'intro',
    heading: 'Authentic Strength, Zero Gimmicks',
    subheading: 'Why Gorkhali Gym is different',
    bodyText:
      'We combine rigorous barbell strength mechanics, progressive overload principles, and functional athletic conditioning in a supportive community atmosphere.',
    imageUrl: '/images/training_strength_gym.jpg',
    ctaLabel: 'Explore Programs',
    ctaUrl: '/training',
    displayOrder: 2,
    isVisible: true,
  },
  {
    id: 'sec-cta',
    pageSlug: 'home',
    sectionKey: 'cta',
    heading: 'Ready to Transform Your Physique?',
    subheading: 'Begin with an initial coach consultation and movement assessment.',
    bodyText: 'Open 5:00 AM to 9:00 PM daily. Certified coaches and supportive atmosphere.',
    imageUrl: '/images/trainer_coaching_session.jpg',
    ctaLabel: 'Start Training Today',
    ctaUrl: '/apply',
    displayOrder: 3,
    isVisible: true,
  },
];

const initialNavigation: NavigationItemType[] = [
  { id: 'nav-home', label: 'Home', href: '/', displayOrder: 1, isPublished: true },
  {
    id: 'nav-training',
    label: 'Training',
    href: '/training',
    displayOrder: 2,
    isPublished: true,
    children: [
      { id: 'nav-pt', label: 'Personal Training', href: '/training/personal-training', displayOrder: 1, isPublished: true },
      { id: 'nav-strength', label: 'Strength Training', href: '/training/strength-training', displayOrder: 2, isPublished: true },
      { id: 'nav-yoga', label: 'Yoga Class', href: '/training/yoga-class', displayOrder: 3, isPublished: true },
      { id: 'nav-training-all', label: 'Browse All Training →', href: '/training', displayOrder: 4, isPublished: true },
    ],
  },
  {
    id: 'nav-membership',
    label: 'Membership',
    href: '/membership',
    displayOrder: 3,
    isPublished: true,
    children: [
      { id: 'nav-club', label: 'Club Membership', href: '/membership/club', displayOrder: 1, isPublished: true },
      { id: 'nav-refer', label: 'Refer a Friend', href: '/membership/refer-a-friend', displayOrder: 2, isPublished: true },
      { id: 'nav-membership-all', label: 'Membership Overview →', href: '/membership', displayOrder: 3, isPublished: true },
    ],
  },
  {
    id: 'nav-services',
    label: 'Services',
    href: '/services',
    displayOrder: 4,
    isPublished: true,
    children: [
      { id: 'nav-nutrition', label: 'Nutritionist Consultation', href: '/services/nutritionist', displayOrder: 1, isPublished: true },
      { id: 'nav-services-all', label: 'All Services →', href: '/services', displayOrder: 2, isPublished: true },
    ],
  },
  {
    id: 'nav-explore',
    label: 'Explore',
    href: '/gallery',
    displayOrder: 5,
    isPublished: true,
    children: [
      { id: 'nav-gallery', label: 'Gallery', href: '/gallery', displayOrder: 1, isPublished: true },
      { id: 'nav-blog', label: 'Blog', href: '/blog', displayOrder: 2, isPublished: true },
      { id: 'nav-events', label: 'Events', href: '/events', displayOrder: 3, isPublished: true },
      { id: 'nav-offers', label: 'Offers', href: '/offers', displayOrder: 4, isPublished: true },
      { id: 'nav-faq', label: 'FAQ', href: '/faq', displayOrder: 5, isPublished: true },
      { id: 'nav-reviews', label: 'Reviews', href: '/reviews', displayOrder: 6, isPublished: true },
      { id: 'nav-about', label: 'About Us', href: '/about', displayOrder: 7, isPublished: true },
      { id: 'nav-team', label: 'Our Team', href: '/team', displayOrder: 8, isPublished: true },
    ],
  },
  { id: 'nav-contact', label: 'Contact', href: '/contact', displayOrder: 6, isPublished: true },
];

const initialPrograms: ProgramItem[] = [
  {
    id: 'prog-1',
    slug: 'strength-training',
    title: 'Strength & Conditioning',
    category: 'training',
    shortDesc: 'Build raw power, muscle density, and structural durability with Olympic barbells, power racks, and periodized training.',
    fullDesc:
      'Our strength training program focuses on fundamental compound movements: squat, bench press, deadlift, overhead press, and functional pulls. Athletes and beginners alike receive coaching on biomechanical alignment, safe progressive overload, and movement efficiency using high-grade Olympic barbells and bumper plates.',
    imageUrl: '/images/training_strength_gym.jpg',
    badge: 'Popular',
    duration: '60–75 mins / session',
    features: [
      'Comprehensive barbell and free-weight floor',
      'Squat racks, Olympic platforms & calibrated iron plates',
      'Periodized strength progression plans',
      'Form correction and spotter assistance',
    ],
    ctaLabel: 'Apply for Strength Training',
    displayOrder: 1,
    isPublished: true,
    publishedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'prog-2',
    slug: 'personal-training',
    title: '1-on-1 Personal Coaching',
    category: 'training',
    shortDesc: 'Custom-tailored workout programming and direct coach supervision tailored to your specific fitness and body composition goals.',
    fullDesc:
      'Work side-by-side with a dedicated personal trainer who assesses your mobility, movement history, and physical targets. Every workout is coached rep-by-rep to ensure safety, maximum output, and sustained motivation.',
    imageUrl: '/images/trainer_coaching_session.jpg',
    badge: 'Personalized',
    duration: 'Custom schedule',
    features: [
      'Individualized movement and posture assessment',
      'Rep-by-rep form guidance and safety spotting',
      'Weekly progress tracking and milestone check-ins',
      'Integration with dietary guidance',
    ],
    ctaLabel: 'Book Consultation',
    displayOrder: 2,
    isPublished: true,
    publishedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'prog-3',
    slug: 'yoga-class',
    title: 'Yoga & Mobility Training',
    category: 'training',
    shortDesc: 'Enhance joint range of motion, core stabilization, mental focus, and athletic recovery through disciplined yoga sessions.',
    fullDesc:
      'Strength without mobility leads to stiffness. Our yoga and athletic mobility sessions bridge the gap between heavy lifting and fluid bodily movement, helping athletes recover faster, relieve lower back stress, and improve flexibility.',
    imageUrl: '/images/training_yoga_wellness.jpg',
    badge: 'Recovery',
    duration: '50 mins / class',
    features: [
      'Hip and hamstring opening for lifters',
      'Thoracic spine and shoulder mobility work',
      'Breathwork and stress reduction',
      'Beginner to intermediate scalable postures',
    ],
    ctaLabel: 'Join Yoga Class',
    displayOrder: 3,
    isPublished: true,
    publishedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'prog-4',
    slug: 'nutritionist',
    title: 'Certified Nutrition Consultation',
    category: 'service',
    shortDesc: 'Practical, culturally tailored nutritional planning focused on sustainable fuel, macronutrient balance, and metabolic health.',
    fullDesc:
      'Fitness results happen in the kitchen as much as on the gym floor. Our nutrition consulting analyzes your daily dietary intake, basal metabolic rate, and schedule to build meal plans that fit local culinary traditions while meeting protein and micronutrient requirements.',
    imageUrl: '/images/hero_gorkhali_gym.jpg',
    badge: 'Health',
    duration: '45 mins initial consult',
    features: [
      'Targeted macronutrient and caloric calculation',
      'Muscle gain and fat reduction dietary templates',
      'Supplementation facts and guidance',
      'Ongoing habit tracking and feedback',
    ],
    ctaLabel: 'Schedule Nutrition Consult',
    displayOrder: 4,
    isPublished: true,
    publishedAt: '2026-01-15T00:00:00Z',
  },
];

const initialOffers: OfferItem[] = [
  {
    id: 'offer-1',
    slug: 'new-member-pass',
    title: 'New Member Welcome Assessment',
    badge: 'Limited Offer',
    shortDesc: 'Receive a complimentary 1-on-1 movement assessment and gym induction with any active enrollment.',
    fullDesc:
      'New to Gorkhali Gym? Book your welcome visit to tour our training floors opposite Soaltee Westend Hotel on Dharan Road and test our facilities with a certified coach.',
    discountInfo: 'Complimentary Induction',
    imageUrl: '/images/hero_gorkhali_gym.jpg',
    validUntil: '2026-12-31T23:59:59Z',
    displayOrder: 1,
    isPublished: true,
  },
];

const initialEvents: EventItem[] = [
  {
    id: 'event-1',
    slug: 'deadlift-technique-clinic',
    title: 'Deadlift & Hip-Hinge Mechanics Clinic',
    date: '2026-04-18T09:00:00Z',
    location: 'Gorkhali Gym Main Floor, Dharan Road, Itahari',
    shortDesc: 'Hands-on biomechanics workshop on pulling safely and building posterior chain strength.',
    fullDesc:
      'Join our coaches for an intensive 2-hour technical breakdown of conventional and sumo deadlifts, spinal bracing, hip-hinge mechanics, and grip variations.',
    imageUrl: '/images/training_strength_gym.jpg',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'event-2',
    slug: 'mobility-recovery-session',
    title: 'Full-Body Athletic Mobility & Foam Rolling',
    date: '2026-05-02T07:30:00Z',
    location: 'Yoga & Recovery Studio, Gorkhali Gym',
    shortDesc: 'Structured guided recovery class focusing on hip openers, ankle dorsiflexion, and thoracic extension.',
    fullDesc:
      'Designed specifically for powerlifters, runners, and desk workers in Itahari to relieve lower back tightness and restore range of motion.',
    imageUrl: '/images/training_yoga_wellness.jpg',
    displayOrder: 2,
    isPublished: true,
  },
];

const initialPlans: MembershipPlanItem[] = [
  {
    id: 'plan-1',
    slug: 'standard-access',
    name: 'Club Membership',
    priceInfo: 'Contact Front Desk for Current Rates',
    period: 'Monthly / Quarterly',
    description: 'Full day access to the main gym floor, free-weight arena, cardio deck, and locker facilities.',
    features: [
      'Full facility access (5:00 AM – 9:00 PM)',
      'Barbell racks, dumbbells & machine access',
      'Clean changing rooms & locker storage',
      'Free high-speed member Wi-Fi',
    ],
    isFeatured: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'plan-2',
    slug: 'coaching-tier',
    name: 'Coaching & Training Pass',
    priceInfo: 'Inquire for Custom Schedule',
    period: 'Flexible Enrollment',
    description: 'Combines general gym membership with scheduled 1-on-1 personal coaching and monthly assessments.',
    features: [
      'All Club Membership benefits included',
      'Assigned personal trainer sessions',
      'Body composition analysis check-ins',
      'Customized workout and nutrition guide',
    ],
    isFeatured: false,
    displayOrder: 2,
    isPublished: true,
  },
];

const initialReferral: ReferralProgramItem = {
  id: 'ref-program',
  title: 'Gorkhali Brotherhood & Sisterhood Referral',
  benefitText: 'Refer a training partner and both receive 1 week complimentary extension on current memberships.',
  rules:
    '1. Valid for active members in good standing.\n2. The referred friend must complete enrollment.\n3. Present referral reference code at front desk.\n4. No limit on referrals per member.',
  isActive: true,
};

const initialTrainers: TrainerItem[] = [
  {
    id: 'tr-1',
    name: 'Senior Coach & Founder',
    role: 'Head Strength & Conditioning',
    bio: 'Dedicated to physical culture, discipline, and helping members reach peak strength and longevity with evidence-based lifting.',
    qualifications: ['Strength Coaching', 'Biomechanical Alignment', 'Conditioning'],
    imageUrl: '/images/trainer_coaching_session.jpg',
    facebookUrl: 'https://www.facebook.com/p/Gorkhali-Fitness-61571983437753/',
    instagramUrl: 'https://www.instagram.com/gorkhali_fitness/',
    whatsappUrl: 'https://wa.me/9779828405453',
    email: null,
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'tr-2',
    name: 'Coach & Mobility Specialist',
    role: 'Mobility & Personal Trainer',
    bio: 'Specializes in athletic mobility, posture restoration, and functional resistance training for athletes of all skill levels.',
    qualifications: ['Functional Movement', 'Mobility & Flexibility', 'Personal Training'],
    imageUrl: '/images/training_strength_gym.jpg',
    facebookUrl: 'https://www.facebook.com/p/Gorkhali-Fitness-61571983437753/',
    instagramUrl: 'https://www.instagram.com/gorkhali_fitness/',
    whatsappUrl: 'https://wa.me/9779828405453',
    email: null,
    displayOrder: 2,
    isPublished: true,
  },
];

const initialGallery: GalleryItemType[] = [
  {
    id: 'gal-1',
    title: 'Main Strength & Powerlifting Deck',
    caption: 'Olympic barbells, heavy-duty racks, and bumper plates on Dharan Road, Itahari.',
    orientation: 'landscape',
    category: 'equipment',
    imageUrl: '/images/hero_gorkhali_gym.jpg',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'gal-2',
    title: 'Barbell Form & Deadlift Training',
    caption: 'Precision lifting technique and athletic dedication.',
    orientation: 'portrait',
    category: 'training',
    imageUrl: '/images/training_strength_gym.jpg',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'gal-3',
    title: '1-on-1 Coaching & Form Check',
    caption: 'Professional guidance and technique spotting.',
    orientation: 'landscape',
    category: 'training',
    imageUrl: '/images/trainer_coaching_session.jpg',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'gal-4',
    title: 'Mobility & Athletic Yoga Session',
    caption: 'Joint recovery and flexibility enhancement.',
    orientation: 'landscape',
    category: 'training',
    imageUrl: '/images/training_yoga_wellness.jpg',
    displayOrder: 4,
    isPublished: true,
  },
];

const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Sunil Thapa',
    rating: 5,
    previewText: 'Best gym in Itahari without question. The barbell racks and weights are genuine quality, and the atmosphere keeps you focused every single workout.',
    fullText:
      'Best gym in Itahari without question. The barbell racks and weights are genuine quality, and the atmosphere keeps you focused every single workout. Located right opposite Soaltee Westend on Dharan Road, the gym has great parking and the coaches actually correct your form rather than ignoring you.',
    avatarUrl: null,
    reviewDate: '2026-02-10T00:00:00Z',
    isPublished: true,
    publishedAt: '2026-02-10T00:00:00Z',
    displayOrder: 1,
  },
  {
    id: 'rev-2',
    author: 'Pooja Shrestha',
    rating: 5,
    previewText: 'Very welcoming environment for women and beginners. The trainers are respectful, professional, and knowledgeable about lifting mechanics.',
    fullText:
      'Very welcoming environment for women and beginners. The trainers are respectful, professional, and knowledgeable about lifting mechanics. I joined for strength and mobility after years of inactivity, and the structured guidance made a tremendous difference in my daily energy.',
    avatarUrl: null,
    reviewDate: '2026-02-28T00:00:00Z',
    isPublished: true,
    publishedAt: '2026-02-28T00:00:00Z',
    displayOrder: 2,
  },
  {
    id: 'rev-3',
    author: 'Aman Rai',
    rating: 5,
    previewText: 'Clean facility, serious lifters, and great equipment. Opens right at 5:00 AM so I can complete heavy squats before morning work.',
    fullText:
      'Clean facility, serious lifters, and great equipment. Opens right at 5:00 AM so I can complete heavy squats before morning work. No unnecessary noise or crowding, just pure iron and discipline. Highly recommend Gorkhali Gym to anyone in Koshi Province.',
    avatarUrl: null,
    reviewDate: '2026-03-05T00:00:00Z',
    isPublished: true,
    publishedAt: '2026-03-05T00:00:00Z',
    displayOrder: 3,
  },
];

const initialBlog: BlogPostItem[] = [
  {
    id: 'blog-1',
    slug: 'fundamentals-of-compound-lifting',
    title: 'The Fundamentals of Compound Lifting for Natural Athletes',
    excerpt: 'Why the squat, bench, deadlift, and overhead press form the core of structural muscular development and strength.',
    content: `Strength training is not about doing endless isolation exercises; it is about building neural efficiency and muscular density through multi-joint compound lifts.

### The Big Four Movements
1. **The Barbell Squat**: Develops quadriceps, glutes, core rigidity, and posterior chain power.
2. **The Deadlift**: Teaches full-body tension, hip hinge mechanics, and upper back stability.
3. **The Overhead Press**: Cultivates genuine shoulder power and core brace without back extension.
4. **The Bench Press & Dips**: Builds chest, front deltoids, and tricep pressing power.

At Gorkhali Gym, we prioritize safe setup, correct bracing techniques, and progressive resistance tracking for long-term health and athletic performance.`,
    coverImage: '/images/training_strength_gym.jpg',
    author: 'Gorkhali Gym Editorial',
    category: 'Strength & Training',
    readTime: '4 min read',
    isPublished: true,
    publishedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'blog-2',
    slug: 'nutrition-habits-for-strength-recovery',
    title: 'Practical Nutrition Guidelines for Muscle Recovery in Nepal',
    excerpt: 'How to meet daily protein and micronutrient targets with accessible local staples and simple dietary adjustments.',
    content: `Training breaks down muscle tissue; proper nutrition and restorative sleep build it back stronger. Many lifters struggle with muscle gains simply because their protein intake and daily hydration fall short.

### Simple Steps to Optimize Recovery:
- **Prioritize Protein**: Aim for balanced protein across every meal using eggs, lentils (dal), paneer, chicken, fish, or clean whey protein.
- **Hydrate Constantly**: During high-intensity lifting in Koshi Province, sweat loss demands consistent water and electrolyte intake.
- **Sleep 7-8 Hours**: Growth hormone and muscle tissue repair predominantly occur during deep REM sleep stages.

Visit our coaching team at Gorkhali Gym on Dharan Road for personalized nutrition consultations.`,
    coverImage: '/images/hero_gorkhali_gym.jpg',
    author: 'Gorkhali Gym Editorial',
    category: 'Nutrition & Health',
    readTime: '3 min read',
    isPublished: true,
    publishedAt: '2026-02-25T00:00:00Z',
  },
];

const initialFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Where is Gorkhali Gym located in Itahari?',
    answer:
      'We are conveniently located directly opposite Soaltee Westend Hotel on Dharan Road, Itahari, Koshi Province 56705, Nepal. Click our map link on the website for GPS directions.',
    category: 'Location & Facility',
    displayOrder: 1,
    isPublished: true,
  },
  {
    id: 'faq-2',
    question: 'What are the daily opening and closing hours?',
    answer:
      'Gorkhali Gym is open daily from 5:00 AM to 9:00 PM, allowing early morning lifters and evening after-work athletes full flexibility.',
    category: 'General',
    displayOrder: 2,
    isPublished: true,
  },
  {
    id: 'faq-3',
    question: 'How do I apply for a membership or personal training consultation?',
    answer:
      'You can apply directly through our website by clicking the "Apply Now" button, sending an inquiry, or messaging our front desk directly on WhatsApp at +977 982-8405453.',
    category: 'Membership',
    displayOrder: 3,
    isPublished: true,
  },
  {
    id: 'faq-4',
    question: 'Is Gorkhali Gym suitable for beginners who have never lifted before?',
    answer:
      'Yes. Our coaches provide an initial equipment orientation and movement assessment so you learn proper lifting mechanics, safety, and etiquette from day one.',
    category: 'Training',
    displayOrder: 4,
    isPublished: true,
  },
  {
    id: 'faq-5',
    question: 'Do you offer yoga and mobility classes?',
    answer:
      'Yes, we provide dedicated yoga and mobility classes designed to improve flexibility, balance, and athletic joint recovery.',
    category: 'Training',
    displayOrder: 5,
    isPublished: true,
  },
  {
    id: 'faq-6',
    question: 'What should I bring on my first visit?',
    answer:
      'Please bring comfortable athletic training clothing, clean indoor gym footwear, a water bottle, and a personal training towel.',
    category: 'General',
    displayOrder: 6,
    isPublished: true,
  },
];

const initialMedia: MediaAssetItem[] = [
  {
    id: 'media-1',
    url: '/images/hero_gorkhali_gym.jpg',
    pathname: 'images/hero_gorkhali_gym.jpg',
    filename: 'hero_gorkhali_gym.jpg',
    size: 955053,
    mimeType: 'image/jpeg',
    altText: 'Gorkhali Gym heavy iron barbell lifting floor in Itahari',
    caption: 'Main weight training arena opposite Soaltee Westend Hotel',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'media-2',
    url: '/images/trainer_coaching_session.jpg',
    pathname: 'images/trainer_coaching_session.jpg',
    filename: 'trainer_coaching_session.jpg',
    size: 925551,
    mimeType: 'image/jpeg',
    altText: 'Certified personal coach guiding athlete in squat mechanics',
    caption: '1-on-1 coaching session at Gorkhali Gym',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'media-3',
    url: '/images/training_strength_gym.jpg',
    pathname: 'images/training_strength_gym.jpg',
    filename: 'training_strength_gym.jpg',
    size: 819321,
    mimeType: 'image/jpeg',
    altText: 'Heavy deadlift barbell and bumper plates',
    caption: 'Barbell strength and conditioning deck',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'media-4',
    url: '/images/training_yoga_wellness.jpg',
    pathname: 'images/training_yoga_wellness.jpg',
    filename: 'training_yoga_wellness.jpg',
    size: 859803,
    mimeType: 'image/jpeg',
    altText: 'Yoga and athletic mobility session',
    caption: 'Mobility and joint recovery class',
    createdAt: '2026-01-10T00:00:00Z',
  },
];

class DataStore {
  settings: SiteSettings = { ...initialSettings };
  announcement: Announcement = { ...initialAnnouncement };
  sections: PageSectionItem[] = [...initialSections];
  navigation: NavigationItemType[] = [...initialNavigation];
  programs: ProgramItem[] = [...initialPrograms];
  offers: OfferItem[] = [...initialOffers];
  events: EventItem[] = [...initialEvents];
  plans: MembershipPlanItem[] = [...initialPlans];
  referral: ReferralProgramItem = { ...initialReferral };
  trainers: TrainerItem[] = [...initialTrainers];
  gallery: GalleryItemType[] = [...initialGallery];
  reviews: ReviewItem[] = [...initialReviews];
  blog: BlogPostItem[] = [...initialBlog];
  faqs: FaqItem[] = [...initialFaqs];
  inquiries: InquiryItem[] = [];
  media: MediaAssetItem[] = [...initialMedia];

  isPostgresConnected(): boolean {
    return isDbConfigured;
  }

  // --- Settings ---
  getSettings(): SiteSettings {
    return { ...this.settings };
  }

  updateSettings(data: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...data };
    return { ...this.settings };
  }

  // --- Announcement ---
  getAnnouncement(): Announcement {
    const banner = { ...this.announcement };
    // Check optional date validity
    const now = new Date();
    if (banner.startDate && new Date(banner.startDate) > now) {
      banner.isActive = false;
    }
    if (banner.endDate && new Date(banner.endDate) < now) {
      banner.isActive = false;
    }
    return banner;
  }

  getRawAnnouncement(): Announcement {
    return { ...this.announcement };
  }

  updateAnnouncement(data: Partial<Announcement>): Announcement {
    this.announcement = { ...this.announcement, ...data };
    return { ...this.announcement };
  }

  // --- Page Sections ---
  getSections(pageSlug = 'home'): PageSectionItem[] {
    return this.sections
      .filter((s) => s.pageSlug === pageSlug)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getAllSections(): PageSectionItem[] {
    return [...this.sections].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveSection(item: Omit<PageSectionItem, 'id'> & { id?: string }): PageSectionItem {
    if (item.id) {
      const idx = this.sections.findIndex((s) => s.id === item.id);
      if (idx !== -1) {
        this.sections[idx] = { ...this.sections[idx], ...item };
        return this.sections[idx];
      }
    }
    const newSec: PageSectionItem = {
      ...item,
      id: item.id || `sec-${Date.now()}`,
      displayOrder: item.displayOrder ?? this.sections.length + 1,
      isVisible: item.isVisible ?? true,
    };
    this.sections.push(newSec);
    return newSec;
  }

  deleteSection(id: string): boolean {
    const len = this.sections.length;
    this.sections = this.sections.filter((s) => s.id !== id);
    return this.sections.length < len;
  }

  // --- Navigation Items ---
  getNavigation(): NavigationItemType[] {
    return [...this.navigation].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveNavigationItem(item: Omit<NavigationItemType, 'id'> & { id?: string }): NavigationItemType {
    if (item.id) {
      const idx = this.navigation.findIndex((n) => n.id === item.id);
      if (idx !== -1) {
        this.navigation[idx] = { ...this.navigation[idx], ...item };
        return this.navigation[idx];
      }
    }
    const newItem: NavigationItemType = {
      ...item,
      id: item.id || `nav-${Date.now()}`,
      displayOrder: item.displayOrder ?? this.navigation.length + 1,
      isPublished: item.isPublished ?? true,
      children: item.children || [],
    };
    this.navigation.push(newItem);
    return newItem;
  }

  deleteNavigationItem(id: string): boolean {
    const len = this.navigation.length;
    this.navigation = this.navigation.filter((n) => n.id !== id);
    return this.navigation.length < len;
  }

  // --- Programs & Services ---
  getPrograms(publishedOnly = true, category?: 'training' | 'service'): ProgramItem[] {
    return this.programs
      .filter((p) => {
        if (publishedOnly && !p.isPublished) return false;
        if (category && p.category !== category) return false;
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getProgramBySlug(slug: string): ProgramItem | undefined {
    return this.programs.find((p) => p.slug === slug);
  }

  saveProgram(item: Omit<ProgramItem, 'id'> & { id?: string }): ProgramItem {
    if (item.id) {
      const idx = this.programs.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        this.programs[idx] = { ...this.programs[idx], ...item };
        return this.programs[idx];
      }
    }
    const newProg: ProgramItem = {
      ...item,
      id: item.id || `prog-${Date.now()}`,
      category: item.category || 'training',
      features: item.features || [],
      isPublished: item.isPublished ?? false,
      publishedAt: item.isPublished ? new Date().toISOString() : null,
      displayOrder: item.displayOrder ?? this.programs.length + 1,
    };
    this.programs.push(newProg);
    return newProg;
  }

  deleteProgram(id: string): boolean {
    const len = this.programs.length;
    this.programs = this.programs.filter((p) => p.id !== id);
    return this.programs.length < len;
  }

  // --- Membership Plans ---
  getMembershipPlans(publishedOnly = true): MembershipPlanItem[] {
    return this.plans
      .filter((p) => (!publishedOnly ? true : p.isPublished))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getMembershipPlanBySlug(slug: string): MembershipPlanItem | undefined {
    return this.plans.find((p) => p.slug === slug);
  }

  saveMembershipPlan(item: Omit<MembershipPlanItem, 'id'> & { id?: string }): MembershipPlanItem {
    if (item.id) {
      const idx = this.plans.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        this.plans[idx] = { ...this.plans[idx], ...item };
        return this.plans[idx];
      }
    }
    const newPlan: MembershipPlanItem = {
      ...item,
      id: item.id || `plan-${Date.now()}`,
      features: item.features || [],
      isPublished: item.isPublished ?? false,
      isFeatured: item.isFeatured ?? false,
      displayOrder: item.displayOrder ?? this.plans.length + 1,
    };
    this.plans.push(newPlan);
    return newPlan;
  }

  deleteMembershipPlan(id: string): boolean {
    const len = this.plans.length;
    this.plans = this.plans.filter((p) => p.id !== id);
    return this.plans.length < len;
  }

  // --- Referral Program ---
  getReferralProgram(): ReferralProgramItem {
    return { ...this.referral };
  }

  updateReferralProgram(data: Partial<ReferralProgramItem>): ReferralProgramItem {
    this.referral = { ...this.referral, ...data };
    return { ...this.referral };
  }

  // --- Offers ---
  getOffers(publishedOnly = true, activeOnly = false): OfferItem[] {
    const now = new Date();
    return this.offers
      .filter((o) => {
        if (publishedOnly && !o.isPublished) return false;
        if (activeOnly && o.validUntil && new Date(o.validUntil) < now) return false;
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getOfferBySlug(slug: string): OfferItem | undefined {
    return this.offers.find((o) => o.slug === slug);
  }

  saveOffer(item: Omit<OfferItem, 'id'> & { id?: string }): OfferItem {
    if (item.id) {
      const idx = this.offers.findIndex((o) => o.id === item.id);
      if (idx !== -1) {
        this.offers[idx] = { ...this.offers[idx], ...item };
        return this.offers[idx];
      }
    }
    const newOffer: OfferItem = {
      ...item,
      id: item.id || `off-${Date.now()}`,
      isPublished: item.isPublished ?? false,
      displayOrder: item.displayOrder ?? this.offers.length + 1,
    };
    this.offers.push(newOffer);
    return newOffer;
  }

  deleteOffer(id: string): boolean {
    const len = this.offers.length;
    this.offers = this.offers.filter((o) => o.id !== id);
    return this.offers.length < len;
  }

  // --- Events ---
  getEvents(publishedOnly = true): EventItem[] {
    return this.events
      .filter((e) => (!publishedOnly ? true : e.isPublished))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getEventBySlug(slug: string): EventItem | undefined {
    return this.events.find((e) => e.slug === slug);
  }

  saveEvent(item: Omit<EventItem, 'id'> & { id?: string }): EventItem {
    if (item.id) {
      const idx = this.events.findIndex((e) => e.id === item.id);
      if (idx !== -1) {
        this.events[idx] = { ...this.events[idx], ...item };
        return this.events[idx];
      }
    }
    const newEvent: EventItem = {
      ...item,
      id: item.id || `evt-${Date.now()}`,
      isPublished: item.isPublished ?? false,
      displayOrder: item.displayOrder ?? this.events.length + 1,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  deleteEvent(id: string): boolean {
    const len = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    return this.events.length < len;
  }

  // --- Trainers ---
  getTrainers(publishedOnly = true): TrainerItem[] {
    return this.trainers
      .filter((t) => (!publishedOnly ? true : t.isPublished))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveTrainer(item: Omit<TrainerItem, 'id'> & { id?: string }): TrainerItem {
    if (item.id) {
      const idx = this.trainers.findIndex((t) => t.id === item.id);
      if (idx !== -1) {
        this.trainers[idx] = { ...this.trainers[idx], ...item };
        return this.trainers[idx];
      }
    }
    const newTrainer: TrainerItem = {
      ...item,
      id: item.id || `tr-${Date.now()}`,
      qualifications: item.qualifications || [],
      isPublished: item.isPublished ?? false,
      displayOrder: item.displayOrder ?? this.trainers.length + 1,
    };
    this.trainers.push(newTrainer);
    return newTrainer;
  }

  deleteTrainer(id: string): boolean {
    const len = this.trainers.length;
    this.trainers = this.trainers.filter((t) => t.id !== id);
    return this.trainers.length < len;
  }

  // --- Gallery ---
  getGallery(publishedOnly = true, category?: string, orientation?: string): GalleryItemType[] {
    return this.gallery
      .filter((g) => {
        if (publishedOnly && !g.isPublished) return false;
        if (category && g.category !== category) return false;
        if (orientation && g.orientation !== orientation) return false;
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getGalleryItems(): GalleryItemType[] {
    return this.gallery;
  }

  saveGalleryItem(item: Omit<GalleryItemType, 'id'> & { id?: string }): GalleryItemType {
    if (item.id) {
      const idx = this.gallery.findIndex((g) => g.id === item.id);
      if (idx !== -1) {
        this.gallery[idx] = { ...this.gallery[idx], ...item };
        return this.gallery[idx];
      }
    }
    const newGal: GalleryItemType = {
      ...item,
      id: item.id || `gal-${Date.now()}`,
      isPublished: item.isPublished ?? false,
      displayOrder: item.displayOrder ?? this.gallery.length + 1,
    };
    this.gallery.push(newGal);
    return newGal;
  }

  deleteGalleryItem(id: string): boolean {
    const len = this.gallery.length;
    this.gallery = this.gallery.filter((g) => g.id !== id);
    return this.gallery.length < len;
  }

  // --- Reviews ---
  getReviews(publishedOnly = true, moderationFilter?: 'all' | 'pending' | 'published'): ReviewItem[] {
    return this.reviews
      .filter((r) => {
        if (moderationFilter === 'pending') return !r.isPublished;
        if (moderationFilter === 'published') return r.isPublished;
        if (publishedOnly) return r.isPublished;
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveReview(item: Omit<ReviewItem, 'id'> & { id?: string }): ReviewItem {
    if (item.id) {
      const idx = this.reviews.findIndex((r) => r.id === item.id);
      if (idx !== -1) {
        this.reviews[idx] = { ...this.reviews[idx], ...item };
        return this.reviews[idx];
      }
    }
    const newRev: ReviewItem = {
      ...item,
      id: item.id || `rev-${Date.now()}`,
      isPublished: item.isPublished ?? false,
      publishedAt: item.isPublished ? new Date().toISOString() : null,
      displayOrder: item.displayOrder ?? this.reviews.length + 1,
    };
    this.reviews.push(newRev);
    return newRev;
  }

  deleteReview(id: string): boolean {
    const len = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== id);
    return this.reviews.length < len;
  }

  // --- Blog ---
  getBlog(publishedOnly = true): BlogPostItem[] {
    return this.blog
      .filter((b) => (!publishedOnly ? true : b.isPublished))
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  }

  getBlogPosts(publishedOnly = true): BlogPostItem[] {
    return this.getBlog(publishedOnly);
  }

  getBlogPostBySlug(slug: string): BlogPostItem | undefined {
    return this.blog.find((b) => b.slug === slug);
  }

  saveBlogPost(item: Omit<BlogPostItem, 'id'> & { id?: string }): BlogPostItem {
    if (item.id) {
      const idx = this.blog.findIndex((b) => b.id === item.id);
      if (idx !== -1) {
        this.blog[idx] = { ...this.blog[idx], ...item };
        return this.blog[idx];
      }
    }
    const newPost: BlogPostItem = {
      ...item,
      id: item.id || `blog-${Date.now()}`,
      isPublished: item.isPublished ?? false,
      publishedAt: item.isPublished ? (item.publishedAt || new Date().toISOString()) : null,
    };
    this.blog.push(newPost);
    return newPost;
  }

  deleteBlogPost(id: string): boolean {
    const len = this.blog.length;
    this.blog = this.blog.filter((b) => b.id !== id);
    return this.blog.length < len;
  }

  // --- FAQs ---
  getFaqs(publishedOnly = true): FaqItem[] {
    return this.faqs
      .filter((f) => (!publishedOnly ? true : f.isPublished))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveFaq(item: Omit<FaqItem, 'id'> & { id?: string }): FaqItem {
    if (item.id) {
      const idx = this.faqs.findIndex((f) => f.id === item.id);
      if (idx !== -1) {
        this.faqs[idx] = { ...this.faqs[idx], ...item };
        return this.faqs[idx];
      }
    }
    const newFaq: FaqItem = {
      ...item,
      id: item.id || `faq-${Date.now()}`,
      isPublished: item.isPublished ?? false,
      displayOrder: item.displayOrder ?? this.faqs.length + 1,
    };
    this.faqs.push(newFaq);
    return newFaq;
  }

  deleteFaq(id: string): boolean {
    const len = this.faqs.length;
    this.faqs = this.faqs.filter((f) => f.id !== id);
    return this.faqs.length < len;
  }

  // --- Inquiries ---
  getInquiries(): InquiryItem[] {
    return [...this.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  addInquiry(
    data: Omit<InquiryItem, 'id' | 'referenceCode' | 'createdAt' | 'status' | 'adminNotes'>
  ): InquiryItem {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `GKG-${year}-${randomSuffix}`;
    const newInquiry: InquiryItem = {
      ...data,
      id: `inq-${Date.now()}`,
      referenceCode,
      status: 'new',
      adminNotes: null,
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(newInquiry);
    return newInquiry;
  }

  updateInquiry(id: string, updates: { status?: InquiryItem['status']; adminNotes?: string }): InquiryItem | null {
    const inq = this.inquiries.find((i) => i.id === id);
    if (!inq) return null;
    if (updates.status) inq.status = updates.status;
    if (updates.adminNotes !== undefined) inq.adminNotes = updates.adminNotes;
    return { ...inq };
  }

  deleteInquiry(id: string): boolean {
    const len = this.inquiries.length;
    this.inquiries = this.inquiries.filter((i) => i.id !== id);
    return this.inquiries.length < len;
  }

  // --- Media Assets ---
  getMediaAssets(): MediaAssetItem[] {
    return [...this.media].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  saveMediaAsset(item: Omit<MediaAssetItem, 'id' | 'createdAt'> & { id?: string }): MediaAssetItem {
    if (item.id) {
      const idx = this.media.findIndex((m) => m.id === item.id);
      if (idx !== -1) {
        this.media[idx] = { ...this.media[idx], ...item };
        return this.media[idx];
      }
    }
    const newMedia: MediaAssetItem = {
      id: item.id || `media-${Date.now()}`,
      url: item.url,
      pathname: item.pathname || 'external',
      filename: item.filename || 'external-image',
      size: item.size || 0,
      mimeType: item.mimeType || 'image/jpeg',
      altText: item.altText || null,
      caption: item.caption || null,
      createdAt: new Date().toISOString(),
    };
    this.media.unshift(newMedia);
    return newMedia;
  }

  deleteMediaAsset(id: string): { success: boolean; inUse?: boolean; message?: string } {
    // Check if asset is referenced by active content
    const asset = this.media.find((m) => m.id === id);
    if (!asset) return { success: false, message: 'Asset not found' };

    const inUseInPrograms = this.programs.some((p) => p.imageUrl === asset.url);
    const inUseInTrainers = this.trainers.some((t) => t.imageUrl === asset.url);
    const inUseInGallery = this.gallery.some((g) => g.imageUrl === asset.url);
    const inUseInBlog = this.blog.some((b) => b.coverImage === asset.url);

    if (inUseInPrograms || inUseInTrainers || inUseInGallery || inUseInBlog) {
      return {
        success: false,
        inUse: true,
        message: 'This asset is currently referenced by published content. Replace references before deleting.',
      };
    }

    this.media = this.media.filter((m) => m.id !== id);
    return { success: true };
  }

  // --- Dashboard Real Statistics ---
  getDashboardStats() {
    const now = new Date();

    const trainingPrograms = this.programs.filter((p) => p.category === 'training');
    const services = this.programs.filter((p) => p.category === 'service');

    const publishedProgramsCount = trainingPrograms.filter((p) => p.isPublished).length;
    const draftProgramsCount = trainingPrograms.filter((p) => !p.isPublished).length;

    const publishedServicesCount = services.filter((p) => p.isPublished).length;
    const draftServicesCount = services.filter((p) => !p.isPublished).length;

    const publishedOffersCount = this.offers.filter((o) => o.isPublished).length;
    const activeOffersCount = this.offers.filter(
      (o) => o.isPublished && (!o.validUntil || new Date(o.validUntil) >= now)
    ).length;

    const publishedEventsCount = this.events.filter((e) => e.isPublished).length;
    const publishedPlansCount = this.plans.filter((p) => p.isPublished).length;
    const publishedTrainersCount = this.trainers.filter((t) => t.isPublished).length;
    const publishedGalleryCount = this.gallery.filter((g) => g.isPublished).length;

    const pendingReviewsCount = this.reviews.filter((r) => !r.isPublished).length;
    const publishedReviewsCount = this.reviews.filter((r) => r.isPublished).length;

    const publishedBlogCount = this.blog.filter((b) => b.isPublished).length;
    const draftBlogCount = this.blog.filter((b) => !b.isPublished).length;

    const publishedFaqsCount = this.faqs.filter((f) => f.isPublished).length;

    const totalInquiriesCount = this.inquiries.length;
    const newInquiriesCount = this.inquiries.filter((i) => i.status === 'new').length;
    const contactedInquiriesCount = this.inquiries.filter((i) => i.status === 'contacted').length;

    const mediaAssetsCount = this.media.length;

    const recentInquiries = this.inquiries.slice(0, 5);

    return {
      counts: {
        trainingPrograms: { published: publishedProgramsCount, drafts: draftProgramsCount },
        services: { published: publishedServicesCount, drafts: draftServicesCount },
        offers: { published: publishedOffersCount, active: activeOffersCount },
        events: { published: publishedEventsCount },
        memberships: { published: publishedPlansCount },
        trainers: { published: publishedTrainersCount },
        gallery: { published: publishedGalleryCount },
        reviews: { published: publishedReviewsCount, pending: pendingReviewsCount },
        blog: { published: publishedBlogCount, drafts: draftBlogCount },
        faqs: { published: publishedFaqsCount },
        inquiries: { total: totalInquiriesCount, new: newInquiriesCount, contacted: contactedInquiriesCount },
        mediaAssets: { total: mediaAssetsCount },
      },
      recentInquiries,
      bannerStatus: this.getAnnouncement(),
      systemStatus: {
        databaseConnected: this.isPostgresConnected(),
        vercelBlobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    };
  }
}

export const store = new DataStore();
export default store;
