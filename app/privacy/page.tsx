import { Metadata } from "next"
import Image from "next/image"
// import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | Escape Rooms Finder - Your Privacy Matters",
  description: "Learn how Escape Rooms Finder protects your privacy and handles your personal information. Read our comprehensive privacy policy.",
  openGraph: {
    title: "Privacy Policy | Escape Rooms Finder",
    description: "Learn how Escape Rooms Finder protects your privacy and handles your personal information.",
    url: "https://escaperoomsfinder.com/privacy",
    siteName: "Escape Rooms Finder",
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Escape Rooms Finder Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Escape Rooms Finder",
    description: "Learn how Escape Rooms Finder protects your privacy and handles your personal information.",
    images: ["/images/hero.jpeg"],
  },
  alternates: {
    canonical: "https://escaperoomsfinder.com/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://escaperoomsfinder.com/privacy",
              "url": "https://escaperoomsfinder.com/privacy",
              "name": "Privacy Policy | Escape Rooms Finder - Your Privacy Matters",
              "description": "Learn how Escape Rooms Finder protects your privacy and handles your personal information. Read our comprehensive privacy policy.",
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://escaperoomsfinder.com/images/hero.jpeg",
                "url": "https://escaperoomsfinder.com/images/hero.jpeg",
                "width": 1200,
                "height": 630,
                "caption": "Escape Rooms Finder Privacy Policy"
              },
              "breadcrumb": "https://escaperoomsfinder.com/privacy#breadcrumb",
              "isPartOf": {
                "@type": "WebSite",
                "@id": "https://escaperoomsfinder.com/#website"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://escaperoomsfinder.com/privacy#breadcrumb",
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
                  "name": "Privacy Policy",
                  "item": "https://escaperoomsfinder.com/privacy"
                }
              ]
            }
          ])
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="Privacy Policy Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Privacy <span className="text-[#00d4aa]">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we protect and handle your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy describes how Escape Rooms Finder (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your information when you use our website and services.
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
                      <p className="text-gray-700 leading-relaxed mb-2">
                        We may collect personal information that you voluntarily provide to us, including:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Name and contact information (email address, phone number)</li>
                        <li>Business information when listing an escape room</li>
                        <li>User account information</li>
                        <li>Communication preferences</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Usage Information</h3>
                      <p className="text-gray-700 leading-relaxed mb-2">
                        We automatically collect certain information about your use of our services:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li>Device information (IP address, browser type, operating system)</li>
                        <li>Usage patterns and preferences</li>
                        <li>Location data (if you enable location services)</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Providing and maintaining our services</li>
                    <li>Processing and managing escape room listings</li>
                    <li>Communicating with you about our services</li>
                    <li>Improving our website and user experience</li>
                    <li>Sending promotional materials (with your consent)</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>With service providers who assist us in operating our website</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Access to your personal information</li>
                    <li>Correction of inaccurate information</li>
                    <li>Deletion of your personal information</li>
                    <li>Restriction of processing</li>
                    <li>Data portability</li>
                    <li>Objection to processing</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences. Please note that disabling cookies may affect the functionality of our services.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after any changes constitutes acceptance of the new Privacy Policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> privacy@escaperoomsfinder.com
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Address:</strong> [Your Business Address]
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong> [Your Phone Number]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}