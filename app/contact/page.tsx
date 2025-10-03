import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ContactForm from "@/components/contact-form"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Phone, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Escape Rooms Finder - Get in Touch with Our Support Team",
  description: "Contact Escape Rooms Finder for support, questions about listings, or general inquiries. We're here to help with all your escape room needs.",
  keywords: [
    "escape room help",
    "booking support",
    "escape room FAQ",
    "customer support",
    "escape room questions",
    "booking assistance",
    "escape room guide",
    "help center",
    "support team",
    "escape room booking help"
  ],
  authors: [{ name: "Escape Rooms Finder Team" }],
  publisher: "Escape Rooms Finder",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Contact Us | Escape Rooms Finder - Get in Touch with Our Support Team",
    description: "Contact Escape Rooms Finder for support, questions about listings, or general inquiries. We're here to help with all your escape room needs.",
    url: "https://escaperoomsfinder.com/contact",
    siteName: "Escape Rooms Finder",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://escaperoomsfinder.com/images/help-support.jpg",
        width: 1200,
        height: 630,
        alt: "Escape Rooms Finder Help and Support Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Escape Rooms Finder - Get in Touch with Our Support Team",
    description: "Contact Escape Rooms Finder for support, questions about listings, or general inquiries. We're here to help with all your escape room needs.",
    images: ["https://escaperoomsfinder.com/images/help-support.jpg"],
    creator: "@EscapeRoomsFinder",
    site: "@EscapeRoomsFinder",
  },
  alternates: {
    canonical: "https://escaperoomsfinder.com/contact",
  },
  other: {
    "contact:email": "support@escaperoomsfinder.com",
    "contact:phone_number": "+1-555-123-3722",
    "business:contact_data:street_address": "123 Adventure Street",
    "business:contact_data:locality": "Entertainment City",
    "business:contact_data:region": "CA",
    "business:contact_data:postal_code": "90210",
    "business:contact_data:country_name": "United States",
  },
}

export default function ContactPage() {

  // Generate structured data for contact and support page
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://escaperoomsfinder.com/contact",
        "url": "https://escaperoomsfinder.com/contact",
        "name": "Contact Us | Escape Rooms Finder - Get in Touch with Our Support Team",
        "description": "Contact Escape Rooms Finder for support, questions about listings, or general inquiries. We're here to help with all your escape room needs.",
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "@id": "https://escaperoomsfinder.com/images/help-support.jpg#primaryimage",
          "url": "https://escaperoomsfinder.com/images/help-support.jpg",
          "contentUrl": "https://escaperoomsfinder.com/images/help-support.jpg",
          "width": 1200,
          "height": 630,
          "caption": "Escape Rooms Finder Help and Support Center"
        },
        "breadcrumb": "https://escaperoomsfinder.com/contact#breadcrumb",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://escaperoomsfinder.com/#website"
        }
      },
      {
        "@type": "ContactPage",
        "@id": "https://escaperoomsfinder.com/contact#contactpage",
        "name": "Contact Escape Rooms Finder Support",
        "description": "Get in touch with our support team for help with escape room listings, and platform questions.",
        "url": "https://escaperoomsfinder.com/contact",
        "mainEntity": {
          "@type": "ContactPoint",
          "@id": "https://escaperoomsfinder.com/contact#contactpoint",
          "contactType": "Customer Support",
          "email": "support@escaperoomsfinder.com",
          "telephone": "+1-555-123-3722",
          "availableLanguage": "English",
          "hoursAvailable": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Saturday",
              "opens": "10:00",
              "closes": "16:00"
            }
          ],
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://escaperoomsfinder.com/contact#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://escaperoomsfinder.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact Us",
            "item": "https://escaperoomsfinder.com/contact"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://escaperoomsfinder.com/#website",
        "name": "Escape Rooms Finder",
        "description": "Escape Rooms Finder is the premier platform for discovering escape room experiences. Find the best escape rooms near you with detailed reviews, photos",
        "url": "https://escaperoomsfinder.com",
        "publisher": {
          "@type": "Organization",
          "@id": "https://escaperoomsfinder.com/#organization",
        "name": "Escape Rooms Finder",
        "url": "https://escaperoomsfinder.com",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://escaperoomsfinder.com/#logo",
            "url": "https://escaperoomsfinder.com/logo.png",
            "contentUrl": "https://escaperoomsfinder.com/logo.png",
            "width": 512,
            "height": 512,
            "caption": "Escape Rooms Finder Logo"
          }
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://escaperoomsfinder.com/browse?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="Contact us"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        {/* Enhanced atmospheric elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        {/* Enhanced floating mystery elements */}
        <div className="absolute inset-0 opacity-20 -z-10">
          <div className="absolute top-1/4 left-1/6 text-6xl animate-mystery-float pointer-events-none drop-shadow-2xl">📞</div>
          <div className="absolute top-3/4 right-1/5 text-5xl animate-mystery-float delay-1000 pointer-events-none drop-shadow-2xl">💬</div>
          <div className="absolute top-1/2 right-1/4 text-4xl animate-mystery-float delay-500 pointer-events-none drop-shadow-2xl">✉️</div>
          <div className="absolute bottom-1/4 left-1/4 text-5xl animate-mystery-float delay-1500 pointer-events-none drop-shadow-2xl">🤝</div>
          <div className="absolute top-1/3 right-1/6 text-3xl animate-mystery-float delay-2000 pointer-events-none drop-shadow-2xl">💡</div>
          <div className="absolute bottom-1/3 left-1/5 text-4xl animate-mystery-float delay-2500 pointer-events-none drop-shadow-2xl">🎯</div>
        </div>

        {/* Additional geometric background elements */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
          <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
          <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/30 rounded-full animate-spin-slow delay-1500"></div>
        </div>

        {/* Glowing accent lines */}
        <div className="absolute inset-0 opacity-15 -z-10">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/50 to-transparent"></div>
          <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/50 to-transparent"></div>
          <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/50 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/50 to-transparent"></div>
        </div>
        
        {/* Glowing particles effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-escape-red rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-escape-red-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-escape-red-600 rounded-full animate-ping delay-500"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Contact <span className="text-escape-red">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our support team. We&apos;re here to help with all your escape room needs!
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Additional atmospheric elements for main content */}
        <div className="absolute inset-0 opacity-5 -z-10">
          <div className="absolute top-20 left-10 w-24 h-24 bg-escape-red rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        {/* Floating geometric elements */}
        <div className="absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-32 left-20 w-8 h-8 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-32 right-20 w-6 h-6 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-4 h-4 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            
            {/* Contact Form */}
            <Card className="relative overflow-hidden">
              {/* Atmospheric background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-escape-red rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-escape-red-600 rounded-full blur-xl"></div>
              </div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl font-bold">Still Need Help?</CardTitle>
                <p className="text-gray-600">Send us a message and we&apos;ll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <Card className="relative overflow-hidden escape-card-hover">
              {/* Atmospheric background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-escape-red rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-escape-red-600 rounded-full blur-lg"></div>
              </div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-escape-red/10 rounded-full flex items-center justify-center group-hover:bg-escape-red/20 transition-all duration-300">
                    <Mail className="h-6 w-6 text-escape-red" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Email Support</div>
                    <div className="text-sm text-gray-600 group-hover:text-escape-red transition-colors duration-300">support@escaperoomsfinder.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-escape-red/10 rounded-full flex items-center justify-center group-hover:bg-escape-red/20 transition-all duration-300">
                    <Phone className="h-6 w-6 text-escape-red" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Phone Support</div>
                    <div className="text-sm text-gray-600 group-hover:text-escape-red transition-colors duration-300">(555) 123-ESCAPE</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-escape-red/10 rounded-full flex items-center justify-center group-hover:bg-escape-red/20 transition-all duration-300">
                    <MessageCircle className="h-6 w-6 text-escape-red" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Live Chat</div>
                    <div className="text-sm text-gray-600 group-hover:text-escape-red transition-colors duration-300">Available 9 AM - 6 PM EST</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden escape-card-hover">
              {/* Atmospheric background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-16 h-16 bg-escape-red-600 rounded-full blur-lg"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-escape-red rounded-full blur-md"></div>
              </div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Monday - Friday</span>
                    <span className="text-escape-red font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Saturday</span>
                    <span className="text-escape-red font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Sunday</span>
                    <span className="text-gray-500 font-semibold">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden escape-card-hover">
              {/* Atmospheric background elements */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-18 h-18 bg-escape-red-700 rounded-full blur-lg"></div>
                <div className="absolute bottom-0 left-0 w-14 h-14 bg-escape-red-500 rounded-full blur-md"></div>
              </div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <Link href="/add-listing">
                    <Button variant="ghost" className="w-full justify-start h-12 hover:bg-escape-red/10 hover:text-escape-red transition-all duration-300 group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">List Your Business</span>
                    </Button>
                  </Link>
                  <Link href="/privacy">
                    <Button variant="ghost" className="w-full justify-start h-12 hover:bg-escape-red/10 hover:text-escape-red transition-all duration-300 group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                    </Button>
                  </Link>
                  <Link href="/terms">
                    <Button variant="ghost" className="w-full justify-start h-12 hover:bg-escape-red/10 hover:text-escape-red transition-all duration-300 group">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Terms of Service</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
