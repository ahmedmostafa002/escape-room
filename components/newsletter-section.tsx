import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Gift, Bell, Star } from "lucide-react"

export default function NewsletterSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Enhanced atmospheric background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-10 w-72 h-72 bg-escape-red rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-escape-red-700 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Enhanced floating mystery elements with more visibility */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 text-8xl animate-mystery-float drop-shadow-2xl">📧</div>
        <div className="absolute top-3/4 right-1/5 text-7xl animate-mystery-float delay-1000 drop-shadow-2xl">🔔</div>
        <div className="absolute top-1/2 left-3/4 text-6xl animate-mystery-float delay-500 drop-shadow-2xl">⭐</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl animate-mystery-float delay-1500 drop-shadow-2xl">🎁</div>
        <div className="absolute top-1/6 right-1/4 text-4xl animate-mystery-float delay-2000 drop-shadow-2xl">🚀</div>
        <div className="absolute bottom-1/6 left-1/3 text-5xl animate-mystery-float delay-2500 drop-shadow-2xl">💌</div>
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
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-md border border-white/20 overflow-hidden hover:shadow-2xl hover:shadow-escape-red/20 transition-all duration-500 relative">
            {/* Card internal atmospheric elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-escape-red/30 to-escape-red-700/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-escape-red-600/30 to-escape-red-800/20 rounded-full blur-2xl" />
              <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-escape-red-500/25 to-escape-red-700/20 rounded-full blur-xl" />
            </div>

            <CardContent className="p-12 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-escape-red via-escape-red-600 to-escape-red-700 rounded-full mb-8 hover:scale-110 transition-transform duration-300 shadow-2xl relative">
                <Mail className="h-12 w-12 text-white" />
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full bg-escape-red/30 animate-ping"></div>
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
                Never Miss an Adventure
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get exclusive access to new escape rooms, special discounts, and insider tips delivered straight to your inbox.
                <br className="hidden sm:block" />
                <span className="text-escape-red-300">Join the ultimate escape room community!</span>
              </p>

              {/* Enhanced Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="flex items-center gap-4 text-gray-300 hover:text-escape-red transition-colors group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-escape-red/20 to-escape-red-700/10 rounded-full flex items-center justify-center group-hover:from-escape-red/30 group-hover:to-escape-red-700/20 transition-all shadow-lg">
                    <Gift className="h-6 w-6 text-escape-red" />
                  </div>
                  <div>
                    <div className="font-bold">Exclusive Deals</div>
                    <div className="text-sm text-gray-400">Up to 30% off</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-300 hover:text-escape-red-600 transition-colors group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-escape-red-600/20 to-escape-red-700/10 rounded-full flex items-center justify-center group-hover:from-escape-red-600/30 group-hover:to-escape-red-700/20 transition-all shadow-lg">
                    <Bell className="h-6 w-6 text-escape-red-600" />
                  </div>
                  <div>
                    <div className="font-bold">New Room Alerts</div>
                    <div className="text-sm text-gray-400">Be the first to know</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-300 hover:text-escape-red-700 transition-colors group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-escape-red-700/20 to-escape-red-800/10 rounded-full flex items-center justify-center group-hover:from-escape-red-700/30 group-hover:to-escape-red-800/20 transition-all shadow-lg">
                    <Star className="h-6 w-6 text-escape-red-700" />
                  </div>
                  <div>
                    <div className="font-bold">Insider Tips</div>
                    <div className="text-sm text-gray-400">Pro strategies</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Newsletter Form */}
              <div className="max-w-lg mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Input
                    placeholder="Enter your email address"
                    className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-escape-red h-14 text-lg font-medium rounded-xl shadow-inner"
                  />
                  <Button className="h-14 px-8 bg-gradient-to-r from-escape-red to-escape-red-600 hover:from-escape-red-600 hover:to-escape-red-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl">
                    🚀 Subscribe
                  </Button>
                </div>
              </div>

              <p className="text-gray-400 text-sm">
                Join 25,000+ subscribers • No spam, unsubscribe anytime • Free forever
                <br />
                <span className="text-escape-red-400">🔒 Your privacy is our priority</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
