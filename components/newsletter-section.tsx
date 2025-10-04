import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Gift, Bell, Star } from "lucide-react"

export default function NewsletterSection() {
  return (
    <section className="py-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-72 h-72 bg-escape-red rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-escape-red-700 rounded-full blur-2xl animate-pulse delay-500" />
      </div>


      {/* Additional geometric background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/30 rounded-full animate-spin-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/30 rounded-full animate-spin-slow delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/30 rounded-full animate-spin-slow delay-1500"></div>
      </div>

      {/* Glowing accent lines */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/50 to-transparent"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/50 to-transparent"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/50 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md border border-white/20 overflow-hidden hover:shadow-2xl hover:shadow-escape-red/20 transition-all duration-500 relative">
            {/* Card internal atmospheric elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-escape-red/30 to-escape-red-700/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-escape-red-600/30 to-escape-red-800/20 rounded-full blur-2xl" />
              <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-escape-red-500/25 to-escape-red-700/20 rounded-full blur-xl" />
            </div>

            <CardContent className="p-6 sm:p-8 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                {/* Left side - Content (more compact) */}
                <div className="w-full lg:w-96 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-escape-red via-escape-red-600 to-escape-red-700 rounded-full hover:scale-110 transition-transform duration-300 shadow-2xl relative">
                      <Mail className="h-5 w-5 text-white" />
                      <div className="absolute inset-0 rounded-full bg-escape-red/30 animate-ping"></div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
                      Never Miss an Adventure
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    Get exclusive access to new escape rooms, special discounts, and insider tips delivered straight to your inbox.
                    <span className="text-escape-red-300"> Join the ultimate escape room community!</span>
                  </p>

                  {/* Benefits in compact horizontal layout */}
                  <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 justify-center lg:justify-start">
                    <div className="flex items-center gap-1 text-gray-300 hover:text-escape-red transition-colors group p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-escape-red/20 to-escape-red-700/10 rounded-full flex items-center justify-center group-hover:from-escape-red/30 group-hover:to-escape-red-700/20 transition-all shadow-lg">
                        <Gift className="h-3 w-3 text-escape-red" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Exclusive Deals</div>
                        <div className="text-xs text-gray-400">Up to 30% off</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 hover:text-escape-red-600 transition-colors group p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-escape-red-600/20 to-escape-red-700/10 rounded-full flex items-center justify-center group-hover:from-escape-red-600/30 group-hover:to-escape-red-700/20 transition-all shadow-lg">
                        <Bell className="h-3 w-3 text-escape-red-600" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">New Room Alerts</div>
                        <div className="text-xs text-gray-400">Be the first to know</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300 hover:text-escape-red-700 transition-colors group p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-escape-red-700/20 to-escape-red-800/10 rounded-full flex items-center justify-center group-hover:from-escape-red-700/30 group-hover:to-escape-red-800/20 transition-all shadow-lg">
                        <Star className="h-3 w-3 text-escape-red-700" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Insider Tips</div>
                        <div className="text-xs text-gray-400">Pro strategies</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Form (wider) */}
                <div className="w-full lg:flex-1">
                  <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-4">
                    <Input
                      placeholder="Enter your email address"
                      className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-escape-red h-12 sm:h-14 text-base sm:text-lg font-medium rounded-lg shadow-inner flex-1"
                    />
                    <Button className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-escape-red to-escape-red-600 hover:from-escape-red-600 hover:to-escape-red-700 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-lg whitespace-nowrap">
                      🚀 Subscribe
                    </Button>
                  </div>
                  
                  <p className="text-gray-400 text-xs sm:text-sm text-center lg:text-left">
                    Join 25,000+ subscribers • No spam, unsubscribe anytime • Free forever
                    <br />
                    <span className="text-escape-red-400">🔒 Your privacy is our priority</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
