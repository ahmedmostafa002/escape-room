import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getThemesWithCounts, createSEOFriendlySlug } from "@/lib/supabase"

// Helper to get the appropriate image based on theme name
const getThemeImage = (themeName: string) => {
  const themeImages: { [key: string]: string } = {
    'Adventure Escape Rooms': '/images/adventure escape rooms.jpeg',
    'Mixed Escape Rooms': '/images/mixed escape rooms.jpeg',
    'Mystery Escape Rooms': '/images/mystery escape rooms.jpeg',
    'Horror Escape Rooms': '/images/horror escape rooms.jpeg',
    'Fantasy Escape Rooms': '/images/fantasy escape room.jpeg',
    'Crime Escape Rooms': '/images/mystery escape rooms.jpeg',
    'Entertainment Escape Rooms': '/images/entertainment escape rooms.jpeg',
    'VR Escape Rooms': '/images/vr escape rooms.jpeg',
    'Historical Escape Rooms': '/images/historical escape rooms.jpeg',
    'Sci-Fi Escape Rooms': '/images/sci-fi escape rooms.png',
  };
  
  // Check for exact match first
  if (themeImages[themeName]) {
    return themeImages[themeName];
  }
  
  // Check for partial matches (case insensitive)
  const lowerTheme = themeName.toLowerCase();
  for (const [key, value] of Object.entries(themeImages)) {
    if (lowerTheme.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTheme)) {
      return value;
    }
  }
  
  // Default fallback image
  return '/images/adventure escape room.jpeg';
};

export default async function ThemesSection() {
  const { data: themes, error } = await getThemesWithCounts();

  if (error) {
    console.error('Error loading themes:', error);
    // Use fallback themes when database fails
    const fallbackThemes = [
      { theme: 'Adventure', count: 150 },
      { theme: 'Mystery', count: 120 },
      { theme: 'Horror', count: 100 },
      { theme: 'Fantasy', count: 80 },
      { theme: 'Sci-Fi', count: 60 },
      { theme: 'Historical', count: 40 }
    ];
    
    return (
      <section className="py-20 bg-gradient-to-br from-[#1a1f2e] via-[#232937] to-[#2a3441] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Explore by Theme</h2>
            <p className="text-xl text-gray-300">Discover escape rooms by your favorite theme</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fallbackThemes.map((theme, index) => (
              <Card key={index} className="group relative overflow-hidden bg-gray-800/50 border-gray-700 hover:border-escape-red/50 transition-all duration-300 hover:scale-105">
                <div className="aspect-video relative">
                  <Image
                    src={getThemeImage(theme.theme)}
                    alt={`${theme.theme} escape rooms`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{theme.theme}</h3>
                    <Badge className="bg-escape-red text-white">
                      {theme.count} rooms
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }



  // Placeholder data for when themes are loading or empty
  const placeholderThemes = [
    { theme: "Adventure Escape Rooms", count: 0 },
    { theme: "Mixed Escape Rooms", count: 0 },
    { theme: "Mystery Escape Rooms", count: 0 },
    { theme: "Horror Escape Rooms", count: 0 },
    { theme: "Fantasy Escape Rooms", count: 0 },
    { theme: "Entertainment Escape Rooms", count: 0 },
    { theme: "VR Escape Rooms", count: 0 },
    { theme: "Historical Escape Rooms", count: 0 },
  ];

  const displayThemes = (themes && themes.length > 0 ? themes : placeholderThemes).slice(0, 6);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Enhanced atmospheric background elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-64 h-64 bg-escape-red rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-48 h-48 bg-escape-red-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-escape-red-700 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      {/* Enhanced floating mystery elements with more visibility */}
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute top-1/4 left-1/6 text-8xl animate-mystery-float pointer-events-none drop-shadow-2xl">🔍</div>
        <div className="absolute top-3/4 right-1/5 text-7xl animate-mystery-float delay-1000 pointer-events-none drop-shadow-2xl">🗝️</div>
        <div className="absolute top-1/2 left-3/4 text-6xl animate-mystery-float delay-500 pointer-events-none drop-shadow-2xl">🔐</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl animate-mystery-float delay-1500 pointer-events-none drop-shadow-2xl">⏱️</div>
        <div className="absolute top-1/6 right-1/4 text-4xl animate-mystery-float delay-2000 pointer-events-none drop-shadow-2xl">🧩</div>
        <div className="absolute bottom-1/6 left-1/3 text-5xl animate-mystery-float delay-2500 pointer-events-none drop-shadow-2xl">🎯</div>
      </div>

      {/* Additional geometric background elements */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-escape-red/40 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-escape-red-600/40 rounded-full animate-spin-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 border-2 border-escape-red-700/40 rounded-full animate-spin-slow delay-500"></div>
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 border-2 border-escape-red-500/40 rounded-full animate-spin-slow delay-1500"></div>
      </div>

      {/* Glowing accent lines */}
      <div className="absolute inset-0 opacity-25 z-0">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-escape-red/60 to-transparent"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-escape-red-600/60 to-transparent"></div>
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-escape-red-700/60 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-escape-red-500/60 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-escape-red-200 to-white bg-clip-text text-transparent">
            Explore Escape Rooms by Theme
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From heart-pounding horror to mind-bending mysteries, find the perfect themed escape room adventure for your group.
            <br className="hidden sm:block" />
            <span className="text-escape-red-300">Unlock your next great adventure!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {displayThemes.map((themeData, index) => (
            <Link key={index} href={`/themes/${createSEOFriendlySlug(themeData.theme || 'unknown')}`}>
              <Card className="overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group border-0 hover:shadow-2xl hover:shadow-escape-red/20">
                <div className="relative h-64">
                  <Image
                    src={getThemeImage(themeData.theme)}
                    alt={`${themeData.theme} - Discover ${themeData.count} themed escape room experiences`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25 group-hover:from-escape-red/20 group-hover:via-black/60 group-hover:to-black/35 transition-all duration-300" />
                  
                  {/* Glowing border effect on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-escape-red/50 transition-all duration-300 rounded-lg"></div>
                  
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-escape-red text-white border-0 shadow-lg group-hover:bg-escape-red-600 transition-colors duration-300">
                      {themeData.count} rooms
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-escape-red-200 transition-colors duration-300">
                      {themeData.theme}
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                      Explore {themeData.theme} themed escape rooms.
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/themes">
            <Button size="lg">
              View All Themes
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
