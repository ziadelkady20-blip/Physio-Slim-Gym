/**
 * ═══════════════════════════════════════════════════
 * PHYSIO SLIM — Firebase Seed Script
 * Run: node scripts/seed.js
 *
 * Populates Firestore with initial data so the
 * website renders properly out of the box.
 * ═══════════════════════════════════════════════════
 */

// NOTE: This runs as a plain Node.js script using Firebase Admin SDK
// Install: npm install firebase-admin
// Set GOOGLE_APPLICATION_CREDENTIALS env var or use service account

const admin = require('firebase-admin')

// Initialize Admin SDK (use service account or default credentials)
if (!admin.apps.length) {
  admin.initializeApp({
    // For local dev, set GOOGLE_APPLICATION_CREDENTIALS env variable
    // pointing to your service account JSON file
    // OR pass credential explicitly:
    // credential: admin.credential.cert(require('./service-account.json')),
    credential: admin.credential.applicationDefault(),
  })
}

const db = admin.firestore()

async function seed() {
  console.log('🌱 Seeding Physio Slim Firebase...\n')

  // ── SITE SETTINGS ──────────────────────────────
  await db.doc('settings/site').set({
    gymName: 'Physio Slim Health Club',
    tagline: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
    primaryColor: '#D4AF37',
    secondaryColor: '#C9A227',
    phone: '+20 102 326 5002',
    whatsapp: 'https://wa.me/201023265002',
    email: 'info@physioslim.com',
    address: 'Fayoum, Egypt',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    googleMapsEmbed: '',
    appleMapsLink: '',
    businessHours: [
      { day: 'Monday', open: '06:00', close: '22:00', closed: false },
      { day: 'Tuesday', open: '06:00', close: '22:00', closed: false },
      { day: 'Wednesday', open: '06:00', close: '22:00', closed: false },
      { day: 'Thursday', open: '06:00', close: '22:00', closed: false },
      { day: 'Friday', open: '08:00', close: '22:00', closed: false },
      { day: 'Saturday', open: '08:00', close: '20:00', closed: false },
      { day: 'Sunday', open: '08:00', close: '18:00', closed: false },
    ],
    footerTagline: "Fayoum's premier fitness destination. Transform your body, mind, and life.",
    copyright: `© ${new Date().getFullYear()} Physio Slim Health Club. All rights reserved.`,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log('✅ Site settings seeded')

  // ── HERO ───────────────────────────────────────
  await db.doc('settings/hero').set({
    title: 'PHYSIO SLIM',
    subtitle: 'HEALTH CLUB',
    description: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
    badge: 'Premium Fitness • Fayoum, Egypt',
    primaryButtonText: 'Join Now',
    primaryButtonLink: '#memberships',
    secondaryButtonText: 'WhatsApp Us',
    secondaryButtonLink: 'https://wa.me/201023265002',
    backgroundImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
    videoUrl: '',
    videoEnabled: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log('✅ Hero settings seeded')

  // ── SEO ────────────────────────────────────────
  await db.doc('settings/seo').set({
    metaTitle: 'Physio Slim Health Club | Premium Fitness in Fayoum',
    metaDescription: 'Physio Slim Health Club – Premium fitness experience in Fayoum, Egypt. Professional coaches, advanced equipment, and flexible membership plans.',
    keywords: 'gym, fitness, fayoum, health club, physio slim, swimming pool',
    ogImage: '',
    ogTitle: 'Physio Slim Health Club',
    ogDescription: 'Transform Your Body. Build Your Strength. Unlock Your Potential.',
    twitterCard: 'summary_large_image',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log('✅ SEO settings seeded')

  // ── ABOUT ──────────────────────────────────────
  await db.doc('settings/about').set({
    title: 'ELITE',
    subtitle: 'FITNESS',
    text: "Physio Slim Health Club is Fayoum's premier fitness destination. We combine professional coaching, state-of-the-art equipment, and a luxurious environment to help you achieve your fitness goals. Whether you're a beginner or an elite athlete, our expert team is here to guide you every step of the way.",
    mission: 'To provide world-class fitness facilities and professional coaching that empowers every member to achieve their health and wellness goals.',
    vision: 'To be the leading health and fitness brand in Upper Egypt, inspiring communities to live healthier, stronger lives.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    badgeNumber: '5+',
    badgeLabel: 'Years of Excellence',
    stats: [
      { number: '2000+', label: 'Active Members' },
      { number: '15+', label: 'Expert Coaches' },
      { number: '98%', label: 'Satisfaction Rate' },
    ],
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  console.log('✅ About settings seeded')

  // ── MEMBERSHIPS ────────────────────────────────
  const memberships = [
    {
      name: 'Gym Only',
      category: 'gym',
      price: 350,
      currency: 'EGP',
      duration: 'month',
      sessions: 'Unlimited',
      description: 'Full access to main gym floor and all equipment',
      features: ['Unlimited gym access', 'Locker room access', 'Free fitness assessment', 'Access to all equipment'],
      featured: false,
      whatsappLink: 'https://wa.me/201023265002?text=I want to subscribe to Gym Only plan',
      order: 0,
      active: true,
    },
    {
      name: 'Pool + Gym',
      category: 'both',
      price: 550,
      currency: 'EGP',
      duration: 'month',
      sessions: 'Unlimited',
      description: 'Complete access to gym and Olympic swimming pool',
      features: ['Unlimited gym access', 'Swimming pool access', 'Professional swim coach', 'Locker & shower room', 'Free body composition test'],
      featured: true,
      whatsappLink: 'https://wa.me/201023265002?text=I want to subscribe to Pool + Gym plan',
      order: 1,
      active: true,
    },
    {
      name: 'Ladies Section',
      category: 'ladies',
      price: 400,
      currency: 'EGP',
      duration: 'month',
      sessions: 'Unlimited',
      description: 'Private ladies-only gym with female coaches',
      features: ['Private ladies section', 'Female coaches only', 'All equipment included', 'Group fitness classes', 'Comfortable & private'],
      featured: false,
      whatsappLink: 'https://wa.me/201023265002?text=I want to subscribe to Ladies Section plan',
      order: 2,
      active: true,
    },
    {
      name: 'Kids Program',
      category: 'kids',
      price: 250,
      currency: 'EGP',
      duration: 'month',
      sessions: '12 Sessions',
      description: 'Fun and safe fitness program for children',
      features: ['Age-appropriate exercises', 'Certified kids coach', 'Swimming lessons included', 'Fun group activities', 'Progress tracking'],
      featured: false,
      whatsappLink: 'https://wa.me/201023265002?text=I want to enroll my child in the Kids Program',
      order: 3,
      active: true,
    },
  ]

  for (const plan of memberships) {
    await db.collection('memberships').add({
      ...plan,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
  console.log('✅ Membership plans seeded')

  // ── FACILITIES ─────────────────────────────────
  const facilities = [
    {
      title: 'Main Gym Floor',
      description: 'Over 500sqm of premium fitness equipment. From free weights to the latest cardio machines.',
      icon: 'dumbbell',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      order: 0,
      active: true,
    },
    {
      title: 'Swimming Pool',
      description: 'Olympic-grade heated pool with professional lane dividers and starting blocks.',
      icon: 'waves',
      image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80',
      order: 1,
      active: true,
    },
    {
      title: 'Cardio Zone',
      description: 'State-of-the-art cardio machines with individual screens and heart rate monitors.',
      icon: 'heart',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
      order: 2,
      active: true,
    },
    {
      title: 'Ladies Section',
      description: 'Fully equipped private gym for women, managed exclusively by female coaches.',
      icon: 'shield',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      order: 3,
      active: true,
    },
    {
      title: 'Group Classes',
      description: 'Daily group fitness classes including Zumba, Pilates, and HIIT training.',
      icon: 'users',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      order: 4,
      active: true,
    },
    {
      title: 'Locker Rooms',
      description: 'Premium locker rooms with private showers, steam room, and secure storage.',
      icon: 'layers',
      image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
      order: 5,
      active: true,
    },
  ]

  for (const facility of facilities) {
    await db.collection('facilities').add({
      ...facility,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
  console.log('✅ Facilities seeded')

  // ── TESTIMONIALS ───────────────────────────────
  const testimonials = [
    {
      name: 'Ahmed Hassan',
      rating: 5,
      comment: 'Best gym in Fayoum by far. The equipment is premium and the coaches are incredibly professional. Highly recommend!',
      memberSince: '2022',
      initials: 'AH',
      active: true,
      order: 0,
    },
    {
      name: 'Sara Mohamed',
      rating: 5,
      comment: 'I lost 15kg in 3 months with the help of the amazing coaches at Physio Slim. The ladies section is perfect!',
      memberSince: '2023',
      initials: 'SM',
      active: true,
      order: 1,
    },
    {
      name: 'Omar Khalil',
      rating: 5,
      comment: 'The swimming pool and gym combination is unbeatable value. Great facilities and friendly staff.',
      memberSince: '2021',
      initials: 'OK',
      active: true,
      order: 2,
    },
    {
      name: 'Nour Ali',
      rating: 5,
      comment: 'The ladies section is clean, private, and well-equipped. I feel safe and comfortable here every day.',
      memberSince: '2022',
      initials: 'NA',
      active: true,
      order: 3,
    },
    {
      name: 'Mostafa Adel',
      rating: 5,
      comment: 'Enrolled my kids in the swimming program — they love it! Great coaches who are patient and professional.',
      memberSince: '2023',
      initials: 'MA',
      active: true,
      order: 4,
    },
  ]

  for (const t of testimonials) {
    await db.collection('testimonials').add({
      ...t,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
  console.log('✅ Testimonials seeded')

  // ── TRAINERS ───────────────────────────────────
  const trainers = [
    {
      name: 'Coach Mahmoud',
      position: 'Head Personal Trainer',
      specialization: 'Strength & Body Transformation',
      bio: '10+ years experience helping members achieve extraordinary results through personalized training programs.',
      experience: '10+ Years',
      image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&q=80',
      instagram: '',
      facebook: '',
      order: 0,
      active: true,
    },
    {
      name: 'Coach Sara',
      position: 'Ladies Section Head',
      specialization: 'Weight Loss & Toning',
      bio: 'Specialized female fitness coach with expertise in body shaping and nutrition guidance for women.',
      experience: '7 Years',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80',
      instagram: '',
      facebook: '',
      order: 1,
      active: true,
    },
    {
      name: 'Coach Ahmed',
      position: 'Swimming Instructor',
      specialization: 'Swimming & Aqua Fitness',
      bio: 'Former national swimmer turned instructor, passionate about teaching all ages to swim confidently.',
      experience: '8 Years',
      image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&q=80',
      instagram: '',
      facebook: '',
      order: 2,
      active: true,
    },
  ]

  for (const t of trainers) {
    await db.collection('trainers').add({
      ...t,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  }
  console.log('✅ Trainers seeded')

  console.log('\n🎉 Seed complete! Your Physio Slim database is ready.\n')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
