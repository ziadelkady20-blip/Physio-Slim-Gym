# 🏋️ Physio Slim Health Club — Full CMS Platform

> Premium black & gold fitness website powered by Next.js 15 + Firebase

## ✨ Features

### Public Website
- Dynamic hero section (video or image background)
- Membership plans loaded from Firestore (no hardcoded pricing)
- Facilities gallery with hover effects
- Photo gallery with lightbox
- Animated testimonials carousel
- Contact form that saves leads to Firestore
- WhatsApp tracking
- Floating WhatsApp button
- Scroll progress bar
- Luxury loader animation
- Fully responsive

### Admin Dashboard (`/admin`)
- 🔐 Firebase Authentication protected
- 📊 Analytics dashboard with visit tracking
- ✍️ Hero section editor (title, subtitle, buttons, bg image/video)
- 💰 Membership plan CRUD (no hardcoded pricing)
- 🖼️ Gallery manager with drag-and-drop upload + reorder
- 🏢 Facilities CRUD with image upload
- ⭐ Testimonials CRUD
- 👥 Trainers CMS
- 🎯 Offers & promotions with countdown timer
- 📬 Leads manager with status tracking
- 🗂️ Media library with folder organization
- 📞 Contact info editor
- 🔍 SEO manager with live preview
- ⚙️ Site settings (hours, colors, footer)
- 👑 User & role management (Super Admin only)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| Backend | Firebase Firestore, Auth, Storage |
| Deployment | Vercel |

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
cd physio-slim
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called `physio-slim`
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** → Start in production mode
5. Enable **Storage** → Start in production mode
6. Go to Project Settings → Your apps → Add Web App
7. Copy the config values

### 3. Set Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all Firebase config values.

### 4. Deploy Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase init  # select Firestore + Storage
firebase deploy --only firestore:rules,storage
```

### 5. Seed Initial Data

```bash
# Set up service account credentials first
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"
node scripts/seed.js
```

### 6. Create Admin User

1. In Firebase Console → Authentication → Add user
2. Enter email & password for your admin
3. On first login at `/admin/login`, the user is auto-assigned `super_admin` role
4. Subsequent users get `manager` role by default — upgrade in `/admin/users`

### 7. Run Development Server

```bash
npm run dev
```

Visit:
- Website: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add all `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel dashboard.

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── login/              # Auth page
│   │   ├── dashboard/          # Analytics overview
│   │   ├── hero/               # Hero editor
│   │   ├── memberships/        # Plan CRUD
│   │   ├── gallery/            # Image manager
│   │   ├── facilities/         # Facility CRUD
│   │   ├── testimonials/       # Review CRUD
│   │   ├── trainers/           # Trainer CMS
│   │   ├── offers/             # Promotions
│   │   ├── leads/              # Contact submissions
│   │   ├── media/              # Media library
│   │   ├── contact/            # Contact info
│   │   ├── seo/                # SEO settings
│   │   ├── settings/           # Site settings
│   │   └── users/              # Role management
│   ├── api/contact/            # Contact form API
│   ├── site/                   # Public website
│   └── layout.tsx
├── components/
│   └── admin/index.tsx         # Shared admin components
├── lib/
│   ├── firebase.ts             # Firebase init
│   ├── firestore.ts            # All Firestore operations
│   ├── storage.ts              # File upload utilities
│   └── auth-context.tsx        # Auth provider
└── types/index.ts              # All TypeScript types
```

## 🔐 Role System

| Role | Access |
|------|--------|
| `super_admin` | Everything + user management |
| `admin` | All content management |
| `manager` | Leads only (read/update) |

## 🗄️ Firestore Collections

```
settings/         # site, hero, seo, about
memberships/      # pricing plans
gallery/          # gallery images
facilities/       # gym spaces
testimonials/     # member reviews
trainers/         # coach profiles
offers/           # promotions
leads/            # contact submissions
media/            # uploaded files registry
analytics/        # daily event tracking
notifications/    # admin alerts
users/            # admin user profiles
```

## 📸 Theme

The design preserves the **luxury black & gold** aesthetic of the original static site:
- **Background**: `#050505` (near-black)
- **Surface**: `#0D0D0D` / `#111111`
- **Gold**: `#D4AF37` / `#C9A227`
- **Font**: Montserrat (headings) + Inter (body)
- **Style**: Sharp edges, clip-path buttons, subtle glow effects

---

Built with ❤️ for Physio Slim Health Club, Fayoum, Egypt.
