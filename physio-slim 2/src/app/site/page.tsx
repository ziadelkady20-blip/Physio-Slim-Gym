import { Metadata } from 'next'
import { getSiteSettings, getSEOSettings, getHeroSettings, getMemberships, getFacilities, getGallery, getTestimonials, getTrainers, getAboutSettings, getOffers } from '@/lib/firestore'
import SiteClient from './SiteClient'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOSettings()
  return {
    title: seo?.metaTitle || 'Physio Slim Health Club | Premium Fitness in Fayoum',
    description: seo?.metaDescription || 'Premium fitness experience in Fayoum, Egypt.',
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle,
      description: seo?.ogDescription || seo?.metaDescription,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  }
}

export default async function SitePage() {
  // Fetch all data server-side
  const [settings, hero, memberships, facilities, gallery, testimonials, trainers, about, offers] = await Promise.allSettled([
    getSiteSettings(),
    getHeroSettings(),
    getMemberships(),
    getFacilities(),
    getGallery(),
    getTestimonials(),
    getTrainers(),
    getAboutSettings(),
    getOffers(),
  ])

  return (
    <SiteClient
      settings={settings.status === 'fulfilled' ? settings.value : null}
      hero={hero.status === 'fulfilled' ? hero.value : null}
      memberships={memberships.status === 'fulfilled' ? memberships.value : []}
      facilities={facilities.status === 'fulfilled' ? facilities.value : []}
      gallery={gallery.status === 'fulfilled' ? gallery.value : []}
      testimonials={testimonials.status === 'fulfilled' ? testimonials.value : []}
      trainers={trainers.status === 'fulfilled' ? trainers.value : []}
      about={about.status === 'fulfilled' ? about.value : null}
      offers={offers.status === 'fulfilled' ? offers.value : []}
    />
  )
}
