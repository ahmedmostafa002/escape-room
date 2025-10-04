import { Suspense } from "react"
import { Metadata } from "next"
import HeroSection from "@/components/hero-section"
import FeaturedRooms from "@/components/featured-rooms"
import HomepageEscapeRooms from "@/components/homepage-escape-rooms"
import StatsSection from "@/components/stats-section"
import HowItWorksSection from "@/components/how-it-works-section"
import ThemesSection from "@/components/themes-section"
import LazyWrapper from "@/components/performance/lazy-wrapper"
import {
  DynamicTestimonialsSection,
  DynamicBlogSection,
  DynamicNewsletterSection,
  DynamicCTASection
} from "@/components/performance/dynamic-imports"

export const metadata: Metadata = {
  title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
  description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
  openGraph: {
    title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
    description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
    type: "website",
    url: "https://escaperoomsfinder.com"
  },
  twitter: {
    title: "Find The Best Escape Rooms Near You | Escape Rooms Finder",
    description: "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room adventure for your group with real reviews and ratings!",
    card: "summary_large_image"
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Escape Rooms Finder",
          "url": "https://escaperoomsfinder.com",
          "description": "Escape Rooms Finder helps you to discover amazing escape room experiences worldwide. Browse by theme, difficulty, or location. Find the perfect escape room with real reviews and ratings.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://escaperoomsfinder.com/browse?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<div>Loading featured rooms...</div>}>
          <FeaturedRooms />
        </Suspense>
      </div>
      <ThemesSection />
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<div>Loading escape rooms...</div>}>
          <HomepageEscapeRooms />
        </Suspense>
      </div>
      
     
      
      <LazyWrapper fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-lg" />}>
        <DynamicNewsletterSection />
      </LazyWrapper>
      
      <LazyWrapper fallback={<div className="h-96 bg-gray-50 animate-pulse rounded-lg" />}>
        <DynamicBlogSection />
      </LazyWrapper>
      
      <LazyWrapper fallback={<div className="h-32 bg-gray-50 animate-pulse rounded-lg" />}>
        <DynamicCTASection />
      </LazyWrapper>
    </div>
  )
}
