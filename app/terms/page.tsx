import { Metadata } from "next"
import Image from "next/image"
// import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | Escape Rooms Finder - Terms and Conditions",
  description: "Read the terms of service and conditions for using Escape Rooms Finder. Understand your rights and responsibilities when using our platform.",
  openGraph: {
    title: "Terms of Service | Escape Rooms Finder",
    description: "Read the terms of service and conditions for using Escape Rooms Finder platform.",
    url: "https://escaperoomsfinder.com/terms",
    siteName: "Escape Rooms Finder",
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Escape Rooms Finder Terms of Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Escape Rooms Finder",
    description: "Read the terms of service and conditions for using Escape Rooms Finder platform.",
    images: ["/images/hero.jpeg"],
  },
  alternates: {
    canonical: "https://escaperoomsfinder.com/terms",
  },
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": "https://escaperoomsfinder.com/terms",
              "url": "https://escaperoomsfinder.com/terms",
              "name": "Terms of Service | Escape Rooms Finder - Terms and Conditions",
              "description": "Read the terms of service and conditions for using Escape Rooms Finder. Understand your rights and responsibilities when using our platform.",
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://escaperoomsfinder.com/images/hero.jpeg",
                "url": "https://escaperoomsfinder.com/images/hero.jpeg",
                "width": 1200,
                "height": 630,
                "caption": "Escape Rooms Finder Terms of Service"
              },
              "breadcrumb": "https://escaperoomsfinder.com/terms#breadcrumb",
              "isPartOf": {
                "@type": "WebSite",
                "@id": "https://escaperoomsfinder.com/#website"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "@id": "https://escaperoomsfinder.com/terms#breadcrumb",
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
                  "name": "Terms of Service",
                  "item": "https://escaperoomsfinder.com/terms"
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
            alt="Terms of Service Background"
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
              Terms of <span className="text-[#00d4aa]">Service</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service (&quot;Terms&quot;) govern your use of the Escape Rooms Finder website and services (&quot;Service&quot;) operated by Escape Rooms Finder (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using our Service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of the materials on Escape Rooms Finder&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Safeguarding the password and all activities under your account</li>
                    <li>Notifying us immediately of any unauthorized use of your account</li>
                    <li>Ensuring your account information remains accurate and up-to-date</li>
                    <li>Complying with all applicable laws and regulations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Content and Conduct</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When listing your escape room business or submitting content, you agree that:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>All information provided is accurate and truthful</li>
                    <li>You own or have the right to use all content you submit</li>
                    <li>Your content does not violate any laws or third-party rights</li>
                    <li>You will not submit spam, misleading, or inappropriate content</li>
                    <li>You will maintain and update your listing information as needed</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Uses</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may not use our Service:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                    <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Escape Rooms Finder and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">User-Generated Content</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By posting content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms whether express or implied, statutory or otherwise.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall Escape Rooms Finder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Escape Rooms Finder&apos;s website, even if Escape Rooms Finder or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Accuracy of Materials</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The materials appearing on Escape Rooms Finder&apos;s website could include technical, typographical, or photographic errors. Escape Rooms Finder does not warrant that any of the materials on its website are accurate, complete, or current.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Links</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Escape Rooms Finder has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Escape Rooms Finder of the site. Use of any such linked website is at the user&apos;s own risk.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Escape Rooms Finder may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> legal@escaperoomsfinder.com
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