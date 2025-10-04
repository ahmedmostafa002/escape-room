import { Search, Eye, Phone, Trophy } from "lucide-react"

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Discover",
      description: "Browse thousands of escape rooms by location, theme, difficulty level, and verified reviews",
      color: "from-escape-red to-escape-red-700",
    },
    {
      icon: Eye,
      title: "Compare",
      description: "View detailed information, photos, ratings, and reviews to find the perfect match for your group",
      color: "from-[#1a1f2e] to-[#232937]",
    },
    {
      icon: Phone,
      title: "Contact",
      description: "Get directions, contact details, and booking information for your chosen escape room venue",
      color: "from-escape-red-600 to-escape-red-800",
    },
    {
      icon: Trophy,
      title: "Escape",
      description: "Visit the venue, gather your team, and immerse yourself in an unforgettable puzzle-solving adventure",
      color: "from-[#232937] to-[#2a3441]",
    },
  ]

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-escape-red-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-escape-red-700 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-escape-red to-escape-red-700 bg-clip-text text-transparent">
            How It Works?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with your escape room adventure is simple and straightforward - from discovery to adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {/* Card background with subtle border */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 group-hover:border-escape-red/20 transition-all duration-300 group-hover:shadow-lg"></div>
              
              <div className="relative p-4">
                <div className="relative mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.color} rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative z-10`}
                  >
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-escape-red rounded-full shadow-md flex items-center justify-center text-xs font-bold text-white z-20">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-escape-red/30 to-transparent z-0" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-escape-red transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
